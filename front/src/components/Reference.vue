<script setup lang="ts">
import {
    ref,
    useTemplateRef,
    onMounted
} from 'vue';

import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'



const tree = useTemplateRef<InstanceType<typeof Draggable>>('tree');
const height = ref<string>('800px');



function calcTreeHeight(): void {
    const docHeight: number = document.documentElement.clientHeight;
    const offset: number = tree.value!.$el.offsetTop;

    height.value = `${docHeight - offset}px`;
}



onMounted((): void => {
    calcTreeHeight();
    window.addEventListener('resize', calcTreeHeight);
});
</script>

<template>
    <Draggable id="tree" ref="tree" textKey="name">

    </Draggable>
</template>

<style scoped>
#tree {
    height: v-bind(height);
}
</style>