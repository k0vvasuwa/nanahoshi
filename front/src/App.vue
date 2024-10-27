<script setup lang="ts">
import { provide } from 'vue';

import {
    Router,
    RouteLocationNormalizedLoaded,
    useRouter,
    useRoute
} from 'vue-router';

import { ToastServiceMethods } from 'primevue/toastservice';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

import useSettingsStore from '#store';

import { Severity } from '#enums';

import { setCsrfToken } from '#functions/requests';



const settings = useSettingsStore();

const toastService: ToastServiceMethods = useToast();

const toast = {
    show(type: Severity, message: string, details?: string): void {
        toastService.add({
            severity: type,
            summary: message,
            detail: details,
            life: 10_000
        });
    },
    success(message: string, details?: string): void {
        this.show(Severity.Success, message, details);
    },
    info(message: string, details?: string): void {
        this.show(Severity.Info, message, details);
    },
    warn(message: string, details?: string): void {
        this.show(Severity.Warn, message, details);
    },
    error(message: string, details?: string): void {
        this.show(Severity.Error, message, details);
    }
};

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

provide('toast', toast);
provide('redirect', redirect);
</script>

<template>
    <RouterView />
    <Toast />
    <ConfirmDialog />
</template>

<style scoped>

</style>