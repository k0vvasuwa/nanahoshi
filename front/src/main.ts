import {
    App,
    createApp
} from 'vue';

import AppComponent from './App.vue';

import './style.css';



const app: App<Element> = createApp(AppComponent)



app.mount('#app');