import { walletService } from '@modules/wallet/service';
import { walletStore } from '@modules/wallet/store';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';
import {
    PAYMENT_STATUS_POLL_INTERVAL_MS,
    PAYMENT_STATUS_POLL_TIMEOUT_MS,
    TOPUP_PENDING_AMOUNT_KEY,
    TOPUP_PENDING_PAYMENT_KEY,
} from '@modules/wallet/config';
import type { PaymentStatus } from '@modules/wallet/types';

export type PollResult =
    | { status: 'succeeded'; amount: number }
    | { status: 'failed' | 'cancelled' }
    | { status: 'timeout' };

interface PollOptions {
    intervalMs?: number;
    timeoutMs?: number;
}

// pollPaymentStatus периодически дёргает GET /wallet/payments/{id} пока статус не
// станет терминальным или не истечёт таймаут. Возвращает финальный результат.
async function pollPaymentStatus(paymentId: number, opts: PollOptions = {}): Promise<PollResult> {
    const interval = opts.intervalMs ?? PAYMENT_STATUS_POLL_INTERVAL_MS;
    const timeout = opts.timeoutMs ?? PAYMENT_STATUS_POLL_TIMEOUT_MS;
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
        const res = await walletService.getPaymentStatus(paymentId);
        if (res.success && res.data) {
            const status: PaymentStatus = res.data.status;
            if (status === 'succeeded') {
                return { status: 'succeeded', amount: res.data.amount };
            }
            if (status === 'failed' || status === 'cancelled') {
                return { status };
            }
        }
        await sleep(interval);
    }
    return { status: 'timeout' };
}

function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

function clearPendingPayment(): void {
    sessionStorage.removeItem(TOPUP_PENDING_PAYMENT_KEY);
    sessionStorage.removeItem(TOPUP_PENDING_AMOUNT_KEY);
}

function getPendingPaymentId(): number | null {
    const raw = sessionStorage.getItem(TOPUP_PENDING_PAYMENT_KEY);
    if (!raw) return null;
    const id = Number.parseInt(raw, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
}

function getPendingAmount(): number {
    const raw = sessionStorage.getItem(TOPUP_PENDING_AMOUNT_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
}

// markPending выставляет в стор баннер «Ожидаем подтверждение от банка»
// и эмитит wallet:updated, чтобы вкладка кошелька перерендерилась с баннером.
function markPending(paymentId: number, amount: number): void {
    walletStore.setState({ pendingTopup: { paymentId, amount } });
    eventBus.emit('wallet:updated');
}

// finalizePending очищает sessionStorage, снимает баннер, обновляет баланс
// и подгружает свежий список транзакций (чтобы появилась строка пополнения).
async function finalizePending(): Promise<void> {
    clearPendingPayment();
    walletStore.setState({ pendingTopup: null });

    await walletStore.fetchBalance();
    const txRes = await walletService.getTransactions(20);
    if (txRes.success && txRes.data) {
        walletStore.setState({
            transactions: txRes.data.items,
            nextCursor: txRes.data.next_cursor ?? null,
        });
    }

    eventBus.emit('wallet:updated');
}

// handleTopupReturn вызывается при заходе на /profile?tab=wallet&topup=done.
// Показывает баннер ожидания, поллит статус, при успехе перерендеривает
// кошелёк (свежий баланс + новая строка в истории операций).
async function handleTopupReturn(): Promise<void> {
    const paymentId = getPendingPaymentId();
    if (!paymentId) {
        return;
    }

    markPending(paymentId, getPendingAmount());

    const result = await pollPaymentStatus(paymentId);

    if (result.status === 'succeeded') {
        await finalizePending();
        uiActions.showSuccess(`Зачислено ${result.amount.toLocaleString('ru-RU')} ₽`);
        return;
    }

    if (result.status === 'failed' || result.status === 'cancelled') {
        clearPendingPayment();
        walletStore.setState({ pendingTopup: null });
        eventBus.emit('wallet:updated');
        uiActions.showError('Оплата не прошла');
        return;
    }

    // timeout: webhook ещё не дошёл / reconciler подберёт позже. Баннер
    // оставляем на странице — юзер видит, что платёж в обработке. При
    // следующем заходе на /wallet silentPollPendingPayment подберёт статус.
}

// silentPollPendingPayment вызывается при обычном заходе на /wallet (без query-param):
// если у юзера лежит незавершённый payment_id в sessionStorage — показываем баннер
// ожидания, тихо чекаем статус один раз и перерендериваем при необходимости.
async function silentPollPendingPayment(): Promise<void> {
    const paymentId = getPendingPaymentId();
    if (!paymentId) return;

    markPending(paymentId, getPendingAmount());

    const res = await walletService.getPaymentStatus(paymentId);
    if (!res.success || !res.data) {
        return;
    }
    if (res.data.status === 'succeeded') {
        await finalizePending();
    } else if (res.data.status === 'failed' || res.data.status === 'cancelled') {
        clearPendingPayment();
        walletStore.setState({ pendingTopup: null });
        eventBus.emit('wallet:updated');
    }
    // pending — оставляем баннер, попробуем при следующем заходе
}

export { handleTopupReturn, silentPollPendingPayment, clearPendingPayment, getPendingPaymentId };
