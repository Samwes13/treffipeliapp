import {defineConfig} from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'http://localhost:8081/',
        headless: false, //Jos haluat katsoa testin visuaalisesti selaimessa käytä falsea
    },
})