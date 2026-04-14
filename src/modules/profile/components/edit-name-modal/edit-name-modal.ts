import template from '@modules/profile/components/edit-name-modal/edit-name-modal.hbs?raw';
import  '@modules/profile/components/edit-name-modal/style.css';
import { ProfileService } from '@modules/profile/service';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';

declare const Handlebars: any;

export const EditNameModal = {
    getTemplate() {
        return Handlebars.compile(template);
    },

    init(): void {
        const modal = document.getElementById('editNameModal');
        if (!modal) return;

        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            // Закрытие модалки
            if (target.closest('[data-action="close-modal"]')) {
                this.close();
            }
            // Сохранение данных
            if (target.closest('[data-action="save-name"]')) {
                this.handleSave();
            }
        });
    },

    open(): void {
        const modal = document.getElementById('editNameModal');
        if (modal) modal.style.display = 'flex';
    },

    close(): void {
        const modal = document.getElementById('editNameModal');
        if (modal) modal.style.display = 'none';
    },

    async handleSave(): Promise<void> {
        const input = document.getElementById('editNameInput') as HTMLInputElement;
        const newName = input?.value.trim();

        if (!newName || newName.length < 2) {
            uiActions.showError('Имя слишком короткое');
            return;
        }

        uiActions.showLoading(true);
        try {
            const res = await ProfileService.updateName(newName);
            if (res.success && res.data) {
                store.setState({ user: { ...store.user, name: res.data.name } });
                uiActions.showSuccess('Имя обновлено');
                this.close();
                eventBus.emit('profile:update-ui');
            }
        } catch (err) {
            uiActions.showError('Ошибка сохранения');
        } finally {
            uiActions.showLoading(false);
        }
    }
};
