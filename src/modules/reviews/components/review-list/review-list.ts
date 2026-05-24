import template from '@modules/reviews/components/review-list/review-list.hbs?raw';
import '@modules/reviews/components/review-list/review-list.scss';

export const ReviewListComponent = {
    getTemplate(): string {
        return template;
    },
};
