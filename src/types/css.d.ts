declare module '*.css';
declare module '*.scss';
declare module '*.hbs?raw' {
    const content: string;
    export default content;
}
