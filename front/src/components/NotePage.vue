<script setup lang="ts">
import {
    ref,
    inject,
    useTemplateRef,
    onMounted,
    onUpdated, onUnmounted, onBeforeUnmount
} from 'vue';

import { AxiosError } from 'axios';

import {
    Plugin,
    Editor,
    ButtonView,
    ClassicEditor,
    EditorConfig,
    Essentials,
    Paragraph,
    Undo,
    Font,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    Alignment,
    Heading,
    HeadingButtonsUI,
    ParagraphButtonUI,
    Indent,
    IndentBlock,
    List,
    ListProperties,
    Link,
    AutoLink,
    Image,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    SimpleUploadAdapter,
    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties,
    Code,
    CodeBlock,
    Autosave,
    icons
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import coreTranslations from 'ckeditor5/translations/ru.js';

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';

import ScrollPanel from 'primevue/scrollpanel';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

import { Toast } from '#types';

import { getCsrfToken } from '#functions/misc';

import {
    storageUrl,
    getNotePage,
    updateNotePage
} from '#functions/requests';



const Close = createEditorPlugin('close', icons.cancel, 'Закрыть редактор', (): void => {
    editable.value = false;
});

const props = defineProps<{
    id: number,
    title: string
}>();

const toast = inject('toast') as Toast;

const scrollHeight = ref<string>('700px');
const scrollPanel = useTemplateRef<InstanceType<typeof ScrollPanel>>('scrollPanel');

const content = useTemplateRef<HTMLElement>('content');

const data = ref<string>('');

const hasCode = ref<boolean>(false);

const editable = ref<boolean>(false);
const editor = ref(ClassicEditor);

const config = ref<EditorConfig>({
    plugins: [
        Essentials,
        Paragraph,
        Close,
        Undo,
        Font,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Subscript,
        Superscript,
        Alignment,
        Heading,
        HeadingButtonsUI,
        ParagraphButtonUI,
        Indent,
        IndentBlock,
        List,
        ListProperties,
        Link,
        AutoLink,
        Image,
        ImageCaption,
        ImageInsert,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        SimpleUploadAdapter,
        Table,
        TableToolbar,
        TableProperties,
        TableCellProperties,
        Code,
        CodeBlock,
        Autosave
    ],
    translations: [
        coreTranslations
    ],
    toolbar: [
        'close',
        '|',
        'undo',
        'redo',
        '|',
        'fontFamily',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'subscript',
        'superscript',
        '|',
        'alignment:left',
        'alignment:right',
        'alignment:center',
        'alignment:justify',
        '|',
        'paragraph',
        'heading1',
        'heading2',
        'heading3',
        '|',
        'outdent',
        'indent',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'link',
        'insertImage',
        'insertTable',
        '|',
        'code',
        'codeBlock'
    ],
    fontFamily: {
        options: [
            'default',
            'Cascadia Code',
            'Times New Roman',
            'Arial',
            'Courier New',
            'Georgia',
            'Tahoma',
            'Verdana'
        ]
    },
    list: {
        properties: {
            styles: true,
            startIndex: true,
            reversed: true
        }
    },
    link: {
        addTargetToExternalLinks: true
    },
    image: {
        toolbar: [
            'imageStyle:inline',
            'imageStyle:alignBlockLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignBlockRight',
            'imageStyle:wrapText',
            '|',
            'resizeImage',
            '|',
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'linkImage'
        ],
        resizeOptions: [
            {
                name: 'resizeImage:20',
                label: '20%',
                value: '20'
            },
            {
                name: 'resizeImage:50',
                label: '50%',
                value: '50'
            },
            {
                name: 'resizeImage:100',
                label: '100%',
                value: '100'
            },
            {
                name: 'resizeImage:custom',
                label: 'Custom',
                value: 'custom'
            },
            {
                name: 'resizeImage:original',
                value: null,
                label: 'Original'
            }
        ],
        insert: {
            type: 'auto'
        }
    },
    simpleUpload: {
        uploadUrl: `${storageUrl}upload-image/${props.id}/`,
        withCredentials: true,
        headers: {
            'X-CSRFToken': getCsrfToken()
        }
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties'
        ],
        defaultHeadings: {
            rows: 1,
            columns: 1
        }
    },
    codeBlock: {
        languages: [
            { language: 'autohotkey', label: 'AutoHotkey' },
            { language: 'bash', label: 'Bash' },
            { language: 'csharp', label: 'C#' },
            { language: 'c', label: 'C' },
            { language: 'cpp', label: 'C++' },
            { language: 'cmake', label: 'CMake' },
            { language: 'css', label: 'CSS' },
            { language: 'dockerfile', label: 'Dockerfile' },
            { language: 'dart', label: 'Dart' },
            { language: 'fsharp', label: 'F#' },
            { language: 'html', label: 'HTML' },
            { language: 'xml', label: 'XML' },
            { language: 'json', label: 'JSON' },
            { language: 'java', label: 'Java' },
            { language: 'javascript', label: 'JavaScript' },
            { language: 'kotlin', label: 'Kotlin' },
            { language: 'tex', label: 'LaTeX' },
            { language: 'postgresql', label: 'PostgreSQL' },
            { language: 'powershell', label: 'PowerShell' },
            { language: 'qml', label: 'QML' },
            { language: 'scss', label: 'SCSS' },
            { language: 'sql', label: 'SQL' },
            { language: 'scilab', label: 'Scilab' },
            { language: 'shell', label: 'Shell' },
            { language: 'typescript', label: 'TypeScript' }
        ]
    },
    autosave: {
        async save() {
            try {
                await updateNotePage(props.id, data.value);
            } catch (e) {
                const error = e as AxiosError;
                toast.error('Не удалось сохранить изменения', error.message);
                return;
            }
        }
    }
});



