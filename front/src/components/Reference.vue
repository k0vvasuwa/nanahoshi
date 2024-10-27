<script setup lang="ts">
import {
    ref,
    useTemplateRef,
    onMounted
} from 'vue';

import { Draggable } from '@he-tree/vue';
import { Stat } from '@he-tree/tree-utils';
import '@he-tree/vue/style/default.css';
import '@he-tree/vue/style/material-design.css';

import { MenuItem } from 'primevue/menuitem';
import ContextMenu from 'primevue/contextmenu';


import { Note } from '#types';

import { getRootNote } from '#functions/misc';

import {
    getNotes
} from '#functions/requests';

import {
    getContextMenuItems,
    getContextMenuPermissions
} from '#functions/context_menu';



const notes = ref<Note[]>([getRootNote()]);

const tree = useTemplateRef<InstanceType<typeof Draggable>>('tree');
const height = ref<string>('800px');

const contextMenu = useTemplateRef<InstanceType<typeof ContextMenu>>('contextMenu');
const contextMenuItems = ref<MenuItem[]>(getContextMenuItems());
const selectedNote = ref<Note>({} as Note);



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

    [
        contextMenuItems.value[0].disabled,
        contextMenuItems.value[1].disabled,
        contextMenuItems.value[2].disabled
    ] = getContextMenuPermissions(note);

    contextMenu.value!.show(event);
}



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
</template>

<style scoped>
#tree {
    height: v-bind(height);
}

:deep(.tree-node:hover) {
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