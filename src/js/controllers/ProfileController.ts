/**
 * Контроллер профиля пользователя
 */

import { store } from '@/core/store';
import { AppController } from '@/controllers/AppController';

export const ProfileController = {
    /**
     * Показать страницу профиля
     */
    showProfile(): void {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app || !AppController.templates['user-profile']) return;

        const user = store.user;

        app.innerHTML = AppController.templates['user-profile']({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            email: user?.email || 'Неизвестно',
            name: user?.name || user?.email?.split('@')[0] || 'Пользователь',
            registeredAt: user?.created_at
                ? new Date(user.created_at).toLocaleDateString('ru-RU')
                : 'неизвестно',
            avatar: AppController.UI_CONSTANTS.DEFAULT_AVATAR,
        });
    },
};
