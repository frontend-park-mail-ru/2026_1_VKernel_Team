import '@modules/wallet/components/wallet-tab/wallet-tab.scss';
import template from '@modules/wallet/components/wallet-tab/wallet-tab.hbs';
import { walletService } from '@modules/wallet/service';
import { walletStore } from '@modules/wallet/store';
import { TopupModal } from '@modules/wallet/components/topup-modal/topup-modal';
import { createBaseModal } from '@modules/common/components/modal/modal';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';

declare const Handlebars: any;

export const WalletTab = {
    _boundElement: null as HTMLElement | null,
    _unsubscribers: [] as Array<() => void>,
    _clickHandler: null as ((e: Event) => void) | null,
    _eventBusSubscribed: false,

    getTemplate() {
        return template;
    },

    init(): void {
        const openTopupBtn = document.querySelector('[data-action="open-topup"]');
        if (!openTopupBtn) return;
        const content = document.getElementById('tabContent');
        if (!content) return;
        if (content === this._boundElement) return;
        this._boundElement = content;

        TopupModal.init();

        if (!this._eventBusSubscribed) {
            this._eventBusSubscribed = true;
            this._unsubscribers.push(
                eventBus.on('wallet:updated', () => {
                    if (this._boundElement) {
                        this.rerender();
                    }
                }),
            );
        }

        if (this._clickHandler) {
            content.removeEventListener('click', this._clickHandler);
        }
        this._clickHandler = (e: Event) => {
            const target = e.target as HTMLElement;

            if (target.closest('[data-action="open-topup"]')) {
                TopupModal.open();
                return;
            }

            if (target.closest('[data-action="wallet-load-more"]')) {
                this.loadMore();
            }
        };
        content.addEventListener('click', this._clickHandler);
    },

    rerender(): void {
        const contentEl = document.getElementById('tabContent');
        if (!contentEl) return;

        const modalEl = document.getElementById('topupModal');
        const isModalOpen = modalEl && modalEl.style.display !== 'none';

        const walletEl = contentEl.querySelector('.wallet-tab-content');
        if (walletEl) {
            const state = walletStore.getState();
            const templateData = this.buildTemplateData(state);
            const temp = document.createElement('div');
            temp.innerHTML = template(templateData);
            const newWallet = temp.querySelector('.wallet-tab-content');
            if (newWallet) {
                walletEl.replaceWith(newWallet);
            }
        }

        this._boundElement = null;
        this.init();
        if (!isModalOpen) TopupModal.init();
    },

    buildTemplateData(state: ReturnType<typeof walletStore.getState>) {
        return {
            formattedBalance:
                state.balance === 0 ? '0 ₽' : `${state.balance.toLocaleString('ru-RU')} ₽`,
            transactions: state.transactions.map((tx) => ({
                ...tx,
                formattedAmount:
                    tx.type === 'topup'
                        ? `${tx.amount.toLocaleString('ru-RU')} ₽`
                        : `${Math.abs(tx.amount).toLocaleString('ru-RU')} ₽`,
            })),
            nextCursor: state.nextCursor,
        };
    },

    async loadMore(): Promise<void> {
        const state = walletStore.getState();
        if (!state.nextCursor) return;

        const res = await walletService.getTransactions(20, state.nextCursor);
        if (res.success && res.data) {
            walletStore.setState({
                transactions: [...state.transactions, ...res.data.items],
                nextCursor: res.data.next_cursor ?? null,
            });
            this.rerender();
        }
    },
};
