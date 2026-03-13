/**
* Сервис для работы с объявлениями
* Здесь все функции, которые связаны с получением и отображением объявлений
* 
* @module adsServices
*/

import { CONFIG } from "../core/config.js";

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
    async getAllAds() {
        try {
            // Отправляем GET запрос на /ads
            const response = await fetch(`${this.API_URL}/ads`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Если сервер вернул ошибку
            if (!response.ok) {
                throw new Error('Ошибка загрузки объявлений');
            }

            // Превращаем ответ в JSON
            const data = await response.json();
            
            return {
                success: true,
                ads: data  // data - это массив объявлений
            };
        } catch (error) {
            // Ловим ошибки: нет интернета, сервер упал и другое
            console.error('Ошибка получения объявлений:', error);
            return {
                success: false,
                error: 'Не удалось загрузить объявления'
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
    async getAdById(id) {
        try {
            // Отправляем запрос на /ads/10101
            const response = await fetch(`${this.API_URL}/ads/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Объявление не найдено');
            }

            const data = await response.json();
            return {
                success: true,
                ad: data
            };
        } catch (error) {
            console.error('Ошибка получения объявления:', error);
            return {
                success: false,
                error: 'Не удалось загрузить объявление'
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
    formatAdCard(ad) {
        // Базовый URL для статических файлов (картинок)
        const STATIC_URL = CONFIG.API.BASE_URL;
        
        // Берём первую фотографию или пустую строку
        const firstPhoto = ad.photos?.[0] || '';
        
        // Формируем полный путь к картинке
        // Если фото нет - ставим заглушку
        const imageUrl = firstPhoto
            ? `${STATIC_URL}${firstPhoto}`
            : '/images/placeholder.jpg';

        // Возвращаем объект с нужными полями
        return {
            id: ad.id,                                // ID объявления
            title: ad.title,                          // Заголовок
            description: ad.description?.substring(0, 100) + '...', // Описание (первые 100 символов)
            price: ad.price.toLocaleString('ru-RU') + ' ₽', // Цена с пробелами и символом рубля
            location: ad.location || 'Не указано',     // Город
            image: imageUrl,                           // Ссылка на картинку
            views: ad.views_count || 0,                // Количество просмотров
            favorites: ad.favorites_count || 0,        // Количество просмотров
            date: new Date(ad.created_at).toLocaleDateString('ru-RU') // Дата создания
        };
    }
};

export { AdsService };
