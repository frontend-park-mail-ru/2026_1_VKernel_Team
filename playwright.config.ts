import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    retries: 0,
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:80',
        headless: true,
    },
});
