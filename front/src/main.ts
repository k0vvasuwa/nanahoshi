import {
    App,
    createApp
} from 'vue';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import AppComponent from './App.vue';

import '#styles';

import router from '#router';



const app: App<Element> = createApp(AppComponent)



app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark'
        }
    }
});

app.use(router);

app.mount('#app');