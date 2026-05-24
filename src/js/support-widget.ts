import { storage } from '@/utils/storage';
import { widgetAuth } from '@modules/support/widgetAuth';
import { SupportWidgetController } from '@modules/support/controllers/supportWidgetController';
import { ICONS } from '@/utils/icons';

import * as HandlebarsFull from 'handlebars';

const registerHelpers = (Hbs: any) => {
    if (!Hbs || !Hbs.registerHelper || Hbs.helpers?.eq) return;

    Hbs.registerHelper('eq', function (a: any, b: any) {
        return a === b;
    });

    Hbs.registerHelper('formatDate', function (dateString: string) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('ru-RU');
    });

    Hbs.registerHelper('formatTime', function (dateString: string) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    });

    Hbs.registerHelper('gt', function (a: any, b: any) {
        return a > b;
    });

    Hbs.registerHelper('array', function (...args: any[]) {
        return args.slice(0, -1);
    });

    Hbs.registerHelper('icon', function (name: string) {
        const svg = (ICONS as Record<string, string>)[name] || '';
        return new Hbs.SafeString(svg);
    });
};

window.addEventListener('message', (event: MessageEvent) => {
    if (event.data?.type === 'support-widget-token') {
        const token = event.data.token;
        if (token) {
            storage.setToken(token);
        }
    }

    if (event.data?.type === 'support-widget-auth-changed') {
        const next = !!event.data.isAuthenticated;
        if (next === widgetAuth.isAuthenticated) return;
        widgetAuth.isAuthenticated = next;
        if (!next) {
            storage.removeToken();
        }
        SupportWidgetController.navigate('list');
    }

    if (event.data?.type === 'support-widget-opened') {
        // При открытии виджета перерисовываем текущую страницу;
        // TicketListController сам решит, нужен ли свежий запрос (TTL-кэш).
        SupportWidgetController.refresh();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    registerHelpers(HandlebarsFull);
    if (typeof window !== 'undefined' && (window as any).Handlebars) {
        registerHelpers((window as any).Handlebars);
    }

    const root = document.getElementById('support-root');
    if (root) {
        SupportWidgetController.init(root);
    }
});
