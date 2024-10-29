import axios from 'axios';

import { defineStore } from 'pinia';

import { ref } from 'vue';

import { Settings } from '#types';

import {
    apiPrefix,
    storageUrl
} from '#functions/requests';



const authUrl: string = `${apiPrefix}auth/`;

const useSettingsStore = defineStore('settings', () => {
    const loggedIn = ref<boolean>(false);
    const darkTheme = ref<boolean>(false);
    const expandedNotes = ref<number[]>();
    const openedTabs = ref<number[]>([]);
    const programmingLanguages = ref<Record<string, string>>({});

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

    async function toggleTheme(saveToDb: boolean = false): Promise<void> {
        document.documentElement.classList.toggle('dark');
        darkTheme.value = !darkTheme.value;
        localStorage.setItem('darkTheme', `${+darkTheme.value}`);

        if (saveToDb) {
            await save({
                dark_theme: darkTheme.value
            });
        }
    }

    async function load(): Promise<void> {
        const data: Settings = (await axios.get(`${storageUrl}settings/1/`)).data;

        if (darkTheme.value !== data.dark_theme) {
            toggleTheme();
        }

        expandedNotes.value = data.expanded_notes;
        openedTabs.value = data.opened_tabs;
        programmingLanguages.value = data.programming_languages;
    }

    async function save(data: Partial<Settings>) {
        await axios.patch(`${storageUrl}settings/1/`, data);
    }

    return {
        loggedIn,
        darkTheme,
        expandedNotes,
        openedTabs,
        programmingLanguages,
        obtainLocalData,
        setLoginStatus,
        login,
        logout,
        toggleTheme,
        load,
        save
    };
});



export default useSettingsStore;