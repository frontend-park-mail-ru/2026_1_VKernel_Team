import template from '@modules/promotion/components/promote-modal/promote-modal.hbs';
import '@modules/promotion/components/promote-modal/promote-modal.scss';
import { createBaseModal } from '@modules/common/components/modal/modal';
import { promotionService } from '@modules/promotion/service';
import { promotionStore } from '@modules/promotion/store';
import { walletStore } from '@modules/wallet/store';
import { walletService } from '@modules/wallet/service';
import { TopupModal } from '@modules/wallet/components/topup-modal/topup-modal';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';

const PLAN_LABELS: Record<string, string> = {
    boost_1d: 'Поднятие на 1 день',
    boost_7d: 'Поднятие на 7 дней',
    highlight_1d: 'Выделение на 1 день',
    highlight_7d: 'Выделение на 7 дней',
};

const base = createBaseModal({ id: 'promoteModal' });

function buildTemplateData() {
    const state = promotionStore.getState();
    const walletState = walletStore.getState();
    const plans = state.plans;
    return {
        plans,
        boostPlans: plans.filter((p) => p.kind === 'boost'),
        highlightPlans: plans.filter((p) => p.kind === 'highlight'),
        formattedBalance: walletState.balance.toLocaleString('ru-RU') + ' ₽',
    };
}

function ensureContainer(): HTMLElement {
    let root = document.getElementById('modal-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'modal-root';
        document.getElementById('app')?.appendChild(root);
    }
    return root;
}

export const PromoteModal = {
    _boundElement: null as HTMLElement | null,
    _selectedPlanCode: null as string | null,
    _selectedPlanPrice: 0,
    _adId: null as number | string | null,
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

            if (target.closest('[data-action="go-to-step2"]')) {
                this.goToStep2();
                return;
            }

            if (target.closest('[data-action="go-to-step1"]')) {
                this.goToStep1();
                return;
            }

            if (target.closest('[data-action="confirm-promote"]')) {
                this.handleConfirm();
                return;
            }

            const planBtn = target.closest('[data-plan-code]');
            if (planBtn) {
                this.selectPlan(planBtn as HTMLElement);
            }
        });
    },

    selectPlan(btn: HTMLElement): void {
        const modal = base.getElement();
        if (!modal) return;

        this._selectedPlanCode = btn.dataset.planCode || null;
        this._selectedPlanPrice = parseInt(btn.dataset.planPrice || '0', 10);

        modal.querySelectorAll('.promote-plan-btn').forEach((b) => {
            b.classList.toggle(
                'active',
                (b as HTMLElement).dataset.planCode === this._selectedPlanCode,
            );
        });

        const nextBtn = modal.querySelector('[data-action="go-to-step2"]') as HTMLButtonElement;
        if (nextBtn) nextBtn.disabled = !this._selectedPlanCode;
    },

    async open(adId: number | string): Promise<void> {
        this._adId = adId;
        this._selectedPlanCode = null;
        this._selectedPlanPrice = 0;
        this._idempotencyKey = '';

        await this.loadPlans();

        const container = ensureContainer();
        const existing = document.getElementById('promoteModal');
        if (existing) {
            existing.outerHTML = template(buildTemplateData());
        } else {
            container.insertAdjacentHTML('beforeend', template(buildTemplateData()));
        }

        this._boundElement = null;
        this.init();
        base.open();
    },

    close(): void {
        base.close();
    },

    async loadPlans(): Promise<void> {
        const res = await promotionService.getPlans();
        if (res.success && res.data) {
            promotionStore.setState({ plans: res.data });
        }
    },

    showStep(step: number): void {
        const step1 = document.getElementById('promoteStep1');
        const step2 = document.getElementById('promoteStep2');
        if (step1) step1.style.display = step === 1 ? '' : 'none';
        if (step2) step2.style.display = step === 2 ? '' : 'none';
    },

    goToStep2(): void {
        if (!this._selectedPlanCode) return;

        const confirmPlan = document.getElementById('promoteConfirmPlan');
        const confirmPrice = document.getElementById('promoteConfirmPrice');
        if (confirmPlan)
            confirmPlan.textContent = PLAN_LABELS[this._selectedPlanCode] || this._selectedPlanCode;
        if (confirmPrice) confirmPrice.textContent = this._selectedPlanPrice + ' ₽';

        const confirmError = document.getElementById('promoteConfirmError');
        if (confirmError) confirmError.style.display = 'none';

        this.showStep(2);
    },

    goToStep1(): void {
        this.showStep(1);
    },

    async handleConfirm(): Promise<void> {
        if (!this._adId || !this._selectedPlanCode) return;

        if (!this._idempotencyKey) {
            this._idempotencyKey = crypto.randomUUID();
        }

        const confirmError = document.getElementById('promoteConfirmError');
        uiActions.showLoading(true);

        try {
            const res = await promotionService.purchasePromo(
                this._adId,
                this._selectedPlanCode,
                this._idempotencyKey,
            );

            if (res.success && res.data) {
                walletStore.setState({ balance: res.data.wallet_balance });
                promotionStore.setAdPromotions(
                    typeof this._adId === 'string' ? parseInt(this._adId, 10) : this._adId,
                    [res.data.promotion],
                );
                uiActions.showSuccess('Объявление продвинуто');
                this.close();
                eventBus.emit('promotion:purchased');
                eventBus.emit('wallet:updated');
            } else {
                const errorCode = res.error || '';

                if (errorCode === 'INSUFFICIENT_FUNDS') {
                    await this.handleInsufficientFunds();
                    return;
                }

                const messages: Record<string, string> = {
                    PLAN_NOT_FOUND: 'Тариф не найден',
                    PLAN_INACTIVE: 'Тариф временно недоступен',
                    INVALID_AD_STATUS: 'Объявление нельзя продвигать',
                    NOT_AD_OWNER: 'Можно продвигать только свои объявления',
                    AD_NOT_FOUND: 'Объявление не найдено',
                };
                const msg = messages[errorCode] || 'Не удалось продвинуть объявление';
                if (confirmError) {
                    confirmError.textContent = msg;
                    confirmError.style.display = 'block';
                }
            }
        } catch {
            if (confirmError) {
                confirmError.textContent = 'Ошибка сети';
                confirmError.style.display = 'block';
            }
        } finally {
            uiActions.showLoading(false);
        }
    },

    async handleInsufficientFunds(): Promise<void> {
        this.close();

        const balanceRes = await walletService.getBalance();
        const currentBalance = balanceRes.success && balanceRes.data ? balanceRes.data.balance : 0;
        const deficit = this._selectedPlanPrice - currentBalance;

        if (deficit > 0) {
            TopupModal.openWithAmount(deficit);
        } else {
            TopupModal.open();
        }

        const onWalletUpdated = async () => {
            eventBus.off('wallet:updated', onWalletUpdated);

            this._idempotencyKey = crypto.randomUUID();
            await this.open(this._adId!);
            this.showStep(2);

            const confirmPlan = document.getElementById('promoteConfirmPlan');
            const confirmPrice = document.getElementById('promoteConfirmPrice');
            if (confirmPlan)
                confirmPlan.textContent =
                    PLAN_LABELS[this._selectedPlanCode!] || this._selectedPlanCode;
            if (confirmPrice) confirmPrice.textContent = this._selectedPlanPrice + ' ₽';
        };

        eventBus.on('wallet:updated', onWalletUpdated);
    },
};

(window as any).__PromoteModal = PromoteModal;
