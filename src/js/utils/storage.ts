/**
 * Модуль для работы с localStorage
 * Сохраняет данные пользователя и настройки
 */

import type { User } from '@/types';

const KEYS = {
    USER: 'user',
    TOKEN: 'token',
    PREFERENCES: 'user_preferences',
} as const;

export class Storage {
    setItem(key: string, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    }

    getItem<T = any>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Ошибка чтения из localStorage:', e);
            return null;
        }
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }

    setUser(user: User | null): void {
        if (user) {
            this.setItem(KEYS.USER, user);
        } else {
            this.removeItem(KEYS.USER);
        }
    }

    getUser(): User | null {
        return this.getItem<User>(KEYS.USER);
    }

    removeUser(): void {
        this.removeItem(KEYS.USER);
        this.removeItem(KEYS.TOKEN);
    }

    isAuthenticated(): boolean {
        return this.getUser() !== null;
    }

    logout(): void {
        this.removeUser();
    }

    setToken(token: string): void {
        this.setItem(KEYS.TOKEN, token);
    }

    getToken(): string | null {
        return this.getItem<string>(KEYS.TOKEN);
    }

    removeToken(): void {
        this.removeItem(KEYS.TOKEN);
    }
}

// ✅ Создаём экземпляр
export const storage = new Storage();
