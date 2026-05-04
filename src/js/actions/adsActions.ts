/**
 * Действия для работы с объявлениями
 */

import { adsService } from '@/services/adsServices';
import { store } from '@/core/store';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import type { Ad } from '@/types';

const ADS_LIST_STORE = 'adsList';

export const adsActions = {
    async loadAds(): Promise<void> {
        store.setState({ error: null });

        try {
            const result = await adsService.getAllAds();

            if (result.success && result.data) {
                store.setState({ ads: result.data });
                this.cacheAdsList(result.data);
                return;
            }
        } catch {
            // Сетевая ошибка — отдадим список из IndexedDB
        }

        await this.loadAdsFromCache();
    },

    async loadAdsFromCache(): Promise<void> {
        try {
            const cached = await cloverDB.getAll<Ad & { _order?: number }>(ADS_LIST_STORE);
            if (cached.length > 0) {
                cached.sort((a, b) => (a._order ?? 0) - (b._order ?? 0));
                store.setState({ ads: cached, error: null });
            } else {
                store.setState({ error: 'Нет подключения к интернету' });
            }
        } catch {
            store.setState({ error: 'Нет подключения к интернету' });
        }
    },

    async cacheAdsList(ads: Ad[]): Promise<void> {
        try {
            const indexed = ads.map((ad, i) => ({ ...ad, _order: i }));
            await cloverDB.replaceAll(ADS_LIST_STORE, indexed);
        } catch {
            // IndexedDB недоступна — кэш просто не запишется
        }
    },

    async loadAdById(id: number | string): Promise<Ad | null> {
        const result = await adsService.getAdById(id);
        return result.success && result.data ? result.data : null;
    },

    async searchAds(query: string): Promise<void> {
        store.setState({ error: null });

        try {
            const result = await adsService.getAllAds();

            if (result.success && result.data) {
                const filtered = result.data.filter((ad: Ad) =>
                    ad.title.toLowerCase().includes(query.toLowerCase()),
                );
                store.setState({ ads: filtered });
            } else {
                store.setState({
                    error: result.error || 'Не удалось выполнить поиск',
                });
            }
        } catch {
            store.setState({
                error: 'Не удалось соединиться с сервером',
            });
        }
    },
};
