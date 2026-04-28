import '@modules/chat/components/chat-message/styles.css';
import template from '@modules/chat/components/chat-message/chat-message.hbs?raw';

export const ChatMessageComponent = {
    getTemplate(): string {
        return template;
    },
};
