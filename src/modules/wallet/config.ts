export const WALLET_API_ENDPOINTS = {
    GET_BALANCE: '/wallet',
    GET_TRANSACTIONS: '/wallet/transactions',
    TOPUP: '/wallet/topup',
    GET_PAYMENT_STATUS: '/wallet/payments',
};

// Ключи, которыми мы помечаем pending-платежи в sessionStorage. После редиректа на
// return_url фронт по этому ключу понимает, какой платёж поллить.
export const TOPUP_PENDING_PAYMENT_KEY = 'topup_pending_payment_id';
export const TOPUP_PENDING_AMOUNT_KEY = 'topup_pending_amount';

// Параметры поллинга статуса платежа после возврата с return_url ЮКассы.
export const PAYMENT_STATUS_POLL_INTERVAL_MS = 2000;
export const PAYMENT_STATUS_POLL_TIMEOUT_MS = 30000;
