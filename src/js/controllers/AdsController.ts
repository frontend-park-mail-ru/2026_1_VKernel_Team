import { adsActions } from '@/actions/adsActions';
import { eventBus } from '@/core/eventBus';
import { store } from '@/core/store';
import { apiClient } from '@/api/apiClient';
import { uiActions } from '@/actions/uiActions';
import type { Ad, HandlebarsTemplateFunction } from '@/types';
import { PROFILE_CONFIG } from '@modules/profile/config';
import { ADS_SELECTORS } from '@/types/adsConstants';

declare const Handlebars: any;

// Маппинг названий категорий на ID. Сверяется с записями в таблице categories на бэкенде.
const CATEGORY_ID_MAP: Record<string, number> = {
    Авто: 21,
    Недвижимость: 2,
    Работа: 22,
    'Одежда, обувь, аксессуары': 11,
    'Хобби и отдых': 4,
    Животные: 16,
    Электроника: 1,
    'Для дома и дачи': 17,
    Запчасти: 18,
    'Товары для детей': 23,
    'Красота и здоровье': 15,
    Музыка: 5,
    Ремонт: 6,
    Туризм: 7,
    'Техника для дома': 8,
    Игрушки: 9,
    'Настольные игры': 10,
    Книги: 14,
    Спорт: 19,
    Канцелярия: 20,
};

