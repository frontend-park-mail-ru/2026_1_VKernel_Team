import template from '@modules/reviews/components/review-summary/review-summary.hbs?raw';
import '@modules/reviews/components/review-summary/review-summary.scss';

export const ReviewSummaryComponent = {
    getTemplate(): string {
        return template;
    },
};
