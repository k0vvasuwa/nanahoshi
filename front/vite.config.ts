import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';



export default defineConfig({
    plugins: [vue()],
    resolve: {
        extensions: [
            '.css',
            '.ts',
            '.vue'
        ],
        alias: {
            '#styles': '/src/styles.css',
            '#router': '/src/router.ts',
            '#components': '/src/components'
        }
    }
});