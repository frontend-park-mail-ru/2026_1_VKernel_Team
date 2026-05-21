/**
 * Ленивый загрузчик Yandex Maps JS API v3.
 * Скрипт подгружается один раз — последующие вызовы возвращают тот же промис.
 */

import { CONFIG } from '@core/config';

declare global {
    interface Window {
        ymaps3?: YMaps3;
    }
}

export interface YMaps3 {
    ready: Promise<void>;
    YMap: new (root: HTMLElement, props: YMapProps) => YMapInstance;
    YMapDefaultSchemeLayer: new () => unknown;
    YMapDefaultFeaturesLayer: new () => unknown;
    YMapMarker: new (props: YMapMarkerProps, element?: HTMLElement) => YMapMarkerInstance;
    YMapListener: new (props: YMapListenerProps) => unknown;
    suggest: (params: SuggestParams) => Promise<SuggestItem[]>;
    search: (params: SearchParams) => Promise<SearchResult[]>;
}

export interface YMapProps {
    location: { center: [number, number]; zoom: number };
    behaviors?: string[];
}

export interface YMapInstance {
    addChild(child: unknown): void;
    setLocation(location: { center?: [number, number]; zoom?: number; duration?: number }): void;
    destroy(): void;
}

export interface YMapMarkerProps {
    coordinates: [number, number];
    draggable?: boolean;
    onDragEnd?: (coords: [number, number]) => void;
}

export interface YMapMarkerInstance {
    update(props: Partial<YMapMarkerProps>): void;
    destroy?(): void;
}

export interface YMapListenerProps {
    onClick?: (object: unknown, event: { coordinates: [number, number] }) => void;
}

export interface SuggestParams {
    text: string;
    apikey?: string;
    bbox?: [[number, number], [number, number]];
    results?: number;
}

export interface SuggestItem {
    title: { text: string };
    subtitle?: { text: string };
    uri?: string;
}

export interface SearchParams {
    text?: string;
    geometry?: { type: 'Point'; coordinates: [number, number] };
    apikey?: string;
}

export interface SearchResult {
    geometry?: { coordinates: [number, number] };
    properties?: {
        name?: string;
        description?: string;
        address?: { formatted_address?: string };
    };
}

let loadPromise: Promise<YMaps3> | null = null;

/**
 * Подгружает Yandex Maps JS API v3 и резолвится после `ymaps3.ready`.
 * При первом вызове вставляет <script>, при последующих — отдаёт кешированный промис.
 */
export function loadYandexMaps(): Promise<YMaps3> {
    if (loadPromise) return loadPromise;

    const apiKey = CONFIG.YANDEX.JSAPI_KEY;
    if (!apiKey) {
        return Promise.reject(new Error('YANDEX_JSAPI_KEY is not configured'));
    }

    loadPromise = new Promise((resolve, reject) => {
        // На случай, если SDK уже был подгружен сторонним скриптом.
        if (window.ymaps3) {
            window.ymaps3.ready.then(() => resolve(window.ymaps3 as YMaps3));
            return;
        }

        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
        script.async = true;
        script.onload = () => {
            const ymaps3 = window.ymaps3;
            if (!ymaps3) {
                reject(new Error('Yandex Maps SDK loaded but window.ymaps3 is missing'));
                return;
            }
            ymaps3.ready.then(() => resolve(ymaps3));
        };
        script.onerror = () => {
            loadPromise = null;
            reject(new Error('Не удалось загрузить Yandex Maps SDK'));
        };
        document.head.appendChild(script);
    });

    return loadPromise;
}
