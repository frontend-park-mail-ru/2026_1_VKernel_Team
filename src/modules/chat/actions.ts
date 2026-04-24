/**
 * Действия для работы с чатами
 */
import { chatService } from '@modules/chat/service';
import { uiActions } from '@/actions/uiActions';

export const chatActions = {
    async createOrderForAd(adId: number | string): Promise<number | null> {
        const result = await chatService.createOrder(adId);
        if (result.success && result.data?.chat_id) {
            return result.data.chat_id;
        }
        uiActions.showError(result.error || 'Не удалось создать чат с продавцом');
        return null;
    },

    async confirmOrder(chatId: number | string): Promise<boolean> {
        const result = await chatService.confirmOrder(chatId);
        if (result.success) {
            uiActions.showSuccess('Покупка подтверждена');
            return true;
        }
        uiActions.showError(result.error || 'Не удалось подтвердить покупку');
        return false;
    },
};
