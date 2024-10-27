<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import Button from 'primevue/button';

import useSettingsStore from '#store';

import Reference from '#components/Reference';
import NotePage from '#components/NotePage';



const settings = useSettingsStore();
</script>

<template>
    <Splitter stateKey="splitterSize" stateStorage="local">
        <SplitterPanel :minSize="20">
            <div class="flex-row align-center">
                <div class="app-logo">Nanahoshi</div>
                <div class="spacer"></div>
                <Button :icon="settings.darkTheme ? 'pi pi-moon' : 'pi pi-sun'" text rounded
                        @click="settings.toggleTheme(true)" />
                <Button icon="pi pi-cog" text rounded />
            </div>
            <Reference />
        </SplitterPanel>
        <SplitterPanel :minSize="60">
            <NotePage />
        </SplitterPanel>
    </Splitter>
</template>

<style scoped>
.p-splitter {
    border: none;
}
</style>