declare module '*.hbs' {
    /**
     * Прекомпилированный шаблон Handlebars
     * @param context Объект данных для рендера
     * @param options Опции рантайма (helpers, partials, data)
     */
    const template: (context: Record<string, unknown>, options?: any) => string;
    export default template;
}

declare module 'handlebars/dist/handlebars.runtime.js' {
    import Handlebars from 'handlebars';
    export default Handlebars;
}
