/**
 * Контроллер страницы объявления
 */

import Handlebars from 'handlebars';
import { adsService } from '@/services/adsServices';
import { store } from '@/core/store';
import { AppController } from '@/controllers/AppController';
import { PhotoViewer } from '@modules/announcements/shared/photo-view/photoViewer';
import type { Ad } from '@/types';

export class AdDetailController {
    private static currentPhotoIndex: number = 0;
    private static allPhotosArray: string[] = [];
    private static _handlers: Map<string, EventListener> = new Map();
    
    /**
     * Рендер страницы объявления
     */
    // static async render(adId: string): Promise<void> {
    //     console.log('=== AdDetailController.render ===', adId);
        
    //     const app = document.getElementById('app');
    //     if (!app) return;
        
    //     document.body.classList.remove('auth-page');
        
    //     AppController.showLoading(true);
        
    //     try {
    //         const response = await fetch('/src/modules/announcements/ad-detail/templates/ad-detail.hbs');
    //         if (!response.ok) {
    //             throw new Error(`Failed to load template: ${response.status}`);
    //         }
    //         const templateSource = await response.text();
    //         const template = Handlebars.compile(templateSource);
            
    //         const result = await adsService.getAdById(adId);
            
    //         if (!result.success || !result.data) {
    //             await this.showNotFound();
    //             return;
    //         }
            
    //         const ad = result.data;
    //         const adData = this.prepareAdData(ad);
    //         app.innerHTML = template(adData);
    //         this.attachEventListeners();
            
