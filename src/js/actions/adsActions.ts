/**
 * Действия для работы с объявлениями
 */

import { adsService } from '@/services/adsServices';
import { store } from '@/core/store';
import type { Ad } from '@/types';

export const adsActions = {
    async loadAds(): Promise<void> {
        store.setState({ error: null });

        try {
            const result = await adsService.getAllAds();

            if (result.success && result.data) {
                store.setState({
                    ads: result.data,
                });
            } else {
                store.setState({
                    error: result.error || 'Не удалось загрузить объявления',
                });
            }
        } catch (error) {
            store.setState({
                error: 'Не удалось соединиться с сервером',
            });
        }
    },

    async loadAdById(id: number | string): Promise<Ad | null> {
        const result = await adsService.getAdById(id);
        return result.success && result.data ? result.data : null;
    },
    async searchAds(query: string): Promise<void> {
        store.setState({ isLoading: true, error: null });

        try {
            const result = await adsService.getAllAds();

            if (result.success && result.data) {
                const filtered = result.data.filter((ad: Ad) =>
                    ad.title.toLowerCase().includes(query.toLowerCase()),
                );
                store.setState({
                    ads: filtered,
                    isLoading: false,
                });
            } else {
                store.setState({
                    isLoading: false,
                    error: result.error || 'Не удалось выполнить поиск',
                });
            }
        } catch (error) {
            store.setState({
                isLoading: false,
                error: 'Не удалось соединиться с сервером',
            });
        }
    },
};
