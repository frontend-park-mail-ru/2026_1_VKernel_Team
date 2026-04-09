/**
 * Локальное хранилище состояния модуля корзины
 */

import { EventBus } from '@/core/eventBus';
import type { CartItem, CartSellerGroup } from './types';

export interface CartState {
    items: CartItem[];
    total: number;
    error: string | null;
    isLoading: boolean;
}

class CartStore {
    private state: CartState = {
        items: [],
        total: 0,
        error: null,
        isLoading: false,
    };

    private eventBus: EventBus;

    constructor() {
        this.eventBus = new EventBus();
    }

    /**
     * Получение текущего состояния
     */
    getState(): CartState {
        return { ...this.state };
    }

    /**
     * Обновление состояния
     */
    setState(newState: Partial<CartState>): void {
        this.state = { ...this.state, ...newState };
        this.eventBus.emit('cartStateChanged', this.state);
    }

    /**
     * Подписка на изменения состояния
     */
    subscribe(callback: (state: CartState) => void): () => void {
        return this.eventBus.on('cartStateChanged', callback);
    }
}

export const cartStore = new CartStore();
