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
import { registerCartSyncHandlers } from '@modules/cart/sync-handler';
import { registerAdSyncHandler } from '@modules/announcements/sync-handler';

// === Точка входа: AppController вместо устаревшего App ===
import { AppController } from '@/controllers/AppController';

// === Регистрация Service Worker ===
registerServiceWorker();

// === Инициализация ===
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cloverDB.open('clover-db', 3, [
            { name: 'cart', keyPath: 'product_id' },
            { name: 'syncQueue', keyPath: 'id', autoIncrement: true, recreate: true },
            { name: 'adDrafts', keyPath: 'id' },
        ]);
    } catch (error) {
        console.error('IndexedDB initialization failed:', error);
    }

    registerCartSyncHandlers();
    registerAdSyncHandler();
    syncManager.init();
    AppController.init();
});
