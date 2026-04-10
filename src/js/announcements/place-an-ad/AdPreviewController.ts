/**
 * Контроллер страницы предпросмотра объявления
 */

import Handlebars from 'handlebars';
import { store } from '@/core/store';
import { AppController } from '@/controllers/AppController';
import { uiActions } from '@/actions/uiActions';

export class AdPreviewController {
    private static _handlers: Map<string, EventListener> = new Map();
    private static previewData: any = null;
    
    static async render(): Promise<void> {
        console.log('=== AdPreviewController.render ===');
        
        const app = document.getElementById('app');
        if (!app) return;
        
        // Получаем данные из sessionStorage
        const storedData = sessionStorage.getItem('adPreviewData');
        if (!storedData) {
            uiActions.showError('Нет данных для предпросмотра');
            AppController.navigateTo('/place-ad');
            return;
        }
        
        this.previewData = JSON.parse(storedData);
        
        document.body.classList.remove('auth-page');
        
        AppController.showLoading(true);
        
        try {
            const response = await fetch('/src/js/announcements/place-an-ad/templates/before-publication.hbs');
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            const templateSource = await response.text();
            const template = Handlebars.compile(templateSource);
            
            const templateData = this.preparePreviewData();
            
            app.innerHTML = template(templateData);
            this.attachEventListeners();
            
        } catch (error) {
            console.error('Error loading preview page:', error);
            app.innerHTML = '<h1>Ошибка загрузки страницы</h1>';
        } finally {
            AppController.showLoading(false);
        }
    }
    
    private static preparePreviewData(): any {
        const mainPhoto = this.previewData.photos && this.previewData.photos.length > 0 
            ? this.previewData.photos[0] 
            : '/images/default-ad.jpg';
        
        const allPhotos = this.previewData.photos || [];
        
        const formattedPrice = this.previewData.price === 0 
            ? 'Бесплатно' 
            : this.previewData.price.toLocaleString('ru-RU') + ' ₽';
        
        // Собираем все характеристики
        const attributes = [
            ...(this.previewData.category_characteristics || []),
            ...(this.previewData.custom_characteristics || [])
        ];
        
        const isDescriptionLong = this.previewData.description && this.previewData.description.length > 300;
        
        return {
            title: this.previewData.title || 'Без названия',
            formattedPrice: formattedPrice,
            location: this.previewData.location || 'Не указано',
            description: this.previewData.description || 'Описание отсутствует',
            mainPhoto: mainPhoto,
            allPhotos: allPhotos,
            hasMultiplePhotos: allPhotos.length > 1,
            isDescriptionLong: isDescriptionLong,
            attributes: attributes,
            isAuthenticated: store.isAuthenticated,
            user: store.user,
        };
    }
    
    private static attachEventListeners(): void {
        // Кнопка "Назад" - возврат к редактированию
        const backBtn = document.querySelector('[data-action="back-to-edit"]');
        if (backBtn) {
            const handler = (e: Event) => {
                e.preventDefault();
                AppController.navigateTo('/place-ad');
            };
            backBtn.addEventListener('click', handler);
            this._handlers.set('back-to-edit', handler);
        }
        
        // Кнопка "Опубликовать" - публикация объявления
        const publishBtn = document.querySelector('[data-action="publish-ad"]');
        if (publishBtn) {
            const handler = async (e: Event) => {
                e.preventDefault();
                await this.publishAd();
            };
            publishBtn.addEventListener('click', handler);
            this._handlers.set('publish-ad', handler);
        }
        
        // Навигация галереи (если есть)
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
    }
    
    private static currentPhotoIndex: number = 0;
    
    private static navigateGallery(direction: number): void {
        const allPhotos = this.previewData?.photos || [];
        const newIndex = this.currentPhotoIndex + direction;
        
        if (newIndex >= 0 && newIndex < allPhotos.length) {
            this.currentPhotoIndex = newIndex;
            const mainPhoto = document.getElementById('mainPhoto') as HTMLImageElement;
            if (mainPhoto) {
                mainPhoto.src = allPhotos[this.currentPhotoIndex];
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
    
    private static async publishAd(): Promise<void> {
        AppController.showLoading(true);
        
        try {
            // Восстанавливаем данные из sessionStorage
            const storedData = sessionStorage.getItem('adPreviewData');
            if (!storedData) {
                throw new Error('No preview data');
            }
            
            const formData = JSON.parse(storedData);
            
            // Здесь нужно отправить данные на сервер для публикации
            // Так как фото уже загружены в sessionStorage как base64,
            // их нужно преобразовать обратно в File или отправить как есть
            
            const multipartFormData = new FormData();
            
            multipartFormData.append('title', formData.title);
            multipartFormData.append('category_id', String(formData.category_id));
            multipartFormData.append('ad_type', formData.ad_type);
            multipartFormData.append('price', String(formData.price));
            multipartFormData.append('description', formData.description || '');
            multipartFormData.append('location', formData.location || '');
            multipartFormData.append('category_characteristics', JSON.stringify(formData.category_characteristics));
            multipartFormData.append('custom_characteristics', JSON.stringify(formData.custom_characteristics));
            multipartFormData.append('status', 'active');
            
            // Для фото нужно преобразовать base64 обратно в Blob/File
            // Это сложно, поэтому лучше сохранять исходные File объекты в другом месте
            
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/ads', {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: multipartFormData,
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                uiActions.showSuccess('Объявление успешно опубликовано!');
                sessionStorage.removeItem('adPreviewData');
                if (result.data && result.data.id) {
                    AppController.navigateTo(`/ad/${result.data.id}`);
                } else {
                    AppController.navigateTo('/');
                }
            } else {
                uiActions.showError(result.error || 'Ошибка при публикации объявления');
            }
        } catch (error) {
            console.error('Error publishing ad:', error);
            uiActions.showError('Не удалось опубликовать объявление');
        } finally {
            AppController.showLoading(false);
        }
    }
    
    static cleanup(): void {
        this._handlers.forEach((handler, key) => {
            let element: Element | null = null;
            if (key === 'back-to-edit') {
                element = document.querySelector('[data-action="back-to-edit"]');
            } else if (key === 'publish-ad') {
                element = document.querySelector('[data-action="publish-ad"]');
            } else if (key === 'prev') {
                element = document.querySelector('[data-gallery-prev]');
            } else if (key === 'next') {
                element = document.querySelector('[data-gallery-next]');
            }
            
            if (element) {
                element.removeEventListener('click', handler);
            }
        });
        
        this._handlers.clear();
        this.previewData = null;
        this.currentPhotoIndex = 0;
    }
}
