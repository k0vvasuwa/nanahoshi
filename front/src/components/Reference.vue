<script setup lang="ts">
import {
    ref,
    useTemplateRef,
    onMounted,
    inject
} from 'vue';

import axios, { AxiosError } from 'axios';

import {
    Draggable,
    StartInfo
} from '@he-tree/vue';
import { Stat } from '@he-tree/tree-utils';
import { dragContext } from '@he-tree/vue';
import '@he-tree/vue/style/default.css';
import '@he-tree/vue/style/material-design.css';

import { useConfirm } from 'primevue/useconfirm';

import { MenuItem } from 'primevue/menuitem';
import ContextMenu from 'primevue/contextmenu';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import useSettingsStore from '#store';

import {
    Toast,
    Note,
    TabNote
} from '#types';

import { getRootNote } from '#functions/misc';

import {
    storageUrl,
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteTitle
} from '#functions/requests';

import {
    getContextMenuItems,
    getContextMenuPermissions
} from '#functions/context_menu';



const emit = defineEmits<{
    selectNote: [
        note: TabNote,
        active: boolean
    ],
    renameNote: [
        renamedNote: Note
    ],
    deleteNote: [
        id: number
    ]
}>();

const toast = inject('toast') as Toast;
const confirm = useConfirm();

const settings = useSettingsStore();

const notes = ref<Note[]>([]);

const tree = useTemplateRef<InstanceType<typeof Draggable>>('tree');
const height = ref<string>('800px');

const contextMenu = useTemplateRef<InstanceType<typeof ContextMenu>>('contextMenu');
const contextMenuItems = ref<MenuItem[]>(getContextMenuItems());

const selectedNote = ref<Note>({} as Note);
const selectedNoteElement = ref<HTMLElement>(null as unknown as HTMLElement);

const newNoteHandler = ref({
    dialogVisible: false,
    name: '',
    triedSave: false,
    async handlePressingKey(event: KeyboardEvent): Promise<void> {
        if (event.code === 'Enter') {
            await this.create();
        }
    },
    async create(): Promise<void> {
        this.triedSave = true;

        if (!this.name) {
            return;
        }

        const parent: Note = selectedNote.value;
        try {
            const createdNote: Note = await createNote(this.name, parent.id);

            const parentStat: Stat<Note> = getStat(parent);
            if (!parentStat.open) {
                parentStat.open = true;
                addExpandedNote(parentStat.data.id);
            }

            if (!parent.has_children) {
                parent.has_children = true;
            }

            parent.children ??= [];
            parent.children.push(createdNote);

            tree.value!.add(createdNote, getStat(parent));

            this.dialogVisible = false;
            this.name = '';

            toast.success('Запрос выполнен', `Запись «${createdNote.name}» добавлена к записи «${parent.name}»`);
        } catch (e) {
            const error = e as AxiosError;

            toast.error('Не удалось добавить запись', error.message);
        }
    }
});

const renameNoteHandler = ref({
    dialogVisible: false,
    name: '',
    triedSave: false,
    async handlePressingKey(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            await this.rename();
        }
    },
    async rename(): Promise<void> {
        this.triedSave = true;

        if (!this.name) {
            return;
        }

        const target: Note = selectedNote.value;

        try {
            const renamedNote: Note = await updateNote(target.id, {
                name: this.name
            });

            emit('renameNote', target);

            const oldLabel: string = target.name;

            target.name = renamedNote.name;

            this.dialogVisible = false;

            toast.success('Запрос выполнен', `Запись «${oldLabel}» переименована в «${target.name}»`);
        } catch (e) {
            const error = e as AxiosError;

            toast.error(`Не удалось переименовать запись`, error.message);
        }
    }
});



async function addRootNote(): Promise<void> {
    await settings.load();
    notes.value.push(getRootNote());
    tree.value?.add(notes.value[0]);
}

async function addExpandedNote(id: number): Promise<void> {
    await axios.patch(`${storageUrl}settings/1/add_expanded_note/`, { note_id: id });
}

