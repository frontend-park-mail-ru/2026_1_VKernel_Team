import { EventBus } from '@/core/eventBus';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import type { CartItem } from '@modules/cart/types';

export interface PurchaseSeller {
    id: number;
    name: string;
    avatar_path?: string;
}

export interface PurchaseItem {
    order_id: number;
    product_id: number;
    title: string;
    price: number;
    photo?: string;
    location?: string;
    seller: PurchaseSeller;
    source: 'cart' | 'chat';
    purchased_at: string;
    chat_id?: number;
}

export interface PurchasesResponse {
    purchases: PurchaseItem[];
    next_cursor?: number | null;
}

export interface PurchasesState {
    items: PurchaseItem[];
    nextCursor: number | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    isInitialised: boolean;
    error: string | null;
}

const PURCHASES_STORE = 'purchases';
const PAGE_SIZE = 20;

class PurchasesStore {
    private state: PurchasesState = {
        items: [],
        nextCursor: null,
        isLoading: false,
        isLoadingMore: false,
        isInitialised: false,
        error: null,
    };

    private eventBus = new EventBus();

    getState(): PurchasesState {
        return { ...this.state };
    }

    setState(newState: Partial<PurchasesState>): void {
        this.state = { ...this.state, ...newState };
        this.eventBus.emit('purchasesStateChanged', this.state);

        if (newState.items !== undefined) {
            void this.persistToIndexedDB(this.state.items);
        }
    }

    subscribe(cb: (state: PurchasesState) => void): () => void {
        return this.eventBus.on('purchasesStateChanged', cb);
    }

    async loadFromCache(): Promise<boolean> {
        try {
            const items = await cloverDB.getAll<PurchaseItem>(PURCHASES_STORE);
            if (items.length > 0) {
                items.sort(
                    (a, b) =>
                        new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime(),
                );
                this.state = { ...this.state, items };
                this.eventBus.emit('purchasesStateChanged', this.state);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    async fetch(options: { force?: boolean } = {}): Promise<void> {
        if (this.state.isInitialised && !options.force) return;
        this.setState({ isLoading: true, error: null });

        const res = await apiClient.get<PurchasesResponse>(
            `${API_ENDPOINTS.PURCHASES.MY}?limit=${PAGE_SIZE}`,
        );

        if (!res.success || !res.data) {
            // Сеть упала — оставляем то, что есть в IDB-кэше.
            const hasCache = this.state.items.length > 0 || (await this.loadFromCache());
            this.setState({
                isLoading: false,
                error: hasCache ? null : res.error || 'Не удалось загрузить покупки',
                isInitialised: true,
            });
            return;
        }

        const items = res.data.purchases || [];
        const nextCursor = res.data.next_cursor ?? null;
        this.state = {
            ...this.state,
            items,
            nextCursor,
            isLoading: false,
            isInitialised: true,
        };
        this.eventBus.emit('purchasesStateChanged', this.state);
        void this.persistToIndexedDB(items);
    }

    async loadMore(): Promise<void> {
        if (!this.state.nextCursor || this.state.isLoadingMore) return;
        this.setState({ isLoadingMore: true });

        const res = await apiClient.get<PurchasesResponse>(
            `${API_ENDPOINTS.PURCHASES.MY}?limit=${PAGE_SIZE}&cursor=${this.state.nextCursor}`,
        );

        if (!res.success || !res.data) {
            this.setState({ isLoadingMore: false });
            return;
        }

        const existingIds = new Set(this.state.items.map((p) => p.order_id));
        const newItems = (res.data.purchases || []).filter((p) => !existingIds.has(p.order_id));

        const merged = [...this.state.items, ...newItems];
        this.state = {
            ...this.state,
            items: merged,
            nextCursor: res.data.next_cursor ?? null,
            isLoadingMore: false,
        };
        this.eventBus.emit('purchasesStateChanged', this.state);
        void this.persistToIndexedDB(merged);
    }

    /**
     * Оптимистический апдейт после оформления корзины — добавляет позиции,
     * полученные локально из cart-checkout. На фоне нужно вызвать fetch({force})
     * чтобы синхронизироваться с сервером.
     */
    async addOptimisticFromCart(cartItems: CartItem[]): Promise<void> {
        const now = new Date().toISOString();
        const optimistic: PurchaseItem[] = cartItems.map((item, idx) => ({
            order_id: -Date.now() - idx,
            product_id: item.product_id,
            title: item.title,
            price: item.price,
            photo: item.image_path,
            location: item.location,
            seller: {
                id: item.seller_id,
                name: item.seller_name,
            },
            source: 'cart',
            purchased_at: now,
        }));

        const merged = [...optimistic, ...this.state.items];
        this.setState({ items: merged });
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
