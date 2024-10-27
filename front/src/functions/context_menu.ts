import { MenuItem } from 'primevue/menuitem';

import { Note } from '#types';



export function getContextMenuItems(): MenuItem[] {
    return [
        {
            label: 'Добавить запись',
            icon: 'pi pi-file-plus'
        },
        {
            label: 'Переименовать',
            icon: 'pi pi-pencil'
        },
        {
            label: 'Удалить',
            icon: 'pi pi-trash'
        }
    ];
}

export function getContextMenuPermissions(note: Note): boolean[] {
    const permissions: boolean[] = [false, false, false];

    if (note.id === 1) {
        permissions[1] = true;
        permissions[2] = true;
    }

    return permissions;
}