/**
 * Контроллер модуля чатов
 * Управляет отображением списка чатов и страницы отдельного чата.
 */
import { chatService } from '@modules/chat/service';
import { chatActions } from '@modules/chat/actions';
import { unreadStore } from '@modules/chat/unread-store';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { getTemplate as getListTemplate } from '@modules/chat/pages/chat-list/chat-list';
import { getTemplate as getDetailTemplate } from '@modules/chat/pages/chat-detail/chat-detail';
import type { ChatPreview, ChatMessage, ChatDetailResponse } from '@modules/chat/types';
import { myReviewsStore } from '@modules/reviews/store';
import { reviewsActions, REVIEW_EVENTS } from '@modules/reviews/actions';
import { ReviewModal } from '@modules/reviews/components/review-modal/review-modal';
import { eventBus } from '@/core/eventBus';

function getCurrentUserId(): number | null {
    const user = store.user;
    if (!user) return null;
    const id = user.id ?? user.user_id;
    return typeof id === 'number' ? id : id ? Number(id) : null;
}

function prepareChatListItem(chat: ChatPreview) {
    const ad = chat.ad || ({} as ChatPreview['ad']);
    const last = chat.last_message;
    const isOrderPreview = last?.type === 'order';

    return {
        chat_id: chat.chat_id,
        partner: chat.partner,
        ad: ad,
        adPhotoUrl: chatService.buildMediaUrl(ad?.photo),
        formattedPrice: chatService.formatPrice(ad?.price ?? 0),
        isSold: ad?.status === 'sold',
        last_message: last,
        isOrderPreview,
        lastMessagePreview: last ? chatService.truncate(last.text || '', 80) : '',
        lastMessageTime: last ? chatService.formatMessageTime(last.created_at) : '',
        isUnread: unreadStore.isUnread(chat),
    };
}

function prepareMessages(
    messages: ChatMessage[],
    currentUserId: number | null,
    isSeller: boolean,
    isSold: boolean,
    ad: { ad_id?: number },
    partnerId: number | null,
) {
    const adId = ad?.ad_id;
    const myReview = adId ? myReviewsStore.getByProduct(adId) : undefined;
    const canReview = !isSeller && isSold && adId !== undefined && partnerId !== null;

    return messages.map((msg) => {
        const isOrder = msg.type === 'order';
        return {
            id: msg.id,
            text: msg.text,
            type: msg.type,
            isOrder,
            isMine: currentUserId !== null && msg.sender_id === currentUserId,
            canConfirm: isOrder && isSeller && !isSold,
            canReview: isOrder && canReview,
            hasMyReview: !!myReview,
            myReviewRating: myReview?.rating ?? 0,
            adId: adId ?? null,
            sellerId: partnerId,
            formattedTime: chatService.formatMessageTime(msg.created_at),
        };
    });
}

let chatReviewSubmittedUnsub: (() => void) | null = null;
let chatReviewDeletedUnsub: (() => void) | null = null;

