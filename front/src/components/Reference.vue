<script setup lang="ts">
import {
    ref,
    useTemplateRef,
    onMounted,
    inject,
    nextTick
} from 'vue';

import { AxiosError } from 'axios';

import { Draggable } from '@he-tree/vue';
import { Stat } from '@he-tree/tree-utils';
import '@he-tree/vue/style/default.css';
import '@he-tree/vue/style/material-design.css';

import { MenuItem } from 'primevue/menuitem';
import ContextMenu from 'primevue/contextmenu';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';


import {
    Toast,
    Note
} from '#types';

import { getRootNote } from '#functions/misc';

import {
    getNotes,
    createNote,
    updateNote
} from '#functions/requests';

import {
    getContextMenuItems,
    getContextMenuPermissions
} from '#functions/context_menu';



const toast = inject('toast') as Toast;

const notes = ref<Note[]>([getRootNote()]);

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
    async create(): Promise<void> {
        this.triedSave = true;

        if (!this.name) {
            return;
        }

        const parent: Note = selectedNote.value;
        try {
            const createdNote: Note = await createNote(this.name, parent.id);

            const parentStat: Stat<Note> = getStat(parent);
            parentStat.open = true;

            if (!parent.has_children) {
                parent.has_children = true;
            }

            parent.children ??= [];
            parent.children.push(createdNote);

            tree.value!.add(createdNote, getStat(parent));

            nextTick((): void => {
                selectedNoteElement.value.previousElementSibling!.classList.toggle('down');
            });

            this.dialogVisible = false;

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



function calcTreeHeight(): void {
    const docHeight: number = document.documentElement.clientHeight;
    const offset: number = tree.value!.$el.offsetTop;
    height.value = `${docHeight - offset}px`;
}

function expandNode(event: PointerEvent, stat: Stat<Note>): void {
    (event.target as HTMLElement).classList.toggle('down');
    stat.open = !stat.open;
}

async function loadChildren(note: Note): Promise<void> {
    if (note.children !== undefined) {
        return;
    }

    note.children = await getNotes(note.id);
    tree.value!.addMulti(note.children, getStat(note));
}

function getStat(note: Note): Stat<Note> {
    return tree.value!.getStat(note) as Stat<Note>;
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
};

contextMenuItems.value[1].command = (): void => {
    renameNoteHandler.value.triedSave = false;
    renameNoteHandler.value.name = selectedNote.value.name;
    renameNoteHandler.value.dialogVisible = true;
};

const rootNote: Note = notes.value[0];

getNotes(1).then(
    children => {
        rootNote.children = children;
        tree.value!.addMulti(children, getStat(rootNote));
    }
);

onMounted((): void => {
    tree.value!.$el.querySelector('i').classList.toggle('down');
    getStat(rootNote).open = true;

    calcTreeHeight();
    window.addEventListener('resize', calcTreeHeight);
});
</script>

<template>
    <Draggable id="tree" class="mtl-tree" ref="tree" v-model="notes" virtualization textKey="name" :defaultOpen="false"
               treeLine>
        <template #default="{ node: note, stat}">
            <i v-if="note.has_children" class="pi pi-angle-right" @click="expandNode($event as PointerEvent, stat)"
               @mouseenter.once="loadChildren(note)" />
            <div class="spacer" @contextmenu="openContextMenu($event as PointerEvent, note)">
                {{ note.name }}
            </div>
        </template>
    </Draggable>
    <ContextMenu ref="contextMenu" :model="contextMenuItems" />
    <Dialog v-model:visible="newNoteHandler.dialogVisible" modal :header="`${selectedNote.name} – новая запись`">
        <IconField>
            <InputIcon class="pi pi-file" />
            <InputText v-model="newNoteHandler.name" placeholder="Имя записи" variant="filled"
                       :invalid="!newNoteHandler.name && newNoteHandler.triedSave" size="large" fluid />
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
                       :invalid="!renameNoteHandler.name && renameNoteHandler.triedSave" size="large" fluid />
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