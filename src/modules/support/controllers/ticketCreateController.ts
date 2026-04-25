import { supportApi } from '../api/supportApi';

import templateRaw from '../views/ticket-create.hbs?raw';

declare const Handlebars: any;

let compiled: ((ctx: any) => string) | null = null;

function getTemplate(): (ctx: any) => string {
    if (!compiled) {
        compiled = Handlebars.compile(templateRaw);
    }
    return compiled!;
}

export const TicketCreateController = {
    _onNavigate: null as ((page: string, data?: any) => void) | null,

    setNavigator(fn: (page: string, data?: any) => void) {
        this._onNavigate = fn;
    },

    render(container: HTMLElement): void {
        container.innerHTML = getTemplate()({});
        this.attachEvents(container);
    },

    attachEvents(container: HTMLElement): void {
        const backBtn = container.querySelector('#support-back-btn');
        backBtn?.addEventListener('click', () => {
            this._onNavigate?.('list');
        });

        const form = container.querySelector('#support-create-form') as HTMLFormElement | null;
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(container);
        });
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

    async handleSubmit(container: HTMLElement): Promise<void> {
        const category =
            (container.querySelector('#ticket-category') as HTMLSelectElement)?.value || '';
        const title = (container.querySelector('#ticket-title') as HTMLInputElement)?.value || '';
        const description =
            (container.querySelector('#ticket-description') as HTMLTextAreaElement)?.value || '';

        if (!this.validate(category, title, description)) return;

        const submitBtn = container.querySelector(
            '#support-submit-btn',
        ) as HTMLButtonElement | null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
        }

        const result = await supportApi.createTicket({ category, title, description });

        if (result.success) {
            this._onNavigate?.('list');
        } else {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить';
            }
            const descErr = document.getElementById('description-error');
            if (descErr) descErr.textContent = result.error || 'Ошибка при создании обращения';
        }
    },
};
