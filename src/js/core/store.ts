import { EventBus } from '@/core/eventBus';
import { storage } from '@/utils/storage';
import type { User } from '@/types';

export interface AppState {
    isAuthenticated: boolean;
    user: User | null;
    ads: any[];
    currentPage: string;
    error: string | null;
    isLoading: boolean; // Добавлено
}

class Store {
    private state: AppState = {
        isAuthenticated: storage.isAuthenticated(),
        user: storage.getUser(),
        ads: [],
        currentPage: 'main-page',
        error: null,
        isLoading: false, // Добавлено
    };

    private eventBus: EventBus;

    constructor() {
        this.eventBus = new EventBus();
    }

    getState(): AppState {
        return { ...this.state };
    }

    setState(newState: Partial<AppState>): void {
        this.state = { ...this.state, ...newState };

        // Персистим user в localStorage при изменении auth-данных
        if ('user' in newState || 'isAuthenticated' in newState) {
            storage.setUser(this.state.user);
        }

        this.eventBus.emit('stateChanged', this.state);
    }

    subscribe(callback: (state: AppState) => void): () => void {
        return this.eventBus.on('stateChanged', callback);
    }

    get isAuthenticated(): boolean {
        return this.state.isAuthenticated;
    }
    get user(): User | null {
        return this.state.user;
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
    get isLoading(): boolean {
        return this.state.isLoading;
    } // Добавлено
}

export const store = new Store();
