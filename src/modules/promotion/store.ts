import { EventBus } from '@/core/eventBus';
import type { ActivePromotion, PromotionState, PromoHistoryItem } from './types';

class PromotionStore {
    private state: PromotionState = {
        plans: [],
        adPromotions: {},
        userHistory: [],
        nextCursor: null,
        isLoading: false,
        error: null,
    };

    private eventBus: EventBus;

    constructor() {
        this.eventBus = new EventBus();
    }

    getState(): PromotionState {
        return { ...this.state };
    }

    setState(newState: Partial<PromotionState>): void {
        this.state = { ...this.state, ...newState };
        this.eventBus.emit('promotionStateChanged', this.state);
    }

    setAdPromotions(adId: number, promotions: ActivePromotion[]): void {
        this.state = {
            ...this.state,
            adPromotions: { ...this.state.adPromotions, [adId]: promotions },
        };
        this.eventBus.emit('promotionStateChanged', this.state);
    }

    appendHistory(items: PromoHistoryItem[], nextCursor: number | null): void {
        this.state = {
            ...this.state,
            userHistory: [...this.state.userHistory, ...items],
            nextCursor,
        };
        this.eventBus.emit('promotionStateChanged', this.state);
    }

    resetHistory(): void {
        this.state = {
            ...this.state,
            userHistory: [],
            nextCursor: null,
        };
    }

    subscribe(callback: (state: PromotionState) => void): () => void {
        return this.eventBus.on('promotionStateChanged', callback);
    }
}

export const promotionStore = new PromotionStore();
