/**
 * Сохранение и восстановление пути, на который пользователь хотел попасть
 * до того, как был отправлен на /login (или /register).
 *
 * Используется sessionStorage, чтобы значение не пережило закрытие вкладки.
 */

const RETURN_TO_KEY = 'clover_return_to';

const isSafePath = (path: string): boolean => {
    if (!path || typeof path !== 'string') return false;
    if (!path.startsWith('/')) return false;
    if (path.startsWith('//')) return false;
    if (path === '/login' || path === '/register') return false;
    return true;
};

export const saveReturnTo = (path?: string): void => {
    try {
        const target = path ?? window.location.pathname + window.location.search;
        if (!isSafePath(target)) return;
        sessionStorage.setItem(RETURN_TO_KEY, target);
    } catch {
        // sessionStorage может быть заблокирован — просто игнорируем
    }
};

export const consumeReturnTo = (): string | null => {
    try {
        const value = sessionStorage.getItem(RETURN_TO_KEY);
        sessionStorage.removeItem(RETURN_TO_KEY);
        return value && isSafePath(value) ? value : null;
    } catch {
        return null;
    }
};

export const peekReturnTo = (): string | null => {
    try {
        const value = sessionStorage.getItem(RETURN_TO_KEY);
        return value && isSafePath(value) ? value : null;
    } catch {
        return null;
    }
};
