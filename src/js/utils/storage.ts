/**
 * Модуль для работы с локальным хранилищем браузера (localStorage)
 * Здесь сохраняем данные пользователя и проверяем авторизацию
 *
 * @module storage
 */

type UserPreferences = Record<string,any>;

/**
 * Объект с методами для сохранения и получения данных
 * Использует localStorage для долговременного хранения
 */
const Storage = {
    setItem(key: string, value: any) {
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

    removeItem(key: string) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    },

    setUserPreferences(prefs: UserPreferences) {
        this.setItem('user_preferences', prefs);
    },

    getUserPreferences(): UserPreferences {
        return this.getItem('user_preferences') || {};
    },

    setUser: undefined,
    getUser: undefined,
    removeUser: undefined,
    isAuthenticated: undefined,
    logout: undefined,
};

export { Storage };
