// src/modules/product_search/types.ts

export interface SearchFilters {
    minPrice: number | null;
    maxPrice: number | null;
    condition: 'all' | 'new' | 'used';
    category_id: number | null;  // Добавляем фильтр по категории
}

export type SortOrder = 'default' | 'price_asc' | 'price_desc';

export interface SearchState {
    query: string;
    filters: SearchFilters;
    sortOrder: SortOrder;
    results: any[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
}

export interface PriceRange {
    min: number;
    max: number;
}
