import { apiClient } from '@/api/apiClient';
import type { SearchFilters, SortOrder } from './types';

const SEARCH_ENDPOINT = '/ads/search';

export const productSearchService = {
    /**
     * Поиск товаров по ключевому слову
     * @param query - поисковый запрос (слово или название категории)
     * @param filters - фильтры (цена, состояние, категория)
     * @param sortOrder - сортировка
     */
    async searchProducts(query: string, filters: SearchFilters, sortOrder: SortOrder = 'default') {
        const params = new URLSearchParams();

        if (query) {
            // Бэкенд ждёт параметр "query", не "q"
            params.append('query', query);
        }

        if (filters.category_id && filters.category_id > 0) {
            params.append('category_id', String(filters.category_id));
        }

        if (filters.minPrice !== null && filters.minPrice > 0) {
            params.append('min_price', String(filters.minPrice));
        }
        if (filters.maxPrice !== null && filters.maxPrice > 0) {
            params.append('max_price', String(filters.maxPrice));
        }

        if (filters.condition && filters.condition !== 'all') {
            params.append('condition', filters.condition);
        }

        if (sortOrder === 'price_asc') {
            params.append('sort', 'price');
            params.append('order', 'asc');
        } else if (sortOrder === 'price_desc') {
            params.append('sort', 'price');
            params.append('order', 'desc');
        }

        const url = `${SEARCH_ENDPOINT}${params.toString() ? `?${params.toString()}` : ''}`;

        return apiClient.get(url);
    },
};
