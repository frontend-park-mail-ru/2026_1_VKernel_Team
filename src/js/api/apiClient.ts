/**
 * Универсальный HTTP клиент для отправки запросов
 * Все сервисы используют этот модуль для работы с API
 */

import { CONFIG } from '@/core/config';
import { storage } from '@/utils/storage';
import type { ApiResponse } from '@/types';

const API_URL = CONFIG.API.API_URL;

export const API_ENDPOINTS = {
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
  },
  USERS: {
    PROFILE: '/profile',
    GET_BY_ID: (id: number | string) => `/users/${id}`,
    GET_ADS: (id: number | string) => `/users/${id}/ads`, 
  },
  CATEGORIES: {
    GET_ALL: '/categories',
  },
  FAVORITES: {
    GET_ALL: '/profile/favorites',
    ADD: (id: number | string) => `/favorites/${id}`,
    REMOVE: (id: number | string) => `/favorites/${id}`,
    CHECK: (id: number | string) => `/favorites/${id}/check`,
  },
  PROFILE: {
    UPDATE: '/profile/update',
    AVATAR: '/profile/avatar',
  },
  CART: {
    GET_ALL: '/cart',
  },
};

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export class ApiClient {
    private _isRefreshing: boolean = false;
    private _refreshPromise: Promise<ApiResponse> | null = null;

    /**
     * Обновляет токен доступа через запрос на рефреш
     */
    private async _refreshAccessToken(): Promise<ApiResponse> {
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
    }

    /**
     * Обрабатывает 401 ошибку и повторяет запрос после рефреша
     */
    private async _handleUnauthorizedResponse(
        response: Response,
        endpoint: string,
        config: RequestInit,
    ): Promise<Response> {
        const isAuthEndpoint =
            endpoint === API_ENDPOINTS.AUTH.REFRESH ||
            endpoint === API_ENDPOINTS.AUTH.REGISTER ||
            endpoint === API_ENDPOINTS.AUTH.LOGIN;

        if (response.status !== 401 || isAuthEndpoint) {
            return response;
        }

        const refreshResult = await this._refreshAccessToken();
        if (!refreshResult?.success) {
            return response;
        }

        // Токен обновлен, повторяем исходный запрос
        return fetch(`${API_URL}${endpoint}`, config);
    }

    /**
     * Универсальный метод для выполнения HTTP-запросов
     */
    async request<T = any>(
        endpoint: string,
        method: string = 'GET',
        body: any = null,
        customHeaders: Record<string, string> = {},
    ): Promise<ApiResponse<T>> {
        console.log(`API Request: ${method} ${API_URL}${endpoint}`, body); 
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        // Токен авторизации
        const token = storage.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // CSRF токен для mutating методов
        if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
            const csrfToken = getCookie('csrf_token');
            if (csrfToken) {
                headers['X-CSRF-Token'] = csrfToken;
            }
        }

        const config: RequestInit = {
            method,
            headers,
            credentials: 'include',
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            let response = await fetch(`${API_URL}${endpoint}`, config);

            response = await this._handleUnauthorizedResponse(response, endpoint, config);

            let data: any;
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
                return { success: true, data: data as T };
            }

            return {
                success: false,
                error: data.message || data.error || 'Произошла неизвестная ошибка',
                data: data as T,
                status: response.status,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Не удалось соединиться с сервером',
                status: 0,
            };
        }
    }

    get<T = any>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'GET', null, headers);
    }

    post<T = any>(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'POST', body, headers);
    }

    put<T = any>(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'PUT', body, headers);
    }

    delete<T = any>(
        endpoint: string,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'DELETE', null, headers);
    }
}

export const apiClient = new ApiClient();
