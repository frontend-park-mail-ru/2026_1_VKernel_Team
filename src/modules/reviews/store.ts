import { EventBus } from '@/core/eventBus';
import type { Review, ReviewSummary } from './types';

export interface SellerReviewsState {
    sellerId: number | null;
    summary: ReviewSummary | null;
    items: Review[];
    nextCursor: number | null;
    filterRating: number | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
}

export interface MyReviewsState {
    items: Review[];
    productIndex: Map<number, Review>;
    nextCursor: number | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    isInitialised: boolean;
    error: string | null;
}

export interface ReviewModalState {
    isOpen: boolean;
    mode: 'create' | 'edit';
    adId: number | null;
    sellerId: number | null;
    reviewId: number | null;
    productTitle: string;
    productPhoto: string;
    sellerName: string;
    rating: number;
    content: string;
    isSubmitting: boolean;
    error: string | null;
}

const SELLER_EVENT = 'reviews:sellerStateChanged';
const MY_EVENT = 'reviews:myStateChanged';
const MODAL_EVENT = 'reviews:modalStateChanged';

class SellerReviewsStore {
    private state: SellerReviewsState = {
        sellerId: null,
        summary: null,
        items: [],
        nextCursor: null,
        filterRating: null,
        isLoading: false,
        isLoadingMore: false,
        error: null,
    };
    private bus = new EventBus();

    getState(): SellerReviewsState {
        return { ...this.state };
    }

    setState(patch: Partial<SellerReviewsState>): void {
        this.state = { ...this.state, ...patch };
        this.bus.emit(SELLER_EVENT, this.state);
    }

    reset(sellerId: number): void {
        this.state = {
            sellerId,
            summary: null,
            items: [],
            nextCursor: null,
            filterRating: null,
            isLoading: false,
            isLoadingMore: false,
            error: null,
        };
        this.bus.emit(SELLER_EVENT, this.state);
    }

    appendItems(items: Review[], nextCursor: number | null): void {
        this.state = {
            ...this.state,
            items: [...this.state.items, ...items],
            nextCursor,
        };
        this.bus.emit(SELLER_EVENT, this.state);
    }

    subscribe(cb: (state: SellerReviewsState) => void): () => void {
        return this.bus.on(SELLER_EVENT, cb);
    }
}

class MyReviewsStore {
    private state: MyReviewsState = {
        items: [],
        productIndex: new Map(),
        nextCursor: null,
        isLoading: false,
        isLoadingMore: false,
        isInitialised: false,
        error: null,
    };
    private bus = new EventBus();

    getState(): MyReviewsState {
        return { ...this.state, productIndex: new Map(this.state.productIndex) };
    }

    setState(patch: Partial<MyReviewsState>): void {
        this.state = { ...this.state, ...patch };
        this.bus.emit(MY_EVENT, this.state);
    }

    setItems(items: Review[], nextCursor: number | null): void {
        const productIndex = new Map<number, Review>();
        for (const r of items) {
            if (r.product?.id) productIndex.set(r.product.id, r);
        }
        this.state = {
            ...this.state,
            items,
            productIndex,
            nextCursor,
            isInitialised: true,
        };
        this.bus.emit(MY_EVENT, this.state);
    }

    appendItems(items: Review[], nextCursor: number | null): void {
        const productIndex = new Map(this.state.productIndex);
        for (const r of items) {
            if (r.product?.id) productIndex.set(r.product.id, r);
        }
        this.state = {
            ...this.state,
            items: [...this.state.items, ...items],
            productIndex,
            nextCursor,
        };
        this.bus.emit(MY_EVENT, this.state);
    }

    upsert(review: Review): void {
        const items = [...this.state.items];
        const idx = items.findIndex((r) => r.id === review.id);
        if (idx >= 0) {
            items[idx] = review;
        } else {
            items.unshift(review);
        }
        const productIndex = new Map(this.state.productIndex);
        if (review.product?.id) productIndex.set(review.product.id, review);
        this.state = { ...this.state, items, productIndex };
        this.bus.emit(MY_EVENT, this.state);
    }

    remove(reviewId: number): void {
        const target = this.state.items.find((r) => r.id === reviewId);
        const items = this.state.items.filter((r) => r.id !== reviewId);
        const productIndex = new Map(this.state.productIndex);
        if (target?.product?.id) productIndex.delete(target.product.id);
        this.state = { ...this.state, items, productIndex };
        this.bus.emit(MY_EVENT, this.state);
    }

    getByProduct(productId: number): Review | undefined {
        return this.state.productIndex.get(productId);
    }

    subscribe(cb: (state: MyReviewsState) => void): () => void {
        return this.bus.on(MY_EVENT, cb);
    }
}

class ReviewModalStore {
    private state: ReviewModalState = {
        isOpen: false,
        mode: 'create',
        adId: null,
        sellerId: null,
        reviewId: null,
        productTitle: '',
        productPhoto: '',
        sellerName: '',
        rating: 0,
        content: '',
        isSubmitting: false,
        error: null,
    };
    private bus = new EventBus();

    getState(): ReviewModalState {
        return { ...this.state };
    }

    setState(patch: Partial<ReviewModalState>): void {
        this.state = { ...this.state, ...patch };
        this.bus.emit(MODAL_EVENT, this.state);
    }

    reset(): void {
        this.state = {
            isOpen: false,
            mode: 'create',
            adId: null,
            sellerId: null,
            reviewId: null,
            productTitle: '',
            productPhoto: '',
            sellerName: '',
            rating: 0,
            content: '',
            isSubmitting: false,
            error: null,
        };
        this.bus.emit(MODAL_EVENT, this.state);
    }

    subscribe(cb: (state: ReviewModalState) => void): () => void {
        return this.bus.on(MODAL_EVENT, cb);
    }
}

export const sellerReviewsStore = new SellerReviewsStore();
export const myReviewsStore = new MyReviewsStore();
export const reviewModalStore = new ReviewModalStore();
