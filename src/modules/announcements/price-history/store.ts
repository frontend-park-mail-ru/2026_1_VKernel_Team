import { cloverDB } from '@modules/common/offline/db/indexedDB';
import type { PriceHistoryPoint } from './api';

const STORE_NAME = 'priceHistory';

export const priceHistoryStore = {
    async save(adId: number | string, history: PriceHistoryPoint[]): Promise<void> {
        try {
            // Проверяем, открыта ли БД и существует ли store
            if (!cloverDB['db']) {
                return;
            }
            await cloverDB.put<{ adId: string; history: PriceHistoryPoint[]; timestamp: number }>(
                STORE_NAME,
                {
                    adId: String(adId),
                    history,
                    timestamp: Date.now(),
                },
            );
        } catch (error) {
            // Игнорируем ошибки IndexedDB, кэш не критичен
        }
    },

    async load(adId: number | string): Promise<PriceHistoryPoint[] | null> {
        try {
            if (!cloverDB['db']) {
                return null;
            }
            const cached = await cloverDB.get<{
                adId: string;
                history: PriceHistoryPoint[];
                timestamp: number;
            }>(STORE_NAME, String(adId));
            if (cached && cached.history) {
                // Кэш валиден 5 минут
                const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000;
                if (!isExpired) {
                    return cached.history;
                }
            }
        } catch (error) {
            console.debug('Cache load failed (non-critical):', error);
        }
        return null;
    },
};
