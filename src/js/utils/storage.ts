/**
 * Модуль для работы с локальным хранилищем браузера (localStorage)
 * Здесь сохраняем данные пользователя и проверяем авторизацию
 * 
 * @module storage
 */

/**
 * Объект с методами для сохранения и получения данных
 * Использует localStorage для долговременного хранения
 */
const Storage = {
    setItem(key: string, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    },

    getItem<T = any>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    },

    removeItem(key: string): void {
        localStorage.removeItem(key);
    },

    clear(): void {
        localStorage.clear();
    },

    setUserPreferences(prefs: any): void {
        this.setItem('user_preferences', prefs);
    },

    getUserPreferences(): any {
        return this.getItem('user_preferences') || {};
    },

    setUser: undefined as ((user: any) => void) | undefined,
    getUser: undefined as (() => any) | undefined,
    removeUser: undefined as (() => void) | undefined,
    isAuthenticated: undefined as (() => boolean) | undefined,
    logout: undefined as (() => void) | undefined
};

export { Storage };