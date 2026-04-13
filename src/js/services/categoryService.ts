/**
 * Сервис для работы с категориями и характеристиками
 */

import { apiClient } from '@/api/apiClient';
import type { Category, CategoryCharacteristic } from '@/types';

const API_ENDPOINTS = {
    CATEGORIES: {
        GET_ALL: '/categories',
        GET_CHARACTERISTICS: (id: number) => `/categories/${id}/characteristics`,
    },
};

export const categoryService = {
    /**
     * Получение всех категорий
     */
    async getAllCategories(): Promise<Category[]> {
        const result = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.GET_ALL);

        if (result.success && result.data) {
            return result.data;
        }

        console.warn('Failed to load categories from API, using fallback');
        return this.getFallbackCategories();
    },

    /**
     * Получение характеристик категории
     */
    async getCategoryCharacteristics(categoryId: number): Promise<CategoryCharacteristic[]> {
        const result = await apiClient.get<CategoryCharacteristic[]>(
            API_ENDPOINTS.CATEGORIES.GET_CHARACTERISTICS(categoryId),
        );

        if (result.success && result.data) {
            // Сортируем по sort_order
            return result.data.sort((a, b) => a.sort_order - b.sort_order);
        }

        return [];
    },

    /**
     * Фолбэк-категории (на случай, если API еще не готов)
     */
    getFallbackCategories(): Category[] {
        return [
            { id: 1, name: 'Электроника' },
            { id: 2, name: 'Недвижимость' },
            { id: 3, name: 'Транспорт' },
            { id: 4, name: 'Хобби и отдых' },
            { id: 5, name: 'Музыка' },
            { id: 6, name: 'Ремонт' },
            { id: 7, name: 'Туризм' },
            { id: 8, name: 'Техника для дома' },
            { id: 9, name: 'Игрушки' },
            { id: 10, name: 'Настольные игры' },
            { id: 11, name: 'Одежда' },
            { id: 12, name: 'Обувь' },
            { id: 13, name: 'Аксессуары' },
            { id: 14, name: 'Книги' },
            { id: 15, name: 'Красота и здоровье' },
            { id: 16, name: 'Животные' },
            { id: 17, name: 'Сад и огород' },
            { id: 18, name: 'Автозапчасти' },
            { id: 19, name: 'Спорт' },
            { id: 20, name: 'Канцелярия' },
        ];
    },
};
