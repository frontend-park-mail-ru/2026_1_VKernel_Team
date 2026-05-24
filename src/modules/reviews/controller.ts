import Handlebars from 'handlebars';
import reviewCardTpl from '@modules/reviews/components/review-card/review-card.hbs?raw';
import reviewSummaryTpl from '@modules/reviews/components/review-summary/review-summary.hbs?raw';
import reviewListTpl from '@modules/reviews/components/review-list/review-list.hbs?raw';
import reviewCtaTpl from '@modules/reviews/components/review-cta/review-cta.hbs?raw';
import { ReviewCardComponent } from '@modules/reviews/components/review-card/review-card';
import { ReviewSummaryComponent } from '@modules/reviews/components/review-summary/review-summary';
import { ReviewListComponent } from '@modules/reviews/components/review-list/review-list';
import { ReviewCtaComponent } from '@modules/reviews/components/review-cta/review-cta';

let registered = false;

const PARTIALS: Record<string, string> = {
    'reviews/components/review-card/review-card': reviewCardTpl,
    'reviews/components/review-summary/review-summary': reviewSummaryTpl,
    'reviews/components/review-list/review-list': reviewListTpl,
    'reviews/components/review-cta/review-cta': reviewCtaTpl,
};

function registerOn(instance: any): void {
    if (!instance || typeof instance.registerPartial !== 'function') return;
    for (const [name, tpl] of Object.entries(PARTIALS)) {
        instance.registerPartial(name, tpl);
    }
}

export const ReviewsModule = {
    /**
     * Регистрирует partials в обоих Handlebars-инстансах: npm-импортированном
     * (используется прекомпилированными .hbs) и глобальном с CDN (используется
     * raw-шаблонами вроде seller-page).
     */
    registerPartials(): void {
        if (registered) return;
        registered = true;
        registerOn(Handlebars);
        if (typeof window !== 'undefined') {
            registerOn((window as any).Handlebars);
        }
        // Trigger asset side-effects (CSS imports)
        void ReviewCardComponent.getTemplate();
        void ReviewSummaryComponent.getTemplate();
        void ReviewListComponent.getTemplate();
        void ReviewCtaComponent.getTemplate();
    },
};
