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



onMounted((): void => {
    tree.value!.$el.querySelector('i').classList.toggle('down');
    calcTreeHeight();
    window.addEventListener('resize', calcTreeHeight);
});
</script>

<template>
    <Draggable id="tree" class="mtl-tree" ref="tree" v-model="notes" virtualization textKey="name">
        <template #default="{ node: note, stat}" >
            <i class="pi pi-angle-right" @click="expandNode($event as PointerEvent, stat)" />
            <div class="spacer">{{ note.name }}</div>
        </template>
    </Draggable>
</template>

<style scoped>
#tree {
    height: v-bind(height);
}

:deep(.tree-node-inner:hover) {
    background-color: var(--expand-icon-hover-background);
}

.pi-angle-right {
    transition: rotate 150ms;
}

.down {
    rotate: 90deg;
}
</style>