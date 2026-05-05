import { CONFIG } from '@/core/config';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { productSearchService } from './service';
import { productSearchStore } from './store';
import { getTemplate } from '.';
import { categoryService } from '@/services/categoryService';
import type { SearchFilters, SortOrder } from './types';

export const ProductSearchController = {
    searchQuery: '',
    searchTimeout: null as ReturnType<typeof setTimeout> | null,

    async render(query?: string, categoryId?: number | null): Promise<void> {
        const state = productSearchStore.getState();

        const queryChanged = query !== undefined && query !== this.searchQuery;
        const categoryChanged =
            categoryId !== undefined && categoryId !== state.filters.category_id;

        if (queryChanged || categoryChanged) {
            this.searchQuery = query || '';

            const newFilters = { ...state.filters };
            if (categoryId !== undefined) {
                newFilters.category_id = categoryId;
            }

            productSearchStore.setState({
                query: query || '',
                filters: newFilters,
                isLoading: true,
                results: [],
                error: null,
                totalCount: 0,
            });
            await this.performSearch();
        } else {
            this.renderFromState();
        }
    },

    async performSearch(): Promise<void> {
        const state = productSearchStore.getState();

        // Раньше при пустом query сразу выходили — но теперь поиск может
        // идти только по фильтрам (category_id), без текстового запроса.
        const hasFilters = !!(
            state.filters.category_id ||
            (state.filters.minPrice && state.filters.minPrice > 0) ||
            (state.filters.maxPrice && state.filters.maxPrice > 0) ||
            (state.filters.condition && state.filters.condition !== 'all')
        );
        const trimmedQuery = (state.query || '').trim();
        if (!trimmedQuery && !hasFilters) {
            productSearchStore.setState({
                results: [],
                totalCount: 0,
                isLoading: false,
                error: null,
            });
            this.renderFromState();
            return;
        }

        productSearchStore.setState({
            filters: {
                minPrice: null,
                maxPrice: null,
                condition: 'all',
                category_id: state.filters.category_id,
            },
            sortOrder: 'default',
        });

        const result = await productSearchService.searchProducts(
            state.query,
            { ...state.filters, minPrice: null, maxPrice: null, condition: 'all' },
            'default',
        );

        if (result.success && result.data) {
            let adsArray: any[] = [];

            if (Array.isArray(result.data)) {
                adsArray = result.data;
            } else if (result.data.ads && Array.isArray(result.data.ads)) {
                adsArray = result.data.ads;
            } else if (result.data.data && Array.isArray(result.data.data)) {
                adsArray = result.data.data;
            }

            const formattedResults = adsArray.map((item: any) => this.formatSearchResult(item));

            productSearchStore.setOriginalResults(formattedResults);

            productSearchStore.setState({
                results: formattedResults,
                totalCount: formattedResults.length,
                isLoading: false,
                error: null,
            });

            this.renderFromState();
        } else {
            productSearchStore.setState({
                error: result.error || 'Ошибка при поиске',
                isLoading: false,
                results: [],
                totalCount: 0,
            });
            this.renderFromState();
        }
    },

    formatSearchResult(ad: any) {
        const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';
        let imageUrl = DEFAULT_AD_IMAGE;

        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0]?.trim();
            if (photoPath) {
                if (photoPath.startsWith('http')) {
                    imageUrl = photoPath;
                } else {
                    const normalized = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
                    imageUrl = `${CONFIG.API.BASE_URL}${normalized}`;
                }
            }
        }

        // Состояние товара хранится среди category_characteristics под именем "Состояние"
        let condition = '';
        if (ad.category_characteristics && Array.isArray(ad.category_characteristics)) {
            const conditionChar = ad.category_characteristics.find(
                (char: any) => char.name === 'Состояние',
            );
            if (conditionChar) {
                condition = conditionChar.value;
            }
        }

        return {
            id: ad.id,
            title: ad.title || 'Без названия',
            price: ad.price || 0,
            condition: condition,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price.toLocaleString('ru-RU') + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl,
            location: ad.location || 'Не указано',
            views: ad.views_count || 0,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
            isOwn: store.isAuthenticated && store.user?.id === ad.seller_id,
            isFavorite: store.favoriteIds.has(Number(ad.id)),
            seller_id: ad.seller_id,
            seller_name: ad.seller_name,
        };
    },

    renderFromState(): void {
        const app = document.getElementById('app');
        const template = getTemplate();
        if (!app || !template) return;

        document.body.classList.remove('auth-page');

        const state = productSearchStore.getState();

        let categoryName = null;
        if (state.filters.category_id) {
            categoryName = this.getCategoryNameById(state.filters.category_id);
        }

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            query: state.query,
            categoryName: categoryName,
            filters: state.filters,
            sortOrder: state.sortOrder,
            results: state.results,
            totalCount: state.totalCount,
            isLoading: state.isLoading,
            error: state.error,
        });

        this.attachEventListeners();

        setTimeout(() => {
            this.initCardClickHandlers();
            this.initFavoriteHandlers();
            this.initCartButtons();
        }, 100);
    },

    getCategoryNameById(categoryId: number): string | null {
        const categories = categoryService.getCachedCategories();
        const category = categories?.find((c) => c.id === categoryId);
        return category?.name || null;
    },

    initCardClickHandlers(): void {
        const cards = document.querySelectorAll('.rec-card');
        cards.forEach((card) => {
            card.removeEventListener('click', this.handleCardClick);
            card.addEventListener('click', this.handleCardClick);
        });
    },

    handleCardClick(e: Event): void {
        const target = e.target as HTMLElement;

        if (target.closest('.rec-card-cart') || target.closest('.rec-card-fav')) {
            return;
        }

        const card = (e.currentTarget as HTMLElement).closest('.rec-card');
        const adId = card?.getAttribute('data-id');

        if (adId) {
            window.location.href = `/ad/${adId}`;
        }
    },

    initFavoriteHandlers(): void {
        const favBtns = document.querySelectorAll('.rec-card-fav');
        favBtns.forEach((btn) => {
            btn.removeEventListener('click', this.handleFavoriteClick);
            btn.addEventListener('click', this.handleFavoriteClick);
        });
    },

    async handleFavoriteClick(e: Event): Promise<void> {
        e.preventDefault();
        e.stopPropagation();

        if (!store.isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        const btn = e.currentTarget as HTMLButtonElement;
        const card = btn.closest('.rec-card');
        const adId = card?.getAttribute('data-id');

        if (!adId) return;

        const isFavorite = store.favoriteIds.has(Number(adId));
        btn.disabled = true;

        btn.classList.toggle('rec-card-fav--active');
        const newFavorites = new Set(store.favoriteIds);
        if (isFavorite) {
            newFavorites.delete(Number(adId));
        } else {
            newFavorites.add(Number(adId));
        }
        store.setState({ favoriteIds: newFavorites });

        try {
            const { PROFILE_CONFIG } = await import('@modules/profile/config');
            const { apiClient } = await import('@/api/apiClient');

            const endpoint = isFavorite
                ? PROFILE_CONFIG.API.REMOVE_FAVORITE(Number(adId))
                : PROFILE_CONFIG.API.ADD_FAVORITE(Number(adId));

            const result = isFavorite
                ? await apiClient.delete(endpoint)
                : await apiClient.post(endpoint, {});

            if (!result.success) {
                btn.classList.toggle('rec-card-fav--active');
                const revertFavorites = new Set(store.favoriteIds);
                if (isFavorite) {
                    revertFavorites.add(Number(adId));
                } else {
                    revertFavorites.delete(Number(adId));
                }
                store.setState({ favoriteIds: revertFavorites });
                uiActions.showError(result.error || 'Ошибка при работе с избранным');
            }
        } catch (error) {
            btn.classList.toggle('rec-card-fav--active');
            const revertFavorites = new Set(store.favoriteIds);
            if (isFavorite) {
                revertFavorites.add(Number(adId));
            } else {
                revertFavorites.delete(Number(adId));
            }
            store.setState({ favoriteIds: revertFavorites });
            console.error('Favorite error:', error);
            uiActions.showError('Не удалось изменить состояние избранного');
        } finally {
            btn.disabled = false;
        }
    },

    initCartButtons(): void {
        const cartBtns = document.querySelectorAll('[data-cart-add]');
        if (cartBtns.length === 0) return;

        import('@modules/cart/components/cart-button/cart-button').then(
            ({ CartButtonComponent }) => {
                CartButtonComponent.initAll();
            },
        );
    },

    attachEventListeners(): void {
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (applyFiltersBtn) {
            const newBtn = applyFiltersBtn.cloneNode(true);
            applyFiltersBtn.parentNode?.replaceChild(newBtn, applyFiltersBtn);

            newBtn.addEventListener('click', () => {
                const minPriceInput = document.getElementById('minPrice') as HTMLInputElement;
                const maxPriceInput = document.getElementById('maxPrice') as HTMLInputElement;

                const minPrice = minPriceInput.value ? Number(minPriceInput.value) : null;
                const maxPrice = maxPriceInput.value ? Number(maxPriceInput.value) : null;

                let condition: 'all' | 'new' | 'used' = 'all';
                const selectedRadio = document.querySelector(
                    'input[name="condition"]:checked',
                ) as HTMLInputElement;
                if (selectedRadio) {
                    condition = selectedRadio.value as 'all' | 'new' | 'used';
                }

                productSearchStore.setState({
                    filters: {
                        ...productSearchStore.getState().filters,
                        minPrice,
                        maxPrice,
                        condition,
                    },
                });

                this.applyFilters();
            });
        }

        const sortingTrigger = document.getElementById('sortingTrigger');
        const sortingMenu = document.getElementById('sortingMenu');

        if (sortingTrigger && sortingMenu) {
            sortingTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                sortingMenu.style.display =
                    sortingMenu.style.display === 'block' ? 'none' : 'block';
            });

            document.addEventListener('click', () => {
                sortingMenu.style.display = 'none';
            });

            const sortingOptions = document.querySelectorAll('.sorting-option');
            sortingOptions.forEach((option) => {
                option.addEventListener('click', () => {
                    const sortValue = (option as HTMLElement).dataset.sort as SortOrder;
                    productSearchStore.setState({ sortOrder: sortValue });

                    const sortingLabel = document.getElementById('sortingLabel');
                    if (sortingLabel) {
                        if (sortValue === 'price_asc') sortingLabel.textContent = 'Сначала дешёвые';
                        else if (sortValue === 'price_desc')
                            sortingLabel.textContent = 'Сначала дорогие';
                        else sortingLabel.textContent = 'По умолчанию';
                    }

                    sortingMenu.style.display = 'none';
                    this.applyFilters();
                });
            });
        }

        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        }

        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.retrySearch());
        }
    },

    applyFilters(): void {
        const state = productSearchStore.getState();
        const originalResults = productSearchStore.getOriginalResults();

        if (!originalResults.length) {
            return;
        }

        let filteredResults = [...originalResults];

        if (state.filters.condition !== 'all') {
            filteredResults = filteredResults.filter((item) => {
                const itemCondition = item.condition;

                if (state.filters.condition === 'new') {
                    return itemCondition === 'новый' || itemCondition === 'новое';
                }
                if (state.filters.condition === 'used') {
                    return (
                        itemCondition === 'б/у' ||
                        itemCondition === 'Б/у' ||
                        itemCondition === 'б/у'
                    );
                }
                return true;
            });
        }

        const { minPrice, maxPrice } = state.filters;

        if (minPrice !== null || maxPrice !== null) {
            filteredResults = filteredResults.filter((item) => {
                const price = item.price;

                if (minPrice !== null && (maxPrice === null || maxPrice === 0)) {
                    return price >= minPrice;
                }
                if ((minPrice === null || minPrice === 0) && maxPrice !== null) {
                    return price <= maxPrice;
                }
                if (minPrice !== null && maxPrice !== null) {
                    return price >= minPrice && price <= maxPrice;
                }
                return true;
            });
        }

        const { sortOrder } = state;
        switch (sortOrder) {
            case 'price_asc':
                filteredResults.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filteredResults.sort((a, b) => b.price - a.price);
                break;
            default:
                filteredResults.sort((a, b) => b.id - a.id);
                break;
        }

        productSearchStore.setState({
            results: filteredResults,
            totalCount: filteredResults.length,
        });

        this.renderFromState();
    },

    resetFilters(): void {
        const minPriceInput = document.getElementById('minPrice') as HTMLInputElement;
        const maxPriceInput = document.getElementById('maxPrice') as HTMLInputElement;
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';

        const allRadio = document.querySelector(
            'input[name="condition"][value="all"]',
        ) as HTMLInputElement;
        if (allRadio) allRadio.checked = true;

        const sortingLabel = document.getElementById('sortingLabel');
        if (sortingLabel) sortingLabel.textContent = 'По умолчанию';

        productSearchStore.setState({
            filters: {
                minPrice: null,
                maxPrice: null,
                condition: 'all',
                category_id: productSearchStore.getState().filters.category_id,
            },
            sortOrder: 'default',
        });

        const originalResults = productSearchStore.getOriginalResults();
        productSearchStore.setState({
            results: [...originalResults],
            totalCount: originalResults.length,
        });

        this.renderFromState();
    },

    async retrySearch(): Promise<void> {
        productSearchStore.setState({ isLoading: true, error: null });
        await this.performSearch();
    },

    cleanup(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
    },
};
