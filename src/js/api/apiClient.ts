import { CONFIG } from '../core/config.js';

const API_URL = CONFIG.API.API_URL;

export type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
    status?: number;
};

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

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};


export class ApiClient {
    private _isRefreshing: boolean = false;
    private _refreshPromise: Promise<ApiResponse> | null = null;

    async _refreshAccessToken(): Promise<ApiResponse> {
        if (!this._isRefreshing) {
            this._isRefreshing = true;
            this._refreshPromise = this.post(API_ENDPOINTS.AUTH.REFRESH, {})
                .then(res => {
                    this._isRefreshing = false;
                    this._refreshPromise = null;
                    return res;
                })
                .catch(err => {
                    console.error('Ошибка обновления токена:', err);
                    this._isRefreshing = false;
                    this._refreshPromise = null;
                    return { success: false };
                });
        }

        return this._refreshPromise!;
    }

    async _handleUnauthorizedResponse(
        response: Response,
        endpoint: string,
        config: RequestInit,
    ): Promise<Response> {
        const isAuthEndpoint = endpoint === API_ENDPOINTS.AUTH.REFRESH ||
            endpoint === API_ENDPOINTS.AUTH.REGISTER;

        if (response.status !== 401 || isAuthEndpoint) {
            return response;
        }

        const refreshResult = await this._refreshAccessToken();

        if (!refreshResult?.success) {
            return response;
        }

        return fetch(`${API_URL}${endpoint}`, config);
    }

    async request<T = any>(
        endpoint: string,
        method: string = 'GET',
        body: any = null,
        customHeaders: Record<string, string> = {},
    ): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

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

    post<T = any>(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'POST', body, headers);
    }

    put<T = any>(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'PUT', body, headers);
    }

    delete<T = any>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'DELETE', null, headers);
    }
}

export const apiClient = new ApiClient();
