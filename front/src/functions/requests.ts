import axios from 'axios';

import { getCsrfToken } from '#functions/misc';



export const apiPrefix: string = '/api/';
export const storeUrl: string = `${apiPrefix}store/`;



export async function setCsrfToken(): Promise<void> {
    const axiosDefaults = axios.defaults;

    if (!axiosDefaults.withCredentials) {
        axiosDefaults.withCredentials = true;
    }

    await axios.get(`${apiPrefix}set-csrf-token`);
    axiosDefaults.headers['X-CSRFToken'] = getCsrfToken();
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