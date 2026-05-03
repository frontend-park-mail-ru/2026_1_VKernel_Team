import { TicketListController } from './ticketListController';
import { TicketCreateController } from './ticketCreateController';
import { TicketDetailController } from './ticketDetailController';

import layoutTemplateRaw from '../views/widget-layout.hbs?raw';
import '../styles/support.scss';

declare const Handlebars: any;

let layoutCompiled: ((ctx: any) => string) | null = null;

function getLayoutTemplate(): (ctx: any) => string {
    if (!layoutCompiled) {
        layoutCompiled = Handlebars.compile(layoutTemplateRaw);
    }
    return layoutCompiled!;
}

export const SupportWidgetController = {
    _root: null as HTMLElement | null,
    _contentEl: null as HTMLElement | null,
    _currentPage: 'list' as string,

    init(root: HTMLElement): void {
        this._root = root;
        root.innerHTML = getLayoutTemplate()({});

        this._contentEl = root.querySelector('#support-content');

        const closeBtn = root.querySelector('#support-close-btn');
        closeBtn?.addEventListener('click', () => {
            window.parent.postMessage({ type: 'support-widget-close' }, '*');
        });

        const navigate = (page: string, data?: any) => this.navigate(page, data);
        TicketListController.setNavigator(navigate);
        TicketCreateController.setNavigator(navigate);
        TicketDetailController.setNavigator(navigate);

        this.navigate('list');
    },

    navigate(page: string, data?: any): void {
        if (!this._contentEl) return;
        this._currentPage = page;
        this._lastNavData = data ?? null;

        switch (page) {
            case 'list':
                TicketListController.render(this._contentEl);
                break;
            case 'create':
                TicketCreateController.render(this._contentEl);
                break;
            case 'detail':
                if (data?.id) {
                    TicketDetailController.render(this._contentEl, data.id);
                }
                break;
        }
    },

    // Перерисовать текущую страницу (например, после открытия виджета).
    refresh(): void {
        this.navigate(this._currentPage, this._lastNavData ?? undefined);
    },

    _lastNavData: null as any,
};
