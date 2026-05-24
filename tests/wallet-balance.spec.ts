import { test as base, expect } from '@playwright/test';
import { loginAndSaveState, resetAccount } from './helpers';

const test = base.extend<{ authedPage: import('@playwright/test').Page }>({
    authedPage: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: '/tmp/balance-auth.json' });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

test.describe('Баланс кошелька доступен глобально', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await loginAndSaveState(page, '/tmp/balance-auth.json', 4);

        await context.close();
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: '/tmp/balance-auth.json' });
        const page = await context.newPage();
        await resetAccount(page);
        await context.close();
    });

    test('баланс кошелька совпадает с API после пополнения', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await page.click('[data-action="open-topup"]');
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('#topupModal [data-action="go-to-step2"]');
        await page.waitForSelector('#topupStep2', { state: 'visible' });
        await page.click('[data-quick-amount="500"]');
        await page.click('[data-action="confirm-topup"]');
        await expect(page.locator('#topupModal')).not.toBeVisible({ timeout: 10000 });
        await page.waitForSelector('.wallet-balance-value');

        const uiBalance = await page.locator('.wallet-balance-value').textContent();
        expect(uiBalance).toBe('500 ₽');
    });

    test('баланс в карточке профиля обновляется после пополнения', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await page.click('[data-action="open-topup"]');
        await page.waitForSelector('#topupCardNumber', { state: 'visible' });
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('#topupModal [data-action="go-to-step2"]');
        await page.waitForSelector('#topupStep2', { state: 'visible' });
        await page.click('#topupModal [data-quick-amount="200"]');
        await page.click('#topupModal [data-action="confirm-topup"]');
        await expect(page.locator('#topupModal')).not.toBeVisible({ timeout: 10000 });

        await page.waitForSelector('.profile-info-card__balance');
        const sidebarBalance = await page
            .locator('.profile-info-card__balance strong')
            .textContent();
        expect(sidebarBalance).toBe('700 ₽');
    });

    test('баланс кошелька доступен после навигации на другую вкладку и обратно', async ({
        authedPage: page,
    }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');
        await page.waitForTimeout(500);
        const balanceBefore = await page.locator('.wallet-balance-value').textContent();

        await page.goto('/profile?tab=ads');
        await page.waitForSelector('.profile-tab-content');

        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');
        await page.waitForTimeout(500);
        const balanceAfter = await page.locator('.wallet-balance-value').textContent();
        expect(balanceAfter).toBe(balanceBefore);
    });
});
