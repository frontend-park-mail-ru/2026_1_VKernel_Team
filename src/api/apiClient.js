import { CONFIG } from '../core/config.js';
const API_URL = CONFIG.API.API_URL;
export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
    },
    ADS: {
        GET_ALL: '/ads',
        GET_BY_ID: (id) => `/ads/${id}`,
        CREATE: '/ads',
        UPDATE: (id) => `/ads/${id}`,
        DELETE: (id) => `/ads/${id}`,
        SEARCH: '/ads/search',
    },
    USERS: {
        PROFILE: '/users/profile',
        GET_BY_ID: (id) => `/users/${id}`,
    },
    CATEGORIES: {
        GET_ALL: '/categories',
    },
    FAVORITES: {
        GET_ALL: '/favorites',
        ADD: (id) => `/favorites/${id}`,
        REMOVE: (id) => `/favorites/${id}`,
        CHECK: (id) => `/favorites/${id}/check`,
    },
};
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop()?.split(';').shift() || null;
    return null;
};
export const apiClient = {
    async request(endpoint, method = 'GET', body = null, customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };
        if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
            const csrfToken = getCookie('csrf_token');
            if (csrfToken) {
                headers['X-CSRF-Token'] = csrfToken;
            }
        }
        const config = {
            method,
            headers,
            credentials: 'include',
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
                }
                catch (e) {
                    data = { message: 'Ошибка парсинга ответа сервера' };
                }
            }
            else {
                const text = await response.text();
                data = { message: text };
            }
            if (response.ok) {
                return { success: true, data: data };
            }
            return {
                success: false,
                error: data.message || data.error || 'Произошла неизвестная ошибка',
                data: data,
                status: response.status,
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Не удалось соединиться с сервером',
                status: 0,
            };
        }
    },
    get(endpoint, headers = {}) {
        return this.request(endpoint, 'GET', null, headers);
    },
    post(endpoint, body, headers = {}) {
        return this.request(endpoint, 'POST', body, headers);
    },
    put(endpoint, body, headers = {}) {
        return this.request(endpoint, 'PUT', body, headers);
    },
    delete(endpoint, headers = {}) {
        return this.request(endpoint, 'DELETE', null, headers);
    },
};
