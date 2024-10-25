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
            '#enums': '/src/enums.ts',
            '#types': '/src/types.ts',
            '#router': '/src/router.ts',
            '#functions': '/src/functions',
            '#requests': '/src/requests.ts',
            '#components': '/src/components'
        }
    }
});