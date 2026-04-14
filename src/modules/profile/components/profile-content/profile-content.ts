import '@modules/profile/components/profile-content/style.css';
import template from '@modules/profile/components/profile-content/profile-content.hbs?raw';
import { EditNameModal } from '@modules/profile/components/edit-name-modal/edit-name-modal';

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
            
            // Обработчик для кнопки "Изменить имя"
            if (target.closest('[data-action="open-edit-name"]')) {
                EditNameModal.open();
                return;
            }
            
            // Обработчик для кнопки редактирования (✏️) → переход на страницу редактирования
            const editBtn = target.closest('.rec-card-edit');
            if (editBtn) {
                const adId = editBtn.getAttribute('data-edit-id');
                if (adId) {
                    import('@/controllers/AppController').then(({ AppController }) => {
                        AppController.navigateTo(`/edit-ad/${adId}`);  // ← /edit-ad/:id
                    });
                }
                return;
            }
            
            // Обработчик для карточек объявлений (клик по самой карточке) → переход на страницу объявления
            const card = target.closest('.rec-card');
            if (card && !target.closest('.rec-card-fav') && !target.closest('.rec-card-cart') && !target.closest('.rec-card-edit')) {
                const adId = card.getAttribute('data-id');
                if (adId) {
                    import('@/controllers/AppController').then(({ AppController }) => {
                        AppController.navigateTo(`/ad/${adId}`);  // ← /ad/:id
                    });
                }
            }
        });
    },
};