    //     } catch (error) {
    //         console.error('Error loading ad:', error);
    //         await this.showNotFound();
    //     } finally {
    //         AppController.showLoading(false);
    //     }
    // }
    static async render(adId: string): Promise<void> {
        console.log('=== AdDetailController.render ===', adId);
        
        const app = document.getElementById('app');
        if (!app) return;
        
        document.body.classList.remove('auth-page');
        
        AppController.showLoading(true);
        
        try {
            const response = await fetch('/src/modules/announcements/ad-detail/templates/ad-detail.hbs');
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            const templateSource = await response.text();
            const template = Handlebars.compile(templateSource);
            
            const result = await adsService.getAdById(adId);
            
            console.log('📦 Raw API response for ad:', result); // ← ОТЛАДКА
            
            if (!result.success || !result.data) {
                console.error('No data in response:', result);
                await this.showNotFound();
                return;
            }
            
            const ad = result.data;
            console.log('📦 Ad data with characteristics:', {
                category_characteristics: ad.category_characteristics,
                custom_characteristics: ad.custom_characteristics
            }); // ← ОТЛАДКА
            
            const adData = this.prepareAdData(ad);
            console.log('📦 Prepared ad data for template:', {
                attributes: adData.attributes
            }); // ← ОТЛАДКА
            
            app.innerHTML = template(adData);
            this.attachEventListeners();
            
        } catch (error) {
            console.error('Error loading ad:', error);
            await this.showNotFound();
        } finally {
            AppController.showLoading(false);
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

    // private static prepareAdData(ad: Ad): any {
    //     let mainPhoto = '/images/default-ad.jpg';
    //     let allPhotos: string[] = [];
        
    //     if (ad.photos && ad.photos.length > 0) {
    //         allPhotos = ad.photos.map((photo: string) => {
    //             if (photo.startsWith('/')) {
    //                 return `http://clover-go.ru:8000${photo}`;
    //             }
    //             return photo;
    //         });
    //         mainPhoto = allPhotos[0];
    //     }
        
    //     const formattedPrice = ad.price === 0 
    //         ? 'Бесплатно' 
    //         : ad.price.toLocaleString('ru-RU') + ' ₽';
        
    //     const formattedDate = ad.created_at 
    //         ? new Date(ad.created_at).toLocaleDateString('ru-RU')
    //         : '';
        
    //     const isDescriptionLong = ad.description && ad.description.length > 300;
    //     const adAny = ad as any;
        
    //     return {
    //         id: ad.id,
    //         title: ad.title || 'Без названия',
    //         formattedPrice: formattedPrice,
    //         location: ad.location || 'Не указано',
    //         views_count: ad.views_count || 0,
    //         favorites_count: ad.favorites_count || 0,
    //         formattedDate: formattedDate,
    //         status: ad.status || 'active',
    //         statusText: this.getStatusText(ad.status),
    //         description: ad.description || 'Описание отсутствует',
    //         mainPhoto: mainPhoto,
    //         allPhotos: allPhotos,
    //         hasMultiplePhotos: allPhotos.length > 1,
    //         isDescriptionLong: isDescriptionLong,
    //         isAuthenticated: store.isAuthenticated,
    //         isOwner: store.user?.id === adAny.seller_id,
    //         sellerName: adAny.seller_name || 'Продавец',
    //         sellerSince: adAny.seller_created_at 
    //             ? new Date(adAny.seller_created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    //             : 'неизвестно',
    //         attributes: this.extractAttributes(ad),
    //     };
    // }

    // Обновите метод prepareAdData в AdDetailController.ts

    private static prepareAdData(ad: Ad): any {
        let mainPhoto = '/images/default-ad.jpg';
        let allPhotos: string[] = [];
        
        if (ad.photos && ad.photos.length > 0) {
            allPhotos = ad.photos.map((photo: string) => {
                if (photo.startsWith('/')) {
                    return `http://clover-go.ru:8000${photo}`;
                }
                return photo;
            });
            mainPhoto = allPhotos[0];
        }
        this.allPhotosArray = allPhotos;
        
        const formattedPrice = ad.price === 0 
            ? 'Бесплатно' 
            : ad.price.toLocaleString('ru-RU') + ' ₽';
        
        const formattedDate = ad.created_at 
            ? new Date(ad.created_at).toLocaleDateString('ru-RU')
            : '';
        
        const isDescriptionLong = ad.description && ad.description.length > 300;
        const adAny = ad as any;
        
        // ✅ ФОРМИРУЕМ ХАРАКТЕРИСТИКИ ИЗ ДАННЫХ С БЭКЕНДА
        const attributes: Array<{name: string, value: string}> = [];
        
        // Добавляем категорийные характеристики
        if (ad.category_characteristics && ad.category_characteristics.length > 0) {
            for (const char of ad.category_characteristics) {
                attributes.push({
                    name: char.name,
                    value: char.value
                });
            }
        }
        
        // Добавляем пользовательские характеристики
        if (ad.custom_characteristics && ad.custom_characteristics.length > 0) {
            for (const char of ad.custom_characteristics) {
                attributes.push({
                    name: char.name,
                    value: char.value
                });
            }
        }
        
        // ⚠️ ВАЖНО: Убираем шаблонные характеристики!
        // Больше НЕ добавляем "Состояние: Как новое", "Год выпуска: 2024" и т.д.
        // Они будут браться ТОЛЬКО из ad.category_characteristics и ad.custom_characteristics
        
        console.log('📊 Prepared attributes:', attributes); // Для отладки
        
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
            description: ad.description || 'Описание отсутствует',
            mainPhoto: mainPhoto,
            allPhotos: allPhotos,
            hasMultiplePhotos: allPhotos.length > 1,
            isDescriptionLong: isDescriptionLong,
            isAuthenticated: store.isAuthenticated,
            isOwner: store.user?.id === adAny.seller_id,
            sellerName: adAny.seller_name || 'Продавец',
            sellerSince: adAny.seller_created_at 
                ? new Date(adAny.seller_created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
                : 'неизвестно',
            attributes: attributes, // ← Теперь только реальные характеристики
        };
    }
    
    private static getStatusText(status?: string): string {
        const statusMap: Record<string, string> = {
            'active': 'Активно',
            'draft': 'Черновик',
            'reserved': 'Зарезервировано',
            'sold': 'Продано',
            'archived': 'Архив'
        };
        return statusMap[status || 'active'] || 'Активно';
    }
    
    private static extractAttributes(ad: Ad): Array<{name: string, value: string}> {
        const attributes = [];
        const adAny = ad as any;
        
        if (adAny.category_id) {
            attributes.push({ name: 'Категория', value: String(adAny.category_id) });
        }
        if (ad.price !== undefined) {
            attributes.push({ name: 'Цена', value: ad.price.toLocaleString('ru-RU') + ' ₽' });
        }
        if (ad.location) {
            attributes.push({ name: 'Локация', value: ad.location });
        }
        if (adAny.condition) {
            attributes.push({ name: 'Состояние', value: adAny.condition });
        }
        
        if (attributes.length < 4) {
            if (!attributes.find(a => a.name === 'Состояние')) {
                attributes.push({ name: 'Состояние', value: 'Отличное' });
            }
            if (!attributes.find(a => a.name === 'Год выпуска')) {
                attributes.push({ name: 'Год выпуска', value: '2024' });
            }
        }
        
        return attributes;
    }
    
    private static attachEventListeners(): void {
        this.currentPhotoIndex = 0;
        this.allPhotosArray = [];
        
        const backBtns = document.querySelectorAll('[data-action="back"]');
        for (let i = 0; i < backBtns.length; i++) {
            const btn = backBtns[i];
            const handler = (e: Event) => {
                e.preventDefault();
                AppController.navigateTo('/');
            };
            btn.addEventListener('click', handler);
            this._handlers.set(`back-${i}`, handler);
        }

        const categoriesBtn = document.querySelector('[data-action="show-categories"]');
        if (categoriesBtn) {
            const handler = (e: Event) => {
                e.preventDefault();
                console.log('Show categories menu');
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
                    
                    if (showMoreText instanceof HTMLElement && showLessText instanceof HTMLElement) {
                        showMoreText.style.display = isCollapsed ? 'inline' : 'none';
                        showLessText.style.display = isCollapsed ? 'none' : 'inline';
                    }
                }
            };
            toggleBtn.addEventListener('click', handler);
            this._handlers.set('toggle-description', handler);
        }

        // ✅ Добавляем обработчик для открытия просмотрщика фото
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
        
        // // Также добавим на миниатюры (опционально)
        // const thumbnails = document.querySelectorAll('[data-thumbnail]');
        // thumbnails.forEach((thumb, index) => {
        //     const handler = (e: Event) => {
        //         e.preventDefault();
        //         if (this.allPhotosArray.length > 0) {
        //             PhotoViewer.init();
        //             PhotoViewer.open(this.allPhotosArray, index);
        //         }
        //     };
        //     thumb.addEventListener('click', handler);
        //     this._handlers.set(`thumb-viewer-${index}`, handler);
        // });
    }

    // private static attachEventListeners(): void {
    //     this.currentPhotoIndex = 0;
    //     this.allPhotosArray = [];
        
    //     // 1. ВСЕГДА навешиваем обработчик на главное фото (для просмотрщика)
    //     const mainPhoto = document.getElementById('mainPhoto');
    //     if (mainPhoto) {
    //         const handler = (e: Event) => {
    //             e.preventDefault();
    //             console.log('🖱️ Main photo clicked, photos:', this.allPhotosArray.length);
    //             if (this.allPhotosArray.length > 0) {
    //                 import('@modules/announcements/shared/photo-view/photoViewer').then(({ PhotoViewer }) => {
    //                     PhotoViewer.init();
    //                     PhotoViewer.open(this.allPhotosArray, this.currentPhotoIndex);
    //                 });
    //             } else {
    //                 console.warn('No photos available');
    //             }
    //         };
    //         mainPhoto.addEventListener('click', handler);
    //         this._handlers.set('openPhotoViewer', handler);
    //         console.log('✅ Photo viewer handler attached');
    //     }
        
    //     // 2. Кнопка "Назад" - всегда
    //     const backBtns = document.querySelectorAll('[data-action="back"]');
    //     for (let i = 0; i < backBtns.length; i++) {
    //         const btn = backBtns[i];
    //         const handler = (e: Event) => {
    //             e.preventDefault();
    //             AppController.navigateTo('/');
    //         };
    //         btn.addEventListener('click', handler);
    //         this._handlers.set(`back-${i}`, handler);
    //     }
        
    //     // 3. Кнопка "Все категории" - всегда
    //     const categoriesBtn = document.querySelector('[data-action="show-categories"]');
    //     if (categoriesBtn) {
    //         const handler = (e: Event) => {
    //             e.preventDefault();
    //             console.log('Show categories menu');
    //         };
    //         categoriesBtn.addEventListener('click', handler);
    //         this._handlers.set('categories', handler);
    //     }
        
    //     // 4. Кнопка "Показать полностью" - всегда
    //     const toggleBtn = document.querySelector('[data-action="toggle-description"]');
    //     if (toggleBtn) {
    //         const handler = () => {
    //             const description = document.getElementById('adDescription');
    //             const showMoreText = document.querySelector('.show-more-text');
    //             const showLessText = document.querySelector('.show-less-text');
                
    //             if (description && showMoreText && showLessText) {
    //                 description.classList.toggle('collapsed');
    //                 const isCollapsed = description.classList.contains('collapsed');
                    
    //                 if (showMoreText instanceof HTMLElement && showLessText instanceof HTMLElement) {
    //                     showMoreText.style.display = isCollapsed ? 'inline' : 'none';
    //                     showLessText.style.display = isCollapsed ? 'none' : 'inline';
    //                 }
    //             }
    //         };
    //         toggleBtn.addEventListener('click', handler);
    //         this._handlers.set('toggle-description', handler);
    //     }
        
    //     // 5. ОСТАЛЬНЫЕ ОБРАБОТЧИКИ ТОЛЬКО ЕСЛИ ФОТО БОЛЬШЕ 1
    //     if (this.allPhotosArray.length > 1) {
    //         console.log('📸 Multiple photos detected, attaching gallery handlers');
            
    //         // Навигация вперед/назад
    //         const prevBtn = document.querySelector('[data-gallery-prev]');
    //         if (prevBtn) {
    //             const handler = (e: Event) => {
    //                 e.preventDefault();
    //                 this.navigateGallery(-1);
    //             };
    //             prevBtn.addEventListener('click', handler);
    //             this._handlers.set('prev', handler);
    //         }
            
    //         const nextBtn = document.querySelector('[data-gallery-next]');
    //         if (nextBtn) {
    //             const handler = (e: Event) => {
    //                 e.preventDefault();
    //                 this.navigateGallery(1);
    //             };
    //             nextBtn.addEventListener('click', handler);
    //             this._handlers.set('next', handler);
    //         }
            
    //         // Миниатюры
    //         const thumbnails = document.querySelectorAll('[data-thumbnail]');
    //         thumbnails.forEach((thumb, index) => {
    //             const handler = (e: Event) => {
    //                 e.preventDefault();
    //                 const target = e.currentTarget as HTMLImageElement;
    //                 const mainPhoto = document.getElementById('mainPhoto') as HTMLImageElement;
    //                 if (mainPhoto && target.src) {
    //                     mainPhoto.src = target.src;
    //                     this.setActiveThumbnail(index);
    //                     this.currentPhotoIndex = index; // Важно: обновляем индекс
    //                 }
    //             };
    //             thumb.addEventListener('click', handler);
    //             this._handlers.set(`thumb-${index}`, handler);
    //         });
    //     } else {
    //         console.log('📸 Single photo, gallery navigation handlers not attached');
    //     }
    // }
    
    private static navigateGallery(direction: number): void {
        if (this.allPhotosArray.length === 0) {
            const thumbnails = document.querySelectorAll('[data-thumbnail]');
            this.allPhotosArray = Array.from(thumbnails).map(
                thumb => (thumb as HTMLImageElement).src
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
