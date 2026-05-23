import { test as base, expect } from '@playwright/test';
import { createAdWithPhoto, loginAndSaveState } from './helpers';

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

        await loginAndSaveState(page, '/tmp/promo-auth.json', 2);

        await createAdWithPhoto(page, {
            title: 'Тестовое объявление для продвижения',
            description: 'Описание тестового объявления',
            price: 1000,
        });

        await context.close();
    });

    async function openPromoteModal(page: import('@playwright/test').Page) {
        await page.goto('/profile');
        await page.waitForSelector('.profile-tab-content');
        await page.waitForSelector('.rec-card-promote', { timeout: 15000 });
        await page.click('.rec-card-promote');
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

        await page.goto('/profile');
        await page.waitForSelector('.profile-tab-content');
        await page.waitForSelector('.rec-card-promote', { timeout: 15000 });

        await page.click('.rec-card-promote');
        await expect(page.locator('#promoteModal')).toBeVisible({ timeout: 10000 });

        await page.click('#promoteModal [data-plan-code="boost_1d"]');
        await page.click('#promoteModal [data-action="go-to-step2"]');

        const adId = await page.locator('.rec-card').first().getAttribute('data-id');
        if (adId) {
            await page.evaluate(async (id) => {
                await fetch('/api/v1/profile', { method: 'GET', credentials: 'include' });
                const value = `; ${document.cookie}`;
                const parts = value.split(`; csrf_token=`);
                const csrfToken = parts.length === 2 ? parts.pop()!.split(';').shift() : null;
                if (csrfToken) {
                    await fetch(`/api/v1/ads/${id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'X-CSRF-Token': csrfToken },
                    });
                }
            }, adId);
        }

        await page.click('[data-action="confirm-promote"]');

        await expect(page.locator('#promoteConfirmError')).toBeVisible({ timeout: 10000 });
    });
});
