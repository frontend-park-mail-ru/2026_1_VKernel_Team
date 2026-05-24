import { test as base, expect } from '@playwright/test';
import { createAdWithPhoto, loginAndSaveState, resetAccount } from './helpers';

const test = base.extend<{ authedPage: import('@playwright/test').Page }>({
    authedPage: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: '/tmp/profile-ads-auth.json' });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

test.describe.configure({ mode: 'serial' });

test.describe('Карточки объявлений в профиле', () => {
    let page: import('@playwright/test').Page;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();

        await loginAndSaveState(page, '/tmp/profile-ads-auth.json', 5);

        await createAdWithPhoto(page, {
            title: 'Тестовая карточка профиля',
            description: 'Описание для проверки карточки в профиле',
            price: 5000,
            location: 'Москва',
        });

        await context.close();
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: '/tmp/profile-ads-auth.json' });
        const page = await context.newPage();
        await resetAccount(page);
        await context.close();
    });

    test('клик по карточке открывает страницу объявления', async ({ authedPage: p }) => {
        await p.goto('/profile');
        await p.waitForSelector('.profile-ad-card');

        const card = p.locator('.profile-ad-card').first();
        const adId = await card.getAttribute('data-id');
        expect(adId).toBeTruthy();

        await card.locator('.profile-ad-card__clickable').click();
        await p.waitForURL(`**/ad/${adId}`, { timeout: 10000 });
        expect(p.url()).toContain(`/ad/${adId}`);
    });

    test('кнопка редактирования ведёт на /edit-ad', async ({ authedPage: p }) => {
        await p.goto('/profile');
        await p.waitForSelector('.profile-ad-card');

        const card = p.locator('.profile-ad-card').first();
        const adId = await card.getAttribute('data-id');

        await p.locator('.profile-ad-card__btn--edit').first().click();
        await expect(p).toHaveURL(new RegExp(`/edit-ad/${adId}`), { timeout: 10000 });
    });

    test('кнопка продвижения открывает модалку продвижения', async ({ authedPage: p }) => {
        await p.goto('/profile');
        await p.waitForSelector('.profile-ad-card');

        await p.locator('.profile-ad-card__btn--promote').first().click();
        await expect(p.locator('#promoteModal')).toBeVisible({ timeout: 10000 });
    });

    test('кнопка закрытия объявления открывает модалку подтверждения', async ({
        authedPage: p,
    }) => {
        await p.goto('/profile');
        await p.waitForSelector('.profile-ad-card');

        await p.locator('.profile-ad-card__btn--close').first().click();
        await expect(p.locator('#closeAdModal')).toBeVisible({ timeout: 10000 });
    });

    test('клик по кнопке не вызывает навигацию на объявление', async ({ authedPage: p }) => {
        await p.goto('/profile');
        await p.waitForSelector('.profile-ad-card');

        await p.locator('.profile-ad-card__btn--promote').first().click();
        await p.waitForTimeout(500);
        expect(p.url()).toContain('/profile');
    });
});
