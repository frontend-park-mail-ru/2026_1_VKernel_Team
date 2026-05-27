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

// handleTopupReturn вызывается при заходе на /wallet с ?topup=done. Дожидается
// результата на бэке, показывает тост, обновляет баланс.
async function handleTopupReturn(): Promise<void> {
    const paymentId = getPendingPaymentId();
    if (!paymentId) {
        return;
    }

    uiActions.showInfo('Ожидаем подтверждение от банка…');
    const result = await pollPaymentStatus(paymentId);

    if (result.status === 'succeeded') {
        await walletStore.fetchBalance();
        uiActions.showSuccess(`Зачислено ${result.amount.toLocaleString('ru-RU')} ₽`);
        eventBus.emit('wallet:updated');
        clearPendingPayment();
    } else if (result.status === 'failed' || result.status === 'cancelled') {
        uiActions.showError('Оплата не прошла');
        clearPendingPayment();
    } else {
        // timeout: webhook ещё не дошёл / reconciler подберёт позже
        uiActions.showInfo(
            'Платёж обрабатывается. Баланс обновится автоматически в течение нескольких минут.',
        );
        // sessionStorage НЕ чистим — при следующем заходе на /wallet поллинг
        // пройдёт ещё раз и подберёт финальный статус.
    }
}

// silentPollPendingPayment вызывается при обычном заходе на /wallet (без query-param):
// если у юзера лежит незавершённый payment_id в sessionStorage — тихо чекнем его
// статус один раз и обновим баланс, если зачислился.
async function silentPollPendingPayment(): Promise<void> {
    const paymentId = getPendingPaymentId();
    if (!paymentId) return;

    const res = await walletService.getPaymentStatus(paymentId);
    if (!res.success || !res.data) {
        return;
    }
    if (res.data.status === 'succeeded') {
        await walletStore.fetchBalance();
        eventBus.emit('wallet:updated');
        clearPendingPayment();
    } else if (res.data.status === 'failed' || res.data.status === 'cancelled') {
        clearPendingPayment();
    }
    // pending — оставляем, попробуем при следующем заходе
}

export { handleTopupReturn, silentPollPendingPayment, clearPendingPayment, getPendingPaymentId };
