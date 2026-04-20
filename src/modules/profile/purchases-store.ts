import { EventBus } from '@/core/eventBus';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import type { CartItem } from '@modules/cart/types';

export interface PurchaseItem extends CartItem {
    purchased_at: string;
}

export interface PurchasesState {
    items: PurchaseItem[];
    isLoading: boolean;
}

const PURCHASES_STORE = 'purchases';

class PurchasesStore {
    private state: PurchasesState = {
        items: [],
        isLoading: false,
    };

    private eventBus = new EventBus();

    getState(): PurchasesState {
        return { ...this.state };
    }

    setState(newState: Partial<PurchasesState>): void {
        this.state = { ...this.state, ...newState };
        this.eventBus.emit('purchasesStateChanged', this.state);

        if (newState.items !== undefined) {
            this.persistToIndexedDB(this.state.items);
        }
    }

    async loadFromCache(): Promise<boolean> {
        try {
            const items = await cloverDB.getAll<PurchaseItem>(PURCHASES_STORE);
            if (items.length > 0) {
                items.sort(
                    (a, b) =>
                        new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime(),
                );
                this.state = { ...this.state, items, isLoading: false };
                this.eventBus.emit('purchasesStateChanged', this.state);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    async addPurchases(cartItems: CartItem[]): Promise<void> {
        const now = new Date().toISOString();
        const newPurchases: PurchaseItem[] = cartItems.map((item) => ({
            ...item,
            purchased_at: now,
        }));

        const currentItems = this.state.items;
        const allItems = [...newPurchases, ...currentItems];

        this.setState({ items: allItems });
    }

    private async persistToIndexedDB(items: PurchaseItem[]): Promise<void> {
        try {
            await cloverDB.replaceAll(PURCHASES_STORE, items);
        } catch {
            // IndexedDB unavailable
        }
    }
}

export const purchasesStore = new PurchasesStore();
