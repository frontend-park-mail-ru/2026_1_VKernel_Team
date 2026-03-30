/**
* Сервис для работы с объявлениями
* Здесь все функции, которые связаны с получением и отображением объявлений
*
* @module adsServices
*/

import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import type { Ad } from '@/types';

/**
 * Объект с методами для работы с объявлениями
 * Умеет получать все объявления, одно объявление по ID,
 * и форматировать их для отображения на странице
 */
const AdsService = {
    /**
     * Получает все объявления с сервера
     */
    async getAllAds() {
        return apiClient.get(API_ENDPOINTS.ADS.GET_ALL);
    },

    /**
     * Получает одно конкретное объявление по его ID
     * @param {number|string} id - идентификатор объявления
     */
    async getAdById(id: number | string) {
        return apiClient.get(API_ENDPOINTS.ADS.GET_BY_ID(id));
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
