import { test as base, expect } from '@playwright/test';
import { createAdWithPhoto, loginAndSaveState } from './helpers';

const test = base.extend<{ authedPage: import('@playwright/test').Page }>({
    authedPage: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: '/tmp/promo-flow-auth.json' });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

test.describe.configure({ mode: 'serial' });

test.describe('Сценарий платного продвижения', () => {
    let page: import('@playwright/test').Page;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();

        await loginAndSaveState(page, '/tmp/promo-flow-auth.json', 3);

        await createAdWithPhoto(page, {
            title: 'Объявление для полного сценария',
            description: 'Описание тестового объявления для сценария',
            price: 1000,
        });
    });

    async function topupWallet(amount = 500) {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');
        await page.click('[data-action="open-topup"]');
        await page.fill('#topupCardNumber', '1234567890123456');
        await page.fill('#topupCardExpiry', '12/28');
        await page.fill('#topupCardCvv', '123');
        await page.click('#topupModal [data-action="go-to-step2"]');
        await page.click(`[data-quick-amount="${amount}"]`);
        await page.click('[data-action="confirm-topup"]');
        await expect(page.locator('#topupModal')).not.toBeVisible({ timeout: 10000 });
    }

    async function openPromoteFromProfile() {
        await page.goto('/profile');
        await page.waitForSelector('.profile-tab-content');
        await page.waitForSelector('.rec-card-promote', { timeout: 15000 });
        await page.click('.rec-card-promote');
        await expect(page.locator('#promoteModal')).toBeVisible({ timeout: 10000 });
    }

    test('покупка boost без средств открывает модалку пополнения', async () => {
        await openPromoteFromProfile();

        await page.click('#promoteModal [data-plan-code="boost_7d"]');
        await page.click('#promoteModal [data-action="go-to-step2"]');
        await page.click('[data-action="confirm-promote"]');

        await expect(page.locator('#topupModal')).toBeVisible({ timeout: 10000 });
        await page.click('.modal-close');
        await expect(page.locator('#topupModal')).not.toBeVisible();
    });

    test('пополнение кошелька и успешная покупка boost', async () => {
        await topupWallet(500);

        await openPromoteFromProfile();
        await page.click('#promoteModal [data-plan-code="boost_1d"]');
        await page.click('#promoteModal [data-action="go-to-step2"]');
        await page.click('[data-action="confirm-promote"]');

        await expect(page.locator('#promoteModal')).not.toBeVisible({ timeout: 10000 });

        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');

        await expect(page.locator('.wallet-transaction-type--promotion_charge')).toBeVisible({
            timeout: 10000,
        });
    });

    test('карточка объявления получает бейдж boost после покупки', async () => {
        await page.goto('/profile');
        await page.waitForSelector('.profile-tab-content');
        await page.waitForSelector('.rec-card', { timeout: 15000 });

        await expect(page.locator('.rec-card-promo-badge--boost')).toBeVisible({ timeout: 10000 });
    });

    test('покупка highlight добавляет класс highlighted и бейдж', async () => {
        await openPromoteFromProfile();
        await page.click('#promoteModal [data-plan-code="highlight_1d"]');
        await page.click('#promoteModal [data-action="go-to-step2"]');
        await page.click('[data-action="confirm-promote"]');

        await expect(page.locator('#promoteModal')).not.toBeVisible({ timeout: 10000 });

        await page.goto('/profile');
        await page.waitForSelector('.profile-tab-content');
        await page.waitForSelector('.rec-card', { timeout: 15000 });

        await expect(page.locator('.rec-card--highlighted')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.rec-card-promo-badge--highlight')).toBeVisible({
            timeout: 10000,
        });
    });

    test('страница объявления показывает блок продвижения и статус', async () => {
        const adId = await page.locator('.rec-card').first().getAttribute('data-id');
        if (!adId) return;

        await page.goto(`/ad/${adId}`);
        await page.waitForSelector('.ad-detail-page');

        await expect(page.locator('.ad-promotion-section')).toBeVisible();
        await expect(page.locator('[data-action="promote-ad"]')).toBeVisible();
        await expect(page.locator('.ad-promotion-item')).toHaveCount(2, { timeout: 10000 });
    });

    test('история продвижений на вкладке платных услуг', async () => {
        await page.goto('/profile?tab=paid_services');
        await page.waitForSelector('.promo-history-list', { timeout: 15000 });

        await expect(page.locator('.promo-history-item')).toHaveCount(2, { timeout: 10000 });
        await expect(page.locator('.promo-history-badge--boost')).toBeVisible();
        await expect(page.locator('.promo-history-badge--highlight')).toBeVisible();
        await expect(page.locator('.promo-history-price')).toHaveCount(2);
    });

    test('транзакции кошелька содержат топапы и списания', async () => {
        await page.goto('/profile?tab=wallet');
        await page.waitForSelector('.wallet-balance-card');
        await page.waitForSelector('.wallet-transaction-item', { timeout: 10000 });

        const topups = await page.locator('.wallet-transaction-type--topup').count();
        expect(topups).toBeGreaterThanOrEqual(1);

        const charges = await page.locator('.wallet-transaction-type--promotion_charge').count();
        expect(charges).toBeGreaterThanOrEqual(1);
    });
});
