export type Settings = {
    dark_theme: boolean
    expanded_notes: number[]
    opened_tabs: number[]
    programming_languages: Record<string, string>
}

export type Toast = {
    success: ToastCall
    info: ToastCall
    warn: ToastCall
    error: ToastCall
}

export type Note = {
    id: number
    name: string
    position: number
    parent: number
    has_children: boolean
    children?: Note[]
}

export type TabNote = {
    value: string
    noteId: number
    name: string
}



type ToastCall = (message: string, details?: string) => void
export type Redirect = (url: string) => Promise<void>