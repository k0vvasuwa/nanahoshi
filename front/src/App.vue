<script setup lang="ts">
import { provide } from 'vue';

import {
    Router,
    RouteLocationNormalizedLoaded,
    useRouter,
    useRoute
} from 'vue-router';

import {
    setCsrfToken,
    checkUserLoggedIn
} from '#requests';



const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();



async function redirect(url: string): Promise<void> {
    await router.push(url);
}

async function start(): Promise<void> {
    await setCsrfToken();
}



start();

provide('redirect', redirect);
</script>

<template>

</template>

<style scoped>

</style>