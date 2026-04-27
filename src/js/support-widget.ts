import { storage } from '@/utils/storage';
import { widgetAuth } from '@modules/support/widgetAuth';
import { SupportWidgetController } from '@modules/support/controllers/supportWidgetController';

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
};

window.addEventListener('message', (event: MessageEvent) => {
    if (event.data?.type === 'support-widget-token') {
        const token = event.data.token;
        if (token) {
            storage.setToken(token);
            widgetAuth.isAuthenticated = true;
        }
    }

    if (event.data?.type === 'support-widget-auth-changed') {
        widgetAuth.isAuthenticated = !!event.data.isAuthenticated;
        if (!event.data.isAuthenticated) {
            storage.removeToken();
        }
        SupportWidgetController.navigate('list');
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
