/**
* Сервис для работы с объявлениями
* Здесь все функции, которые связаны с получением и отображением объявлений
*
* @module adsServices
*/

import { CONFIG } from '@/core/config';

type Ad = {
    id: number;
    title: string;
    description?: string;
    price: number;
    location?: string;
    photos?: string[];
    views_count?: number;
    favorites_count?: number;
    created_at?: string;
};

type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
};

/**
 * Объект с методами для работы с объявлениями
 * Умеет получать все объявления, одно объявление по ID,
 * и форматировать их для отображения на странице
 */
const AdsService = {
    API_URL: CONFIG.API.API_URL,

    /**
     * Получает все объявления с сервера
     * @async
     * @returns {Promise<Object>} - объект с полем success и либо ads (массив объявлений), либо error
     *
     * @example
     * // Пример использования:
     * const result = await AdsService.getAllAds();
     * if (result.success) {
     *   console.log('Объявления:', result.ads);
     * } else {
     *   console.error('Ошибка:', result.error);
     * }
     */
    async getAllAds(): Promise<ApiResponse<Ad[]>> {
        try {
            const response = await fetch(`${this.API_URL}/ads`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки объявлений');
            }

            const data = await response.json();

            return {
                success: true,
                data: data,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Не удалось загрузить объявления',
            };
        }
    },

    /**
     * Получает одно конкретное объявление по его ID
     * @async
     * @param {number|string} id - идентификатор объявления
     * @returns {Promise<Object>} - объект с объявлением или ошибкой
     *
     * @example
     * const result = await AdsService.getAdById(123);
     * if (result.success) {
     *   console.log('Объявление:', result.ad);
     * }
     */
    async getAdById(id: number | string): Promise<ApiResponse<Ad>> {
        try {
            const response = await fetch(`${this.API_URL}/ads/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Объявление не найдено');
            }

            const data = await response.json();
            return {
                success: true,
                data: data,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Не удалось загрузить объявление',
            };
        }
    },

    /**
     * Подготовливает объявление для отображения на карточке
     * Форматирует цену, дату, добавляет полный путь к картинке
     *
     * @param {Object} ad - сырое объявление с сервера
     * @returns {Object} - отформатированное объявление для шаблона
     *
     */
    formatAdCard(ad: Ad) {
        const firstPhoto = ad.photos?.[0] || '';

        let imageUrl = '/images/placeholder.jpg';
        if (firstPhoto) {
            imageUrl = firstPhoto.startsWith('http')
                ? firstPhoto
                : `${CONFIG.API.BASE_URL}${firstPhoto}`;
        }

        return {
            id: ad.id,
            title: ad.title,
            description: ad.description?.substring(0, 100) + '...',
            price: ad.price.toLocaleString('ru-RU') + ' ₽',
            location: ad.location || 'Не указано',
            image: imageUrl,
            views: ad.views_count || 0,
            favorites: ad.favorites_count || 0,
            date: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        };
    },
};

export { AdsService };
