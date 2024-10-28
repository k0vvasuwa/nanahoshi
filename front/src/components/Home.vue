<script setup lang="ts">
import {
    ref,
    useTemplateRef,
    inject
} from 'vue';

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import Button from 'primevue/button';

import { MenuItem } from 'primevue/menuitem';
import Menu from 'primevue/menu';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import useSettingsStore from '#store';

import {
    Note,
    TabNote,
    Redirect
} from '#types';

import {
    checkNoteHasSpecificParent,
    checkNoteExists,
    getNoteTitle
} from '#functions/requests';

import Reference from '#components/Reference';
import NotePage from '#components/NotePage';
import axios from 'axios';



const settings = useSettingsStore();

const redirect = inject('redirect') as Redirect;

const menu = useTemplateRef<InstanceType<typeof Menu>>('menu');
const menuItems = ref<MenuItem[]>(getMenuItems());

const tabs = ref<TabNote[]>([]);
const currentTab = ref<string>('0');



function getMenuItems(): MenuItem[] {
    return [
        {
            label: 'Языки программирования',
            icon: 'pi pi-code'
        },
        {
            label: 'Выйти',
            icon: 'pi pi-sign-out',
            async command(): Promise<void> {
                await settings.logout();
                await redirect('/login');
            }
        }
    ];
}

function addTab(newTab: TabNote, active: boolean): void {
    let alreadyExists: boolean = false;

    for (const tab of tabs.value) {
        if (tab.value === newTab.value) {
            alreadyExists = true;
            break;
        }
    }

    if (!alreadyExists) {
        tabs.value.push(newTab);
    }

    if (active) {
        currentTab.value = newTab.value;
    }
}

function closeTab(value: string, event?: PointerEvent): void {
    event?.stopPropagation();
    const N: number = tabs.value.length;

    for (let i: number = 0; i < N; i++) {
        if (tabs.value[i].value === value) {
            tabs.value.splice(i, 1);
            if (N === 1) {
                currentTab.value = '0';
            } else {
                if (value === currentTab.value) {
                    let prevIndex: number = i - 1;
                    if (prevIndex < 0) {
                        prevIndex = 0;
                    }

                    currentTab.value = tabs.value[prevIndex].value;
                }
            }
            break;
        }
    }
}

async function processTabsTitles(renamedNote: Note): Promise<void> {
    for (const tab of tabs.value) {
        if (tab.noteId === renamedNote.id) {
            tab.name = renamedNote.name;

            const titleParts: string[] = tab.title.split('. ');
            titleParts.pop();
            titleParts.push(renamedNote.name);
            tab.title = titleParts.join('. ');
        } else if (await checkNoteHasSpecificParent(tab.noteId, renamedNote.id)) {
            tab.title = await getNoteTitle(tab.noteId);
        }
    }
}

async function checkTabsOnExistence(deletedNoteId: number): Promise<void> {
    const tabs_: TabNote[] = tabs.value;
    const N: number = tabs_.length;
    let curIndex: number = 0;

    for (let i: number = 0; i < N; i++) {
        const curTab: TabNote = tabs_[curIndex];

        if (curTab.noteId === deletedNoteId) {
            closeTab(curTab.value);
        } else if (!(await checkNoteExists(curTab.noteId))) {
            closeTab(curTab.value);
        } else {
            curIndex++;
        }
    }
}
</script>

<template>
    <Splitter stateKey="splitterSize" stateStorage="local">
        <SplitterPanel :minSize="20">
            <div class="flex-row align-center">
                <div class="app-logo">Nanahoshi</div>
                <div class="spacer"></div>
                <Button :icon="settings.darkTheme ? 'pi pi-moon' : 'pi pi-sun'" text rounded
                        @click="settings.toggleTheme(true)" />
                <Button icon="pi pi-cog" text rounded @click="menu?.toggle" />
                <Menu ref="menu" :model="menuItems" popup />
            </div>
            <Reference @selectNote="addTab" @renameNote="processTabsTitles" @deleteNote="checkTabsOnExistence" />
        </SplitterPanel>
        <SplitterPanel :minSize="60">
            <Tabs v-if="tabs.length" v-model:value="currentTab" scrollable>
                <TabList>
                    <Tab v-for="tab in tabs" :key="tab.noteId" :value="tab.value">
                        <div class="flex-row align-center">
                            <div>
                                {{ tab.name }}
                            </div>
                            <Button class="close-tab-btn" icon="pi pi-times-circle" text rounded size="small"
                                    @click="closeTab(tab.value, $event as PointerEvent)" />
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel v-for="tab in tabs" :key="tab.noteId" :value="tab.value">
                        <NotePage :id="tab.noteId" :title="tab.title" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </SplitterPanel>
    </Splitter>
</template>

<style scoped>
.p-splitter {
    border: none;
}

.p-tab {
    padding: 2px;
    --close-tab-btn-opacity: 0;
}

.p-tab:hover {
    --close-tab-btn-opacity: 1;
}

.p-tab-active {
    --close-tab-btn-opacity: 1;
}

.close-tab-btn {
    opacity: var(--close-tab-btn-opacity);
    transition: opacity 150ms;
}
</style>