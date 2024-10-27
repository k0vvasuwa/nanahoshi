export type Settings = {
    dark_theme: boolean
    expanded_notes: number[]
    opened_tabs: number[]
    splitter_size: number
    programming_languages: object
}



export type Redirect = (url: string) => Promise<void>