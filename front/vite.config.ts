import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';



const proxy = {
    target: 'http://localhost:8000',
};



export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/api': proxy
        }
    },
    resolve: {
        extensions: [
            '.css',
            '.ts',
            '.vue'
        ],
        alias: {
            '#styles': '/src/styles.css',
            '#store': '/src/store.ts',
            '#enums': '/src/enums.ts',
            '#types': '/src/types.ts',
            '#router': '/src/router.ts',
            '#functions': '/src/functions',
            '#components': '/src/components'
        }
    }
});