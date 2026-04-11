// src/utils/handlebars-helpers.ts
declare const Handlebars: any;

export function registerHandlebarsHelpers(): void {
    // Проверяем, не зарегистрированы ли уже хелперы
    if ((window as any).__handlebarsHelpersRegistered) {
        return;
    }
    
    // Базовые хелперы сравнения
    Handlebars.registerHelper('eq', function(a: any, b: any) {
        return a === b;
    });
    
    Handlebars.registerHelper('ne', function(a: any, b: any) {
        return a !== b;
    });
    
    Handlebars.registerHelper('gt', function(a: number, b: number) {
        return a > b;
    });
    
    Handlebars.registerHelper('lt', function(a: number, b: number) {
        return a < b;
    });
    
    Handlebars.registerHelper('gte', function(a: number, b: number) {
        return a >= b;
    });
    
    Handlebars.registerHelper('lte', function(a: number, b: number) {
        return a <= b;
    });
    
    // Логические операции
    Handlebars.registerHelper('and', function(a: any, b: any) {
        return a && b;
    });
    
    Handlebars.registerHelper('or', function(a: any, b: any) {
        return a || b;
    });
    
    Handlebars.registerHelper('not', function(a: any) {
        return !a;
    });
    
    // Форматирование
    Handlebars.registerHelper('formatPrice', (price: number) => {
        return price === 0 ? 'Бесплатно' : `${price} ₽`;
    });
    
    Handlebars.registerHelper('formatDate', (date: string | Date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('ru-RU');
    });
    
    // Проверка аутентификации
    Handlebars.registerHelper('ifAuthenticated', function(this: any, options: any) {
        // Получаем состояние из глобального store
        const store = (window as any).__APP_STORE__;
        const isAuthenticated = store?.isAuthenticated || false;
        return isAuthenticated ? options.fn(this) : options.inverse(this);
    });
    
    // Помечаем, что хелперы зарегистрированы
    (window as any).__handlebarsHelpersRegistered = true;
}
