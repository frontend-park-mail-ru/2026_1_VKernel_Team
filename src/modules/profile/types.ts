/** Вкладки профиля (должны совпадать с data-tab в шаблоне) */
export type ProfileTab =
    | 'info'
    | 'ads'
    | 'favorites'
    | 'cart'
    | 'messages'
    | 'purchases'
    | 'paid_services'
    | 'wallet'
    | 'settings';

/** Статус объявления для фильтрации */
export type AdFilter = 'all' | 'active' | 'completed' | 'inactive' | 'drafts';

/** Основная структура данных пользователя */
export interface UserProfile {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    avatar_path?: string;
    rating: number;
    reviews_count: number;
    ads_count: number;
    favorites_count: number;
    cart_count: number;
    messages_count?: number;
    created_at: string;
    is_verified?: boolean;
    balance?: number;
    [key: string]: unknown;
}

/** Карточка объявления в сетке профиля */
export interface ProfileAd {
    id: number;
    title: string;
    price: number;
    image?: string;
    image_url?: string;
    location?: string;
    status: AdFilter;
    views_count?: number;
    created_at: string;
}

/** Статистика по объявлениям (передаётся в шаблон) */
export interface AdStats {
    all: number;
    active: number;
    completed: number;
    inactive: number;
    drafts: number;
}

/** Алиас для совместимости с глобальным типом User */
export type User = UserProfile;

/** Внутреннее состояние модуля (если будешь использовать локальный стор) */
export interface ProfileState {
    activeTab: ProfileTab;
    adFilter: AdFilter;
    adsStats: AdStats;
    isLoading: boolean;
    error: string | null;
}
