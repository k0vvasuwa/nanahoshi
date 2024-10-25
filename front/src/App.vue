<script setup lang="ts">
import { provide } from 'vue';

import {
    Router,
    RouteLocationNormalizedLoaded,
    useRouter,
    useRoute
} from 'vue-router';

import { Theme } from '#enums';

import { setTheme } from '#functions/theme';

import {
    setCsrfToken,
    checkUserLoggedIn
} from '#functions/requests';



const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();



async function redirect(url: string): Promise<void> {
    await router.push(url);
}

async function start(): Promise<void> {
    await setCsrfToken();

    const loggedIn: boolean = await checkUserLoggedIn();

    if (loggedIn) {

    } else {
        if (route.name !== 'login') {
            redirect('/login');
        }

        const theme: string | null = localStorage.getItem('theme');

        if (theme) {
            setTheme(theme);
        } else {
            const prefersDarkTheme: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;

            if (prefersDarkTheme) {
                setTheme(Theme.Dark);
            }
        }
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