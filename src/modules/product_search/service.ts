import { apiClient } from '@/api/apiClient';
import type { SearchFilters, SortOrder } from './types';

// Бэкенд /ads/search требует обязательный query и плохо ладит с фильтрами:
// эндпоинт /ads возвращает все объявления, фильтр делаем на клиенте.
const ADS_ENDPOINT = '/ads';

const matchesQuery = (ad: any, q: string): boolean => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return (
        String(ad?.title || '')
            .toLowerCase()
            .includes(needle) ||
        String(ad?.description || '')
            .toLowerCase()
            .includes(needle)
    );
};

export const productSearchService = {
    /**
     * Поиск товаров по ключевому слову + фильтры.
     * Запрос идёт на /ads (всегда успешен), фильтрация — на клиенте.
     */
    async searchProducts(query: string, filters: SearchFilters, sortOrder: SortOrder = 'default') {
        const result = await apiClient.get<any>(ADS_ENDPOINT);
        if (!result.success || !result.data) return result;

        const list: any[] = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.ads)
              ? result.data.ads
              : Array.isArray(result.data?.data)
                ? result.data.data
                : [];

        let filtered = list.filter((ad) => {
            if (!ad) return false;
            if (!matchesQuery(ad, query)) return false;
            if (filters.category_id && Number(ad.category_id) !== filters.category_id) return false;
            const price = Number(ad.price ?? 0);
            if (filters.minPrice !== null && filters.minPrice > 0 && price < filters.minPrice) {
                return false;
            }
            if (filters.maxPrice !== null && filters.maxPrice > 0 && price > filters.maxPrice) {
                return false;
            }
            if (filters.condition && filters.condition !== 'all') {
                if (String(ad.condition || '') !== filters.condition) return false;
            }
            // Скрываем неактивные объявления, если бэкенд отдал статус
            if (ad.status && ad.status !== 'active') return false;
            return true;
        });

        if (sortOrder === 'price_asc') {
            filtered = filtered.slice().sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        } else if (sortOrder === 'price_desc') {
            filtered = filtered.slice().sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        }

        return {
            ...result,
            data: { ads: filtered },
        };
    },
};
