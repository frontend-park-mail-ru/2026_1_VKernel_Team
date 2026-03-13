/**
 * Базовый URL API сервера
 * @type {string}
 */
const API_URL = 'http://clover-go.ru:8000/api/v1';
const MEDIA_URL = 'http://clover-go.ru:8000';

/**
 * Эндпоинты API для различных ресурсов
 * @type {Object}
 */
const API_ENDPOINTS = {
    /**
     * Эндпоинты для аутентификации
     * @type {Object}
     */
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
    },

    /**
     * Эндпоинты для объявлений
     * @type {Object}
     */
    ADS: {
        GET_ALL: '/ads',
        GET_BY_ID: (id) => `/ads/${id}`,
        CREATE: '/ads',
        UPDATE: (id) => `/ads/${id}`,
        DELETE: (id) => `/ads/${id}`,
        SEARCH: '/ads/search'
    },

    /**
     * Эндпоинты для пользователей
     * @type {Object}
     */
    USERS: {
        PROFILE: '/users/profile',
        GET_BY_ID: (id) => `/users/${id}`
    },

    /**
     * Эндпоинты для категорий
     * @type {Object}
     */
    CATEGORIES: {
        GET_ALL: '/categories'
    },

    /**
     * Эндпоинты для избранного
     * @type {Object}
     */
    FAVORITES: {
        GET_ALL: '/favorites',
        ADD: (id) => `/favorites/${id}`,
        REMOVE: (id) => `/favorites/${id}`,
        CHECK: (id) => `/favorites/${id}/check`
    }
};

/**
 * Клиент для взаимодействия с API
 * @type {Object}
 */
const apiClient = {
    /**
     * Универсальный метод для выполнения HTTP-запросов
     * @param {string} endpoint - Эндпоинт API
     * @param {string} [method='GET'] - HTTP метод
     * @param {Object|null} [body=null] - Тело запроса
     * @param {Object} [customHeaders={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса с полями success, data, error, status
     */
    async request(endpoint, method = 'GET', body = null, customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        const config = {
            method,
            headers,
            credentials: 'include'
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = await response.json();
                } catch (e) {
                    data = { message: 'Ошибка парсинга ответа сервера' };
                }
            } else {
                const text = await response.text();
                data = { message: text };
            }

            if (response.ok) {
                return { success: true, data };
            }

            return {
                success: false,
                error: data.message || data.error || 'Произошла неизвестная ошибка',
                data: data,
                status: response.status
            };

        } catch (error) {
            return {
                success: false,
                error: 'Не удалось соединиться с сервером',
                status: 0
            };
        }
    },

    /**
     * Выполняет GET-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    get(endpoint, headers) {
        return this.request(endpoint, 'GET', null, headers);
    },

    /**
     * Выполняет POST-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} body - Тело запроса
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    post(endpoint, body, headers) {
        return this.request(endpoint, 'POST', body, headers);
    },

    /**
     * Выполняет PUT-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} body - Тело запроса
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    put(endpoint, body, headers) {
        return this.request(endpoint, 'PUT', body, headers);
    },

    /**
     * Выполняет DELETE-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    delete(endpoint, headers) {
        return this.request(endpoint, 'DELETE', null, headers);
    }
};

/**
 * Экспорт apiClient и API_ENDPOINTS в глобальную область видимости браузера
 */
if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
    window.API_ENDPOINTS = API_ENDPOINTS;
    window.MEDIA_URL = MEDIA_URL;
}
