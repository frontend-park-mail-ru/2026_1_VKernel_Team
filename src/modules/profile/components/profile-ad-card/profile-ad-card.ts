import './style.css';
import template from './profile-ad-card.hbs?raw';
import { uiActions } from '@/actions/uiActions';

export const ProfileAdCard = {
    // Отдаем строковый шаблон для Handlebars
    getTemplate(): string {
        return template;
    },

    // Логика компонента (обработчики событий)
    init(): void {
        const cards = document.querySelectorAll('.profile-item-card');
        
        cards.forEach(card => {
            // Защита от двойного навешивания событий при перерендере
            if (card.hasAttribute('data-initialized')) return;
            card.setAttribute('data-initialized', 'true');

            card.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const adId = target.dataset.adId; // Берем ID из data-ad-id="{{id}}"
                
                if (adId) {
                    uiActions.navigateTo(`/ad/${adId}`);
                }
            });
        });
    }
};
