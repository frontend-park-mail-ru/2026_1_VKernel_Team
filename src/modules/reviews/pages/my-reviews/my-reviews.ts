import template from '@modules/reviews/pages/my-reviews/my-reviews.hbs';
import '@modules/reviews/pages/my-reviews/my-reviews.scss';
import { reviewsActions, REVIEW_EVENTS } from '@modules/reviews/actions';
import { eventBus } from '@/core/eventBus';
import { myReviewsStore } from '@modules/reviews/store';
import { reviewsService } from '@modules/reviews/service';
import { ReviewModal } from '@modules/reviews/components/review-modal/review-modal';
import { ReviewDeleteModal } from '@modules/reviews/components/review-delete-modal/review-delete-modal';
import { sellerService } from '@modules/seller-page/service';
import { purchasesStore } from '@modules/profile/purchases-store';
import type { PurchaseItem } from '@modules/profile/purchases-store';
import { CONFIG } from '@/core/config';

const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';
const sellerNameCache = new Map<number, string>();

async function resolveReceiverName(id: number): Promise<string> {
    if (sellerNameCache.has(id)) return sellerNameCache.get(id) as string;
    try {
        const res = await sellerService.getProfile(id);
        if (res.success && res.data) {
            const name = res.data.name || 'Продавец';
            sellerNameCache.set(id, name);
            return name;
        }
    } catch {
        // ignore
    }
    return 'Продавец';
}

function resolvePhoto(photo: string | undefined): string {
    if (!photo) return DEFAULT_AD_IMAGE;
    const trimmed = photo.trim();
    if (!trimmed) return DEFAULT_AD_IMAGE;
    if (trimmed.startsWith('http') || trimmed.startsWith('data:')) return trimmed;
    const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${CONFIG.API.BASE_URL}${normalized}`;
}

interface PendingCard {
    productId: number;
    title: string;
    photo: string;
    sellerId: number;
    sellerName: string;
}

function buildPending(): PendingCard[] {
    const reviewed = new Set(myReviewsStore.getState().items.map((r) => r.product.id));
    const seen = new Set<number>();
    const items = purchasesStore.getState().items as PurchaseItem[];

    const pending: PendingCard[] = [];
    for (const p of items) {
        if (!p.product_id || !p.seller?.id) continue;
        if (reviewed.has(p.product_id)) continue;
        if (seen.has(p.product_id)) continue;
        seen.add(p.product_id);
        pending.push({
            productId: p.product_id,
            title: p.title || 'Товар',
            photo: resolvePhoto(p.photo),
            sellerId: p.seller.id,
            sellerName: p.seller.name || 'Продавец',
        });
    }
    return pending;
}

export const MyReviewsPage = {
    _unsubReviews: null as null | (() => void),
    _unsubPurchases: null as null | (() => void),
    _unsubSubmitted: null as null | (() => void),
    _unsubDeleted: null as null | (() => void),
    _root: null as HTMLElement | null,
    _renderTicket: 0,

    async mount(host: HTMLElement): Promise<void> {
        this._root = host;

        // Параллельно подтягиваем мои отзывы и покупки.
        await Promise.all([
            reviewsActions.loadMyReviews({ force: true }),
            purchasesStore.fetch({ force: true }),
        ]);
        await this.render();

        this.cleanupSubscriptions();

        this._unsubReviews = myReviewsStore.subscribe(() => {
            void this.render();
        });
        this._unsubPurchases = purchasesStore.subscribe(() => {
            void this.render();
        });

        // После публикации отзыва сразу обновляем список (рекомендация
        // исчезает, новая карточка появляется в основной ленте).
        this._unsubSubmitted = eventBus.on(REVIEW_EVENTS.SUBMITTED, () => {
            void this.render();
        });
        this._unsubDeleted = eventBus.on(REVIEW_EVENTS.DELETED, () => {
            void this.render();
        });

        this.attachListeners();
    },

    cleanupSubscriptions(): void {
        this._unsubReviews?.();
        this._unsubPurchases?.();
        this._unsubSubmitted?.();
        this._unsubDeleted?.();
        this._unsubReviews = null;
        this._unsubPurchases = null;
        this._unsubSubmitted = null;
        this._unsubDeleted = null;
    },

    unmount(): void {
        this.cleanupSubscriptions();
        this._root = null;
    },

    async render(): Promise<void> {
        if (!this._root) return;
        const ticket = ++this._renderTicket;
        const state = myReviewsStore.getState();
        const formatted = reviewsService.formatList(state.items);

        const enriched = await Promise.all(
            formatted.map(async (r) => ({
                ...r,
                receiverName: await resolveReceiverName(r.receiverId),
            })),
        );

        // Параллельные render'ы — выигрывает последний. Старые промисы
        // не должны перетирать свежий innerHTML.
        if (ticket !== this._renderTicket || !this._root) return;

        this._root.innerHTML = template({
            total: state.items.length,
            reviews: enriched,
            hasMore: !!state.nextCursor,
            isLoading: state.isLoading,
            isLoadingMore: state.isLoadingMore,
            isEmpty: !state.isLoading && state.items.length === 0,
            pending: buildPending(),
        });
    },

    attachListeners(): void {
        if (!this._root) return;
        this._root.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            const pendingBtn = target.closest<HTMLElement>('[data-action="pending-write-review"]');
            if (pendingBtn) {
                e.preventDefault();
                const productId = Number(pendingBtn.dataset.productId);
                this.openPending(productId);
                return;
            }

            const loadMore = target.closest('[data-action="reviews-load-more"]');
            if (loadMore) {
                void reviewsActions.loadMyReviews({ loadMore: true });
                return;
            }

            const editBtn = target.closest<HTMLElement>('[data-action="review-edit"]');
            if (editBtn) {
                const id = Number(editBtn.dataset.reviewId);
                this.openEdit(id);
                return;
            }

            const delBtn = target.closest<HTMLElement>('[data-action="review-delete"]');
            if (delBtn) {
                const id = Number(delBtn.dataset.reviewId);
                this.confirmDelete(id);
            }
        });
    },

    openPending(productId: number): void {
        const purchase = purchasesStore.getState().items.find((p) => p.product_id === productId);
        if (!purchase || !purchase.seller?.id) return;

        ReviewModal.open({
            mode: 'create',
            adId: purchase.product_id,
            sellerId: purchase.seller.id,
            productTitle: purchase.title,
            productPhoto: resolvePhoto(purchase.photo),
            sellerName: purchase.seller.name,
        });
    },

    openEdit(reviewId: number): void {
        const review = myReviewsStore.getState().items.find((r) => r.id === reviewId);
        if (!review) return;
        const sellerName = sellerNameCache.get(review.receiver_id);
        ReviewModal.open({
            mode: 'edit',
            adId: review.product.id,
            sellerId: review.receiver_id,
            reviewId: review.id,
            productTitle: review.product.title,
            productPhoto: reviewsService.format(review).productPhoto,
            sellerName,
            initialRating: review.rating,
            initialContent: review.content,
        });
    },

    confirmDelete(reviewId: number): void {
        const review = myReviewsStore.getState().items.find((r) => r.id === reviewId);
        ReviewDeleteModal.open(reviewId, review?.content ?? '');
    },
};
