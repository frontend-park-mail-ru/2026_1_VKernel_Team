import { sellerPageActions } from '@modules/seller-page/actions';
import { sellerPageStore } from '@modules/seller-page/store';
import { store } from '@/core/store';
import { getTemplate } from '@modules/seller-page/pages/seller-page/seller-page';
import { CartButtonComponent } from '@modules/cart/components/cart-button/cart-button';
import { cartActions } from '@modules/cart/actions';
import { cartStore } from '@modules/cart/store';
import { AdsController } from '@/controllers/AdsController';
import { ADS_SELECTORS } from '@/types/adsConstants';

import Handlebars from 'handlebars';
import reviewSummaryTpl from '@modules/reviews/components/review-summary/review-summary.hbs?raw';
import reviewListTpl from '@modules/reviews/components/review-list/review-list.hbs?raw';
import { ReviewsModule } from '@modules/reviews/controller';
import { reviewsActions, REVIEW_EVENTS } from '@modules/reviews/actions';
import { reviewsService } from '@modules/reviews/service';
import { sellerReviewsStore, myReviewsStore } from '@modules/reviews/store';
import { ReviewModal } from '@modules/reviews/components/review-modal/review-modal';
import { eventBus } from '@/core/eventBus';
import { declensionReviews } from '@modules/reviews/config';
import { renderStarsHTML } from '@/utils/icons';
import { purchasesStore } from '@modules/profile/purchases-store';
import { NotificationComponent } from '@modules/common/notifications/notification';
import type { Review } from '@modules/reviews/types';

const enrichWithFavorite = (ads: any[]): any[] =>
    ads.map((ad) => ({
        ...ad,
        isFavorite: store.favoriteIds.has(Number(ad.id)),
    }));

let summaryTpl: HandlebarsTemplateDelegate | null = null;
let listTpl: HandlebarsTemplateDelegate | null = null;

function ensureReviewsTemplates(): void {
    ReviewsModule.registerPartials();
    if (!summaryTpl) summaryTpl = Handlebars.compile(reviewSummaryTpl);
    if (!listTpl) listTpl = Handlebars.compile(reviewListTpl);
}

