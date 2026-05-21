/**
 * Компонент выбора адреса с Яндекс-саджестом и интерактивной картой.
 *
 * Двусторонний геокодинг через HTTP Geocoder API:
 * - Подсказка/ввод адреса → forward-геокод → ставим метку и центрируем карту.
 * - Клик по карте или drag метки → reverse-геокод → подставляем адрес в инпут.
 *
 * Гонки гасятся монотонным счётчиком — применяем только результат последнего запроса.
 */

import './address-picker.scss';
import { CONFIG } from '@core/config';
import {
    loadYandexMaps,
    geocodeForward,
    geocodeReverse,
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

    // Счётчики для подавления гонок: применяем только результат последнего запроса.
    private forwardGeocodeSeq = 0;
    private reverseGeocodeSeq = 0;

    // Когда сами правим input.value (после reverse-геокода), не хотим показывать суджест.
    private isSettingInputProgrammatically = false;

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
            if (this.isSettingInputProgrammatically) return;
            // Пользователь снова правит адрес вручную — старые координаты больше не соответствуют.
            this.latInput.value = '';
            this.lonInput.value = '';
            this.scheduleSuggest(this.input.value);
        });
        this.input.addEventListener('focus', () => {
            if (this.suggestItems.length) this.renderSuggest();
        });
        this.input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
        // Enter без выбора из суджеста — попытаемся геокодировать то, что введено.
        this.input.addEventListener('change', () => {
            const text = this.input.value.trim();
            if (text && !this.latInput.value) {
                void this.forwardGeocodeAndPlace(text);
            }
        });
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
        this.setInputText(text);
        this.hideSuggest();
        void this.forwardGeocodeAndPlace(text);
    }

    /**
     * Прямой геокод: ищет координаты по тексту адреса и ставит метку.
     * Гонки гасит счётчик forwardGeocodeSeq — применяем только последний запрос.
     */
    private async forwardGeocodeAndPlace(text: string): Promise<void> {
        const seq = ++this.forwardGeocodeSeq;
        try {
            const result = await geocodeForward(text);
            if (this.destroyed || seq !== this.forwardGeocodeSeq || !result) return;

            this.latInput.value = String(result.coords[1]);
            this.lonInput.value = String(result.coords[0]);
            await this.applyMarker(result.coords, MARKER_ZOOM);
        } catch (err) {
            console.warn('AddressPicker: forward geocode failed', err);
        }
    }

    /**
     * Обратный геокод: по координатам подставляет адрес в инпут.
     * Гонки гасит счётчик reverseGeocodeSeq.
     */
    private async reverseGeocodeAndFill(coords: [number, number]): Promise<void> {
        const seq = ++this.reverseGeocodeSeq;
        try {
            const result = await geocodeReverse(coords);
            if (this.destroyed || seq !== this.reverseGeocodeSeq || !result?.text) return;

            this.setInputText(result.text);
        } catch (err) {
            console.warn('AddressPicker: reverse geocode failed', err);
        }
    }

    /**
     * Программная установка адреса: не триггерит ни саджест, ни обнуление координат,
     * но событие 'input' диспатчится, чтобы внешний autoSaveDraft сработал.
     */
    private setInputText(text: string): void {
        this.isSettingInputProgrammatically = true;
        try {
            this.input.value = text;
            this.input.dispatchEvent(new Event('input', { bubbles: true }));
        } finally {
            this.isSettingInputProgrammatically = false;
        }
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
                        void this.reverseGeocodeAndFill(coords);
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
                    void this.reverseGeocodeAndFill(newCoords);
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
