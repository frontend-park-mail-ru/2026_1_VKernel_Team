import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import { createAdWithPhoto } from './helpers';

const accounts = JSON.parse(fs.readFileSync('test-accounts.json', 'utf-8'));
const { email, password } = accounts[0];

const test = base.extend<{ authedPage: import('@playwright/test').Page }>({
    authedPage: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: '/tmp/test-reset-auth.json' });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

test.describe('Сброс тестового аккаунта через /api/v1/test/reset', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('/login');
        await page.locator('input[type="email"]').first().fill(email);
        await page.locator('input[type="password"]').first().fill(password);
        await page.click('button:has-text("Войти")');
        await page.waitForURL('**/', { timeout: 15000 });

        await context.storageState({ path: '/tmp/test-reset-auth.json' });
        await context.close();
    });

    test('создание объявления, пополнение, сброс, проверка очистки', async ({
        authedPage: page,
    }) => {
        await page.goto('/');
        await createAdWithPhoto(page, {
            title: 'Объявление для теста сброса',
            description: 'Описание объявления для проверки test/reset',
            price: 500,
        });

        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');
        await page.click('[data-action="open-topup"]');
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('#topupModal [data-action="go-to-step2"]');
        await page.click('[data-quick-amount="500"]');
        await page.click('[data-action="confirm-topup"]');
        await expect(page.locator('#topupModal')).not.toBeVisible({ timeout: 10000 });

        const resetRes = await page.evaluate(async () => {
            await fetch('/api/v1/profile', { method: 'GET', credentials: 'include' });
            const value = `; ${document.cookie}`;
            const parts = value.split(`; csrf_token=`);
            const csrfToken = parts.length === 2 ? parts.pop()!.split(';').shift() : null;
            if (!csrfToken) throw new Error('no csrf');

            const res = await fetch('/api/v1/test/reset', {
                method: 'POST',
                credentials: 'include',
                headers: { 'X-CSRF-Token': csrfToken },
            });
            return { ok: res.ok, status: res.status, body: await res.text() };
        });

        expect(resetRes.ok).toBeTruthy();

        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');
        const balanceAfter = await page.locator('.wallet-balance-value').textContent();
        expect(balanceAfter).toBe('0 ₽');

        await page.goto('/profile');
        await page.waitForSelector('.profile-tab-content');
        await expect(page.locator('.rec-card')).toHaveCount(0, { timeout: 10000 });
    });
});
