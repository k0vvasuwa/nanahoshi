<script setup lang="ts">
import { setCsrfToken } from '#requests';



async function start(): Promise<void> {
    await setCsrfToken();
}



start();
</script>

<template>

</template>

<style scoped>

</style>