export const ChatController = {
    async renderChatList(): Promise<void> {
        const app = document.getElementById('app');
        const template = getListTemplate();
        if (!app || !template) return;

        document.body.classList.remove('auth-page');

        window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));

        try {
            const result = await chatService.getChats();
            const chats = (result.success && result.data?.chats) || [];
            unreadStore.recomputeFromChats(chats);
            const prepared = chats.map(prepareChatListItem);

            app.innerHTML = template({
                isAuthenticated: store.isAuthenticated,
                user: store.user,
                isEmpty: prepared.length === 0,
                chats: prepared,
            });

            if (!result.success && result.status !== 0) {
                uiActions.showError(result.error || 'Не удалось загрузить список чатов');
            }
        } finally {
            window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: false } }));
        }
    },

    async renderChatDetail(chatId: string): Promise<void> {
        const app = document.getElementById('app');
        const template = getDetailTemplate();
        if (!app || !template) return;

        document.body.classList.remove('auth-page');

        window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));

        try {
            const result = await chatService.getChatById(chatId);
            if (!result.success || !result.data) {
                app.innerHTML = `
                    <div class="chat-detail-page" style="padding:80px 0;text-align:center;">
                        <p>${result.error || 'Чат не найден'}</p>
                        <a href="/chats" data-nav="/chats">К списку чатов</a>
                    </div>`;
                return;
            }

            this.renderDetailFromData(chatId, result.data);
        } finally {
            window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: false } }));
        }
    },

    renderDetailFromData(chatId: string, data: ChatDetailResponse): void {
        const app = document.getElementById('app');
        const template = getDetailTemplate();
        if (!app || !template) return;

        const ad = data.ad || ({} as ChatDetailResponse['ad']);
        const currentUserId = getCurrentUserId();
        const messages = data.messages || [];
        // Заказ-сообщение создаётся покупателем → его отправитель = покупатель.
        // Если моего id нет в отправителях order-сообщений, значит я продавец.
        const orderMsg = messages.find((m) => m.type === 'order');
        const isSeller =
            currentUserId !== null &&
            orderMsg !== undefined &&
            orderMsg.sender_id !== currentUserId;
        const isSold = ad?.status === 'sold';
        const partnerId = data.partner?.id ?? null;
        const preparedMessages = prepareMessages(
            messages,
            currentUserId,
            isSeller,
            isSold,
            ad,
            partnerId,
        );

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            chat_id: data.chat_id,
            ad,
            partner: data.partner,
            adPhotoUrl: chatService.buildMediaUrl(ad?.photo),
            formattedPrice: chatService.formatPrice(ad?.price ?? 0),
            isSold,
            isSeller,
            messages: preparedMessages,
            hasMessages: preparedMessages.length > 0,
        });

        // Отмечаем чат прочитанным по времени самого свежего сообщения,
        // затем обновляем общий счётчик непрочитанных (fire-and-forget).
        const lastMsgIso = messages.reduce((max, m) => {
            const ts = m.created_at || '';
            return ts > max ? ts : max;
        }, '');
        unreadStore.markRead(chatId, lastMsgIso || undefined);
        unreadStore.refreshCountFromServer();

        this.attachDetailListeners(chatId);

        const messagesBox = document.getElementById('chat-messages');
        if (messagesBox) {
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }
    },

    attachDetailListeners(chatId: string): void {
        const buttons = document.querySelectorAll('[data-action="confirm-order"]');
        buttons.forEach((btn) => {
            btn.addEventListener('click', async (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                const button = btn as HTMLButtonElement;
                button.disabled = true;
                const originalText = button.innerHTML;
                button.innerHTML = 'Подтверждение…';
                const ok = await chatActions.confirmOrder(chatId);
                if (ok) {
                    await this.renderChatDetail(chatId);
                } else {
                    button.disabled = false;
                    button.innerHTML = originalText;
                }
            });
        });

        const reviewBtns = document.querySelectorAll<HTMLElement>(
            '[data-action="review-from-chat"]',
        );
        reviewBtns.forEach((btn) => {
            btn.addEventListener('click', (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                const adId = Number(btn.dataset.adId);
                const sellerId = Number(btn.dataset.sellerId);
                if (!adId || !sellerId) return;

                const adPhotoEl = document.querySelector<HTMLImageElement>(
                    '.chat-detail-page__ad-photo img',
                );
                const adTitleEl = document.querySelector<HTMLElement>(
                    '.chat-detail-page__ad-title',
                );
                const partnerNameEl = document.querySelector<HTMLElement>(
                    '.chat-detail-page__partner-name',
                );

                ReviewModal.open({
                    mode: 'create',
                    adId,
                    sellerId,
                    productTitle: adTitleEl?.textContent?.trim() || undefined,
                    productPhoto: adPhotoEl?.src || undefined,
                    sellerName: partnerNameEl?.textContent?.trim() || undefined,
                });
            });
        });

        if (store.isAuthenticated && !myReviewsStore.getState().isInitialised) {
            void reviewsActions.loadMyReviews();
        }

        chatReviewSubmittedUnsub?.();
        chatReviewDeletedUnsub?.();
        const refresh = () => this.renderChatDetail(chatId);
        chatReviewSubmittedUnsub = eventBus.on(REVIEW_EVENTS.SUBMITTED, refresh);
        chatReviewDeletedUnsub = eventBus.on(REVIEW_EVENTS.DELETED, refresh);
    },
};