function createEditorPlugin(componentName: string, buttonIcon: string, buttonTooltip: string, callback: (...args: any[]) => any) {
    return class extends Plugin {
        init(): void {
            const editor: Editor = this.editor;

            editor.ui.componentFactory.add(componentName, (): ButtonView => {
                const button = new ButtonView();

                button.set({
                    icon: buttonIcon,
                    withText: false,
                    tooltip: buttonTooltip
                });

                button.on('execute', callback);

                return button;
            });
        }
    };
}

function calcScrollHeight(): void {
    const docHeight: number = document.documentElement.clientHeight;
    scrollHeight.value = `${docHeight - 86}px`;
}

async function loadPage(): Promise<void> {
    try {
        data.value = await getNotePage(props.id);
    } catch (e) {
        const error = e as AxiosError;
        toast.error('Не удалось загрузить страницу', error.message);
    }
}

function processEditor(editor: ClassicEditor): void {
    editor.keystrokes.set('esc', () => editable.value = false);
}

function detectFeatures(): void {
    hasCode.value = scrollPanel.value!.$el.querySelector('pre code') !== null;
}

function applyFeatures(): void {
    if (hasCode.value) {
        for (const el of content.value!.querySelectorAll('pre code')) {
            hljs.highlightElement(el as HTMLElement);
        }
    }
    MathJax.typeset();
}

function handlePressingEscape(event: KeyboardEvent): void {
    if (event.ctrlKey && event.code === 'KeyE') {
        event.preventDefault();
        editable.value = true;
    }
}



onMounted(async (): Promise<void> => {
    calcScrollHeight();
    window.addEventListener('resize', calcScrollHeight);

    window.addEventListener('keydown', handlePressingEscape);

    await loadPage();
    detectFeatures();
    applyFeatures();
});

onUpdated((): void => {
    detectFeatures();
    applyFeatures();
});

onBeforeUnmount((): void => {
    window.removeEventListener('keydown', handlePressingEscape);
});
</script>

<template>
    <div class="wrapper">
        <div class="page-title flex-row align-center">
            <div>
                {{ title }}
            </div>
            <Divider layout="vertical" />
            <Button icon="pi pi-file-edit" text rounded @click="editable = true;" :disabled="editable" />
        </div>
        <ScrollPanel ref="scrollPanel" class="scroll-panel">
            <div v-show="!editable" v-html="data" ref="content" class="page-content" />
            <div v-show="editable">
                <ckeditor v-model="data" :editor="editor" :config="config as EditorConfig" @ready="processEditor" />
            </div>
        </ScrollPanel>
    </div>
</template>

<style scoped>
.scroll-panel {
    height: v-bind(scrollHeight);
}

.page-title {
    padding-left: 10px;
    border-bottom: 1px solid var(--page-title-border-color);
    min-height: 41px;
    max-height: 41px;
}

:deep(code) {
    font-family: 'Cascadia Code';
}

:deep(pre code) {
    color: var(--code-block-color);
}

:deep(mjx-container[jax="CHTML"][display="true"]) {
    display: inline-block !important;
}

:deep(.page-content .image) {
    display: table;
    clear: both;
    text-align: center;
    margin: 0.9em auto;
    min-width: 50px;
}

:deep(.page-content img.image_resized) {
    height: auto;
}

:deep(.page-content .image.image_resized) {
    max-width: 100%;
    display: block;
    box-sizing: border-box;
}

:deep(.page-content .image.image_resized img) {
    height: auto;
    width: 100%;
}

:deep(.page-content .image.image-style-block-align-left), :deep(.page-content .image.image-style-block-align-right) {
    max-width: calc(100% - var(--ck-image-style-spacing));
}

:deep(.page-content .image.image-style-align-left), :deep(.page-content .image.image-style-align-right) {
    clear: none;
}

:deep(.page-content .image.image-style-align-left) {
    float: left;
    margin-right: var(--ck-image-style-spacing);
}

:deep(.page-content .image.image-style-align-right) {
    float: right;
    margin-left: var(--ck-image-style-spacing);
}

:deep(.page-content .image.image-style-block-align-left) {
    margin-left: 0;
    margin-right: auto;
}

:deep(.page-content .image.image-style-block-align-right) {
    margin-right: 0;
    margin-left: auto;
}

:deep(.page-content .image-style-align-center) {
    margin-left: auto;
    margin-right: auto;
}

:deep(.page-content p + .image.image-style-align-left), :deep(.page-content p + .image.image-style-align-right) {
    margin-top: 0;
}

:deep(.page-content .image img) {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    min-width: 100%;
    height: auto;
}

:deep(.page-content .image-inline) {
    display: inline-flex;
    max-width: 100%;
    align-items: flex-start;
}

:deep(.page-content .image > figcaption) {
    display: block;
    text-align: center;
    caption-side: bottom;
    word-break: break-word;
    color: var(--ck-color-image-caption-text);
    background-color: #e6d8d8;
    padding: .6em;
    font-size: .75em;
    outline-offset: -1px;
}

:deep(.page-content .table) {
    margin: 0.9em auto;
    display: table;
}

:deep(.page-content .table table) {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    height: 100%;
    border: 1px double hsl(0, 0%, 70%);
}

:deep(.page-content .table table td), :deep(.page-content .table table th) {
    min-width: 2em;
    padding: .4em;
    border: 1px solid hsl(0, 0%, 75%);
}

:deep(.page-content .table table th) {
    font-weight: bold;
    background: var(--th-background);
}
</style>