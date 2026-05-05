declare module '*.css';
declare module '*.scss';
declare module '*.hbs?raw' {
    const content: string;
    export default content;
}
declare module '*.svg?raw' {
    const content: string;
    export default content;
}
declare module '*.svg' {
    const url: string;
    export default url;
}
