import '@modules/profile/components/profile-content/style.scss';
import template from '@modules/profile/components/profile-content/profile-content.hbs';
import { CloseAdModal } from '@modules/profile/components/close-ad-modal/close-ad-modal';
import { PromoteModal } from '@modules/promotion/components/promote-modal/promote-modal';
import { eventBus } from '@/core/eventBus';

export const ProfileContent = {
    getTemplate() {
        return template;
    },

    init(): void {
        const content = document.querySelector('.profile-tab-content');
        if (!content) return;

        content.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // Переключение вкладок Активные / Архивные
            const adTabBtn = target.closest('[data-profile-ad-tab]') as HTMLElement | null;
            if (adTabBtn) {
                const tab = adTabBtn.getAttribute('data-profile-ad-tab');
                content
                    .querySelectorAll('[data-profile-ad-tab]')
                    .forEach((btn) => btn.classList.remove('profile-ad-tab--active'));
                adTabBtn.classList.add('profile-ad-tab--active');
                content.querySelectorAll('[data-profile-ad-content]').forEach((el) => {
                    (el as HTMLElement).style.display = 'none';
                });
                const target2 = content.querySelector(
                    `[data-profile-ad-content="${tab}"]`,
                ) as HTMLElement | null;
                if (target2) target2.style.display = '';
                return;
            }

            // Кнопка закрытия объявления
            const closeBtn =
                (target.closest('.rec-card-close') as HTMLElement | null) ||
                (target.closest('.profile-ad-card__btn--close') as HTMLElement | null);
            if (closeBtn) {
                e.stopPropagation();
                const adId = closeBtn.getAttribute('data-close-id');
                const adTitle = closeBtn.getAttribute('data-close-title') || '';
                if (adId) CloseAdModal.open(adId, adTitle);
                return;
            }

            const promoteBtn =
                (target.closest('.rec-card-promote') as HTMLElement | null) ||
                (target.closest('.profile-ad-card__btn--promote') as HTMLElement | null);
            if (promoteBtn) {
                e.stopPropagation();
                const adId = promoteBtn.getAttribute('data-promote-id');
                if (adId) PromoteModal.open(adId);
                return;
            }

            const editBtn =
                (target.closest('.rec-card-edit') as HTMLElement | null) ||
                (target.closest('.profile-ad-card__btn--edit') as HTMLElement | null);
            if (editBtn) {
                e.preventDefault();
                e.stopPropagation();
                const adId = editBtn.getAttribute('data-edit-id');
                if (adId) {
                    eventBus.emit('app:navigate', `/edit-ad/${adId}`);
                }
                return;
            }

            const card =
                (target.closest('.rec-card') as HTMLElement | null) ||
                (target.closest('.profile-ad-card') as HTMLElement | null);
            if (
                card &&
                !target.closest('.rec-card-fav') &&
                !target.closest('.rec-card-cart') &&
                !target.closest('.rec-card-edit') &&
                !target.closest('.rec-card-close') &&
                !target.closest('.rec-card-promote') &&
                !target.closest('.profile-ad-card__btn') &&
                !target.closest('.profile-ad-card__actions')
            ) {
                const adId = card.getAttribute('data-id');
                if (adId) {
                    window.dispatchEvent(
                        new CustomEvent('app:navigate', {
                            detail: { path: `/ad/${adId}` },
                        }),
                    );
                }
            }
        });
    },
};
