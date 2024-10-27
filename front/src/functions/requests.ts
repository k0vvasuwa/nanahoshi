import axios from 'axios';

import { Note } from '#types';

import { getCsrfToken } from '#functions/misc';



export const apiPrefix: string = '/api/';
export const storageUrl: string = `${apiPrefix}storage/`;



export async function setCsrfToken(): Promise<void> {
    const axiosDefaults = axios.defaults;

    if (!axiosDefaults.withCredentials) {
        axiosDefaults.withCredentials = true;
    }

    await axios.get(`${apiPrefix}set-csrf-token`);
    axiosDefaults.headers['X-CSRFToken'] = getCsrfToken();
}

export async function getNotes(parentId: number): Promise<Note[]> {
    return (await axios.get(`${storageUrl}notes?parent=${parentId}`)).data;
}

export async function createNote(name: string, parent: number): Promise<Note> {
    return (await axios.post(`${storageUrl}notes/`, {
        name,
        parent
    })).data;
}

export async function updateNote(id: number, data: Partial<Note>): Promise<Note> {
        return (await axios.patch(`${storageUrl}notes/${id}/`, data)).data;
}