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


import { Note } from '#types';

import { getRootNote } from '#functions/misc';

import {
    getNotes
} from '#functions/requests';



const notes = ref<Note[]>([getRootNote()]);

const tree = useTemplateRef<InstanceType<typeof Draggable>>('tree');
const height = ref<string>('800px');



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



const rootNote: Note = notes.value[0];

getNotes(1).then(
    children => {
        rootNote.children = children;
        tree.value!.addMulti(children, getStat(rootNote));
    }
)

onMounted((): void => {
    tree.value!.$el.querySelector('i').classList.toggle('down');
    getStat(rootNote).open = true;

    calcTreeHeight();
    window.addEventListener('resize', calcTreeHeight);
});
</script>

<template>
    <Draggable id="tree" class="mtl-tree" ref="tree" v-model="notes" virtualization textKey="name" :defaultOpen="false">
        <template #default="{ node: note, stat}" >
            <i v-if="note.has_children" class="pi pi-angle-right" @click="expandNode($event as PointerEvent, stat)"
               @mouseenter.once="loadChildren(note)" />
            <div class="spacer">{{ note.name }}</div>
        </template>
    </Draggable>
</template>

<style scoped>
#tree {
    height: v-bind(height);
}

:deep(.tree-node:hover) {
    background-color: var(--node-hover-background);
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