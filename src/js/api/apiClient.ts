/**
 * Универсальный HTTP клиент для отправки запросов
 * Все сервисы используют этот модуль для работы с API
 */

import { CONFIG } from '@/core/config';
import { storage } from '@/utils/storage';
import { eventBus } from '@/core/eventBus';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
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
        CLOSE: (id: number | string) => `/ads/${id}/close`,
        VIEW: (id: number | string) => `/ads/${id}/view`,
    },
    USERS: {
        PROFILE: '/profile',
        GET_BY_ID: (id: number | string) => `/users/${id}`,
        GET_ADS: (id: number | string) => `/users/${id}/ads`,
    },
    CATEGORIES: {
        GET_ALL: '/categories',
    },
    CHATS: {
        GET_ALL: '/chats',
        GET_BY_ID: (id: number | string) => `/chats/${id}`,
        CONFIRM: (id: number | string) => `/chats/${id}/confirm`,
        CREATE_ORDER: (adId: number | string) => `/ads/${adId}/order`,
    },
    REVIEWS: {
        LIST_BY_USER: (id: number | string) => `/users/${id}/reviews`,
        SUMMARY: (id: number | string) => `/users/${id}/reviews/summary`,
        MY: '/profile/reviews',
        CREATE: '/reviews',
        UPDATE: (id: number | string) => `/reviews/${id}`,
        DELETE: (id: number | string) => `/reviews/${id}`,
    },
    PURCHASES: {
        MY: '/profile/purchases',
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

    getApiUrl(): string {
        return API_URL;
    }

    /**
     * Если ответ 400 c сообщением про CSRF и метод mutating — один раз пытается
     * прогреть сессию и повторить запрос. Возвращает ApiResponse при успешном
     * retry, иначе null (вызывающий продолжит обычную обработку).
     */
    private async _maybeRetryCsrf(
        status: number,
        data: any,
        method: string,
        endpoint: string,
        body: any,
        customHeaders: Record<string, string>,
    ): Promise<ApiResponse | null> {
        if (status !== 400) return null;
        const errMsg = (data?.message || data?.error || '').toString().toLowerCase();
        if (!errMsg.includes('csrf')) return null;

        console.warn('[CSRF] Missing/mismatch CSRF cookie, attempting warm-up');
        const isMutating =
            method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

        if (isMutating && !customHeaders['X-Csrf-Retry']) {
            const warmed = await this._warmUpCsrf();
            if (warmed) {
                return this.request(endpoint, method, body, {
                    ...customHeaders,
                    'X-Csrf-Retry': '1',
                });
            }
        }
        eventBus.emit('auth:csrf-expired');
        return null;
    }

    /**
     * Делает один GET-запрос на /profile, чтобы бэкенд переустановил CSRF-cookie.
     * Используется как «warm-up» при ошибке Missing/mismatch CSRF cookie.
     * Возвращает true, если после запроса cookie csrf_token присутствует.
     */
    private async _warmUpCsrf(): Promise<boolean> {
        try {
            await fetch(`${API_URL}${API_ENDPOINTS.USERS.PROFILE}`, {
                method: 'GET',
                credentials: 'include',
            });
        } catch {
            // Сетевые ошибки игнорируем — проверим cookie ниже
        }
        return getCookie('csrf_token') !== null;
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

        // Токен обновлен, повторяем исходный запрос с новым AbortController
        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), 2000);
        const retryConfig = { ...config, signal: retryController.signal };
        try {
            return await fetch(`${API_URL}${endpoint}`, retryConfig);
        } finally {
            clearTimeout(retryTimeout);
        }
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
        const headers: Record<string, string> = {
            ...customHeaders,
        };

        // Подставляем токен из LocalStorage, если он есть
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
            if (body instanceof FormData) {
                // Если передали файл: отдаем FormData как есть, без stringify
                config.body = body;
                // Удаляем Content-Type, чтобы браузер сам сгенерировал multipart/form-data и boundary
                delete (config.headers as Record<string, string>)['Content-Type'];
            } else {
                // Если передали обычный объект: ставим JSON
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/json';
                }
                config.body = JSON.stringify(body);
            }
        }

        const controller = new AbortController();
        const timeoutMs = body instanceof FormData ? 30000 : 15000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        config.signal = controller.signal;

        try {
            let response = await fetch(`${API_URL}${endpoint}`, config);

            // Пытаемся поймать токен из заголовков ответа
            const authHeader =
                response.headers.get('Authorization') || response.headers.get('X-Token');
            if (authHeader) {
                const extractedToken = authHeader.replace('Bearer ', '');
                storage.setToken(extractedToken);
            }

            response = await this._handleUnauthorizedResponse(response, endpoint, config);
            clearTimeout(timeoutId);

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
            if (response.ok && endpoint === API_ENDPOINTS.AUTH.LOGIN) {
                const possibleToken =
                    data?.token ||
                    data?.access_token ||
                    data?.data?.token ||
                    data?.data?.access_token;
                if (possibleToken) {
                    storage.setToken(possibleToken);
                }
            }

            if (response.ok) {
                networkStatus.setOnline();
                return { success: true, data: data as T };
            }

            // 502/503/504 от прокси = бэкенд недоступен → трактуем как офлайн
            if (response.status === 502 || response.status === 503 || response.status === 504) {
                networkStatus.setOffline();
            }

            // Протух/отсутствует CSRF-токен → пробуем «прогреть» сессию ещё раз
            // (один GET, который должен переустановить cookie на бэкенде),
            // и только при повторной неудаче эмитим csrf-expired.
            const csrfRetry = await this._maybeRetryCsrf(
                response.status,
                data,
                method,
                endpoint,
                body,
                customHeaders,
            );
            if (csrfRetry) return csrfRetry as ApiResponse<T>;

            return {
                success: false,
                error: data.message || data.error || 'Произошла неизвестная ошибка',
                data: data as T,
                status: response.status,
            };
        } catch (error) {
            clearTimeout(timeoutId);
            // fetch выбросил исключение — сеть недоступна.
            // Переключаем приложение в офлайн только если браузер явно сообщает,
            // что сети нет, иначе единичный таймаут будет ложно переводить UI
            // в offline-режим и сразу же показывать «Подключение восстановлено».
            if (!navigator.onLine) {
                networkStatus.setOffline();
            }
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

    patch<T = any>(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'PATCH', body, headers);
    }
}

export const apiClient = new ApiClient();
