<script setup lang="ts">
import { provide } from 'vue';

import {
    Router,
    RouteLocationNormalizedLoaded,
    useRouter,
    useRoute
} from 'vue-router';

import useSettingsStore from './store.ts';

import { setCsrfToken } from '#functions/requests';



const settings = useSettingsStore();

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();



async function redirect(url: string): Promise<void> {
    await router.push(url);
}

async function start(): Promise<void> {
    await setCsrfToken();

    await settings.setLoginStatus();

    if (settings.loggedIn) {
        if (route.name === 'login') {
            redirect('/');
        }

        // load settings...
    } else {
        if (route.name !== 'login') {
            redirect('/login');
        }
        settings.obtainLocalData();
    }
}



start();

provide('redirect', redirect);
</script>

<template>
    <RouterView />
</template>

<style scoped>

</style>