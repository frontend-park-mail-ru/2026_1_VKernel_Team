/**
 * Точка входа в приложение
 * @module main
 */

import '@styles/base.scss';
import '@styles/components.scss';
import '@styles/auth.scss';
import '@styles/main.scss';
import '@styles/footer.scss';

import '@/utils/storage';
import '@/validators/authValidator';
import '@/services/authService';
import '@/services/adsServices';
import '@modules/cart/init';
import '@/api/apiClient';
import '@modules/product_search';

import { registerServiceWorker } from '@modules/common/offline/service-worker/sw-register';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import { syncManager } from '@modules/common/offline/sync/syncManager';
import { registerCartSyncHandlers } from '@modules/cart/sync-handler';
import { registerAdSyncHandler } from '@modules/announcements/sync-handler';
import { registerAvatarSyncHandler, getCachedAvatarDataUrl } from '@modules/profile/sync-handler';
import { initGlobalSearch } from '@modules/common/components/search-section/search_init';

import { AppController } from '@/controllers/AppController';
import { store } from '@/core/store';

registerServiceWorker();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cloverDB.open('clover-db', 7, [
            { name: 'cart', keyPath: 'product_id' },
            { name: 'syncQueue', keyPath: 'id', autoIncrement: true, recreate: true },
            { name: 'adDrafts', keyPath: 'id' },
            { name: 'ads', keyPath: 'id' },
            { name: 'adsList', keyPath: 'id' },
            { name: 'userProfile', keyPath: 'id' },
            { name: 'avatarQueue', keyPath: 'id', autoIncrement: true },
            { name: 'purchases', keyPath: 'order_id', recreate: true },
            { name: 'wallet-balance', keyPath: 'currency' },
            { name: 'wallet-transactions', keyPath: 'id' },
        ]);
    } catch (error) {
        console.error('IndexedDB initialization failed:', error);
    }

    registerCartSyncHandlers();
    registerAdSyncHandler();
    registerAvatarSyncHandler();

    // Восстанавливаем аватар из IndexedDB (если был сохранён offline)
    const cachedAvatar = await getCachedAvatarDataUrl();
    if (cachedAvatar && store.user && !store.user.avatar_path) {
        store.setState({
            user: { ...store.user, avatar: cachedAvatar, avatar_path: cachedAvatar },
        });
    }

    syncManager.init();
    AppController.init();
    initGlobalSearch();
});
