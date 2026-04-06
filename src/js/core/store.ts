/**
 * Центральное хранилище состояния приложения
 * Все данные хранятся в одном месте, компоненты подписываются на изменения
 */

import { EventBus } from './eventBus';
import { storage } from '@/utils/storage';
import type { User, CartItem } from '@/types';

export interface AppState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    ads: any[];
    currentPage: string;
    error: string | null;
    cartItems: CartItem[];
    cartTotal: number;
}

class Store {
    private state: AppState = {
        isAuthenticated: storage.isAuthenticated(),
        user: storage.getUser(),
        isLoading: false,
        ads: [],
        currentPage: 'main-page',
        error: null,
        cartItems: [],
        cartTotal: 0,
    };

    private eventBus: EventBus;

    constructor() {
        this.eventBus = new EventBus();
    }

    /**
     * Получение текущего состояния
     */
    getState(): AppState {
        return { ...this.state };
    }

    /**
     * Обновление состояния
     */
    setState(newState: Partial<AppState>): void {
        this.state = { ...this.state, ...newState };
        this.eventBus.emit('stateChanged', this.state);
    }

    /**
     * Подписка на изменения состояния
     */
    subscribe(callback: (state: AppState) => void): () => void {
        return this.eventBus.on('stateChanged', callback);
    }

    // Геттеры для удобства
    get isAuthenticated(): boolean {
        return this.state.isAuthenticated;
    }

    get user(): User | null {
        return this.state.user;
    }

    get isLoading(): boolean {
        return this.state.isLoading;
    }

    get ads(): any[] {
        return this.state.ads;
    }

    get currentPage(): string {
        return this.state.currentPage;
    }

    get error(): string | null {
        return this.state.error;
    }

    get cartItems(): CartItem[] {
        return this.state.cartItems;
    }

    get cartTotal(): number {
        return this.state.cartTotal;
    }
}

export const store = new Store();