async function removeExpandedNote(id: number): Promise<void> {
    await axios.patch(`${storageUrl}settings/1/remove_expanded_note/`, { note_id: id });
}

function calcTreeHeight(): void {
    const docHeight: number = document.documentElement.clientHeight;
    const offset: number = tree.value!.$el.offsetTop;
    height.value = `${docHeight - offset}px`;
}

async function loadChildren(note: Note): Promise<void> {
    if (note.children !== undefined) {
        return;
    }

    note.children = await getNotes(note.id);
    tree.value!.addMulti(note.children, getStat(note));
}

async function handleSelectNote(event: MouseEvent, note: Note): Promise<void> {
    const button: number = event.button;
    if (button === 0) {
        emit('selectNote', {
            noteId: note.id,
            value: `${note.id}`,
            name: note.name,
            title: await getNoteTitle(note.id)
        }, !event.ctrlKey);
        event.preventDefault();
    }
}

function getStat(note: Note): Stat<Note> {
    return tree.value!.getStat(note) as Stat<Note>;
}

function eachDraggable(stat: Stat<Note>): boolean {
    return stat.data.id !== 1;
}

async function handleNodeBeforeDragOpen(stat: Stat<Note>): Promise<void> {
    await loadChildren(stat.data);
    addExpandedNote(stat.data.id);
}

function toggleNode(stat: Stat<Note>): void {
    stat.open = !stat.open;
    const noteId: number = stat.data.id;
    if (stat.open) {
        addExpandedNote(noteId);
    } else {
        removeExpandedNote(noteId);
    }
}

function statHandler(stat: Stat<Note>): Stat<Note> {
    if (settings.expandedNotes!.includes(stat.data.id)) {
        stat.open = true;
    }
    loadChildren(stat.data);
    return stat;
}

async function handleDrop(): Promise<void> {
    const startInfo: StartInfo = dragContext.startInfo;
    const indexBeforeDrop: number = startInfo.indexBeforeDrop;
    const oldParent: Note = startInfo.parent!.data;

    const draggingNote: Note = startInfo.dragNode.data;

    const finalInfo: StartInfo = dragContext.targetInfo;
    const newParent: Note = finalInfo.parent!.data;
    const indexAfterDrop: number = newParent.children!.indexOf(draggingNote);

    if (oldParent.id === newParent.id) {
        if (indexBeforeDrop === indexAfterDrop) {
            return;
        }

        try {
            await updateNote(draggingNote.id, {
                position: indexAfterDrop + 1
            });
        } catch (e) {
            const error = e as AxiosError;
            toast.error(`Не уделось поменять позицию записи «${draggingNote.name}»`, error.message);
            return;
        }
    } else {
        try {
            await updateNote(draggingNote.id, {
                position: indexAfterDrop + 1,
                parent: newParent.id
            });

            if (oldParent.children!.length === 0) {
                oldParent.children = undefined;
                oldParent.has_children = false;
                removeExpandedNote(oldParent.id);
            }

            if (newParent.children!.length === 1) {
                newParent.has_children = true;
            }
        } catch (e) {
            const error = e as AxiosError;
            toast.error(`Не удалось переместить запись «${draggingNote.name}»`, error.message);
            return;
        }
    }
}

function openContextMenu(event: PointerEvent, note: Note): void {
    selectedNote.value = note;
    selectedNoteElement.value = event.target as HTMLElement;

    [
        contextMenuItems.value[0].disabled,
        contextMenuItems.value[1].disabled,
        contextMenuItems.value[2].disabled
    ] = getContextMenuPermissions(note);

    contextMenu.value!.show(event);
}



contextMenuItems.value[0].command = (): void => {
    newNoteHandler.value.triedSave = false;
    newNoteHandler.value.dialogVisible = true;
    loadChildren(selectedNote.value);
};

contextMenuItems.value[1].command = (): void => {
    renameNoteHandler.value.triedSave = false;
    renameNoteHandler.value.name = selectedNote.value.name;
    renameNoteHandler.value.dialogVisible = true;
};

