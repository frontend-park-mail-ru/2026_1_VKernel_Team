import { supportApi } from '../api/supportApi';
import type { SupportTicket } from '../types';

import templateRaw from '../views/ticket-list.hbs?raw';

declare const Handlebars: any;

let compiled: ((ctx: any) => string) | null = null;

function getTemplate(): (ctx: any) => string {
    if (!compiled) {
        compiled = Handlebars.compile(templateRaw);
    }
    return compiled!;
}

export const TicketListController = {
    _tickets: [] as SupportTicket[],
    _onNavigate: null as ((page: string, data?: any) => void) | null,

    setNavigator(fn: (page: string, data?: any) => void) {
        this._onNavigate = fn;
    },

    async render(container: HTMLElement): Promise<void> {
        container.innerHTML = getTemplate()({ isLoading: true, tickets: [] });

        const result = await supportApi.getMyTickets();
        if (result.success && result.data) {
            this._tickets = Array.isArray(result.data) ? result.data : [];
        } else {
            this._tickets = [];
        }

        container.innerHTML = getTemplate()({
            isLoading: false,
            tickets: this._tickets,
        });

        this.attachEvents(container);
    },

    attachEvents(container: HTMLElement): void {
        const createBtn = container.querySelector('#support-create-btn');
        createBtn?.addEventListener('click', () => {
            this._onNavigate?.('create');
        });

        container.querySelectorAll('.support-ticket-card').forEach((card) => {
            card.addEventListener('click', () => {
                const id = (card as HTMLElement).dataset.ticketId;
                if (id) this._onNavigate?.('detail', { id: Number(id) });
            });
        });
    },
};
