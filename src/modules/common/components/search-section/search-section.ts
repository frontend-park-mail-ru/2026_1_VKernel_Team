import '@modules/common/components/search-section/style.scss';
import { searchSuggestService, type SuggestItem } from '@/services/searchSuggestService';
import { eventBus } from '@/core/eventBus';
import { getIcon } from '@/utils/icons';

const SUGGEST_DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;

export const SearchSectionComponent = {
    _suggestTimer: null as ReturnType<typeof setTimeout> | null,
    _activeRequestQuery: '' as string,
    _activeIndex: -1 as number,
    _outsideHandler: null as ((e: Event) => void) | null,

    getTemplate(): string {
        return `
<div class="search-section">
    <div class="search-row">
        <div class="brand">
            <img src="/images/logo/logo_clover2.png" alt="Логотип" class="logo" data-nav="/">
        </div>
        <div class="search-wrapper">
            <input
                type="text"
                class="search-input"
                id="globalSearchInput"
                placeholder="Поиск объявлений..."
                autocomplete="off"
                aria-label="Поиск объявлений"
            >
            <button class="btn place-ad-btn" id="globalSearchBtn" aria-label="Найти">Найти</button>
            <div class="search-suggestions" id="globalSearchSuggestions" hidden role="listbox"></div>
        </div>
    </div>
</div>
        `.trim();
    },

    initSearchHandlers(): void {
        const searchInput = document.getElementById('globalSearchInput') as HTMLInputElement;
        const searchBtn = document.getElementById('globalSearchBtn') as HTMLButtonElement;
        const suggestBox = document.getElementById('globalSearchSuggestions') as HTMLElement;

        if (!searchInput || !searchBtn) return;

        const performSearch = () => {
            const query = searchInput.value.trim();
            this.hideSuggestions(suggestBox);
            if (query) {
                eventBus.emit('app:navigate', `/search?query=${encodeURIComponent(query)}`);
            } else {
                eventBus.emit('app:navigate', '/search');
            }
        };

        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('input', () => {
            this.scheduleSuggest(searchInput, suggestBox);
        });

        searchInput.addEventListener('focus', () => {
            const query = searchInput.value.trim();
            if (query.length >= MIN_QUERY_LENGTH && suggestBox?.dataset.lastQuery === query) {
                this.showSuggestions(suggestBox);
            }
        });

        searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this._activeIndex >= 0 && suggestBox && !suggestBox.hidden) {
                    const items = suggestBox.querySelectorAll<HTMLElement>('[data-suggest-id]');
                    const target = items[this._activeIndex];
                    if (target) {
                        const id = target.dataset.suggestId;
                        this.hideSuggestions(suggestBox);
                        eventBus.emit('app:navigate', `/ad/${id}`);
                        return;
                    }
                }
                performSearch();
                return;
            }
            if (e.key === 'Escape') {
                this.hideSuggestions(suggestBox);
                return;
            }
            if (!suggestBox || suggestBox.hidden) return;
            const items = suggestBox.querySelectorAll<HTMLElement>('[data-suggest-id]');
            if (items.length === 0) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this._activeIndex = (this._activeIndex + 1) % items.length;
                this.highlightActive(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this._activeIndex =
                    this._activeIndex <= 0 ? items.length - 1 : this._activeIndex - 1;
                this.highlightActive(items);
            }
        });

        if (suggestBox) {
            suggestBox.addEventListener('click', (e: Event) => {
                const target = (e.target as HTMLElement).closest(
                    '[data-suggest-id]',
                ) as HTMLElement | null;
                if (!target) return;
                const id = target.dataset.suggestId;
                this.hideSuggestions(suggestBox);
                if (id) eventBus.emit('app:navigate', `/ad/${id}`);
            });
        }

        if (this._outsideHandler) {
            document.removeEventListener('click', this._outsideHandler);
        }
        this._outsideHandler = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!suggestBox) return;
            if (suggestBox.contains(target)) return;
            if (target === searchInput) return;
            this.hideSuggestions(suggestBox);
        };
        document.addEventListener('click', this._outsideHandler);
    },

    scheduleSuggest(input: HTMLInputElement, box: HTMLElement | null): void {
        if (!box) return;
        if (this._suggestTimer) clearTimeout(this._suggestTimer);

        const query = input.value.trim();
        if (query.length < MIN_QUERY_LENGTH) {
            this.hideSuggestions(box);
            return;
        }

        this._suggestTimer = setTimeout(async () => {
            this._activeRequestQuery = query;
            try {
                const items = await searchSuggestService.search(query);
                if (this._activeRequestQuery !== query) return; // устаревший ответ
                this.renderSuggestions(box, items, query);
            } catch {
                this.hideSuggestions(box);
            }
        }, SUGGEST_DEBOUNCE_MS);
    },

    renderSuggestions(box: HTMLElement, items: SuggestItem[], query: string): void {
        if (items.length === 0) {
            box.innerHTML = `<div class="search-suggestions__empty">Ничего не найдено</div>`;
            box.dataset.lastQuery = query;
            this.showSuggestions(box);
            return;
        }
        box.innerHTML = items
            .map(
                (it, idx) => `
            <button type="button" class="search-suggestions__item" data-suggest-id="${it.id}" data-index="${idx}" role="option">
                <img src="${it.image}" alt="" class="search-suggestions__image" loading="lazy">
                <span class="search-suggestions__title">${this.escapeHTML(it.title)}</span>
                <span class="search-suggestions__price">${it.price === 0 ? 'Бесплатно' : it.price + ' ₽'}</span>
            </button>
        `,
            )
            .join('');
        box.dataset.lastQuery = query;
        this._activeIndex = -1;
        this.showSuggestions(box);
    },

    highlightActive(items: NodeListOf<HTMLElement>): void {
        items.forEach((el, idx) => {
            if (idx === this._activeIndex) el.classList.add('is-active');
            else el.classList.remove('is-active');
        });
    },

    showSuggestions(box: HTMLElement | null): void {
        if (!box) return;
        box.hidden = false;
    },

    hideSuggestions(box: HTMLElement | null): void {
        if (!box) return;
        box.hidden = true;
        this._activeIndex = -1;
    },

    escapeHTML(s: string): string {
        return s.replace(
            /[&<>"']/g,
            (ch) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                })[ch] || ch,
        );
    },
};
