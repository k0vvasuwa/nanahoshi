import axios from 'axios';

import { getCsrfToken } from '#functions/misc';



const apiPrefix: string = '/api/';
const authUrl: string = `${apiPrefix}/auth/`;



export async function setCsrfToken(): Promise<void> {
    const axiosDefaults = axios.defaults;

    if (!axiosDefaults.withCredentials) {
        axiosDefaults.withCredentials = true;
    }

    await axios.get(`${apiPrefix}set-csrf-token`);
    axiosDefaults.headers['X-CSRFToken'] = getCsrfToken();
}

export async function checkUserLoggedIn(): Promise<boolean> {
    return (await axios.get(`${authUrl}get-login-status`)).data.loggedIn;
}

export async function login(username: string, password: string): Promise<void> {
    await axios.post(`${authUrl}login`, {
        username,
        password
    });
}

export async function logout(): Promise<void> {
    await axios.get(`${authUrl}logout`);
}