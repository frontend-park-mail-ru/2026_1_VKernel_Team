import { test as base, expect } from '@playwright/test';

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

        const email = `wallet-test-${Date.now()}@test.com`;
        const password = 'Test1234!';

        await page.goto('/register');
        await page.fill('input[placeholder="Введите имя"]', 'Wallet Test');
        await page.locator('input[type="email"]').first().fill(email);
        await page.locator('input[type="password"]').first().fill(password);
        await page.locator('input[type="password"]').last().fill(password);
        await page.click('button:has-text("Зарегистрироваться")');
        await page.waitForURL('**/', { timeout: 15000 });

        await context.storageState({ path: '/tmp/wallet-auth.json' });
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

    test('модалка пополнения: быстрые суммы и закрытие', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await page.click('[data-action="open-topup"]');
        await expect(page.locator('#topupModal')).toBeVisible();

        await page.click('[data-quick-amount="500"]');
        const inputValue = await page.locator('#topupAmountInput').inputValue();
        expect(inputValue).toBe('500');

        await page.click('[data-action="close-topup"]');
        await expect(page.locator('#topupModal')).not.toBeVisible();
    });

    test('пополнение увеличивает баланс и добавляет транзакцию', async ({ authedPage: page }) => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        const balanceBefore = await page.locator('.wallet-balance-value').textContent();

        await page.click('[data-action="open-topup"]');
        await expect(page.locator('#topupModal')).toBeVisible();
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
        await expect(page.locator('#topupModal')).toBeVisible();
        await page.fill('#topupAmountInput', '0');
        await page.click('[data-action="confirm-topup"]');

        await expect(page.locator('#topupError')).toBeVisible();
        await expect(page.locator('#topupModal')).toBeVisible();
    });
});
