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

const CATEGORIES_CACHE_KEY = 'clover_categories';
const CHARS_CACHE_PREFIX = 'clover_cat_chars_';

export const categoryService = {
    /**
     * Получение всех категорий (с кэшированием в localStorage)
     */
    async getAllCategories(): Promise<Category[]> {
        try {
            const result = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.GET_ALL);

            if (result.success && result.data) {
                try {
                    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(result.data));
                } catch {
                    // localStorage может быть переполнен или заблокирован
                }
                return result.data;
            }
        } catch {
            // Сетевая ошибка — пойдём в фолбек
        }

        const cached = this.getCachedCategories();
        if (cached) return cached;

        return this.getFallbackCategories();
    },

    /**
     * Получение характеристик категории (с кэшированием)
     */
    async getCategoryCharacteristics(categoryId: number): Promise<CategoryCharacteristic[]> {
        try {
            const result = await apiClient.get<CategoryCharacteristic[]>(
                API_ENDPOINTS.CATEGORIES.GET_CHARACTERISTICS(categoryId),
            );

            if (result.success && result.data) {
                const sorted = result.data.sort((a, b) => a.sort_order - b.sort_order);
                try {
                    localStorage.setItem(CHARS_CACHE_PREFIX + categoryId, JSON.stringify(sorted));
                } catch {
                    // localStorage может быть переполнен или заблокирован
                }
                return sorted;
            }
        } catch {
            // Сетевая ошибка — пойдём в фолбек из localStorage
        }

        try {
            const cached = localStorage.getItem(CHARS_CACHE_PREFIX + categoryId);
            if (cached) return JSON.parse(cached);
        } catch {
            // Невалидный JSON или недоступный localStorage
        }

        return [];
    },

    getCachedCategories(): Category[] | null {
        try {
            const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
            if (cached) return JSON.parse(cached);
        } catch {
            // Невалидный JSON или недоступный localStorage
        }
        return null;
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
            { id: 17, name: 'Для дома и дачи' },
            { id: 18, name: 'Запчасти' },
            { id: 19, name: 'Спорт' },
            { id: 20, name: 'Канцелярия' },
            { id: 21, name: 'Авто' },
            { id: 22, name: 'Работа' },
            { id: 23, name: 'Товары для детей' },
        ];
    },
};
