import template from '@modules/reviews/components/review-card/review-card.hbs?raw';
import '@modules/reviews/components/review-card/review-card.scss';

export const ReviewCardComponent = {
    getTemplate(): string {
        return template;
    },
};
