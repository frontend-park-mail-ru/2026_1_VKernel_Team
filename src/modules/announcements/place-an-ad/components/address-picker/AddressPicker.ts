/**
 * Компонент выбора адреса с Яндекс-саджестом и интерактивной картой.
 *
 * Поток:
 * 1. Пользователь вводит адрес — `ymaps3.suggest` отдаёт подсказки (требуется Suggest API ключ).
 * 2. Клик по саджесту — текст подставляется в инпут. Координаты не запрашиваем —
 *    `ymaps3.search` в v3 живёт в отдельном пакете, и пока его не используем,
 *    чтобы не плодить зависимости. Адрес для бэка уходит строкой.
 * 3. Карта показывается всегда. Пользователь кликает по карте — туда ставится
 *    draggable-метка, координаты сохраняются в hidden inputs (`#location_lat`,
 *    `#location_lon`). Метку можно перетащить — координаты обновляются.
 *
 * Когда подымется бэкенд-эндпоинт `/api/v1/geocode` — добавим прямой/обратный
 * геокод и автоматическую установку метки по выбранному саджесту.
 */

import './address-picker.scss';
import { CONFIG } from '@core/config';
import {
    loadYandexMaps,
    type YMaps3,
    type YMapInstance,
    type YMapMarkerInstance,
    type SuggestItem,
} from '@/utils/yandexMaps';

export interface AddressValue {
    text: string;
    lat: number | null;
    lon: number | null;
}

const DEFAULT_CENTER: [number, number] = [37.6173, 55.7558]; // Москва: [lon, lat]
const DEFAULT_ZOOM = 10;
const MARKER_ZOOM = 15;
const SUGGEST_DEBOUNCE_MS = 250;
const SUGGEST_MIN_LENGTH = 3;
const SUGGEST_LIMIT = 7;

export class AddressPicker {
    private root: HTMLElement;
    private input: HTMLInputElement;
    private latInput: HTMLInputElement;
    private lonInput: HTMLInputElement;
    private suggestList: HTMLUListElement;
    private mapContainer: HTMLElement;

    private ymaps: YMaps3 | null = null;
    private map: YMapInstance | null = null;
    private marker: YMapMarkerInstance | null = null;

    private suggestItems: SuggestItem[] = [];
    private activeSuggestIndex = -1;
    private suggestTimer: number | null = null;
    private mapLoadPromise: Promise<void> | null = null;
    private destroyed = false;

    private onDocumentClick = (e: MouseEvent): void => {
        if (!this.root.contains(e.target as Node)) {
            this.hideSuggest();
        }
    };

    constructor(root: HTMLElement) {
        this.root = root;
        this.input = root.querySelector<HTMLInputElement>('#location')!;
        this.latInput = root.querySelector<HTMLInputElement>('#location_lat')!;
        this.lonInput = root.querySelector<HTMLInputElement>('#location_lon')!;
        this.suggestList = root.querySelector<HTMLUListElement>('.address-picker__suggest')!;
        this.mapContainer = root.querySelector<HTMLElement>('.address-picker__map')!;

        if (
            !this.input ||
            !this.latInput ||
            !this.lonInput ||
            !this.suggestList ||
            !this.mapContainer
        ) {
            throw new Error('AddressPicker: required DOM elements are missing');
        }

        this.attachInputListeners();
        document.addEventListener('click', this.onDocumentClick);

        // Карту монтируем сразу — пользователю сразу видно, куда тыкать.
        void this.ensureMap();
    }

    getValue(): AddressValue {
        const lat = parseFloat(this.latInput.value);
        const lon = parseFloat(this.lonInput.value);
        return {
            text: this.input.value.trim(),
            lat: Number.isFinite(lat) ? lat : null,
            lon: Number.isFinite(lon) ? lon : null,
        };
    }

    setValue(value: Partial<AddressValue>): void {
        if (value.text !== undefined) this.input.value = value.text;
        if (value.lat !== undefined && value.lat !== null) {
            this.latInput.value = String(value.lat);
        }
        if (value.lon !== undefined && value.lon !== null) {
            this.lonInput.value = String(value.lon);
        }
        if (value.lat != null && value.lon != null) {
            void this.applyMarker([value.lon, value.lat], MARKER_ZOOM);
        }
    }

    clear(): void {
        this.input.value = '';
        this.latInput.value = '';
        this.lonInput.value = '';
        this.hideSuggest();
        if (this.marker?.destroy) {
            this.marker.destroy();
        }
        this.marker = null;
        if (this.map) {
            this.map.setLocation({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 0 });
        }
    }

    destroy(): void {
        this.destroyed = true;
        document.removeEventListener('click', this.onDocumentClick);
        if (this.suggestTimer !== null) {
            window.clearTimeout(this.suggestTimer);
        }
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
    }

    private attachInputListeners(): void {
        this.input.addEventListener('input', () => {
            this.scheduleSuggest(this.input.value);
        });
        this.input.addEventListener('focus', () => {
            if (this.suggestItems.length) this.renderSuggest();
        });
        this.input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
    }

    private scheduleSuggest(query: string): void {
        if (this.suggestTimer !== null) {
            window.clearTimeout(this.suggestTimer);
        }

        const trimmed = query.trim();
        if (trimmed.length < SUGGEST_MIN_LENGTH) {
            this.suggestItems = [];
            this.hideSuggest();
            return;
        }

        this.suggestTimer = window.setTimeout(() => {
            void this.fetchSuggest(trimmed);
        }, SUGGEST_DEBOUNCE_MS);
    }

