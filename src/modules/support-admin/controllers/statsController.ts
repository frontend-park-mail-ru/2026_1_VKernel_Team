import { adminApi } from '../api/adminApi';
import { store } from '@/core/store';
import { ChatController } from '@modules/support/controllers/chatController';
import type { SupportTicketAdmin, StatsResponse } from '../types';

import statsTemplateRaw from '../views/stats-page.hbs?raw';
import tableTemplateRaw from '../views/ticket-table.hbs?raw';
import chatPanelTemplateRaw from '../views/admin-chat.hbs?raw';
import '../styles/admin.css';

declare const Handlebars: any;

let statsCompiled: ((ctx: any) => string) | null = null;
let tableCompiled: ((ctx: any) => string) | null = null;
let chatPanelCompiled: ((ctx: any) => string) | null = null;

function ensureHelpers(): void {
    if (Handlebars.helpers?.formatTime) return;
    Handlebars.registerHelper('formatTime', function (dateString: string) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    });
}

function getStatsTemplate(): (ctx: any) => string {
    if (!statsCompiled) {
        ensureHelpers();
        Handlebars.registerPartial('ticket-table', tableTemplateRaw);
        statsCompiled = Handlebars.compile(statsTemplateRaw);
    }
    return statsCompiled!;
}

function getTableTemplate(): (ctx: any) => string {
    if (!tableCompiled) {
        ensureHelpers();
        tableCompiled = Handlebars.compile(tableTemplateRaw);
    }
    return tableCompiled!;
}

function getChatPanelTemplate(): (ctx: any) => string {
    if (!chatPanelCompiled) {
        chatPanelCompiled = Handlebars.compile(chatPanelTemplateRaw);
    }
    return chatPanelCompiled!;
}

function isAuthorized(): boolean {
    const role = store.user?.role;
    return role === 'support' || role === 'admin';
}

export const StatsController = {
    _tickets: [] as SupportTicketAdmin[],
    _stats: null as StatsResponse | null,
    _filterStatus: '' as string,
    _filterCategory: '' as string,
    _openChatTicketId: null as number | null,

    async render(): Promise<void> {
        const app = document.getElementById('app');
        if (!app) return;

        if (!store.isAuthenticated || !isAuthorized()) {
            window.dispatchEvent(new CustomEvent('app:navigate', { detail: { path: '/' } }));
            return;
        }

        app.innerHTML = '<div class="admin-stats"><div class="spinner"></div></div>';

        const [statsRes, ticketsRes] = await Promise.all([
            adminApi.getStats(),
            adminApi.getAllTickets(),
        ]);

        this._stats = statsRes.success && statsRes.data ? statsRes.data : null;
        this._tickets = ticketsRes.success && Array.isArray(ticketsRes.data) ? ticketsRes.data : [];

        this.renderPage(app);
    },

    renderPage(app: HTMLElement): void {
        const stats = this._stats || { total: 0, by_status: {}, by_category: {} };
        const ctx = {
            stats,
            open: stats.by_status?.open ?? 0,
            inProgress: stats.by_status?.in_progress ?? 0,
            closed: stats.by_status?.closed ?? 0,
            bug: stats.by_category?.bug ?? 0,
            suggestion: stats.by_category?.suggestion ?? 0,
            complaint: stats.by_category?.complaint ?? 0,
            tickets: this.getFilteredTickets(),
        };
        app.innerHTML = getStatsTemplate()(ctx);
        this.attachEvents();
    },

    getFilteredTickets(): SupportTicketAdmin[] {
        return this._tickets.filter((t) => {
            if (this._filterStatus && t.status !== this._filterStatus) return false;
            if (this._filterCategory && t.category !== this._filterCategory) return false;
            return true;
        });
    },

    refreshTable(): void {
        const container = document.getElementById('admin-table-container');
        if (!container) return;
        container.innerHTML = getTableTemplate()({ tickets: this.getFilteredTickets() });
        this.attachStatusEvents();
    },

    attachEvents(): void {
        const statusFilter = document.getElementById(
            'admin-filter-status',
        ) as HTMLSelectElement | null;
        const categoryFilter = document.getElementById(
            'admin-filter-category',
        ) as HTMLSelectElement | null;

        statusFilter?.addEventListener('change', () => {
            this._filterStatus = statusFilter.value;
            this.refreshTable();
        });

        categoryFilter?.addEventListener('change', () => {
            this._filterCategory = categoryFilter.value;
            this.refreshTable();
        });

        this.attachStatusEvents();
    },

    attachStatusEvents(): void {
        document.querySelectorAll<HTMLSelectElement>('.admin-status-select').forEach((select) => {
            select.addEventListener('change', () => this.handleStatusChange(select));
        });
        document.querySelectorAll<HTMLButtonElement>('.admin-chat-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const ticketId = Number(btn.dataset.ticketId);
                if (ticketId) this.openChat(ticketId);
            });
        });
    },

    async openChat(ticketId: number): Promise<void> {
        this._openChatTicketId = ticketId;
        const ticket = this._tickets.find((t) => t.id === ticketId);

        let overlay = document.getElementById('admin-chat-overlay') as HTMLElement | null;
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'admin-chat-overlay';
            overlay.className = 'admin-chat-overlay';
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = getChatPanelTemplate()({
            ticketId,
            ticketTitle: ticket?.title ?? '',
        });
        overlay.classList.add('admin-chat-overlay--open');

        const closeBtn = overlay.querySelector('#admin-chat-close');
        closeBtn?.addEventListener('click', () => this.closeChat());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeChat();
        });

        const chatBody = overlay.querySelector('#admin-chat-body') as HTMLElement | null;
        if (chatBody) {
            await ChatController.render(chatBody, ticketId);
        }
    },

    closeChat(): void {
        this._openChatTicketId = null;
        ChatController.reset();
        const overlay = document.getElementById('admin-chat-overlay');
        if (overlay) {
            overlay.classList.remove('admin-chat-overlay--open');
            overlay.innerHTML = '';
        }
    },

    async handleStatusChange(select: HTMLSelectElement): Promise<void> {
        const ticketId = Number(select.dataset.ticketId);
        const newStatus = select.value as 'open' | 'in_progress' | 'closed';
        if (!ticketId) return;

        const previousValue = this._tickets.find((t) => t.id === ticketId)?.status;
        select.disabled = true;

        const result = await adminApi.changeStatus(ticketId, { status: newStatus });

        if (result.success && result.data) {
            const ticket = this._tickets.find((t) => t.id === ticketId);
            if (ticket) {
                ticket.status = newStatus;
                ticket.updated_at = result.data.updated_at;
            }
            if (this._stats) {
                if (previousValue && this._stats.by_status[previousValue] != null) {
                    this._stats.by_status[previousValue] = Math.max(
                        0,
                        this._stats.by_status[previousValue] - 1,
                    );
                }
                this._stats.by_status[newStatus] = (this._stats.by_status[newStatus] ?? 0) + 1;
            }
            const app = document.getElementById('app');
            if (app) this.renderPage(app);
        } else {
            if (previousValue) select.value = previousValue;
            select.disabled = false;
        }
    },
};
