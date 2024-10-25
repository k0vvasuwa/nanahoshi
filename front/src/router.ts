import {
    Router,
    RouteRecordRaw,
    createRouter,
    createWebHistory
} from 'vue-router';

import Login from '#components/Login';
import Home from '#components/Home';



const routes: RouteRecordRaw[] = [
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'home',
        path: '/',
        component: Home
    }
];

const router: Router = createRouter({
    routes,
    history: createWebHistory()
});



export default router;