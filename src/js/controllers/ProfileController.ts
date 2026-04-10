/**
 * Контроллер профиля пользователя
 * НЕ импортирует AppController — разрываем цикл!
 */

import { store } from '@/core/store';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

export const ProfileController = {
    templates: {} as Record<string, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
    },

    showProfile(): void {
        document.body.classList.add('auth-page');

        const app = document.getElementById('app');
        const template = this.templates['user-profile'];
        if (!app || !template) return;

        const user = store.user;

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            email: user?.email || 'Неизвестно',
            name: user?.name || user?.email?.split('@')[0] || 'Пользователь',
            registeredAt: user?.created_at
                ? new Date(user.created_at).toLocaleDateString('ru-RU')
                : 'неизвестно',
            avatar: this.UI_CONSTANTS.DEFAULT_AVATAR,
        });
    },
};
