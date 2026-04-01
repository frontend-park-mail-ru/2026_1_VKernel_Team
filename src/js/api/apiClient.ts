import { CONFIG } from '@/core/config';

const API_URL = CONFIG.API.API_URL;

type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
    status?: number;
};

const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    ADS: {
        GET_ALL: '/ads',
        GET_BY_ID: (id: number | string) => `/ads/${id}`,
        CREATE: '/ads',
        UPDATE: (id: number | string) => `/ads/${id}`,
        DELETE: (id: number | string) => `/ads/${id}`,
        SEARCH: '/ads/search',
    },
    USERS: {
        PROFILE: '/profile',
        GET_BY_ID: (id: number | string) => `/users/${id}`,
    },
    CATEGORIES: {
        GET_ALL: '/categories',
    },
    FAVORITES: {
        GET_ALL: '/favorites',
        ADD: (id: number | string) => `/favorites/${id}`,
        REMOVE: (id: number | string) => `/favorites/${id}`,
        CHECK: (id: number | string) => `/favorites/${id}/check`,
    },
};

/**
 * Вспомогательная функция для получения куки по имени
 */
const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

/**
 * Основной объект для отправки запросов на сервер
 * Содержит методы для GET, POST, PUT, DELETE запросов
 *
 * @param {string} endpoint - адрес, куда отправляем запрос (например, '/auth/login')
 * @param {string} method - метод HTTP запроса (GET, POST, PUT, DELETE)
 * @param {Object} body - данные, которые отправляем на сервер (для POST/PUT)
 * @param {Object} customHeaders - дополнительные заголовки, если нужны
 * @returns {Promise<Object>} - ответ от сервера в виде объекта {success, data, error}
 *
 * @example
 * // Пример вызова:
 * const result = await apiClient.request('/auth/login', 'POST', {
 *   email: 'user@mail.ru',
 *   password: '12345678'
 * });
 */
const apiClient = {
    _isRefreshing: false,
    _refreshPromise: null as Promise<ApiResponse> | null,

    /**
     * Обновляет токен доступа через запрос на рефреш
     * Гарантирует что только один рефреш выполняется одновременно
     * @returns {Promise<ApiResponse>} Результат обновления токена
     */
    async _refreshAccessToken(): Promise<ApiResponse> {
        if (!this._isRefreshing) {
            this._isRefreshing = true;
            this._refreshPromise = this.post(API_ENDPOINTS.AUTH.REFRESH, {})
                .then((res) => {
                    this._isRefreshing = false;
                    this._refreshPromise = null;
                    return res;
                })
                .catch((err) => {
                    console.error('Ошибка обновления токена:', err);
                    this._isRefreshing = false;
                    this._refreshPromise = null;
                    return { success: false };
                });
        }

        return this._refreshPromise!;
    },

    /**
     * Проверяет нужно ли обновлять токен и повторяет запрос если нужно
     * @param {Response} response - Ответ от сервера
     * @param {string} endpoint - Эндпоинт запроса
     * @param {RequestInit} config - Конфиг для повтора запроса
     * @returns {Promise<Response>} Новый ответ или исходный если рефреш не требуется
     */
    async _handleUnauthorizedResponse(
        response: Response,
        endpoint: string,
        config: RequestInit,
    ): Promise<Response> {
        const isAuthEndpoint =
            endpoint === API_ENDPOINTS.AUTH.REFRESH ||
            endpoint === API_ENDPOINTS.AUTH.REGISTER;

        if (response.status !== 401 || isAuthEndpoint) {
            return response;
        }

        const refreshResult = await this._refreshAccessToken();

        if (!refreshResult?.success) {
            return response;
        }

        // Токен обновлен, повторяем исходный запрос
        return fetch(`${API_URL}${endpoint}`, config);
    },

    /**
     * Универсальный метод для выполнения HTTP-запросов
     * @param {string} endpoint - Эндпоинт API
     * @param {string} [method='GET'] - HTTP метод
     * @param {Object|null} [body=null] - Тело запроса
     * @param {Object} [customHeaders={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса с полями success, data, error, status
     */
    async request(
        endpoint: string,
        method: string = 'GET',
        body: any = null,
        customHeaders: Record<string, string> = {},
    ): Promise<ApiResponse> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        if (
            method === 'POST' ||
            method === 'PUT' ||
            method === 'PATCH' ||
            method === 'DELETE'
        ) {
            const csrfToken = getCookie('csrf_token');
            if (csrfToken) {
                headers['X-CSRF-Token'] = csrfToken;
            }
        }

        const config: RequestInit = {
            method,
            headers,
            credentials: 'include' as RequestCredentials,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            let response = await fetch(`${API_URL}${endpoint}`, config);
            response = await this._handleUnauthorizedResponse(
                response,
                endpoint,
                config,
            );

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
                error:
                    data.message ||
                    data.error ||
                    'Произошла неизвестная ошибка',
                data: data,
                status: response.status,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Не удалось соединиться с сервером',
                status: 0,
            };
        }
    },

    /**
     * Выполняет GET-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    get(
        endpoint: string,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse> {
        return this.request(endpoint, 'GET', null, headers);
    },

    /**
     * Выполняет POST-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} body - Тело запроса
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    post(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse> {
        return this.request(endpoint, 'POST', body, headers);
    },

    /**
     * Выполняет PUT-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} body - Тело запроса
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    put(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse> {
        return this.request(endpoint, 'PUT', body, headers);
    },

    /**
     * Выполняет DELETE-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    delete(
        endpoint: string,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse> {
        return this.request(endpoint, 'DELETE', null, headers);
    },
};

export { API_ENDPOINTS, apiClient };
