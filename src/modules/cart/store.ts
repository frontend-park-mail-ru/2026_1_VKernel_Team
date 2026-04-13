/**
 * Локальное хранилище состояния модуля корзины
 */

import { EventBus } from '@/core/eventBus';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import type { CartItem } from '@modules/cart/types';

export interface CartState {
    items: CartItem[];
    total: number;
    error: string | null;
    isLoading: boolean;
}

const CART_STORE = 'cart';

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

        if (newState.items !== undefined) {
            this.persistToIndexedDB(this.state.items);
        }
    }

    /**
     * Загрузка данных корзины из IndexedDB
     */
    async loadFromCache(): Promise<boolean> {
        try {
            const items = await cloverDB.getAll<CartItem>(CART_STORE);
            if (items.length > 0) {
                const total = items.reduce((sum, item) => sum + item.price, 0);
                this.state = { ...this.state, items, total, isLoading: false };
                this.eventBus.emit('cartStateChanged', this.state);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    /**
     * Подписка на изменения состояния
     */
    subscribe(callback: (state: CartState) => void): () => void {
        return this.eventBus.on('cartStateChanged', callback);
    }

    private async persistToIndexedDB(items: CartItem[]): Promise<void> {
        try {
            await cloverDB.replaceAll(CART_STORE, items);
        } catch {
            // IndexedDB unavailable — silent fallback
        }
    }
}

export const cartStore = new CartStore();