contextMenuItems.value[2].command = (): void => {
    const target: Note = selectedNote.value;

    confirm.require({
        header: `${target.name} – удаление`,
        message: `Удалить запись «${target.name}»?`,
        icon: 'pi pi-trash',
        rejectProps: {
            label: 'Оставить',
            outlined: true
        },
        acceptProps: {
            label: 'Удалить',
            severity: 'danger'
        },
        async accept(): Promise<void> {
            try {
                await deleteNote(target.id);

                emit('deleteNote', target.id);

                const stat: Stat<Note> = getStat(target);
                const parent: Note = stat.parent?.data!;

                tree.value!.remove(stat);

                if (parent.children!.length === 0) {
                    parent.has_children = false;
                    removeExpandedNote(parent.id);
                }

                toast.success('Удаление выполнено', `Запись «${target.name}» удалена`);
            } catch (e) {
                const error = e as AxiosError;

                toast.error('Не удалось удалить запись', error.message);
            }
        }
    });
};

onMounted((): void => {
    addRootNote();

    calcTreeHeight();
    window.addEventListener('resize', calcTreeHeight);
});
</script>

<template>
    <Draggable id="tree" class="mtl-tree" ref="tree" v-model="notes" virtualization textKey="name" :defaultOpen="false"
               treeLine :rootDroppable="false" :eachDraggable="eachDraggable" :beforeDragOpen="handleNodeBeforeDragOpen"
               :dragOpenDelay="800" @afterDrop="handleDrop" :statHandler="statHandler">
        <template #default="{ node: note, stat}">
            <i v-if="note.has_children" class="pi pi-angle-right" :class="{ down: stat.open }"
               @click="toggleNode(stat)" @mouseenter.once="loadChildren(note)" />
            <div class="spacer" @contextmenu="openContextMenu($event as PointerEvent, note)"
                 @mouseup="handleSelectNote($event, note)">
                {{ note.name }}
            </div>
        </template>
    </Draggable>
    <ContextMenu ref="contextMenu" :model="contextMenuItems" />
    <Dialog v-model:visible="newNoteHandler.dialogVisible" modal :header="`${selectedNote.name} – новая запись`">
        <IconField>
            <InputIcon class="pi pi-file" />
            <InputText v-model="newNoteHandler.name" placeholder="Имя записи" variant="filled"
                       :invalid="!newNoteHandler.name && newNoteHandler.triedSave" size="large" fluid
                       @keydown="newNoteHandler.handlePressingKey($event)" autofocus />
        </IconField>
        <template #footer>
            <Button label="Отмена" severity="danger" outlined @click="newNoteHandler.dialogVisible = false;" />
            <Button label="Сохранить" @click="newNoteHandler.create()" />
        </template>
    </Dialog>
    <Dialog v-model:visible="renameNoteHandler.dialogVisible" modal :header="`${selectedNote.name} – переименование`">
        <IconField>
            <InputIcon class="pi pi-file" />
            <InputText v-model="renameNoteHandler.name" placeholder="Имя записи" variant="filled"
                       :invalid="!renameNoteHandler.name && renameNoteHandler.triedSave" size="large" fluid
                       @keydown="renameNoteHandler.handlePressingKey($event)" autofocus />
        </IconField>
        <template #footer>
            <Button label="Отмена" severity="danger" outlined @click="renameNoteHandler.dialogVisible = false;" />
            <Button label="Сохранить" @click="renameNoteHandler.rename()" />
        </template>
    </Dialog>
</template>

<style scoped>
#tree {
    height: v-bind(height);
}

:deep(.tree-node:hover) {
    cursor: pointer;
    background-color: var(--node-hover-background);
}

:deep(.he-tree-drag-placeholder) {
    background-color: var(--node-drag-background);
}

.pi-angle-right {
    transition: rotate 150ms;
    border-radius: 50%;
}

:deep(.pi-angle-right:hover) {
    background-color: var(--expand-icon-hover-background);
}

.down {
    rotate: 90deg;
}
</style>