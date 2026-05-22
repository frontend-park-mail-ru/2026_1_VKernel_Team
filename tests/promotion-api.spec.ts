import { test as base, expect } from '@playwright/test';

const test = base.extend<{ authedPage: import('@playwright/test').Page }>({
    authedPage: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: '/tmp/promo-auth.json' });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

test.describe('Продвижение объявления', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        const email = `promo-test-${Date.now()}@test.com`;
        const password = 'Test1234!';

        await page.goto('/register');
        await page.fill('input[placeholder="Введите имя"]', 'Promo Test');
        await page.locator('input[type="email"]').first().fill(email);
        await page.locator('input[type="password"]').first().fill(password);
        await page.locator('input[type="password"]').last().fill(password);
        await page.click('button:has-text("Зарегистрироваться")');
        await page.waitForURL('**/', { timeout: 15000 });

        await context.storageState({ path: '/tmp/promo-auth.json' });
        await context.close();
    });

    async function openPromoteModal(page: any) {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');
        await page.evaluate(async () => {
            await (window as any).__PromoteModal.open(1);
        });
        await expect(page.locator('#promoteModal')).toBeVisible({ timeout: 10000 });
    }

    test('модалка показывает тарифы boost и highlight', async ({ authedPage: page }) => {
        await openPromoteModal(page);

        await expect(page.locator('.promote-group-title')).toHaveCount(2);
        await expect(page.locator('#promoteModal .promote-plan-btn')).toHaveCount(4);
        await expect(page.locator('#promoteModal [data-plan-code="boost_1d"]')).toBeVisible();
        await expect(page.locator('#promoteModal [data-plan-code="highlight_1d"]')).toBeVisible();
    });

    test('выбор тарифа активирует кнопку «Далее»', async ({ authedPage: page }) => {
        await openPromoteModal(page);

        const nextBtn = page.locator('#promoteModal [data-action="go-to-step2"]');
        await expect(nextBtn).toBeDisabled();

        await page.click('#promoteModal [data-plan-code="boost_1d"]');
        await expect(page.locator('#promoteModal [data-plan-code="boost_1d"]')).toHaveClass(
            /active/,
        );
        await expect(nextBtn).toBeEnabled();
    });

    test('шаг 2 показывает выбранный тариф и цену', async ({ authedPage: page }) => {
        await openPromoteModal(page);

        await page.click('#promoteModal [data-plan-code="boost_1d"]');
        await page.click('#promoteModal [data-action="go-to-step2"]');

        await expect(page.locator('#promoteStep2')).toBeVisible();
        await expect(page.locator('#promoteConfirmPlan')).toContainText('Поднятие на 1 день');
        await expect(page.locator('#promoteConfirmPrice')).toContainText('49 ₽');
    });

    test('закрытие модалки по ✕', async ({ authedPage: page }) => {
        await openPromoteModal(page);

        await page.click('#promoteModal .modal-close');
        await expect(page.locator('#promoteModal')).not.toBeVisible();
    });

    test('ошибка при покупке для несуществующего объявления', async ({ authedPage: page }) => {
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

        await page.evaluate(async () => {
            await (window as any).__PromoteModal.open(1);
        });
        await expect(page.locator('#promoteModal')).toBeVisible({ timeout: 10000 });

        await page.click('#promoteModal [data-plan-code="boost_1d"]');
        await page.click('#promoteModal [data-action="go-to-step2"]');
        await page.click('[data-action="confirm-promote"]');

        await expect(page.locator('#promoteConfirmError')).toBeVisible({ timeout: 10000 });
    });
});
