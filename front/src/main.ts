import {
    App,
    createApp
} from 'vue';

import AppComponent from './App.vue';

import './style.css';

import router from '#router';



const app: App<Element> = createApp(AppComponent)



app.use(router);

app.mount('#app');