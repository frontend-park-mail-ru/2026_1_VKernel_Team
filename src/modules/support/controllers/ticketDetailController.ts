import { supportApi } from '../api/supportApi';
import type { SupportTicket } from '../types';

import detailTemplateRaw from '../views/ticket-detail.hbs?raw';
import editTemplateRaw from '../views/ticket-edit.hbs?raw';

declare const Handlebars: any;

let detailCompiled: ((ctx: any) => string) | null = null;
let editCompiled: ((ctx: any) => string) | null = null;

function getDetailTemplate(): (ctx: any) => string {
    if (!detailCompiled) {
        detailCompiled = Handlebars.compile(detailTemplateRaw);
    }
    return detailCompiled!;
}

function getEditTemplate(): (ctx: any) => string {
    if (!editCompiled) {
        editCompiled = Handlebars.compile(editTemplateRaw);
    }
    return editCompiled!;
}

export const TicketDetailController = {
    _ticket: null as SupportTicket | null,
    _onNavigate: null as ((page: string, data?: any) => void) | null,

    setNavigator(fn: (page: string, data?: any) => void) {
        this._onNavigate = fn;
    },

    async render(container: HTMLElement, ticketId: number): Promise<void> {
        container.innerHTML =
            '<div class="support-tickets__loader"><div class="spinner"></div></div>';

        const result = await supportApi.getTicket(ticketId);
        if (result.success && result.data) {
            this._ticket = result.data;
        } else {
            container.innerHTML =
                '<div class="support-tickets__empty"><p>Обращение не найдено</p></div>';
            return;
        }

        container.innerHTML = getDetailTemplate()({ ticket: this._ticket });
        this.attachDetailEvents(container);
    },

    attachDetailEvents(container: HTMLElement): void {
        const backBtn = container.querySelector('#support-back-btn');
        backBtn?.addEventListener('click', () => {
            this._onNavigate?.('list');
        });

        const editBtn = container.querySelector('#support-edit-btn');
        editBtn?.addEventListener('click', () => {
            if (this._ticket) {
                this.renderEdit(container);
            }
        });
    },

    renderEdit(container: HTMLElement): void {
        if (!this._ticket) return;
        container.innerHTML = getEditTemplate()({ ticket: this._ticket });
        this.attachEditEvents(container);
    },

    attachEditEvents(container: HTMLElement): void {
        const backBtn = container.querySelector('#support-back-btn');
        backBtn?.addEventListener('click', () => {
            if (this._ticket) {
                this.renderDetail(container);
            }
        });

        const form = container.querySelector('#support-edit-form') as HTMLFormElement | null;
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSave(container);
        });
    },

    renderDetail(container: HTMLElement): void {
        container.innerHTML = getDetailTemplate()({ ticket: this._ticket });
        this.attachDetailEvents(container);
    },

    validate(category: string, title: string, description: string): boolean {
        let valid = true;

        const catErr = document.getElementById('category-error');
        const titleErr = document.getElementById('title-error');
        const descErr = document.getElementById('description-error');

        if (catErr) catErr.textContent = '';
        if (titleErr) titleErr.textContent = '';
        if (descErr) descErr.textContent = '';

        if (!category) {
            if (catErr) catErr.textContent = 'Выберите категорию';
            valid = false;
        }
        if (!title.trim()) {
            if (titleErr) titleErr.textContent = 'Введите заголовок';
            valid = false;
        } else if (title.trim().length > 255) {
            if (titleErr) titleErr.textContent = 'Заголовок не должен превышать 255 символов';
            valid = false;
        }
        if (!description.trim()) {
            if (descErr) descErr.textContent = 'Введите описание';
            valid = false;
        }

        return valid;
    },

    async handleSave(container: HTMLElement): Promise<void> {
        if (!this._ticket) return;

        const category =
            (container.querySelector('#ticket-category') as HTMLSelectElement)?.value || '';
        const title = (container.querySelector('#ticket-title') as HTMLInputElement)?.value || '';
        const description =
            (container.querySelector('#ticket-description') as HTMLTextAreaElement)?.value || '';

        if (!this.validate(category, title, description)) return;

        const saveBtn = container.querySelector('#support-save-btn') as HTMLButtonElement | null;
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Сохранение...';
        }

        const result = await supportApi.updateTicket(this._ticket.id, {
            category,
            title,
            description,
        });

        if (result.success && result.data) {
            this._ticket = result.data;
            this.renderDetail(container);
        } else {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Сохранить';
            }
            const descErr = document.getElementById('description-error');
            if (descErr) descErr.textContent = result.error || 'Ошибка при сохранении';
        }
    },
};
