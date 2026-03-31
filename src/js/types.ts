export interface User {
    id?: number;
    email?: string;
    name?: string;
    created_at?: string;
}

export interface Ad {
    id: number;
    title: string;
    description?: string;
    price: number;
    location?: string;
    photos?: string[];
    views_count?: number;
    favorites_count?: number;
    created_at?: string;
}

export interface ApiResult {
    success: boolean;
    data?: any;
    error?: string;
    fieldErrors?: Record<string, string>;
    status?: number;
}
