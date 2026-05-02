/**
 * Контроллер страницы объявления
 */

import './css/ad-detail.scss';
import Handlebars from 'handlebars';
import adDetailTpl from './templates/ad-detail.hbs';
import { CONFIG } from '@/core/config';
import { adsService } from '@/services/adsServices';
import { store } from '@/core/store';
import { PhotoViewer } from '@modules/announcements/shared/photo-view/photoViewer';
import { sellerService } from '@modules/seller-page/service';
import { uiActions } from '@/actions/uiActions';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import type { Ad } from '@/types';

const AD_DETAIL_STORE = 'ads';

export class AdDetailController {
    private static currentPhotoIndex: number = 0;
    private static allPhotosArray: string[] = [];
    private static _handlers: Map<string, EventListener> = new Map();
    private static adId: string = '';
    private static currentAd: Ad | null = null;

    private static async cacheAd(ad: Ad): Promise<void> {
        try {
            await cloverDB.put(AD_DETAIL_STORE, ad);
        } catch {
            // IndexedDB unavailable
        }
    }

    private static async getCachedAd(adId: string): Promise<Ad | undefined> {
        try {
            return await cloverDB.get<Ad>(AD_DETAIL_STORE, Number(adId));
        } catch {
            return undefined;
        }
    }

    static async render(adId: string): Promise<void> {
        this.adId = adId;
        this.currentPhotoIndex = 0;
        this.allPhotosArray = [];
        const app = document.getElementById('app');
        if (!app) return;

        window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));

        try {
            const result = await adsService.getAdById(adId);

            if (result.success && result.data) {
                // Кэшируем объявление для offline-доступа
                this.currentAd = result.data;
                await this.cacheAd(result.data);
                const adData = await this.prepareAdData(result.data);
                app.innerHTML = adDetailTpl(adData);
                this.attachEventListeners();
                await this.updateCartButtonState(parseInt(adId));
                return;
            }

            const cached = await this.getCachedAd(adId);
            if (cached) {
                this.currentAd = cached;
                const adData = await this.prepareAdData(cached);
                app.innerHTML = adDetailTpl(adData);
                this.attachEventListeners();
                await this.updateCartButtonState(parseInt(adId));
                return;
            }

            await this.showNotFound();
        } catch (error) {
            // Попытка отдать из кэша при любой ошибке
            const cached = await this.getCachedAd(adId);
            if (cached) {
                this.currentAd = cached;
                const adData = await this.prepareAdData(cached);
                app.innerHTML = adDetailTpl(adData);
                this.attachEventListeners();
                await this.updateCartButtonState(parseInt(adId));
                return;
            }
            console.error('Error loading ad:', error);
            await this.showNotFound();
        } finally {
            window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: false } }));
        }
    }

    private static async showNotFound(): Promise<void> {
        const app = document.getElementById('app');
        if (!app) return;

        try {
            const response = await fetch('/templates/not-found.hbs');
            const templateSource = await response.text();
            const template = Handlebars.compile(templateSource);
            app.innerHTML = template({});
        } catch (error) {
            app.innerHTML = '<h1>404 - Объявление не найдено</h1>';
        }
    }

    private static async prepareAdData(ad: Ad): Promise<any> {
        let mainPhoto = '/images/default-ad.jpg';
        let allPhotos: string[] = [];

        if (ad.photos && ad.photos.length > 0) {
            allPhotos = ad.photos.map((photo: string) => {
                if (photo.startsWith('/')) {
                    return `${CONFIG.API.BASE_URL}${photo}`;
                }
                return photo;
            });
            mainPhoto = allPhotos[0];
        }
        this.allPhotosArray = allPhotos;

        const formattedPrice =
            ad.price === 0 ? 'Бесплатно' : ad.price.toLocaleString('ru-RU') + ' ₽';

        const formattedDate = ad.created_at
            ? new Date(ad.created_at).toLocaleDateString('ru-RU')
            : '';

        const isDescriptionLong = ad.description && ad.description.length > 300;
        const adAny = ad as any;

        const attributes: Array<{ name: string; value: string }> = [];

        //  Категорийные характеристики
        if (ad.category_characteristics && ad.category_characteristics.length > 0) {
            for (const char of ad.category_characteristics) {
                attributes.push({
                    name: char.name,
                    value: char.value,
                });
            }
        }

        // Пользовательские характеристики
        if (ad.custom_characteristics && ad.custom_characteristics.length > 0) {
            for (const char of ad.custom_characteristics) {
                attributes.push({
                    name: char.name,
                    value: char.value,
                });
            }
        }

        // Получаем данные продавца через sellerService
        let sellerData = null;
        const sellerId = adAny.seller_id;

        if (sellerId) {
            try {
                const result = await sellerService.getProfile(sellerId);
                if (result.success && result.data) {
                    sellerData = sellerService.formatProfile(result.data);
                }
            } catch (error) {
                console.error('Failed to load seller data:', error);
            }
        }

        // Формируем звезды рейтинга
        const rating = sellerData?.rating || adAny.seller_rating || 0;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        const sellerStars =
            '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
        return {
            id: ad.id,
            title: ad.title || 'Без названия',
            formattedPrice: formattedPrice,
            location: ad.location || 'Не указано',
            views_count: ad.views_count || 0,
            favorites_count: ad.favorites_count || 0,
            formattedDate: formattedDate,
            status: ad.status || 'active',
            statusText: this.getStatusText(ad.status),
            isClosed: ad.status === 'sold' || ad.status === 'archived' || ad.status === 'reserved',
            description: ad.description || 'Описание отсутствует',
            mainPhoto: mainPhoto,
            allPhotos: allPhotos,
            hasMultiplePhotos: allPhotos.length > 1,
            isDescriptionLong: isDescriptionLong,
            isAuthenticated: store.isAuthenticated,
            isOwner: (() => {
                const userId = store.user?.id || store.user?.user_id;
                return !!(userId && Number(userId) === Number(adAny.seller_id));
            })(),
            sellerSince: sellerData?.registrationDate
                ? sellerData.registrationDate
                : adAny.seller_created_at
                  ? new Date(adAny.seller_created_at).toLocaleDateString('ru-RU', {
                        month: 'long',
                        year: 'numeric',
                    })
                  : 'неизвестно',
            attributes: attributes,

            // Для правого блока
            sellerId: sellerId,
            sellerName: sellerData?.name || adAny.seller_name || 'Продавец',
            sellerAvatar: sellerData?.avatarUrl || '/images/logo/avatar.jpeg', // заглушка
            sellerRating: rating,
            sellerStars: sellerStars,
            user: store.user,

            avatarUrl: (() => {
                const src = store.user?.avatar_path || store.user?.avatar;
                if (!src) return '/images/logo/avatar.jpeg';
                if (src.startsWith('http') || src.startsWith('data:')) return src;
                return `${CONFIG.API.BASE_URL}/${src}`;
            })(),
            isFavorite: store.favoriteIds.has(Number(ad.id)),
        };
    }

    private static getStatusText(status?: string): string {
        const statusMap: Record<string, string> = {
            active: 'Активно',
            draft: 'Черновик',
            reserved: 'Зарезервировано',
            sold: 'Продано',
            archived: 'Архив',
        };
        return statusMap[status || 'active'] || 'Активно';
    }

    private static attachEventListeners(): void {
        this.currentPhotoIndex = 0;

        // Сохраняем adId в локальную переменную для использования в обработчиках
        const adId = this.adId;
        const backBtns = document.querySelectorAll('[data-action="back"]');
        for (let i = 0; i < backBtns.length; i++) {
            const btn = backBtns[i];
            const handler = (e: Event) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('app:navigate', { detail: { path: '/' } }));
            };
            btn.addEventListener('click', handler);
            this._handlers.set(`back-${i}`, handler);
        }

        const categoriesBtn = document.querySelector('[data-action="show-categories"]');
        if (categoriesBtn) {
            const handler = (e: Event) => {
                e.preventDefault();
            };
            categoriesBtn.addEventListener('click', handler);
            this._handlers.set('categories', handler);
        }

        const prevBtn = document.querySelector('[data-gallery-prev]');
        if (prevBtn) {
            const handler = (e: Event) => {
                e.preventDefault();
                this.navigateGallery(-1);
            };
            prevBtn.addEventListener('click', handler);
            this._handlers.set('prev', handler);
        }

        const nextBtn = document.querySelector('[data-gallery-next]');
        if (nextBtn) {
            const handler = (e: Event) => {
                e.preventDefault();
                this.navigateGallery(1);
            };
            nextBtn.addEventListener('click', handler);
            this._handlers.set('next', handler);
        }

        const thumbnails = document.querySelectorAll('[data-thumbnail]');
        thumbnails.forEach((thumb, index) => {
            const handler = (e: Event) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLImageElement;
                const mainPhoto = document.getElementById('mainPhoto') as HTMLImageElement;
                if (mainPhoto && target.src) {
                    mainPhoto.src = target.src;
                    this.setActiveThumbnail(index);
                }
            };
            thumb.addEventListener('click', handler);
            this._handlers.set(`thumb-${index}`, handler);
        });

        const toggleBtn = document.querySelector('[data-action="toggle-description"]');
        if (toggleBtn) {
            const handler = () => {
                const description = document.getElementById('adDescription');
                const showMoreText = document.querySelector('.show-more-text');
                const showLessText = document.querySelector('.show-less-text');

                if (description && showMoreText && showLessText) {
                    description.classList.toggle('collapsed');
                    const isCollapsed = description.classList.contains('collapsed');

                    if (
                        showMoreText instanceof HTMLElement &&
                        showLessText instanceof HTMLElement
                    ) {
                        showMoreText.style.display = isCollapsed ? 'inline' : 'none';
                        showLessText.style.display = isCollapsed ? 'none' : 'inline';
                    }
                }
            };
            toggleBtn.addEventListener('click', handler);
            this._handlers.set('toggle-description', handler);
        }

        const mainPhoto = document.getElementById('mainPhoto');
        if (mainPhoto) {
            const handler = (e: Event) => {
                e.preventDefault();
                if (this.allPhotosArray.length > 0) {
                    PhotoViewer.init();
                    PhotoViewer.open(this.allPhotosArray, this.currentPhotoIndex);
                }
            };
            mainPhoto.addEventListener('click', handler);
            this._handlers.set('openPhotoViewer', handler);
        }

        // ===== КНОПКА "В КОРЗИНУ" (с обновлением состояния) =====
        const cartBtn = document.querySelector('[data-action="add-to-cart"]');
        if (cartBtn) {
            if (this._handlers.has('addToCart')) {
                cartBtn.removeEventListener('click', this._handlers.get('addToCart')!);
            }

            const handler = async (e: Event) => {
                e.preventDefault();
                e.stopPropagation();

                if (!store.isAuthenticated) {
                    window.dispatchEvent(
                        new CustomEvent('app:navigate', { detail: { path: '/login' } }),
                    );
                    return;
                }

                if (!adId) {
                    uiActions.showError('Ошибка: идентификатор товара не найден');
                    return;
                }

                const btn = cartBtn as HTMLButtonElement;
                const originalText = btn.innerHTML;

                btn.innerHTML = '⏳ ...';
                btn.disabled = true;

                try {
                    const { cartActions } = await import('@modules/cart/actions');
                    const product = this.extractProductFromPage(Number(adId));
                    const added = await cartActions.addToCart(Number(adId), product);

                    if (added) {
                        uiActions.showSuccess(
                            networkStatus.isOnline
                                ? 'Товар добавлен в корзину'
                                : 'Товар добавлен в корзину (синхронизируется при подключении)',
                        );
                        btn.innerHTML = '✓ В корзине';
                        btn.classList.add('in-cart');
                    } else {
                        uiActions.showError('Не удалось добавить товар');
                        btn.innerHTML = originalText;
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    uiActions.showError('Не удалось добавить товар в корзину');
                    btn.innerHTML = originalText;
                } finally {
                    btn.disabled = false;
                }
            };

            cartBtn.addEventListener('click', handler);
            this._handlers.set('addToCart', handler);
        }

        // ===== КНОПКА "НАПИСАТЬ ПРОДАВЦУ" =====
        const messageBtn = document.querySelector('[data-action="message-seller"]');
        if (messageBtn) {
            if (this._handlers.has('messageSeller')) {
                messageBtn.removeEventListener('click', this._handlers.get('messageSeller')!);
            }

            const handler = async (e: Event) => {
                e.preventDefault();
                e.stopPropagation();

                if (!store.isAuthenticated) {
                    window.dispatchEvent(
                        new CustomEvent('app:navigate', { detail: { path: '/login' } }),
                    );
                    return;
                }

                if (!adId) {
                    uiActions.showError('Ошибка: идентификатор товара не найден');
                    return;
                }

                const btn = messageBtn as HTMLButtonElement;
                btn.disabled = true;

                window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));

                try {
                    const { chatActions } = await import('@modules/chat/actions');
                    const chatId = await chatActions.createOrderForAd(Number(adId));
                    if (chatId) {
                        window.dispatchEvent(
                            new CustomEvent('app:navigate', {
                                detail: { path: `/chats/${chatId}` },
                            }),
                        );
                    }
                } finally {
                    btn.disabled = false;
                    window.dispatchEvent(
                        new CustomEvent('app:loading', { detail: { show: false } }),
                    );
                }
            };

            messageBtn.addEventListener('click', handler);
            this._handlers.set('messageSeller', handler);
        }

        // ===== КНОПКА "РЕДАКТИРОВАТЬ" (для владельца) =====
        const editBtn = document.querySelector('[data-action="edit-ad"]');
        if (editBtn) {
            const handler = (e: Event) => {
                e.preventDefault();
                window.dispatchEvent(
                    new CustomEvent('app:navigate', { detail: { path: `/edit-ad/${adId}` } }),
                );
            };
            editBtn.addEventListener('click', handler);
            this._handlers.set('editAd', handler);
        }

        // ===== КНОПКА "В ИЗБРАННОЕ" =====
        const favoriteBtn = document.querySelector('[data-action="add-to-favorites"]');
        if (favoriteBtn) {
            if (this._handlers.has('addToFavorites')) {
                favoriteBtn.removeEventListener('click', this._handlers.get('addToFavorites')!);
            }

            const handler = async (e: Event) => {
                e.preventDefault();
                e.stopPropagation();

                if (!store.isAuthenticated) {
                    window.dispatchEvent(
                        new CustomEvent('app:navigate', { detail: { path: '/login' } }),
                    );
                    return;
                }

                if (!adId) return;

                const btn = favoriteBtn as HTMLButtonElement;
                btn.disabled = true;

                const isFavorite = store.favoriteIds.has(Number(adId));

                // Optimistic UI: toggle immediately
                const heartIcon = btn.querySelector('.heart-icon');
                if (!isFavorite) {
                    btn.classList.add('active');
                    if (heartIcon) heartIcon.innerHTML = '♥';
                } else {
                    btn.classList.remove('active');
                    if (heartIcon) heartIcon.innerHTML = '♡';
                }
                const newFavorites = new Set(store.favoriteIds);
                if (isFavorite) {
                    newFavorites.delete(Number(adId));
                } else {
                    newFavorites.add(Number(adId));
                }
                store.setState({ favoriteIds: newFavorites });

                try {
                    const { PROFILE_CONFIG } = await import('@modules/profile/config');
                    const endpoint = isFavorite
                        ? PROFILE_CONFIG.API.REMOVE_FAVORITE(Number(adId))
                        : PROFILE_CONFIG.API.ADD_FAVORITE(Number(adId));

                    const { apiClient } = await import('@/api/apiClient');
                    const result = isFavorite
                        ? await apiClient.delete(endpoint)
                        : await apiClient.post(endpoint, {});

                    if (!result.success) {
                        // Revert on failure
                        if (isFavorite) {
                            btn.classList.add('active');
                            if (heartIcon) heartIcon.innerHTML = '♥';
                        } else {
                            btn.classList.remove('active');
                            if (heartIcon) heartIcon.innerHTML = '♡';
                        }
                        const revertFavorites = new Set(store.favoriteIds);
                        if (isFavorite) {
                            revertFavorites.add(Number(adId));
                        } else {
                            revertFavorites.delete(Number(adId));
                        }
                        store.setState({ favoriteIds: revertFavorites });
                        uiActions.showError(result.error || 'Ошибка при работе с избранным');
                        return;
                    }
                } catch (error) {
                    // Revert on error
                    if (isFavorite) {
                        btn.classList.add('active');
                        if (heartIcon) heartIcon.innerHTML = '♥';
                    } else {
                        btn.classList.remove('active');
                        if (heartIcon) heartIcon.innerHTML = '♡';
                    }
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
            };

            favoriteBtn.addEventListener('click', handler);
            this._handlers.set('addToFavorites', handler);
        }

        // ===== ПЕРЕХОД НА СТРАНИЦУ ПРОДАВЦА (по клику на аватар или имя) =====
        const sellerSelectors = document.querySelectorAll('[data-action="go-to-seller"]');
        sellerSelectors.forEach((element) => {
            const handler = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                const sellerId = (element as HTMLElement).dataset.sellerId;
                const isOwner = (element as HTMLElement).dataset.isOwner === 'true';

                if (sellerId) {
                    if (isOwner) {
                        // Если это своё объявление - идём в личный профиль
                        window.dispatchEvent(
                            new CustomEvent('app:navigate', { detail: { path: '/profile' } }),
                        );
                    } else {
                        // Если чужое - на страницу продавца
                        window.dispatchEvent(
                            new CustomEvent('app:navigate', {
                                detail: { path: `/seller/${sellerId}` },
                            }),
                        );
                    }
                }
            };
            element.addEventListener('click', handler);
            const uniqueKey = `goToSeller_${Math.random()}`;
            this._handlers.set(uniqueKey, handler);
        });
    }

    private static extractProductFromPage(productId: number): any {
        const ad = this.currentAd as any;

        if (ad) {
            // Берём данные из объекта, а не из DOM
            let imagePath = '/images/default-ad.jpg';
            if (ad.photos && ad.photos.length > 0) {
                const photo = ad.photos[0];
                imagePath = photo.startsWith('http')
                    ? photo
                    : `${CONFIG.API.BASE_URL}${photo.startsWith('/') ? photo : `/${photo}`}`;
            }

            return {
                product_id: productId,
                title: ad.title || '',
                price: ad.price ?? 0,
                image_path: imagePath,
                seller_id: ad.seller_id || 0,
                seller_name: ad.seller_name || 'Продавец',
                location: ad.location || '',
            };
        }

        // Фолбек на DOM если объект недоступен
        const title = document.querySelector('.ad-title')?.textContent?.trim() || '';
        const priceText = document.querySelector('.current-price')?.textContent?.trim() || '';
        const price = priceText.toLowerCase().includes('бесплатно')
            ? 0
            : parseInt(priceText.replace(/\D/g, ''), 10) || 0;
        const image = (document.getElementById('mainPhoto') as HTMLImageElement)?.src || '';
        const location = document.querySelector('.location-address')?.textContent?.trim() || '';

        const sellerEl = document.querySelector(
            '[data-action="go-to-seller"][data-seller-id]',
        ) as HTMLElement;
        const seller_id = sellerEl ? Number(sellerEl.dataset.sellerId) || 0 : 0;
        const seller_name =
            document.querySelector('.seller-info .seller-name')?.textContent?.trim() || 'Продавец';

        return {
            product_id: productId,
            title,
            price,
            image_path: image,
            seller_id,
            seller_name,
            location,
        };
    }

    /**
     * Проверяет, находится ли товар в корзине (используя локальный store)
     */
    private static async checkIfInCart(productId: number): Promise<boolean> {
        try {
            const { cartStore } = await import('@modules/cart/store');
            const items = cartStore.getState().items;
            return items.some((item: any) => item.product_id === productId);
        } catch {
            return false;
        }
    }

    /**
     * Обновляет состояние кнопки "В корзину" в зависимости от того, есть ли товар в корзине
     */
    private static async updateCartButtonState(productId: number): Promise<void> {
        const cartBtn = document.querySelector('[data-action="add-to-cart"]') as HTMLButtonElement;
        if (!cartBtn) return;

        const isInCart = await this.checkIfInCart(productId);

        if (isInCart) {
            cartBtn.innerHTML = '✓ В корзине';
            cartBtn.classList.add('in-cart');
            cartBtn.disabled = false;
        } else {
            cartBtn.innerHTML = 'Добавить в корзину';
            cartBtn.classList.remove('in-cart');
            cartBtn.disabled = false;
        }
    }
    private static navigateGallery(direction: number): void {
        if (this.allPhotosArray.length === 0) {
            const thumbnails = document.querySelectorAll('[data-thumbnail]');
            this.allPhotosArray = Array.from(thumbnails).map(
                (thumb) => (thumb as HTMLImageElement).src,
            );
            this.currentPhotoIndex = 0;
        }

        const newIndex = this.currentPhotoIndex + direction;
        if (newIndex >= 0 && newIndex < this.allPhotosArray.length) {
            this.currentPhotoIndex = newIndex;
            const mainPhoto = document.getElementById('mainPhoto') as HTMLImageElement;
            if (mainPhoto) {
                mainPhoto.src = this.allPhotosArray[this.currentPhotoIndex];
                this.setActiveThumbnail(this.currentPhotoIndex);
            }
        }
    }

    private static setActiveThumbnail(activeIndex: number): void {
        const thumbWrappers = document.querySelectorAll('.thumbnail-vertical-wrapper');
        thumbWrappers.forEach((wrapper, index) => {
            if (index === activeIndex) {
                wrapper.classList.add('active');
            } else {
                wrapper.classList.remove('active');
            }
        });
        this.currentPhotoIndex = activeIndex;
    }

    static cleanup(): void {
        this._handlers.forEach((handler, key) => {
            let element: Element | null = null;
            if (key === 'categories') {
                element = document.querySelector('[data-action="show-categories"]');
            } else if (key === 'prev') {
                element = document.querySelector('[data-gallery-prev]');
            } else if (key === 'next') {
                element = document.querySelector('[data-gallery-next]');
            } else if (key === 'toggle-description') {
                element = document.querySelector('[data-action="toggle-description"]');
            } else if (key.startsWith('thumb-')) {
                const thumbIndex = parseInt(key.split('-')[1]);
                const thumbnails = document.querySelectorAll('[data-thumbnail]');
                element = thumbnails[thumbIndex];
            }

            if (element) {
                element.removeEventListener('click', handler);
            }
        });

        this._handlers.clear();
        this.currentPhotoIndex = 0;
        this.allPhotosArray = [];
    }
}
