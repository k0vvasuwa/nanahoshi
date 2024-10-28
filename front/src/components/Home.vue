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
    TabNote,
    Redirect
} from '#types';

import Reference from '#components/Reference';
import NotePage from '#components/NotePage';



const settings = useSettingsStore();

const redirect = inject('redirect') as Redirect;

const menu = useTemplateRef<InstanceType<typeof Menu>>('menu');
const menuItems = ref<MenuItem[]>(getMenuItems());

const tabs = ref<TabNote[]>([]);
const currentTab = ref<string>();



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
</script>

<template>
    <Splitter stateKey="splitterSize" stateStorage="local">
        <SplitterPanel :minSize="20">
            <div class="flex-row align-center">
                <div class="app-logo">Nanahoshi</div>
                <div class="spacer"></div>
                <Button :icon="settings.darkTheme ? 'pi pi-moon' : 'pi pi-sun'" text rounded
                        @click="settings.toggleTheme(true)" />
                <Button icon="pi pi-cog" text rounded @click="menu?.toggle"/>
                <Menu ref="menu" :model="menuItems" popup />
            </div>
            <Reference />
        </SplitterPanel>
        <SplitterPanel :minSize="60">
            <Tabs v-if="currentTab" v-model:value="currentTab" scrollable>
                <TabList>
                    <Tab v-for="tab in tabs" :key="tab.noteId" :value="tab.value">
                        <div class="flex-row align-center">
                            <div>
                                {{ tab.name }}
                            </div>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel v-for="tab in tabs" :key="tab.noteId" :value="tab.value">
                        <NotePage :id="tab.noteId" />
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
</style>