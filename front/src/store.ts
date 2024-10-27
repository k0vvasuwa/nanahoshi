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
    const dark_theme = ref<boolean>(false);
    const expanded_notes = ref<number[]>([]);
    const opened_tabs = ref<number[]>([]);
    const splitter_size = ref<number>(20);
    const programming_languages = ref<Record<string, string>>({});

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

    async function login(username: string, password: string): Promise<void> {
        await axios.post(`${authUrl}login`, {
            username,
            password
        });
    }

    async function logout(): Promise<void> {
        await axios.get(`${authUrl}logout`);
    }

    async function toggleTheme(): Promise<void> {
        document.documentElement.classList.toggle('dark');
        dark_theme.value = !dark_theme.value;
        localStorage.setItem('darkTheme', `${+dark_theme.value}`);

        if (loggedIn.value) {
            await save({
                dark_theme: dark_theme.value
            });
        }
    }

    async function load(): Promise<void> {

    }

    async function save(data: Partial<Settings>) {
        await axios.patch(`${storeUrl}settings/1/`, data);
    }

    async function saveAll(): Promise<void> {
        const data: Settings = {
            dark_theme: dark_theme.value,
            expanded_notes: expanded_notes.value,
            opened_tabs: opened_tabs.value,
            splitter_size: splitter_size.value,
            programming_languages: programming_languages.value
        };

        await save(data);
    }

    return {
        loggedIn,
        darkTheme: dark_theme,
        obtainLocalData,
        setLoginStatus,
        login,
        logout,
        toggleTheme,
        save,
        saveAll
    };
});



export default useSettingsStore;