<script setup lang="ts">
import {
    ref,
    inject
} from 'vue';

import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

import Button from 'primevue/button';

import useSettingsStore from '#store';

import {
    Toast,
    Redirect
} from '#types';

import { setCsrfToken } from '#functions/requests';



const settings = useSettingsStore();

const toast = inject('toast') as Toast;
const redirect = inject('redirect') as Redirect;

const triedLogin = ref<boolean>(false);
const username = ref<string>('');
const password = ref<string>('');



async function login(): Promise<void> {
    triedLogin.value = true;

    if (!username.value || !password.value) {
        return;
    }

    await settings.login(username.value, password.value);

    if (settings.loggedIn) {
        await setCsrfToken();
        await redirect('/');
    } else {
        toast.error('Не удалось выполнить вход', 'Проверьте правильность введённых данных');
    }
}
</script>

<template>
    <div class="absolutely-centered flex-column gap-10">
        <Button class="align-self-end" :icon="settings.darkTheme ? 'pi pi-moon' : 'pi pi-sun'" text rounded
                @click="settings.toggleTheme()"/>
        <div class="app-logo align-self-center">
            Nanahoshi
        </div>
        <FloatLabel variant="on">
            <InputText v-model="username" variant="filled" />
            <label>Логин</label>
        </FloatLabel>
        <FloatLabel variant="on">
            <Password v-model="password" />
            <label>Пароль</label>
        </FloatLabel>
        <Button label="Войти" @click="login" />
        <Button label="Регистрация" severity="danger" disabled />
    </div>
</template>

<style scoped>

</style>