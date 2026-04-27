import { apiClient, API_ENDPOINTS } from '@api/apiClient';
import { supportApi } from '../api/supportApi';
import type { SupportMessage } from '../types';

import chatTemplateRaw from '../views/chat.hbs?raw';

declare const Handlebars: any;

let compiled: ((ctx: any) => string) | null = null;

function getTemplate(): (ctx: any) => string {
    if (!compiled) {
        compiled = Handlebars.compile(chatTemplateRaw);
    }
    return compiled!;
}

interface ChatMessageView extends SupportMessage {
    isOwn: boolean;
}

export const ChatController = {
    _ticketId: null as number | null,
    _container: null as HTMLElement | null,
    _messages: [] as SupportMessage[],
    _currentUserId: null as number | null,

    async render(container: HTMLElement, ticketId: number): Promise<void> {
        this._container = container;
        this._ticketId = ticketId;

        if (this._currentUserId == null) {
            await this.loadCurrentUserId();
        }

        container.innerHTML = '<div class="support-chat__loader"><div class="spinner"></div></div>';

        const result = await supportApi.getMessages(ticketId);
        this._messages = result.success && Array.isArray(result.data) ? result.data : [];

        this.renderMessages();
        this.attachEvents();
        this.scrollToBottom();
    },

    async loadCurrentUserId(): Promise<void> {
        const result = await apiClient.get<any>(API_ENDPOINTS.USERS.PROFILE);
        if (result.success && result.data) {
            this._currentUserId = result.data.id ?? result.data.user_id ?? null;
        }
    },

    renderMessages(): void {
        if (!this._container) return;
        const view: ChatMessageView[] = this._messages.map((m) => ({
            ...m,
            isOwn: this._currentUserId !== null && m.user_id === this._currentUserId,
        }));
        this._container.innerHTML = getTemplate()({ messages: view });
    },

    attachEvents(): void {
        if (!this._container) return;
        const form = this._container.querySelector('#support-chat-form') as HTMLFormElement | null;
        const input = this._container.querySelector(
            '#support-chat-input',
        ) as HTMLTextAreaElement | null;

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSend();
        });

        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        input?.addEventListener('input', () => {
            if (!input) return;
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 100) + 'px';
        });
    },

    async handleSend(): Promise<void> {
        if (!this._container || this._ticketId == null) return;

        const input = this._container.querySelector(
            '#support-chat-input',
        ) as HTMLTextAreaElement | null;
        const sendBtn = this._container.querySelector(
            '#support-chat-send',
        ) as HTMLButtonElement | null;

        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        if (sendBtn) sendBtn.disabled = true;
        input.disabled = true;

        const result = await supportApi.sendMessage(this._ticketId, { text });

        if (result.success && result.data) {
            this._messages.push(result.data);
            input.value = '';
            input.style.height = 'auto';
            this.renderMessages();
            this.attachEvents();
            this.scrollToBottom();
        }

        if (sendBtn) sendBtn.disabled = false;
        input.disabled = false;
        input.focus();
    },

    scrollToBottom(): void {
        const list = this._container?.querySelector('#support-chat-messages') as HTMLElement | null;
        if (list) list.scrollTop = list.scrollHeight;
    },

    reset(): void {
        this._ticketId = null;
        this._container = null;
        this._messages = [];
    },
};
