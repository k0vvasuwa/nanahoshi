<script setup lang="ts">
import {
    ref,
    inject,
    useTemplateRef,
    onMounted
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
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    Font,
    Code,
    icons
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import coreTranslations from 'ckeditor5/translations/ru.js';

import ScrollPanel from 'primevue/scrollpanel';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

import { Toast } from '#types';

import {
    getNotePage
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

const data = ref<string>('');

const editable = ref<boolean>(false);
const editor = ref(ClassicEditor);

const config = ref<EditorConfig>({
    plugins: [
        Essentials,
        Paragraph,
        Close,
        Undo,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Subscript,
        Superscript,
        Font,
        Code
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
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'subscript',
        'superscript',
        '|',
        'fontFamily',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'code'
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



loadPage();

onMounted(async (): Promise<void> => {
    calcScrollHeight();
    window.addEventListener('resize', calcScrollHeight);

    window.addEventListener('keydown', (event): void => {
        if (event.ctrlKey && event.code === 'KeyE') {
            event.preventDefault();
            editable.value = true;
        }
    });

    await loadPage();
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
            <div v-show="!editable" v-html="data" ref="content" class="pageContent" />
            <div v-show="editable">
                <ckeditor v-model="data" :editor="editor" :config="config" @ready="processEditor" />
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
</style>