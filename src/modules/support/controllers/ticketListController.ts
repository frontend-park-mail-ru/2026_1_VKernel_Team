import { supportApi } from '../api/supportApi';
import { widgetAuth } from '../widgetAuth';
import type { SupportTicket } from '../types';

import templateRaw from '../views/ticket-list.hbs?raw';
import authRequiredRaw from '../views/auth-required.hbs?raw';

declare const Handlebars: any;

let compiled: ((ctx: any) => string) | null = null;
let authRequiredCompiled: ((ctx: any) => string) | null = null;

function getTemplate(): (ctx: any) => string {
    if (!compiled) {
        compiled = Handlebars.compile(templateRaw);
    }
    return compiled!;
}

function getAuthRequiredTemplate(): (ctx: any) => string {
    if (!authRequiredCompiled) {
        authRequiredCompiled = Handlebars.compile(authRequiredRaw);
    }
    return authRequiredCompiled!;
}

const TICKETS_TTL_MS = 30_000;

export const TicketListController = {
    _tickets: [] as SupportTicket[],
    _lastFetchAt: 0,
    _onNavigate: null as ((page: string, data?: any) => void) | null,

    setNavigator(fn: (page: string, data?: any) => void) {
        this._onNavigate = fn;
    },

    _isCacheFresh(): boolean {
        return this._lastFetchAt > 0 && Date.now() - this._lastFetchAt < TICKETS_TTL_MS;
    },

    async render(container: HTMLElement): Promise<void> {
        if (!widgetAuth.isAuthenticated) {
            container.innerHTML = getAuthRequiredTemplate()({});
            return;
        }

        // Если есть свежий кэш — отрисовываем его и не дёргаем сеть.
        if (this._isCacheFresh()) {
            container.innerHTML = getTemplate()({
                isLoading: false,
                tickets: this._tickets,
            });
            this.attachEvents(container);
            return;
        }

        // Если кэш есть, но протух — показываем его сразу (без скелетона), затем тихо обновляем.
        const hasStaleCache = this._tickets.length > 0;
        container.innerHTML = getTemplate()({
            isLoading: !hasStaleCache,
            tickets: hasStaleCache ? this._tickets : [],
        });
        if (hasStaleCache) this.attachEvents(container);

        const result = await supportApi.getMyTickets();
        if (result.success && result.data) {
            this._tickets = Array.isArray(result.data) ? result.data : [];
            this._lastFetchAt = Date.now();
        } else if (!hasStaleCache) {
            this._tickets = [];
        }

        container.innerHTML = getTemplate()({
            isLoading: false,
            tickets: this._tickets,
        });
        this.attachEvents(container);
    },

    // Принудительный сброс TTL — для случаев, когда нужен гарантированно свежий список
    // (например, после создания/удаления тикета).
    invalidate(): void {
        this._lastFetchAt = 0;
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
