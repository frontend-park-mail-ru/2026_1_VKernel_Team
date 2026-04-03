/**
 * Общие типы TypeScript для всего приложения
 */

export interface User {
    id?: number;
    user_id?: number;
    email?: string;
    name?: string;
    created_at?: string;
}

export interface Ad {
    id: number;
    title: string;
    description?: string;
    price: number;
    photos?: string[];
    views_count?: number;
    favorites_count?: number;
    created_at?: string;
    location?: string;
}

export interface FormattedAd {
    id: number;
    title: string;
    description?: string;
    price: number;
    formattedPrice: string;
    location?: string;
    image: string;
    mainPhoto: string;
    views: number;
    favorites: number;
    createdDate: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string | null;
    fieldErrors?: Record<string, string | null>;
    status?: number;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirm?: string;
}

export interface ValidationResult {
    isValid: boolean;
    error?: string | null;
    fieldErrors?: Record<string, string | null>;
}

export type FieldErrors = Record<string, string | null>;

export type TemplateName =
    | 'auth-links'
    | 'login-forms'
    | 'register-form'
    | 'user-profile'
    | 'main-page'
    | 'not-found';

export type HandlebarsTemplateFunction = (context?: any) => string;

export interface UIConstants {
    DEFAULT_AVATAR: string;
    DEFAULT_AD_IMAGE: string;
    EYE_OPEN: string;
    EYE_CLOSED: string;
    LOADER_HTML: string;
}
