import '@modules/chat/components/chat-list-item/styles.scss';
import template from '@modules/chat/components/chat-list-item/chat-list-item.hbs?raw';

export const ChatListItemComponent = {
    getTemplate(): string {
        return template;
    },
};
