import { EventBus } from '@/core/eventBus';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import { walletService } from './service';
import type { Transaction, WalletState } from './types';

const WALLET_BALANCE_STORE = 'wallet-balance';
const WALLET_TRANSACTIONS_STORE = 'wallet-transactions';

class WalletStore {
    private state: WalletState = {
        balance: 0,
        currency: 'RUB',
        transactions: [],
        nextCursor: null,
        error: null,
        isLoading: false,
    };

    private eventBus: EventBus;

    constructor() {
        this.eventBus = new EventBus();
    }

    getState(): WalletState {
        return { ...this.state };
    }

    setState(newState: Partial<WalletState>): void {
        this.state = { ...this.state, ...newState };
        this.eventBus.emit('walletStateChanged', this.state);

        if (newState.balance !== undefined) {
            this.persistBalance(this.state.balance, this.state.currency);
        }
        if (newState.transactions !== undefined) {
            this.persistTransactions(this.state.transactions);
        }
    }

    async loadFromCache(): Promise<boolean> {
        try {
            const balanceData = await cloverDB.getAll<{ currency: string; balance: number }>(
                WALLET_BALANCE_STORE,
            );
            if (balanceData.length > 0) {
                this.state = {
                    ...this.state,
                    balance: balanceData[0].balance,
                    currency: balanceData[0].currency || 'RUB',
                    isLoading: false,
                };
            }

            const transactions = await cloverDB.getAll<Transaction>(WALLET_TRANSACTIONS_STORE);
            if (transactions.length > 0) {
                this.state = { ...this.state, transactions };
            }

            this.eventBus.emit('walletStateChanged', this.state);
            return balanceData.length > 0;
        } catch {
            return false;
        }
    }

    subscribe(callback: (state: WalletState) => void): () => void {
        return this.eventBus.on('walletStateChanged', callback);
    }

    async fetchBalance(): Promise<void> {
        try {
            const res = await walletService.getBalance();
            if (res.success && res.data) {
                this.setState({ balance: res.data.balance, isLoading: false });
            }
        } catch {
            // silent
        }
    }

    private async persistBalance(balance: number, currency: string): Promise<void> {
        try {
            await cloverDB.put(WALLET_BALANCE_STORE, { currency, balance });
        } catch {
            // IndexedDB unavailable — silent fallback
        }
    }

    private async persistTransactions(transactions: Transaction[]): Promise<void> {
        try {
            await cloverDB.replaceAll(WALLET_TRANSACTIONS_STORE, transactions);
        } catch {
            // IndexedDB unavailable — silent fallback
        }
    }
}

export const walletStore = new WalletStore();
