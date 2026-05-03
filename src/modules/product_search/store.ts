// import { EventBus } from '@/core/eventBus';
// import type { SearchState, SearchFilters, SortOrder } from './types';

// const initialState: SearchState = {
//     query: '',
//     filters: {
//         minPrice: null,
//         maxPrice: null,
//         condition: 'all',
//         category_id: null,
//     },
//     sortOrder: 'default',
//     results: [],
//     isLoading: false,
//     error: null,
//     totalCount: 0,
// };

// class ProductSearchStore {
//     private state: SearchState = { ...initialState };
//     private originalResults: any[] = []; // Храним原始 результаты
//     private eventBus: EventBus;

//     constructor() {
//         this.eventBus = new EventBus();
//     }

//     getState(): SearchState {
//         return { ...this.state };
//     }

//     getOriginalResults(): any[] {
//         return [...this.originalResults];
//     }

//     setState(newState: Partial<SearchState>): void {
//         this.state = { ...this.state, ...newState };
        
//         // Если установлены новые результаты, сохраняем их как оригинальные
//         if (newState.results !== undefined) {
//             this.originalResults = [...newState.results];
//         }
        
//         this.eventBus.emit('searchStateChanged', this.state);
//     }

//     reset(): void {
//         this.state = { ...initialState };
//         this.originalResults = [];
//         this.eventBus.emit('searchStateChanged', this.state);
//     }

//     subscribe(callback: (state: SearchState) => void): () => void {
//         return this.eventBus.on('searchStateChanged', callback);
//     }
// }

// export const productSearchStore = new ProductSearchStore();


// src/modules/product_search/store.ts

import { EventBus } from '@/core/eventBus';
import type { SearchState, SearchFilters, SortOrder } from './types';

const initialState: SearchState = {
    query: '',
    filters: {
        minPrice: null,
        maxPrice: null,
        condition: 'all',
        category_id: null,
    },
    sortOrder: 'default',
    results: [],
    isLoading: false,
    error: null,
    totalCount: 0,
};

class ProductSearchStore {
    private state: SearchState = { ...initialState };
    private originalResults: any[] = []; // Храним результаты с бэкенда
    private eventBus: EventBus;

    constructor() {
        this.eventBus = new EventBus();
    }

    getState(): SearchState {
        return { ...this.state };
    }

    getOriginalResults(): any[] {
        return [...this.originalResults];
    }

    setOriginalResults(results: any[]): void {
        this.originalResults = [...results];
    }

    setState(newState: Partial<SearchState>): void {
        this.state = { ...this.state, ...newState };
        this.eventBus.emit('searchStateChanged', this.state);
    }

    reset(): void {
        this.state = { ...initialState };
        this.originalResults = [];
        this.eventBus.emit('searchStateChanged', this.state);
    }

    subscribe(callback: (state: SearchState) => void): () => void {
        return this.eventBus.on('searchStateChanged', callback);
    }
}

export const productSearchStore = new ProductSearchStore();
