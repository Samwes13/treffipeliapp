import {defineConfig} from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'http://treffipeli.fi',
        headless: false, //Jos haluat katsoa testin visuaalisesti selaimessa käytä falsea
    },
})