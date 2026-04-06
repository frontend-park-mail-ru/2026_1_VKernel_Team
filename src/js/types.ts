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
    confirmPassword: string;
}

export interface ValidationResult {
    isValid: boolean;
    error?: string | null;
    fieldErrors?: Record<string, string | null>;
}

export type FieldErrors = Record<string, string | null>;

export interface CartItem {
    product_id: number;
    title: string;
    price: number;
    image_path: string;
    seller_id: number;
    seller_name: string;
}

export interface CartResponse {
    items: CartItem[];
    total_price: number;
}

export interface SellerContact {
    id: number;
    name: string;
    email: string;
}

export interface CheckoutResponse {
    order_ids: number[];
    sellers: Record<string, SellerContact>;
}

export interface CartSellerGroup {
    seller_name: string;
    seller_id: number;
    items: CartItem[];
}

export type TemplateName =
    | 'auth-links'
    | 'login-forms'
    | 'register-form'
    | 'user-profile'
    | 'main-page'
    | 'cart'
    | 'not-found';

export type HandlebarsTemplateFunction = (context?: any) => string;

export interface UIConstants {
    DEFAULT_AVATAR: string;
    DEFAULT_AD_IMAGE: string;
    EYE_OPEN: string;
    EYE_CLOSED: string;
    LOADER_HTML: string;
}
