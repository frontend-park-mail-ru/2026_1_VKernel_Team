import template from '@modules/wallet/components/topup-modal/topup-modal.hbs';
import '@modules/common/components/modal/modal.scss';
import '@modules/wallet/components/topup-modal/topup-modal.scss';
import { walletService } from '@modules/wallet/service';
import { walletStore } from '@modules/wallet/store';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';

export const TopupModal = {
    _boundElement: null as HTMLElement | null,
    _idempotencyKey: '',

    getTemplate() {
        return template;
    },

    init(): void {
        const modal = document.getElementById('topupModal');
        if (!modal || modal === this._boundElement) return;
        this._boundElement = modal;

        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            if (target.closest('[data-action="close-topup"]')) {
                this.close();
                return;
            }

            if (target.closest('[data-action="confirm-topup"]')) {
                this.handleConfirm();
                return;
            }

            const quickBtn = target.closest('[data-quick-amount]');
            if (quickBtn) {
                const amount = (quickBtn as HTMLElement).dataset.quickAmount;
                const input = document.getElementById('topupAmountInput') as HTMLInputElement;
                if (input && amount) {
                    input.value = amount;
                }
                modal.querySelectorAll('.topup-quick-btn').forEach((btn) => {
                    btn.classList.toggle(
                        'active',
                        (btn as HTMLElement).dataset.quickAmount === amount,
                    );
                });
            }
        });

        const input = document.getElementById('topupAmountInput') as HTMLInputElement;
        if (input) {
            input.addEventListener('input', () => {
                modal.querySelectorAll('.topup-quick-btn').forEach((btn) => {
                    btn.classList.remove('active');
                });
            });
        }

        modal.addEventListener('mousedown', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    },

    open(): void {
        this._idempotencyKey = crypto.randomUUID();
        const modal = document.getElementById('topupModal');
        if (modal) {
            const input = document.getElementById('topupAmountInput') as HTMLInputElement;
            if (input) input.value = '';
            const error = document.getElementById('topupError');
            if (error) error.style.display = 'none';
            modal.querySelectorAll('.topup-quick-btn').forEach((btn) => {
                btn.classList.remove('active');
            });
            modal.style.display = 'flex';
        }
    },

    close(): void {
        const modal = document.getElementById('topupModal');
        if (modal) modal.style.display = 'none';
    },

    async handleConfirm(): Promise<void> {
        const input = document.getElementById('topupAmountInput') as HTMLInputElement;
        const errorEl = document.getElementById('topupError');
        const amount = parseInt(input?.value || '0', 10);

        if (!amount || amount <= 0) {
            if (errorEl) {
                errorEl.textContent = 'Введите сумму больше 0';
                errorEl.style.display = 'block';
            }
            return;
        }

        uiActions.showLoading(true);
        try {
            const res = await walletService.topup(amount, this._idempotencyKey);
            if (res.success && res.data) {
                walletStore.setState({
                    balance: res.data.balance,
                    error: null,
                });
                uiActions.showSuccess('Кошелёк пополнен');
                this.close();
                eventBus.emit('wallet:updated');
                await this.loadTransactions();
            } else {
                const errorMsg =
                    res.error === 'INVALID_AMOUNT'
                        ? 'Некорректная сумма'
                        : 'Не удалось пополнить кошелёк';
                if (errorEl) {
                    errorEl.textContent = errorMsg;
                    errorEl.style.display = 'block';
                }
            }
        } catch {
            if (errorEl) {
                errorEl.textContent = 'Ошибка сети';
                errorEl.style.display = 'block';
            }
        } finally {
            uiActions.showLoading(false);
        }
    },

    async loadTransactions(): Promise<void> {
        const res = await walletService.getTransactions(20);
        if (res.success && res.data) {
            walletStore.setState({
                transactions: res.data.items,
                nextCursor: res.data.next_cursor ?? null,
            });
            eventBus.emit('wallet:updated');
        }
    },
};