export const SellerPageController = {
    _unsubscribe: null as null | (() => void),
    _unsubscribeSubmitted: null as null | (() => void),
    _unsubscribeDeleted: null as null | (() => void),
    _currentSellerId: null as number | null,
    _reviewsLoaded: false,

    async renderSellerPage(sellerId: string): Promise<void> {
        await sellerPageActions.loadSellerPage(sellerId);

        const app = document.getElementById('app');
        const template = getTemplate();
        if (!app || !template) return;

        const state = sellerPageStore.getState();

        if (state.error || !state.profile) {
            app.innerHTML =
                '<div class="seller-ads-empty" style="padding:80px 0">Продавец не найден</div>';
            return;
        }

        document.body.classList.remove('auth-page');

        const isOwner = store.isAuthenticated && store.user?.id === state.profile.id;
        const showCartButton = store.isAuthenticated && !isOwner;

        const activeAds = enrichWithFavorite(state.activeAds);
        const closedAds = enrichWithFavorite(state.closedAds);
        const totalAdsCount = activeAds.length + closedAds.length;

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            seller: { ...state.profile, adsCount: totalAdsCount },
            activeAds,
            closedAds,
            activeAdsCount: activeAds.length,
            closedAdsCount: closedAds.length,
            reviewsCount: state.profile.reviewsCount ?? 0,
            showCartButton,
        });

        this._currentSellerId = state.profile.id;
        this._reviewsLoaded = false;
        sellerReviewsStore.reset(state.profile.id);

        if (showCartButton) {
            if (cartStore.getState().items.length === 0) {
                await cartActions.loadCart();
            }
            CartButtonComponent.initAll();
        }

        this.attachEventListeners();
        this.setupReviewsSubscription();

        if (window.location.hash === '#reviews') {
            this.activateReviewsTab();
        }
    },

    attachEventListeners(): void {
        const tabs = document.querySelectorAll<HTMLElement>('.seller-tab');
        const contents = document.querySelectorAll<HTMLElement>('.seller-tab-content');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                tabs.forEach((t) => t.classList.remove('seller-tab--active'));
                tab.classList.add('seller-tab--active');

                contents.forEach((c) => {
                    if (c.dataset.tabContent === target) {
                        c.classList.remove('seller-tab-content--hidden');
                    } else {
                        c.classList.add('seller-tab-content--hidden');
                    }
                });

                if (target === 'reviews') {
                    void this.ensureReviewsLoaded();
                }
            });
        });

        const reviewsLink = document.querySelector<HTMLElement>('.seller-reviews-link');
        if (reviewsLink) {
            reviewsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.activateReviewsTab();
            });
        }

        const reviewsContainer = document.querySelector<HTMLElement>(
            '[data-tab-content="reviews"]',
        );
        if (reviewsContainer) {
            reviewsContainer.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const loadMoreBtn = target.closest('[data-action="reviews-load-more"]');
                if (loadMoreBtn) {
                    if (this._currentSellerId !== null) {
                        void reviewsActions.loadSellerReviews(this._currentSellerId, {
                            loadMore: true,
                        });
                    }
                    return;
                }
                const filterBtn = target.closest<HTMLElement>('[data-filter-rating]');
                if (filterBtn) {
                    const rating = Number(filterBtn.dataset.filterRating);
                    const current = sellerReviewsStore.getState().filterRating;
                    reviewsActions.setSellerFilter(current === rating ? null : rating);
                    return;
                }
                if (target.closest('[data-action="reset-rating-filter"]')) {
                    reviewsActions.setSellerFilter(null);
                }
            });
        }

        document.querySelectorAll(ADS_SELECTORS.FAVORITE_BTN).forEach((btn) => {
            btn.addEventListener('click', AdsController.handleFavoriteClick.bind(AdsController));
        });

        document.querySelectorAll(ADS_SELECTORS.CARD).forEach((card) => {
            card.addEventListener('click', AdsController.handleCardClick.bind(AdsController));
            (card as HTMLElement).style.cursor = 'pointer';
        });
    },

    activateReviewsTab(): void {
        const tabBtn = document.querySelector<HTMLElement>('.seller-tab[data-tab="reviews"]');
        const tabContent = document.querySelector<HTMLElement>('[data-tab-content="reviews"]');
        if (!tabBtn || !tabContent) return;

        document
            .querySelectorAll<HTMLElement>('.seller-tab')
            .forEach((t) => t.classList.remove('seller-tab--active'));
        tabBtn.classList.add('seller-tab--active');

        document
            .querySelectorAll<HTMLElement>('.seller-tab-content')
            .forEach((c) => c.classList.add('seller-tab-content--hidden'));
        tabContent.classList.remove('seller-tab-content--hidden');

        tabContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        void this.ensureReviewsLoaded();
    },

    async ensureReviewsLoaded(): Promise<void> {
        if (this._currentSellerId === null) return;
        if (this._reviewsLoaded) return;
        this._reviewsLoaded = true;
        await reviewsActions.loadSellerReviews(this._currentSellerId);
    },

    setupReviewsSubscription(): void {
        ensureReviewsTemplates();
        this._unsubscribe?.();
        this._unsubscribeSubmitted?.();
        this._unsubscribeDeleted?.();

        this._unsubscribe = sellerReviewsStore.subscribe(() => this.renderReviewsTab());
        const reloadIfMine = (payload: { sellerId?: number }) => {
            if (this._currentSellerId !== null && payload?.sellerId === this._currentSellerId) {
                void reviewsActions.loadSellerReviews(this._currentSellerId);
            }
        };
        this._unsubscribeSubmitted = eventBus.on(REVIEW_EVENTS.SUBMITTED, reloadIfMine);
        this._unsubscribeDeleted = eventBus.on(REVIEW_EVENTS.DELETED, reloadIfMine);

        // Подгружаем покупки + мои отзывы (нужно для CTA «Оставить отзыв»).
        if (store.isAuthenticated) {
            void purchasesStore.fetch();
            if (!myReviewsStore.getState().isInitialised) {
                void reviewsActions.loadMyReviews();
            }
        }

        this.renderReviewsTab();
    },

    renderReviewsTab(): void {
        if (!summaryTpl || !listTpl) return;
        const summaryHost = document.getElementById('sellerReviewsSummary');
        const listHost = document.getElementById('sellerReviewsList');
        if (!summaryHost || !listHost) return;

        const state = sellerReviewsStore.getState();
        const bars = reviewsService.buildDistributionBars(state.summary);
        const total = state.summary?.total ?? 0;
        const average = state.summary?.average ?? 0;
        const averageDisplay = average ? Math.round(average * 10) / 10 : 0;

        summaryHost.innerHTML = summaryTpl({
            average: averageDisplay,
            total,
            totalLabel: declensionReviews(total),
            ratingStars: renderStarsHTML(averageDisplay),
            bars,
            filterRating: state.filterRating,
        });

        const allFormatted = reviewsService.formatList(state.items);
        const filtered =
            state.filterRating !== null
                ? allFormatted.filter((r) => r.rating === state.filterRating)
                : allFormatted;

        const isEmpty = !state.isLoading && filtered.length === 0;
        const emptyTitle =
            state.filterRating !== null ? 'Под фильтр ничего не подходит' : 'Пока нет отзывов';
        const emptyHint =
            state.filterRating !== null
                ? 'Сбросьте фильтр, чтобы увидеть все отзывы'
                : 'Будьте первым, кто оставит отзыв продавцу';

        listHost.innerHTML = listTpl({
            reviews: filtered,
            isLoading: state.isLoading,
            isLoadingMore: state.isLoadingMore,
            isEmpty,
            hasMore: !!state.nextCursor && state.filterRating === null,
            showActions: false,
            showReceiver: false,
            emptyTitle,
            emptyHint,
        });

        this.renderAddReviewCta();
    },

    renderAddReviewCta(): void {
        const host = document.getElementById('sellerReviewsCta');
        if (!host) return;
        if (this._currentSellerId === null) {
            host.innerHTML = '';
            return;
        }
        if (!store.isAuthenticated) {
            host.innerHTML = '';
            return;
        }
        const userId = store.user?.id || store.user?.user_id;
        if (userId && Number(userId) === this._currentSellerId) {
            host.innerHTML = '';
            return;
        }

        host.innerHTML = `
            <div class="seller-reviews-cta">
                <div class="seller-reviews-cta__text">
                    <p class="seller-reviews-cta__title">Покупали что-то у этого продавца?</p>
                    <p class="seller-reviews-cta__subtitle">Расскажите о товаре и общении</p>
                </div>
                <button type="button" class="seller-reviews-cta__btn" data-action="seller-add-review">
                    Оставить отзыв
                </button>
            </div>
        `;

        const btn = host.querySelector<HTMLButtonElement>('[data-action="seller-add-review"]');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleAddReviewClick();
            });
        }
    },

    handleAddReviewClick(): void {
        if (this._currentSellerId === null) return;
        const sellerId = this._currentSellerId;
        const sellerName = sellerPageStore.getState().profile?.name;

        // Все отзывы текущего юзера этому продавцу: product_id -> Review.
        const reviewsBySeller = new Map<number, Review>();
        for (const r of myReviewsStore.getState().items) {
            if (r.receiver_id === sellerId && r.product?.id) {
                reviewsBySeller.set(r.product.id, r);
            }
        }

        // Покупки у этого продавца.
        const sellerPurchases = purchasesStore
            .getState()
            .items.filter((p) => p.seller?.id === sellerId)
            .sort(
                (a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime(),
            );

        if (sellerPurchases.length === 0) {
            NotificationComponent.show({
                type: 'warning',
                message: 'У вас нет покупок у этого продавца. Сначала купите товар через чат.',
            });
            return;
        }

        // Ищем покупку, для которой отзыва ещё нет.
        const eligible = sellerPurchases.filter((p) => !reviewsBySeller.has(p.product_id));

        if (eligible.length === 0) {
            NotificationComponent.show({
                type: 'info',
                message:
                    'Вы уже оставили отзывы на все товары этого продавца. Изменить или удалить отзыв можно в разделе «Мои отзывы».',
            });
            return;
        }

        const target = eligible[0];
        ReviewModal.open({
            mode: 'create',
            adId: target.product_id,
            sellerId,
            productTitle: target.title,
            productPhoto: target.photo,
            sellerName,
        });
    },
};
