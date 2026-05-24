import { test as base, expect } from '@playwright/test';
import { createAdWithPhoto, loginAndSaveState, resetAccount } from './helpers';

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

        await loginAndSaveState(page, '/tmp/test-reset-auth.json', 0);

        await context.close();
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: '/tmp/test-reset-auth.json' });
        const page = await context.newPage();
        await resetAccount(page);
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

        await resetAccount(page);

        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');
        await expect(page.locator('.wallet-balance-value')).toHaveText('0 ₽', { timeout: 10000 });

        await page.goto('/profile');
        await page.waitForSelector('.profile-tab-content');
        await expect(page.locator('.rec-card')).toHaveCount(0, { timeout: 10000 });
    });
});