export const AdsController = {
    templates: {} as Record<string, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
    },

    async renderMain(): Promise<void> {
        const app = document.getElementById('app');
        const template = this.templates['main-page'];
        if (!app || !template) {
            return;
        }

        const cachedAds = store.ads;
        if (cachedAds.length > 0) {
            this.renderAdsList(app, template, cachedAds);
        }

        await adsActions.loadAds();

        const ads = store.ads;
        this.renderAdsList(app, template, ads);
    },

    renderAdsList(app: HTMLElement, template: HandlebarsTemplateFunction, ads: Ad[]): void {
        const formattedAds = ads.map((ad: Ad) => this.formatAdCard(ad));
        document.body.classList.remove('auth-page');

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            recommendations: formattedAds,
        });

        eventBus.emit('page:adsRendered');
        this.attachMainEventListeners();
    },

    formatAdCard(ad: any) {
        let imageUrl = this.UI_CONSTANTS.DEFAULT_AD_IMAGE;

        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0]?.trim();
            if (photoPath) {
                const STATIC_BACKEND = 'http://clover-go.ru:8000';
                if (photoPath.startsWith('http')) {
                    imageUrl = photoPath;
                } else {
                    const normalized = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
                    imageUrl = `${STATIC_BACKEND}${normalized}`;
                }
            }
        }

        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price.toLocaleString('ru-RU') + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl,
            views: ad.views_count || 0,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
            isOwn: store.isAuthenticated && store.user?.id === ad.seller_id,
            isFavorite: store.favoriteIds.has(Number(ad.id)),
        };
    },

    attachMainEventListeners(): void {
        document
            .querySelectorAll(ADS_SELECTORS.FAVORITE_BTN)
            .forEach((btn) => btn.addEventListener('click', this.handleFavoriteClick.bind(this)));

        document
            .querySelectorAll(ADS_SELECTORS.CARD)
            .forEach((card) => card.addEventListener('click', this.handleCardClick.bind(this)));

        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach((card) => {
            // Снимаем предыдущий обработчик, чтобы не дублировать при повторном рендере
            card.removeEventListener('click', this.handleCategoryClick);
            card.addEventListener('click', this.handleCategoryClick);
        });
    },

    handleCategoryClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        const card = e.currentTarget as HTMLElement;
        const titleElement = card.querySelector('.card-title');
        let categoryTitle = titleElement?.textContent?.trim() || '';

        if (categoryTitle === 'Все категории' || categoryTitle === 'Все<br>категории') {
            return;
        }

        categoryTitle = categoryTitle.replace(/→/g, '').trim();

        const categoryId = CATEGORY_ID_MAP[categoryTitle];

        let searchUrl = `/search?query=${encodeURIComponent(categoryTitle)}`;
        if (categoryId) {
            searchUrl += `&category_id=${categoryId}`;
        }

        window.location.href = searchUrl;
    },

    async handleFavoriteClick(e: Event): Promise<void> {
        e.preventDefault();
        e.stopPropagation();

        if (!store.isAuthenticated) {
            eventBus.emit('app:navigate', '/login');
            return;
        }

        const favBtn = e.currentTarget as HTMLButtonElement;
        const card = favBtn.closest(ADS_SELECTORS.CARD);
        const adId = Number(card?.getAttribute('data-id'));

        if (!adId) {
            return;
        }

        const isFavorite = store.favoriteIds.has(adId);
        favBtn.disabled = true;

        // Optimistic UI: toggle immediately
        favBtn.classList.toggle(ADS_SELECTORS.ACTIVE_FAV_CLASS);
        const newFavorites = new Set(store.favoriteIds);
        if (isFavorite) {
            newFavorites.delete(adId);
        } else {
            newFavorites.add(adId);
        }
        store.setState({ favoriteIds: newFavorites });

        try {
            const endpoint = isFavorite
                ? PROFILE_CONFIG.API.REMOVE_FAVORITE(adId)
                : PROFILE_CONFIG.API.ADD_FAVORITE(adId);

            const result = isFavorite
                ? await apiClient.delete(endpoint)
                : await apiClient.post(endpoint, {});

            if (!result.success) {
                // Revert on failure
                favBtn.classList.toggle(ADS_SELECTORS.ACTIVE_FAV_CLASS);
                const revertFavorites = new Set(store.favoriteIds);
                if (isFavorite) {
                    revertFavorites.add(adId);
                } else {
                    revertFavorites.delete(adId);
                }
                store.setState({ favoriteIds: revertFavorites });
                uiActions.showError(result.error || 'Ошибка при работе с избранным');
                return;
            }

            eventBus.emit('profile:update-ui');
        } catch (error) {
            // Revert on error
            favBtn.classList.toggle(ADS_SELECTORS.ACTIVE_FAV_CLASS);
            const revertFavorites = new Set(store.favoriteIds);
            if (isFavorite) {
                revertFavorites.add(adId);
            } else {
                revertFavorites.delete(adId);
            }
            store.setState({ favoriteIds: revertFavorites });
            console.error('Favorite error:', error);
            uiActions.showError('Не удалось изменить состояние избранного');
        } finally {
            favBtn.disabled = false;
        }
    },

    handleCardClick(e: Event): void {
        const target = e.target as HTMLElement;

        if (target.closest(ADS_SELECTORS.FAVORITE_BTN) || target.closest(ADS_SELECTORS.CART_BTN)) {
            return;
        }

        const card = e.currentTarget as HTMLElement;
        const adId = card.dataset.id;

        if (adId) {
            window.location.href = `/ad/${adId}`;
        }
    },

    async syncFavorites() {
        try {
            const result = await apiClient.get<any>(PROFILE_CONFIG.API.GET_FAVORITES);

            if (!result.success || !result.data) {
                return;
            }

            let favoritesArray: any[] = [];

            if (Array.isArray(result.data)) {
                favoritesArray = result.data;
            } else if (Array.isArray(result.data.ads)) {
                favoritesArray = result.data.ads;
            } else if (Array.isArray(result.data.data)) {
                favoritesArray = result.data.data;
            } else if (typeof result.data === 'object') {
                const arrays = Object.values(result.data).filter(Array.isArray);
                if (arrays.length > 0) {
                    favoritesArray = arrays[0] as any[];
                }
            }

            const ids = new Set<number>(favoritesArray.map((ad: any) => Number(ad.id)));
            store.setState({ favoriteIds: ids });
        } catch (error) {
            console.error('Failed to sync favorites', error);
        }
    },
};
