const CACHE_NAME = 'clover-static-v2';
const IMAGE_CACHE_NAME = 'clover-images-v1';

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/base.css',
    '/css/components.css',
    '/css/auth.css',
    '/css/main.css',
    '/css/styles.css',
    '/css/cart.css',
    '/images/logo/avatar.jpeg',
    '/images/default-ad.jpg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    const validCaches = [CACHE_NAME, IMAGE_CACHE_NAME];
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => !validCaches.includes(key))
                        .map((key) => caches.delete(key)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // API-запросы — пропускаем (кэширование через IndexedDB на уровне приложения)
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // Навигация — network-first, фолбек на index.html
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    // Изображения с бекенда (clover-go.ru) — cache-first в отдельный кэш
    if (isRemoteImage(url)) {
        event.respondWith(imageCacheFirst(request));
        return;
    }

    // Статика — cache-first
    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    event.respondWith(networkFirst(request));
});

function isRemoteImage(url) {
    if (url.hostname.includes('clover-go.ru')) {
        return /\.(png|jpe?g|gif|svg|webp)$/i.test(url.pathname) ||
               url.pathname.startsWith('/uploads/');
    }
    return false;
}

function isStaticAsset(pathname) {
    return (
        /\.[a-f0-9]{8,}\.(js|css)$/.test(pathname) ||
        pathname.startsWith('/images/') ||
        pathname.startsWith('/js/') ||
        /\.(png|jpe?g|gif|svg|webp|ico|woff2?)$/.test(pathname)
    );
}

async function imageCacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request, { mode: 'cors' });
        if (response.ok) {
            const cache = await caches.open(IMAGE_CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('', { status: 503 });
    }
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

        if (request.mode === 'navigate') {
            const fallback = await caches.match('/index.html');
            if (fallback) return fallback;
        }

        return new Response('Offline', { status: 503 });
    }
}
