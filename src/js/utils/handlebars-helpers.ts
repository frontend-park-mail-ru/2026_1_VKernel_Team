// src/utils/handlebars-helpers.ts
declare const Handlebars: any;

export function registerHandlebarsHelpers(): void {
    if ((window as any).__handlebarsHelpersRegistered) {
        return;
    }
    
    // === Твои базовые хелперы ===
    Handlebars.registerHelper('eq', (a: any, b: any) => a === b);
    Handlebars.registerHelper('ne', (a: any, b: any) => a !== b);
    Handlebars.registerHelper('gt', (a: number, b: number) => a > b);
    Handlebars.registerHelper('lt', (a: number, b: number) => a < b);
    Handlebars.registerHelper('gte', (a: number, b: number) => a >= b);
    Handlebars.registerHelper('lte', (a: number, b: number) => a <= b);
    Handlebars.registerHelper('and', (a: any, b: any) => a && b);
    Handlebars.registerHelper('or', (a: any, b: any) => a || b);
    Handlebars.registerHelper('not', (a: any) => !a);
    
    Handlebars.registerHelper('formatPrice', (price: number) => {
        return price === 0 ? 'Бесплатно' : `${price} ₽`;
    });
    
    Handlebars.registerHelper('formatDate', (date: string | Date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('ru-RU');
    });
    
    Handlebars.registerHelper('ifAuthenticated', function(this: any, options: any) {
        const store = (window as any).__APP_STORE__;
        const isAuthenticated = store?.isAuthenticated || false;
        return isAuthenticated ? options.fn(this) : options.inverse(this);
    });

    // === ДОБАВЛЕННЫЕ ХЕЛПЕРЫ ДЛЯ САЙДБАРА ===
    
    // Создание массива прямо в шаблоне
    Handlebars.registerHelper('array', function(...args: any[]) {
        return args.slice(0, -1);
    });

    // Конкатенация строк (для concat tab '_count')
    Handlebars.registerHelper('concat', function(...args: any[]) {
        return args.slice(0, -1).join('');
    });

    // Иконки для вкладок
    Handlebars.registerHelper('iconForTab', function(tab: string) {
        const icons: Record<string, string> = {
            info: '👤', ads: '📦', favorites: '❤️', cart: '🛒',
            messages: '💬', purchases: '🛍️', wallet: '💳', settings: '⚙️'
        };
        return icons[tab] || '📄';
    });

    // Названия для вкладок
    Handlebars.registerHelper('labelForTab', function(tab: string) {
        const labels: Record<string, string> = {
            info: 'Личные данные', ads: 'Мои объявления', favorites: 'Избранное', 
            cart: 'Корзина', messages: 'Сообщения', purchases: 'Мои покупки', 
            wallet: 'Кошелек', settings: 'Настройки'
        };
        return labels[tab] || tab;
    });
    
    (window as any).__handlebarsHelpersRegistered = true;
}
