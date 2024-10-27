import {
    App,
    createApp
} from 'vue';

import {
    Pinia,
    createPinia
} from 'pinia';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import 'primeicons/primeicons.css';

import AppComponent from './App.vue';

import '#styles';

import router from '#router';



const pinia: Pinia = createPinia();

const app: App<Element> = createApp(AppComponent)



app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark'
        }
    }
});

app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia);
app.use(router);

app.mount('#app');