const CACHE_NAME = 'clover-static-v1';

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/base.css',
    '/css/components.css',
    '/css/auth.css',
    '/css/main.css',
    '/css/styles.css',
    '/css/cart.css',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    event.respondWith(networkFirst(request));
});

function isStaticAsset(pathname) {
    return (
        /\.[a-f0-9]{8,}\.(js|css)$/.test(pathname) ||
        pathname.startsWith('/images/') ||
        pathname.startsWith('/js/') ||
        /\.(png|jpe?g|gif|svg|webp|ico|woff2?)$/.test(pathname)
    );
}

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('', { status: 503 });
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;

        const fallback = await caches.match('/index.html');
        if (fallback) return fallback;

        return new Response('Offline', { status: 503 });
    }
}
