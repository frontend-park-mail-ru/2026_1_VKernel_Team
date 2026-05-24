import template from '@modules/reviews/components/review-modal/review-modal.hbs';
import '@modules/reviews/components/review-modal/review-modal.scss';
import { createBaseModal } from '@modules/common/components/modal/modal';
import {
    StarRatingInputComponent,
    mountStarRatingInput,
} from '@modules/reviews/components/star-rating-input/star-rating-input';
import {
    REVIEW_CONTENT_MAX,
    REVIEW_CONTENT_MIN,
    REVIEW_RATING_MAX,
    REVIEW_RATING_MIN,
} from '@modules/reviews/config';
import { reviewModalStore } from '@modules/reviews/store';
import { reviewsActions } from '@modules/reviews/actions';
import type { ReviewModalMode } from '@modules/reviews/types';

const base = createBaseModal({ id: 'reviewModal' });

export interface ReviewModalOpenOptions {
    mode: ReviewModalMode;
    adId: number;
    sellerId: number;
    productTitle?: string;
    productPhoto?: string;
    sellerName?: string;
    reviewId?: number;
    initialRating?: number;
    initialContent?: string;
}

function ensureContainer(): HTMLElement {
    let root = document.getElementById('modal-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'modal-root';
        document.getElementById('app')?.appendChild(root);
    }
    return root;
}

function buildTemplateData(state = reviewModalStore.getState()) {
    return {
        title: state.mode === 'edit' ? 'Изменить отзыв' : 'Оставить отзыв',
        submitLabel: state.mode === 'edit' ? 'Сохранить' : 'Опубликовать',
        productTitle: state.productTitle,
        productPhoto: state.productPhoto,
        sellerName: state.sellerName,
        content: state.content,
        contentLength: state.content.length,
        maxLength: REVIEW_CONTENT_MAX,
    };
}

export const ReviewModal = {
    _boundElement: null as HTMLElement | null,
    _starsApi: null as ReturnType<typeof mountStarRatingInput> | null,

    init(): void {
        const modal = base.getElement();
        if (!modal || modal === this._boundElement) return;
        this._boundElement = modal;

        base.resetBound();
        base.bindBaseEvents(() => this.close());

        const starsHost = modal.querySelector<HTMLElement>('#reviewModalStars');
        if (starsHost) {
            starsHost.innerHTML = StarRatingInputComponent.getTemplate()({});
            const widget = starsHost.querySelector<HTMLElement>('.star-rating-input');
            if (widget) {
                this._starsApi?.destroy();
                this._starsApi = mountStarRatingInput(widget, {
                    value: reviewModalStore.getState().rating,
                    onChange: (value) => {
                        reviewModalStore.setState({ rating: value });
                        this.refreshSubmitState();
                    },
                });
            }
        }

        const textarea = modal.querySelector<HTMLTextAreaElement>('#reviewModalText');
        const counter = modal.querySelector<HTMLElement>('#reviewModalCounter');
        if (textarea) {
            textarea.addEventListener('input', () => {
                const value = textarea.value;
                reviewModalStore.setState({ content: value });
                if (counter) counter.textContent = String(value.length);
                this.updateCounterStyle(value.length);
                this.refreshSubmitState();
            });
        }

        const submit = modal.querySelector<HTMLButtonElement>('#reviewModalSubmit');
        if (submit) {
            submit.addEventListener('click', (e) => {
                e.preventDefault();
                void this.handleSubmit();
            });
        }
    },

    updateCounterStyle(length: number): void {
        const counterWrap = base.getElement()?.querySelector<HTMLElement>('.review-modal__counter');
        if (!counterWrap) return;
        const invalid = length > 0 && (length < REVIEW_CONTENT_MIN || length > REVIEW_CONTENT_MAX);
        counterWrap.classList.toggle('review-modal__counter--invalid', invalid);
    },

    refreshSubmitState(): void {
        const state = reviewModalStore.getState();
        const submit = base.getElement()?.querySelector<HTMLButtonElement>('#reviewModalSubmit');
        if (!submit) return;
        const validRating = state.rating >= REVIEW_RATING_MIN && state.rating <= REVIEW_RATING_MAX;
        const validContent =
            state.content.length >= REVIEW_CONTENT_MIN &&
            state.content.length <= REVIEW_CONTENT_MAX;
        submit.disabled = !validRating || !validContent || state.isSubmitting;
    },

    showError(message: string | null): void {
        const el = base.getElement()?.querySelector<HTMLElement>('#reviewModalError');
        if (!el) return;
        if (message) {
            el.textContent = message;
            el.style.display = 'block';
        } else {
            el.textContent = '';
            el.style.display = 'none';
        }
    },

    open(options: ReviewModalOpenOptions): void {
        reviewModalStore.reset();
        reviewModalStore.setState({
            isOpen: true,
            mode: options.mode,
            adId: options.adId,
            sellerId: options.sellerId,
            reviewId: options.reviewId ?? null,
            productTitle: options.productTitle ?? '',
            productPhoto: options.productPhoto ?? '',
            sellerName: options.sellerName ?? '',
            rating: options.initialRating ?? 0,
            content: options.initialContent ?? '',
        });

        const container = ensureContainer();
        const existing = document.getElementById('reviewModal');
        const html = template(buildTemplateData());
        if (existing) {
            existing.outerHTML = html;
        } else {
            container.insertAdjacentHTML('beforeend', html);
        }

        this._boundElement = null;
        this.init();
        this.refreshSubmitState();
        base.open();

        const textarea = base.getElement()?.querySelector<HTMLTextAreaElement>('#reviewModalText');
        if (textarea) {
            requestAnimationFrame(() => textarea.focus());
        }
    },

    close(): void {
        this._starsApi?.destroy();
        this._starsApi = null;
        base.close();
        reviewModalStore.setState({ isOpen: false });
    },

    async handleSubmit(): Promise<void> {
        const state = reviewModalStore.getState();
        if (
            state.rating < REVIEW_RATING_MIN ||
            state.rating > REVIEW_RATING_MAX ||
            state.content.length < REVIEW_CONTENT_MIN ||
            state.content.length > REVIEW_CONTENT_MAX
        ) {
            return;
        }

        this.showError(null);
        const result = await reviewsActions.submitReview({
            mode: state.mode,
            reviewId: state.reviewId,
            receiverId: state.sellerId as number,
            productId: state.adId as number,
            rating: state.rating,
            content: state.content.trim(),
        });

        const latest = reviewModalStore.getState();
        if (result.ok) {
            this.close();
        } else {
            this.showError(latest.error);
            this.refreshSubmitState();
        }
    },
};

(window as any).__ReviewModal = ReviewModal;
