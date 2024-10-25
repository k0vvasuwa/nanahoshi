import { Theme } from '#enums';



export async function setTheme(theme: Theme, saveToDb: boolean = false): Promise<void> {
    document.documentElement.className = theme;

    localStorage.setItem('theme', theme);

    if (saveToDb) {

    }
}