import '@modules/profile/components/profile-content/style.css'; 
import template from './profile-content.hbs?raw';
import { ProfileService } from '../../service';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus'; // Шина событий

declare const Handlebars: any;

export const ProfileContent = {
    getTemplate() {
        return Handlebars.compile(template);
    },

    init(): void {
        const content = document.querySelector('.profile-tab-content');
        if (!content) return;

        content.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // Открытие модалки
            if (target.closest('[data-action="open-edit-name"]')) {
                const modal = document.getElementById('editNameModal');
                if (modal) modal.style.display = 'flex';
            }

            // Закрытие модалки
            if (target.closest('[data-action="close-modal"]')) {
                const modal = document.getElementById('editNameModal');
                if (modal) modal.style.display = 'none';
            }

            if (target.closest('[data-action="save-name"]')) {
                this.saveName();
            }
        });
    },

    async saveName(): Promise<void> {
        const input = document.getElementById('editNameInput') as HTMLInputElement;
        const newName = input?.value.trim();
        
        if (!newName || newName.length < 2) {
            uiActions.showError('Имя слишком короткое');
            return;
        }

        uiActions.showLoading(true);
        try {
            const res = await ProfileService.updateName(newName);
            if (res.success && res.data?.name) {
                store.setState({ user: { ...store.user, name: res.data.name } });
                uiActions.showSuccess('Имя сохранено');
                
                const modal = document.getElementById('editNameModal');
                if (modal) modal.style.display = 'none';
                
                // Просим контроллер обновиться через событие
                eventBus.emit('profile:update-ui');
            }
        } catch (err) {
            uiActions.showError('Ошибка сохранения');
        } finally {
            uiActions.showLoading(false);
        }
    }
};
