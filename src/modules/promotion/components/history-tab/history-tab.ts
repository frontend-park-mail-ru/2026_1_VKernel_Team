import '@modules/promotion/components/history-tab/history-tab.scss';
import template from '@modules/promotion/components/history-tab/history-tab.hbs';
import { promotionStore } from '@modules/promotion/store';
import { promotionService } from '@modules/promotion/service';

export const PromoHistoryTab = {
    getTemplate() {
        return template;
    },

    buildTemplateData(state?: ReturnType<typeof promotionStore.getState>) {
        const s = state || promotionStore.getState();
        const now = Date.now();
        return {
            items: s.userHistory.map((item) => ({
                ...item,
                isExpired: new Date(item.expires_at).getTime() < now,
            })),
            nextCursor: s.nextCursor,
        };
    },

    init(): void {
        this.attachEvents();
    },

    async loadHistory(): Promise<void> {
        promotionStore.resetHistory();
        const res = await promotionService.getUserHistory(20);
        if (res.success && res.data) {
            promotionStore.appendHistory(res.data.items, res.data.next_cursor ?? null);
            this.rerender();
        }
    },

    async loadMore(): Promise<void> {
        const state = promotionStore.getState();
        if (!state.nextCursor) return;
        const res = await promotionService.getUserHistory(20, state.nextCursor);
        if (res.success && res.data) {
            promotionStore.appendHistory(res.data.items, res.data.next_cursor ?? null);
            this.rerender();
        }
    },

    rerender(): void {
        const container = document.getElementById('tabContent');
        if (!container) return;
        container.innerHTML = template(this.buildTemplateData());
        this.attachEvents();
    },

    attachEvents(): void {
        const loadMoreBtn = document.querySelector('[data-action="load-more-promo-history"]');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
    },
};
