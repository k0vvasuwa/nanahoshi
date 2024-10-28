<script setup lang="ts">
import {
    ref
} from 'vue';

import {
    getNotePage
} from '#functions/requests';



const props = defineProps<{
    id: number,
    title: string
}>();



function loadPage(): void {

}



loadPage();
</script>

<template>
    <div>{{ title }}</div>
</template>

<style scoped>

</style>