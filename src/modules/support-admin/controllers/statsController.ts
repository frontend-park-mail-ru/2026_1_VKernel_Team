import { adminApi } from '../api/adminApi';
import { store } from '@/core/store';
import type { SupportTicketAdmin, StatsResponse } from '../types';

import statsTemplateRaw from '../views/stats-page.hbs?raw';
import tableTemplateRaw from '../views/ticket-table.hbs?raw';
import '../styles/admin.css';

declare const Handlebars: any;

let statsCompiled: ((ctx: any) => string) | null = null;
let tableCompiled: ((ctx: any) => string) | null = null;

function getStatsTemplate(): (ctx: any) => string {
    if (!statsCompiled) {
        Handlebars.registerPartial('ticket-table', tableTemplateRaw);
        statsCompiled = Handlebars.compile(statsTemplateRaw);
    }
    return statsCompiled!;
}

function getTableTemplate(): (ctx: any) => string {
    if (!tableCompiled) {
        tableCompiled = Handlebars.compile(tableTemplateRaw);
    }
    return tableCompiled!;
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
