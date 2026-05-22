import fs from 'fs';

const accounts = JSON.parse(fs.readFileSync('test-accounts.json', 'utf-8'));

export function getAccount(index: number) {
    return accounts[index];
}

export async function resetAccount(page: import('@playwright/test').Page) {
    await page.evaluate(async () => {
        await fetch('/api/v1/profile', { method: 'GET', credentials: 'include' });
        const value = `; ${document.cookie}`;
        const parts = value.split(`; csrf_token=`);
        const csrfToken = parts.length === 2 ? parts.pop()!.split(';').shift() : null;
        if (csrfToken) {
            await fetch('/api/v1/test/reset', {
                method: 'POST',
                credentials: 'include',
                headers: { 'X-CSRF-Token': csrfToken },
            });
        }
    });
}

export async function loginAndSaveState(
    page: import('@playwright/test').Page,
    storagePath: string,
    accountIndex: number,
) {
    const { email, password } = getAccount(accountIndex);
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.click('button:has-text("Войти")');
    await page.waitForURL('**/', { timeout: 15000 });
    await resetAccount(page);
    await page.context().storageState({ path: storagePath });
}

export async function createAdWithPhoto(
    page: import('@playwright/test').Page,
    data: {
        title: string;
        description: string;
        price: number;
        category_id?: number;
        location?: string;
    },
) {
    await page.evaluate(async (adData) => {
        await fetch('/api/v1/profile', { method: 'GET', credentials: 'include' });
        const value = `; ${document.cookie}`;
        const parts = value.split(`; csrf_token=`);
        const csrfToken = parts.length === 2 ? parts.pop()!.split(';').shift() : null;
        if (!csrfToken) throw new Error('no csrf');

        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = '#fff';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Test', 100, 110);

        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8);
        });
        const photo = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append(
            'data',
            JSON.stringify({
                category_id: adData.category_id ?? 1,
                title: adData.title,
                description: adData.description,
                price: adData.price,
                status: 'active',
                location: adData.location ?? 'Москва',
            }),
        );
        formData.append('photos', photo);

        const res = await fetch('/api/v1/ads', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: { 'X-CSRF-Token': csrfToken },
        });

        if (!res.ok) throw new Error(`ad creation failed: ${res.status}`);
    }, data);
}
