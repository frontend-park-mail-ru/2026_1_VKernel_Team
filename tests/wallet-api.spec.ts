import { test as base, expect } from '@playwright/test';
import { loginAndSaveState, resetAccount } from './helpers';

const test = base.extend<{ authedPage: import('@playwright/test').Page }>({
    authedPage: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: '/tmp/wallet-auth.json' });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

test.describe('Кошелёк', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await loginAndSaveState(page, '/tmp/wallet-auth.json', 1);

        await context.close();
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: '/tmp/wallet-auth.json' });
        const page = await context.newPage();
        await resetAccount(page);
        await context.close();
    });

    test('вкладка кошелька показывает баланс и кнопку пополнения', async ({ authedPage: page }) => {
        await page.goto('/profile');
        await page.waitForSelector('.profile-nav');
        await page.click('[data-tab="wallet"]');

        await expect(page.locator('.wallet-balance-card')).toBeVisible();
        const balanceText = await page.locator('.wallet-balance-value').textContent();
        expect(balanceText).toMatch(/[\d\s]+₽/);
        await expect(page.locator('[data-action="open-topup"]')).toBeVisible();
    });

    test('шаг 1 карты: валидация полей и переход на шаг 2', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await page.click('[data-action="open-topup"]');
        await expect(page.locator('#topupStep1')).toBeVisible();
        await expect(page.locator('#topupStep2')).not.toBeVisible();

        await page.click('[data-action="go-to-step2"]');
        await expect(page.locator('#topupCardError')).toBeVisible();

        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('[data-action="go-to-step2"]');

        await expect(page.locator('#topupStep2')).toBeVisible();
        await expect(page.locator('#topupStep1')).not.toBeVisible();
    });

    test('шаг 2 суммы: быстрые суммы, ручной ввод, кнопка назад', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await page.click('[data-action="open-topup"]');
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('[data-action="go-to-step2"]');

        await page.click('[data-quick-amount="500"]');
        expect(await page.locator('#topupAmountInput').inputValue()).toBe('500');
        await expect(page.locator('[data-quick-amount="500"]')).toHaveClass(/active/);

        await page.click('[data-quick-amount="100"]');
        expect(await page.locator('#topupAmountInput').inputValue()).toBe('100');
        await expect(page.locator('[data-quick-amount="100"]')).toHaveClass(/active/);
        await expect(page.locator('[data-quick-amount="500"]')).not.toHaveClass(/active/);

        await page.fill('#topupAmountInput', '250');
        await expect(page.locator('[data-quick-amount="100"]')).not.toHaveClass(/active/);

        await page.click('[data-action="go-to-step1"]');
        await expect(page.locator('#topupStep1')).toBeVisible();
        await expect(page.locator('#topupStep2')).not.toBeVisible();
    });

    test('закрытие модалки через ✕ и оверлей', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await page.click('[data-action="open-topup"]');
        await expect(page.locator('#topupModal')).toBeVisible();

        await page.click('.modal-close');
        await expect(page.locator('#topupModal')).not.toBeVisible();

        await page.click('[data-action="open-topup"]');
        await expect(page.locator('#topupModal')).toBeVisible();
        await page.click('#topupModal', { position: { x: 5, y: 5 } });
        await expect(page.locator('#topupModal')).not.toBeVisible();

        await page.click('[data-action="open-topup"]');
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('[data-action="go-to-step2"]');

        await page.click('#topupModal', { position: { x: 5, y: 5 } });
        await expect(page.locator('#topupModal')).not.toBeVisible();
    });

    test('пополнение увеличивает баланс и добавляет транзакцию', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        const balanceBefore = await page.locator('.wallet-balance-value').textContent();

        await page.click('[data-action="open-topup"]');
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('[data-action="go-to-step2"]');
        await page.click('[data-quick-amount="500"]');
        await page.click('[data-action="confirm-topup"]');

        await expect(page.locator('#topupModal')).not.toBeVisible({ timeout: 10000 });
        await page.waitForSelector('.wallet-balance-value');
        const balanceAfter = await page.locator('.wallet-balance-value').textContent();
        expect(balanceAfter).not.toBe(balanceBefore);

        await expect(page.locator('.wallet-transaction-item')).toHaveCount(1, { timeout: 10000 });
        await expect(page.locator('.wallet-transaction-type--topup')).toBeVisible();
    });

    test('пополнение с нулевой суммой показывает ошибку', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await page.click('[data-action="open-topup"]');
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('[data-action="go-to-step2"]');
        await page.fill('#topupAmountInput', '0');
        await page.click('[data-action="confirm-topup"]');

        await expect(page.locator('#topupError')).toBeVisible();
        await expect(page.locator('#topupModal')).toBeVisible();
    });

    test('кнопка пополнить открывает модалку после успешного пополнения', async ({
        authedPage: page,
    }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await page.click('[data-action="open-topup"]');
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('[data-action="go-to-step2"]');
        await page.click('[data-quick-amount="100"]');
        await page.click('[data-action="confirm-topup"]');
        await expect(page.locator('#topupModal')).not.toBeVisible({ timeout: 10000 });

        await page.click('[data-action="open-topup"]');
        await expect(page.locator('#topupModal')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('#topupStep1')).toBeVisible();
    });
});
