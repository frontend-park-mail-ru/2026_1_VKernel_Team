import { test, expect } from '@playwright/test';

test('главная страница открывается', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
});
