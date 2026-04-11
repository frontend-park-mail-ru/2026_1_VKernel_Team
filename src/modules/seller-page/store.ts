import { EventBus } from '@/core/eventBus';
import type { FormattedSellerProfile } from '@modules/seller-page/types';

export interface SellerPageState {
    profile: FormattedSellerProfile | null;
    activeAds: any[];
    closedAds: any[];
    error: string | null;
    isLoading: boolean;
}

class SellerPageStore {
    private state: SellerPageState = {
        profile: null,
        activeAds: [],
        closedAds: [],
        error: null,
        isLoading: false,
    };

    private eventBus: EventBus;

    constructor() {
        this.eventBus = new EventBus();
    }

    getState(): SellerPageState {
        return { ...this.state };
    }

    setState(newState: Partial<SellerPageState>): void {
        this.state = { ...this.state, ...newState };
        this.eventBus.emit('sellerPageStateChanged', this.state);
    }

    subscribe(callback: (state: SellerPageState) => void): () => void {
        return this.eventBus.on('sellerPageStateChanged', callback);
    }
}

export const sellerPageStore = new SellerPageStore();
