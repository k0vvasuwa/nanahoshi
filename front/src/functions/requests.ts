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
    return (await axios.get(`${storageUrl}notes/?parent=${parentId}`)).data;
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

export async function deleteNote(id: number): Promise<void> {
    await axios.delete(`${storageUrl}notes/${id}/`);
}

export async function checkNoteHasSpecificParent(targetId: number, parentId: number): Promise<boolean> {
    return (await axios.get(`${storageUrl}note-has-parent?target_id=${targetId}&parent_id=${parentId}`)).data.result;
}

export async function checkNoteExists(id: number): Promise<boolean> {
    return (await axios.get(`${storageUrl}note-exists/${id}`)).data.result;
}

export async function getNoteTitle(id: number): Promise<string> {
    return (await axios.get(`${storageUrl}get-note-title/${id}`)).data.title;
}

export async function getNotePage(id: number): Promise<string> {
    return (await axios.get(`${storageUrl}get-note-page/${id}`)).data;
}

export async function updateNotePage(id: number, data: string): Promise<void> {
    await axios.patch(`${storageUrl}update_note_page/${id}/`, data);
}