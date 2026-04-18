export function registerServiceWorker(): void {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
            console.error('SW registration failed:', error);
        });
    });
}
