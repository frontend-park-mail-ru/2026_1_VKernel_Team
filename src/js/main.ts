/**
 * Точка входа в приложение
 * @module main
 */

// === Side-effect модули (инициализация) ===
import '@/utils/storage';
import '@/validators/authValidator';
import '@/services/authService';
import '@/services/adsServices';
import '@modules/cart/init';
import '@/api/apiClient';

// === Offline infrastructure ===
import { registerServiceWorker } from '@modules/common/offline/service-worker/sw-register';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import { syncManager } from '@modules/common/offline/sync/syncManager';

// === Точка входа: AppController вместо устаревшего App ===
import { AppController } from '@/controllers/AppController';

// === Регистрация Service Worker ===
registerServiceWorker();

// === Инициализация ===
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cloverDB.open('clover-db', 1, [
            { name: 'cart', keyPath: 'product_id' },
            { name: 'syncQueue', autoIncrement: true },
        ]);
    } catch (error) {
        console.error('IndexedDB initialization failed:', error);
    }

    syncManager.init();
    AppController.init();
});
