import { AppController } from './AppController.js';

const ProfileController = {
    showProfile(): void {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app || !AppController.templates['user-profile']) return;

        app.innerHTML = AppController.templates['user-profile']({
            email: AppController.user?.email || 'Неизвестно',
            name: AppController.user?.name || AppController.user?.email?.split('@')[0] || 'Пользователь',
            registeredAt: AppController.user?.created_at
                ? new Date(AppController.user.created_at).toLocaleDateString('ru-RU')
                : 'неизвестно',
            avatar: AppController.UI_CONSTANTS.DEFAULT_AVATAR,
        });
    },
};

export { ProfileController };
