/**
 * Общие типы TypeScript для всего приложения
 */

export interface User {
    id?: number;
    user_id?: number; // Для совместимости с разными ответами API
    email?: string;
    name?: string;
    avatar?: string;
    avatar_path?: string;
    rating?: number;
    ads_count?: number;
    favorites_count?: number;
    cart_count?: number;
    unread_messages_count?: number;
    reviews_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Ad {
    id: number;
    category_id: number;
    title: string;
    description?: string;
    price: number;
    photos?: string[];
    views_count?: number;
    favorites_count?: number;
    created_at?: string;
    updated_at?: string;
    location?: string;
    status?: 'active' | 'draft' | 'reserved' | 'sold' | 'archived';

    category_characteristics: ProductCharacteristic[];
    custom_characteristics: ProductCustomCharacteristic[];
    seller_id?: number;
    seller_name?: string;
    seller_created_at?: string;
    condition?: string;
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

export type TemplateName =
    | 'auth-links'
    | 'login-forms'
    | 'register-form'
    | 'user-profile'
    | 'main-page'
    | 'not-found'
    | 'ad-detail'
    | 'before-publication'
    | 'place-an-ad'
    | 'profile-sidebar'
    | 'profile-content'
    | 'profile-modal-edit-name'
    | 'profile-avatar'
    | 'profile-actions'
    | 'profile-ads-grid'
    | 'profile-ads-tabs'
    | 'profile-empty-state'
    | 'profile-item-card'
    | 'profile-stats'
    | 'profile-tab-btn'
    | 'profile-user-info';

export type HandlebarsTemplateFunction = (context?: any) => string;

export interface UIConstants {
    DEFAULT_AVATAR: string;
    DEFAULT_AD_IMAGE: string;
    EYE_OPEN: string;
    EYE_CLOSED: string;
    LOADER_HTML: string;
}

export type ProfileTab = 'info' | 'ads' | 'favorites' | 'cart' | 'settings';

// Типы для создания/редактирования объявлений (из main)
export interface DraftCategoryCharacteristic {
    category_characteristic_id: number;
    value: string;
}

export interface DraftCustomCharacteristic {
    name: string;
    value: string;
}

export interface DraftFormData {
    title: string;
    category_id: number;
    price: number;
    description: string;
    location: string;
    category_characteristics: DraftCategoryCharacteristic[];
    custom_characteristics: DraftCustomCharacteristic[];
}

export interface DraftData {
    id: string;
    formData: DraftFormData;
    photoCount: number;
    timestamp: number;
}

export interface Category {
    id: number;
    name: string;
    parent_id?: number | null;
    sort_order?: number;
}

export interface CategoryCharacteristic {
    id: number;
    category_id: number;
    name: string;
    allowed_values: string[] | null;
    sort_order: number;
}

export interface ProductCharacteristic {
    name: string;
    value: string;
}

export interface ProductCustomCharacteristic {
    name: string;
    value: string;
}

export interface CharacteristicInput {
    category_characteristic_id: number;
    value: string;
}

export interface CustomCharacteristicInput {
    name: string;
    value: string;
}

export interface CreateAdData {
    category_id: number;
    title: string;
    description: string;
    price: number;
    status: string;
    location: string;
    category_characteristics?: CharacteristicInput[];
    custom_characteristics?: CustomCharacteristicInput[];
}

export interface UpdateAdData {
    category_id?: number;
    title?: string;
    description?: string;
    price?: number;
    status?: string;
    location?: string;
    category_characteristics?: CharacteristicInput[];
    custom_characteristics?: CustomCharacteristicInput[];
}

export interface ApiError {
    error: string;
}

export interface ValidationErrors {
    email?: string;
    password?: string;
    name?: string;
    user_id?: string;
    category_id?: string;
    title?: string;
    description?: string;
    price?: string;
    status?: string;
    location?: string;
    photos?: string[];
    category_characteristics?: string;
    custom_characteristics?: string;
}
