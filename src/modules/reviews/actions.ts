import { eventBus } from '@/core/eventBus';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { reviewsService } from './service';
import { myReviewsStore, sellerReviewsStore, reviewModalStore } from './store';
import { mapBackendError } from './config';
import type { CreateReviewPayload, Review, UpdateReviewPayload } from './types';

const REVIEW_SUBMITTED = 'reviews:submitted';
const REVIEW_DELETED = 'reviews:deleted';

export interface SubmitReviewInput {
    mode: 'create' | 'edit';
    reviewId?: number | null;
    receiverId: number;
    productId: number;
    rating: number;
    content: string;
}

export const reviewsActions = {
    async loadSellerSummary(sellerId: number | string): Promise<void> {
        const res = await reviewsService.summary(sellerId);
        if (res.success && res.data) {
            sellerReviewsStore.setState({ summary: res.data });
        }
    },

    async loadSellerReviews(sellerId: number, options: { loadMore?: boolean } = {}): Promise<void> {
        const state = sellerReviewsStore.getState();
        if (!options.loadMore) {
            sellerReviewsStore.reset(sellerId);
            sellerReviewsStore.setState({ isLoading: true });
        } else {
            if (!state.nextCursor) return;
            sellerReviewsStore.setState({ isLoadingMore: true });
        }

        const cursor = options.loadMore ? state.nextCursor : null;

        try {
            const [listRes, summaryRes] = await Promise.all([
                reviewsService.listByUser(sellerId, cursor),
                options.loadMore
                    ? Promise.resolve({ success: true, data: state.summary } as const)
                    : reviewsService.summary(sellerId),
            ]);

            if (!listRes.success || !listRes.data) {
                sellerReviewsStore.setState({
                    isLoading: false,
                    isLoadingMore: false,
                    error: listRes.error || 'Не удалось загрузить отзывы',
                });
                return;
            }

            const items = listRes.data.reviews || [];
            const nextCursor = listRes.data.next_cursor ?? null;

            if (options.loadMore) {
                sellerReviewsStore.appendItems(items, nextCursor);
                sellerReviewsStore.setState({ isLoadingMore: false });
            } else {
                sellerReviewsStore.setState({
                    items,
                    nextCursor,
                    summary: summaryRes.success ? (summaryRes as any).data : null,
                    isLoading: false,
                });
            }
        } catch {
            sellerReviewsStore.setState({
                isLoading: false,
                isLoadingMore: false,
                error: 'Ошибка соединения',
            });
        }
    },

    setSellerFilter(rating: number | null): void {
        sellerReviewsStore.setState({ filterRating: rating });
    },

    async loadMyReviews(options: { force?: boolean; loadMore?: boolean } = {}): Promise<void> {
        if (!store.isAuthenticated) return;
        const state = myReviewsStore.getState();
        if (state.isInitialised && !options.force && !options.loadMore) return;

        if (options.loadMore) {
            if (!state.nextCursor) return;
            myReviewsStore.setState({ isLoadingMore: true });
        } else {
            myReviewsStore.setState({ isLoading: true, error: null });
        }

        const cursor = options.loadMore ? state.nextCursor : null;
        const res = await reviewsService.myReviews(cursor);

        if (!res.success || !res.data) {
            myReviewsStore.setState({
                isLoading: false,
                isLoadingMore: false,
                error: res.error || 'Не удалось загрузить отзывы',
                isInitialised: true,
            });
            return;
        }

        const items = res.data.reviews || [];
        const nextCursor = res.data.next_cursor ?? null;

        if (options.loadMore) {
            myReviewsStore.appendItems(items, nextCursor);
            myReviewsStore.setState({ isLoadingMore: false });
        } else {
            myReviewsStore.setItems(items, nextCursor);
            myReviewsStore.setState({ isLoading: false });
        }
    },

    async submitReview(input: SubmitReviewInput): Promise<{ ok: boolean; review?: Review }> {
        reviewModalStore.setState({ isSubmitting: true, error: null });

        const res =
            input.mode === 'edit' && input.reviewId
                ? await reviewsService.update(input.reviewId, {
                      rating: input.rating,
                      content: input.content,
                  } as UpdateReviewPayload)
                : await reviewsService.create({
                      receiver_id: input.receiverId,
                      product_id: input.productId,
                      rating: input.rating,
                      content: input.content,
                  } as CreateReviewPayload);

        if (!res.success) {
            reviewModalStore.setState({
                isSubmitting: false,
                error: mapBackendError(res.error),
            });
            return { ok: false };
        }

        const review = res.data as Review | undefined;
        const modalState = reviewModalStore.getState();

        // Оптимистичный upsert. Бэк POST/PUT может возвращать неполный DTO
        // (например пустой product.photo или вообще без product). Сборка снизу
        // отдаёт приоритет ответу бэка только когда поле непустое — иначе
        // подставляем то, что точно знаем (input + modalStore + store.user).
        const respProduct = review?.product;
        const respSender = review?.sender;
        const optimisticReview: Review = {
            id: review?.id ?? input.reviewId ?? -Date.now(),
            sender: {
                id: respSender?.id || (store.user?.id as number) || 0,
                name: respSender?.name || (store.user?.name as string) || 'Я',
                avatar_path: respSender?.avatar_path || (store.user?.avatar_path as string) || '',
            },
            receiver_id: review?.receiver_id ?? input.receiverId,
            product: {
                id: respProduct?.id || input.productId,
                title: respProduct?.title || modalState.productTitle || 'Товар',
                photo: respProduct?.photo || modalState.productPhoto || '',
            },
            rating: review?.rating ?? input.rating,
            content: review?.content ?? input.content,
            created_at: review?.created_at ?? new Date().toISOString(),
            updated_at: review?.updated_at ?? new Date().toISOString(),
        };
        myReviewsStore.upsert(optimisticReview);

        // Не делаем мгновенный refetch /profile/reviews — у бэка может быть
        // eventual consistency, и новый отзыв ещё не попадает в выдачу;
        // setItems перетирал бы optimistic и pending-карточка возвращалась бы.
        // Бэк-данные подтянутся при следующем заходе на вкладку.

        const sellerState = sellerReviewsStore.getState();
        if (sellerState.sellerId === input.receiverId) {
            void this.loadSellerReviews(input.receiverId);
        }

        reviewModalStore.setState({ isSubmitting: false });
        eventBus.emit(REVIEW_SUBMITTED, {
            sellerId: input.receiverId,
            productId: input.productId,
            review,
        });
        uiActions.showSuccess(input.mode === 'edit' ? 'Отзыв обновлён' : 'Отзыв опубликован');
        return { ok: true, review };
    },

    async deleteReview(reviewId: number): Promise<boolean> {
        const target = myReviewsStore.getState().items.find((r) => r.id === reviewId);
        const res = await reviewsService.remove(reviewId);
        if (!res.success) {
            uiActions.showError(mapBackendError(res.error));
            return false;
        }
        myReviewsStore.remove(reviewId);
        if (target) {
            const sellerState = sellerReviewsStore.getState();
            if (sellerState.sellerId === target.receiver_id) {
                void this.loadSellerReviews(target.receiver_id);
            }
            eventBus.emit(REVIEW_DELETED, {
                sellerId: target.receiver_id,
                productId: target.product?.id,
                reviewId,
            });
        }
        uiActions.showSuccess('Отзыв удалён');
        return true;
    },
};

export const REVIEW_EVENTS = {
    SUBMITTED: REVIEW_SUBMITTED,
    DELETED: REVIEW_DELETED,
};