    private async fetchSuggest(text: string): Promise<void> {
        try {
            const ymaps = await this.ensureSdk();
            if (this.destroyed) return;

            const apikey = CONFIG.YANDEX.SUGGEST_KEY || undefined;
            const items = await ymaps.suggest({ text, apikey, results: SUGGEST_LIMIT });
            if (this.destroyed) return;

            this.suggestItems = items;
            this.activeSuggestIndex = -1;
            this.renderSuggest();
        } catch (err) {
            console.warn('AddressPicker: suggest failed', err);
        }
    }

    private renderSuggest(): void {
        if (!this.suggestItems.length) {
            this.hideSuggest();
            return;
        }

        this.suggestList.innerHTML = this.suggestItems
            .map((item, idx) => {
                const title = escapeHtml(item.title?.text ?? '');
                const subtitle = item.subtitle?.text ? escapeHtml(item.subtitle.text) : '';
                const activeClass = idx === this.activeSuggestIndex ? ' is-active' : '';
                return `
                    <li data-idx="${idx}" class="${activeClass.trim()}">
                        <div class="address-picker__suggest-title">${title}</div>
                        ${subtitle ? `<div class="address-picker__suggest-subtitle">${subtitle}</div>` : ''}
                    </li>
                `;
            })
            .join('');

        this.suggestList.hidden = false;
        this.suggestList.querySelectorAll('li').forEach((li) => {
            li.addEventListener('mousedown', (e) => {
                // mousedown — чтобы клик отработал до blur инпута
                e.preventDefault();
                const idx = Number((li as HTMLElement).dataset.idx);
                this.selectSuggest(idx);
            });
        });
    }

    private hideSuggest(): void {
        this.suggestList.hidden = true;
        this.suggestList.innerHTML = '';
        this.activeSuggestIndex = -1;
    }

    private handleInputKeydown(e: KeyboardEvent): void {
        if (this.suggestList.hidden || !this.suggestItems.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.activeSuggestIndex = (this.activeSuggestIndex + 1) % this.suggestItems.length;
            this.renderSuggest();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.activeSuggestIndex =
                (this.activeSuggestIndex - 1 + this.suggestItems.length) % this.suggestItems.length;
            this.renderSuggest();
        } else if (e.key === 'Enter') {
            if (this.activeSuggestIndex >= 0) {
                e.preventDefault();
                this.selectSuggest(this.activeSuggestIndex);
            }
        } else if (e.key === 'Escape') {
            this.hideSuggest();
        }
    }

    private selectSuggest(idx: number): void {
        const item = this.suggestItems[idx];
        if (!item) return;

        const text = [item.title?.text, item.subtitle?.text].filter(Boolean).join(', ');
        this.input.value = text;
        this.hideSuggest();
    }

    private async ensureSdk(): Promise<YMaps3> {
        if (this.ymaps) return this.ymaps;
        this.ymaps = await loadYandexMaps();
        return this.ymaps;
    }

    private ensureMap(): Promise<void> {
        if (this.mapLoadPromise) return this.mapLoadPromise;
        this.mapLoadPromise = this.initMap();
        return this.mapLoadPromise;
    }

    private async initMap(): Promise<void> {
        try {
            const ymaps = await this.ensureSdk();
            if (this.destroyed) return;

            const map = new ymaps.YMap(this.mapContainer, {
                location: { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM },
                behaviors: ['drag', 'pinchZoom', 'mouseTilt', 'scrollZoom'],
            });
            map.addChild(new ymaps.YMapDefaultSchemeLayer());
            map.addChild(new ymaps.YMapDefaultFeaturesLayer());

            map.addChild(
                new ymaps.YMapListener({
                    onClick: (_obj, event) => {
                        const coords = event.coordinates;
                        this.latInput.value = String(coords[1]);
                        this.lonInput.value = String(coords[0]);
                        void this.applyMarker(coords);
                    },
                }),
            );

            this.map = map;
        } catch (err) {
            console.error('AddressPicker: map init failed', err);
            this.showMapError('Не удалось загрузить карту');
            this.mapLoadPromise = null;
        }
    }

    private async applyMarker(coords: [number, number], zoom?: number): Promise<void> {
        await this.ensureMap();
        if (!this.map || !this.ymaps) return;

        const isFirstMarker = !this.marker;
        this.map.setLocation({
            center: coords,
            zoom: isFirstMarker ? (zoom ?? MARKER_ZOOM) : undefined,
            duration: 300,
        });

        if (this.marker) {
            this.marker.update({ coordinates: coords });
            return;
        }

        const el = document.createElement('div');
        el.className = 'address-picker__marker';
        const markerInstance = new this.ymaps.YMapMarker(
            {
                coordinates: coords,
                draggable: true,
                onDragEnd: (newCoords) => {
                    this.latInput.value = String(newCoords[1]);
                    this.lonInput.value = String(newCoords[0]);
                },
            },
            el,
        );
        this.map.addChild(markerInstance);
        this.marker = markerInstance;
    }

    private showMapError(message: string): void {
        const err = document.createElement('div');
        err.className = 'address-picker__map-error';
        err.textContent = message;
        this.mapContainer.after(err);
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
