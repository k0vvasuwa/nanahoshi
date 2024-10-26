import { defineStore } from 'pinia';

import { ref } from 'vue';

import { authUrl } from '#functions/requests';
import axios from 'axios';



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

    return {
        loggedIn,
        darkTheme,
        obtainLocalData,
        setLoginStatus,
        toggleTheme
    };
});



export default useSettingsStore;