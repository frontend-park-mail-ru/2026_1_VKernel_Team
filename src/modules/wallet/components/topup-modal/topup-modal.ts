import template from '@modules/wallet/components/topup-modal/topup-modal.hbs';
import '@modules/wallet/components/topup-modal/topup-modal.scss';
import { createBaseModal } from '@modules/common/components/modal/modal';
import { walletService } from '@modules/wallet/service';
import { walletStore } from '@modules/wallet/store';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';

function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
        return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
}

function validateCardFields(): { valid: boolean; error: string } {
    const cardNumber =
        (document.getElementById('topupCardNumber') as HTMLInputElement)?.value.replace(
            /\s/g,
            '',
        ) || '';
    const expiry = (document.getElementById('topupCardExpiry') as HTMLInputElement)?.value || '';
    const cvv = (document.getElementById('topupCardCvv') as HTMLInputElement)?.value || '';

    if (cardNumber.length < 16 || cardNumber.length > 19) {
        return { valid: false, error: 'Номер карты: 16–19 цифр' };
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return { valid: false, error: 'Срок действия: ММ/ГГ' };
    }
    const month = parseInt(expiry.slice(0, 2), 10);
    if (month < 1 || month > 12) {
        return { valid: false, error: 'Месяц: 01–12' };
    }
    if (!/^\d{3}$/.test(cvv)) {
        return { valid: false, error: 'CVV/CVC: 3 цифры' };
    }
    return { valid: true, error: '' };
}

const base = createBaseModal({ id: 'topupModal' });

export const TopupModal = {
    _boundElement: null as HTMLElement | null,
    _idempotencyKey: '',

    getTemplate() {
        return template;
    },

    init(): void {
        const modal = base.getElement();
        if (!modal || modal === this._boundElement) return;
        this._boundElement = modal;

        base.bindBaseEvents(() => this.close());

        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            if (target.closest('[data-action="go-to-step2"]')) {
                this.goToStep2();
                return;
            }

            if (target.closest('[data-action="go-to-step1"]')) {
                this.goToStep1();
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

        const cardNumberInput = document.getElementById('topupCardNumber') as HTMLInputElement;
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', () => {
                const pos = cardNumberInput.selectionStart || 0;
                const before = cardNumberInput.value;
                cardNumberInput.value = formatCardNumber(cardNumberInput.value);
                const diff = cardNumberInput.value.length - before.length;
                cardNumberInput.setSelectionRange(pos + diff, pos + diff);
            });
        }

        const expiryInput = document.getElementById('topupCardExpiry') as HTMLInputElement;
        if (expiryInput) {
            expiryInput.addEventListener('input', () => {
                expiryInput.value = formatExpiry(expiryInput.value);
            });
        }

        const cvvInput = document.getElementById('topupCardCvv') as HTMLInputElement;
        if (cvvInput) {
            cvvInput.addEventListener('input', () => {
                cvvInput.value = cvvInput.value.replace(/\D/g, '').slice(0, 3);
            });
        }

        const amountInput = document.getElementById('topupAmountInput') as HTMLInputElement;
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                modal.querySelectorAll('.topup-quick-btn').forEach((btn) => {
                    btn.classList.remove('active');
                });
            });
        }
    },

    open(): void {
        this._idempotencyKey = crypto.randomUUID();
        const modal = base.getElement();
        if (modal) {
            const cardNumber = document.getElementById('topupCardNumber') as HTMLInputElement;
            const expiry = document.getElementById('topupCardExpiry') as HTMLInputElement;
            const cvv = document.getElementById('topupCardCvv') as HTMLInputElement;
            const amountInput = document.getElementById('topupAmountInput') as HTMLInputElement;
            if (cardNumber) cardNumber.value = '';
            if (expiry) expiry.value = '';
            if (cvv) cvv.value = '';
            if (amountInput) amountInput.value = '';

            const cardError = document.getElementById('topupCardError');
            if (cardError) cardError.style.display = 'none';
            const error = document.getElementById('topupError');
            if (error) error.style.display = 'none';

            modal.querySelectorAll('.topup-quick-btn').forEach((btn) => {
                btn.classList.remove('active');
            });

            this.showStep(1);
            base.open();
        }
    },

    close(): void {
        base.close();
    },

    showStep(step: number): void {
        const step1 = document.getElementById('topupStep1');
        const step2 = document.getElementById('topupStep2');
        if (step1) step1.style.display = step === 1 ? '' : 'none';
        if (step2) step2.style.display = step === 2 ? '' : 'none';
    },

    goToStep2(): void {
        const validation = validateCardFields();
        if (!validation.valid) {
            const errorEl = document.getElementById('topupCardError');
            if (errorEl) {
                errorEl.textContent = validation.error;
                errorEl.style.display = 'block';
            }
            return;
        }
        const cardError = document.getElementById('topupCardError');
        if (cardError) cardError.style.display = 'none';
        this.showStep(2);
    },

    goToStep1(): void {
        this.showStep(1);
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
