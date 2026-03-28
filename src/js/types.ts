export interface User {
    id?: number;
    email?: string;
    name?: string;
    created_at?: string;
}

export interface Ad {
    id: number;
    title: string;
    price: number;
    photos?: string[];
    views_count?: number;
    created_at?: string;
    location?: string;
}

export interface ApiResult {
    success: boolean;
    data?: any;
    error?: string;
    fieldErrors?: Record<string, string>;
    status?: number;
}
