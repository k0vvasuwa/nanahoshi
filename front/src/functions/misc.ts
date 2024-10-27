import Cookies from 'js-cookie';

import { Note } from '#types';



export function getCsrfToken(): string {
    const token: string | undefined = Cookies.get('csrftoken');

    if (!token) {
        throw 'CSRF token not set';
    }

    return token;
}

export function getRootNote(): Note {
    return {
        id: 1,
        name: 'Конспектики',
        position: 1,
        parent: null as unknown as number,
        has_children: true
    };
}