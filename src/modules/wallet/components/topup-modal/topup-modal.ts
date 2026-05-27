import template from '@modules/wallet/components/topup-modal/topup-modal.hbs';
import '@modules/wallet/components/topup-modal/topup-modal.scss';
import { createBaseModal } from '@modules/common/components/modal/modal';
import { walletService } from '@modules/wallet/service';
import { walletStore } from '@modules/wallet/store';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';
import { TOPUP_PENDING_AMOUNT_KEY, TOPUP_PENDING_PAYMENT_KEY } from '@modules/wallet/config';

const base = createBaseModal({ id: 'topupModal' });

// TopupModal — модалка пополнения кошелька. Собирает только сумму.
// Реальные данные карты собираются на стороне ЮКассы (PCI DSS — не касаемся PAN).
//
// Flow:
//   1. Юзер вводит сумму, жмёт «Перейти к оплате».
//   2. POST /wallet/topup. Если бэк ответил succeeded (mock-провайдер в dev)
//      — закрываем модалку, тост, обновляем баланс.
//   3. Если бэк ответил pending + confirmation_url (ЮКасса) — сохраняем
//      payment_id в sessionStorage и редиректим на confirmation_url.
//      Дальше юзер платит у ЮКассы, возвращается на /wallet?topup=done.
//      Обработка возврата живёт в @modules/wallet/payment-polling.
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

        base.resetBound();
        base.bindBaseEvents(() => this.close());

        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            if (target.closest('[data-action="scroll-left"]')) {
                const container = modal.querySelector('.topup-quick-amounts');
                if (container) container.scrollBy({ left: -120, behavior: 'smooth' });
                return;
            }

            if (target.closest('[data-action="scroll-right"]')) {
                const container = modal.querySelector('.topup-quick-amounts');
                if (container) container.scrollBy({ left: 120, behavior: 'smooth' });
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

        const amountInput = document.getElementById('topupAmountInput') as HTMLInputElement;
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                amountInput.value = amountInput.value.replace(/\D/g, '');
                modal.querySelectorAll('.topup-quick-btn').forEach((btn) => {
                    btn.classList.remove('active');
                });
            });
        }
    },

    open(): void {
        this._idempotencyKey = crypto.randomUUID();
        const modal = base.getElement();
        if (!modal) return;

        const amountInput = document.getElementById('topupAmountInput') as HTMLInputElement;
        if (amountInput) amountInput.value = '';

        const error = document.getElementById('topupError');
        if (error) error.classList.remove('topup-error--visible');

        modal.querySelectorAll('.topup-quick-btn').forEach((btn) => {
            btn.classList.remove('active');
        });

        this.showStep('amount');
        base.open();
    },

    openWithAmount(amount: number): void {
        this.open();
        const amountInput = document.getElementById('topupAmountInput') as HTMLInputElement;
        if (amountInput) amountInput.value = String(amount);
    },

    close(): void {
        base.close();
    },

    showStep(step: 'amount' | 'loading'): void {
        const amountStep = document.getElementById('topupStepAmount');
        const loadingStep = document.getElementById('topupStepLoading');
        if (amountStep) amountStep.style.display = step === 'amount' ? '' : 'none';
        if (loadingStep) loadingStep.style.display = step === 'loading' ? '' : 'none';
    },

    async handleConfirm(): Promise<void> {
        const input = document.getElementById('topupAmountInput') as HTMLInputElement;
        const errorEl = document.getElementById('topupError');
        const amount = parseInt(input?.value || '0', 10);

        if (!amount || amount <= 0) {
            if (errorEl) {
                errorEl.textContent = 'Введите сумму больше 0';
                errorEl.classList.add('topup-error--visible');
            }
            return;
        }

        this.showStep('loading');

        try {
            const res = await walletService.topup(amount, this._idempotencyKey);

            if (!res.success || !res.data) {
                this.showStep('amount');
                const errorMsg =
                    res.error === 'INVALID_AMOUNT'
                        ? 'Некорректная сумма'
                        : 'Не удалось пополнить кошелёк';
                if (errorEl) {
                    errorEl.textContent = errorMsg;
                    errorEl.classList.add('topup-error--visible');
                }
                return;
            }

            const data = res.data;

            // Асинхронный провайдер (ЮКасса): редиректим юзера на confirmation_url.
            // Сохраняем payment_id в sessionStorage, чтобы после возврата на /wallet
            // знать, какой платёж поллить (см. modules/wallet/payment-polling).
            if (data.status === 'pending' && data.confirmation_url) {
                sessionStorage.setItem(TOPUP_PENDING_PAYMENT_KEY, String(data.payment_id));
                sessionStorage.setItem(TOPUP_PENDING_AMOUNT_KEY, String(amount));
                window.location.href = data.confirmation_url;
                return;
            }

            // Синхронный провайдер (mock в dev / idempotency-hit): баланс уже зачислен.
            if (data.status === 'succeeded') {
                walletStore.setState({ balance: data.balance, error: null });
                this.close();
                uiActions.showSuccess(`Кошелёк пополнен на ${amount} ₽`);
                eventBus.emit('wallet:updated');
                await this.loadTransactions();
                return;
            }

            // failed / cancelled.
            this.showStep('amount');
            if (errorEl) {
                errorEl.textContent = 'Оплата не прошла. Попробуйте ещё раз';
                errorEl.classList.add('topup-error--visible');
            }
        } catch {
            this.showStep('amount');
            if (errorEl) {
                errorEl.textContent = 'Ошибка сети';
                errorEl.classList.add('topup-error--visible');
            }
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
