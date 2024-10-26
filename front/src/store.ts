import axios from 'axios';

import { defineStore } from 'pinia';

import { ref } from 'vue';

import { Settings } from '#types';

import {
    apiPrefix,
    storeUrl
} from '#functions/requests';



const authUrl: string = `${apiPrefix}/auth/`;

const useSettingsStore = defineStore('settings', () => {
    const loggedIn = ref<boolean>(false);
    const darkTheme = ref<boolean>(false);

    function obtainLocalData(): void {
        const theme: string | null = localStorage.getItem('darkTheme');

        if (theme) {
            if (theme === '1') {
                toggleTheme();
            }
        } else {
            const prefersDarkTheme: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (prefersDarkTheme) {
                toggleTheme();
            }
        }
    }

    async function setLoginStatus(): Promise<void> {
        loggedIn.value = (await axios.get(`${authUrl}get-login-status`)).data.loggedIn;
    }

    async function toggleTheme(): Promise<void> {
        document.documentElement.classList.toggle('dark');
        darkTheme.value = !darkTheme.value;
        localStorage.setItem('darkTheme', `${+darkTheme.value}`);

        if (loggedIn.value) {

        }
    }

    async function save(data: Partial<Settings>) {
        await axios.patch(`${storeUrl}settings/1`, data);
    }

    async function saveAll(): Promise<void> {
        const data: Settings = {
            dark_theme: darkTheme.value
        };

        await save(data);
    }

    return {
        loggedIn,
        darkTheme,
        obtainLocalData,
        setLoginStatus,
        toggleTheme
    };
});



export default useSettingsStore;