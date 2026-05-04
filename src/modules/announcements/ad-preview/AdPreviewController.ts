/**
 * Контроллер просмотра созданного объявления
 */

import './css/preview.scss';
import { CONFIG } from '@/core/config';
import previewTpl from './templates/before-publication.hbs';
import { PhotoViewer } from '@modules/announcements/shared/photo-view/photoViewer';
import type { CreateAdData, CategoryCharacteristic } from '@/types';
import { store } from '@/core/store';
import { categoryService } from '@/services/categoryService';
import { uiActions } from '@/actions/uiActions';
import { AdDraftService } from '@/services/adDraftService';
import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { syncQueue } from '@modules/common/offline/sync/syncQueue';
import { NotificationComponent } from '@modules/common/notifications/notification';

export class AdPreviewController {
    private static _handlers: Map<string, EventListener> = new Map();
    private static draftData: { formData: any; photoFiles: File[] } | null = null;
    private static currentPhotoIndex: number = 0;
    private static categoryCharacteristicsDefs: CategoryCharacteristic[] = [];

    static async render(): Promise<void> {
        this.currentPhotoIndex = 0;
        const app = document.getElementById('app');
        if (!app) return;

        this.draftData = await AdDraftService.get();
        if (!this.draftData) {
            uiActions.showError('Нет данных для предпросмотра');
            // window.dispatchEvent(new CustomEvent('app:navigate', { detail: { path: '/place-ad' } }),);
            window.location.href = '/place-ad';
            return;
        }

        if (this.draftData.formData.category_id) {
            try {
                this.categoryCharacteristicsDefs = await categoryService.getCategoryCharacteristics(
                    this.draftData.formData.category_id,
                );
            } catch (error) {
                console.error('Failed to load characteristic definitions:', error);
            }
        }

        document.body.classList.remove('auth-page');

        window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));

        try {
            const photoPreviews = await this.createPhotoPreviews(this.draftData.photoFiles);
            const templateData = this.preparePreviewData(this.draftData.formData, photoPreviews);

            app.innerHTML = previewTpl(templateData);
            this.attachEventListeners();
        } catch (error) {
            console.error('Error loading preview page:', error);
            app.innerHTML = '<h1>Ошибка загрузки страницы</h1>';
        } finally {
            window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: false } }));
        }
    }

    private static async createPhotoPreviews(files: File[]): Promise<string[]> {
        const previews: string[] = [];

        for (const file of files) {
            const preview = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });
            previews.push(preview);
        }

        return previews;
    }

    private static preparePreviewData(formData: any, photoPreviews: string[]): any {
        const mainPhoto = photoPreviews.length > 0 ? photoPreviews[0] : '/images/default-ad.jpg';
        const formattedPrice =
            formData.price === 0 ? 'Бесплатно' : formData.price.toLocaleString('ru-RU') + ' ₽';

        const isDescriptionLong = formData.description && formData.description.length > 300;

        const attributes: Array<{ name: string; value: string }> = [];

        // Категорийные характеристики
        if (formData.category_characteristics && formData.category_characteristics.length > 0) {
            for (const char of formData.category_characteristics) {
                // Ищем определение характеристики по ID
                const definition = this.categoryCharacteristicsDefs.find(
                    (def) => def.id === char.category_characteristic_id,
                );

                if (definition && char.value) {
                    attributes.push({
                        name: definition.name,
                        value: char.value,
                    });
                }
            }
        }

        // Пользовательские характеристики
        if (formData.custom_characteristics && formData.custom_characteristics.length > 0) {
            for (const char of formData.custom_characteristics) {
                if (char.name && char.value) {
                    attributes.push({
                        name: char.name,
                        value: char.value,
                    });
                }
            }
        }

        return {
            title: formData.title || 'Без названия',
            formattedPrice: formattedPrice,
            location: formData.location || 'Не указано',
            description: formData.description || 'Описание отсутствует',
            mainPhoto: mainPhoto,
            allPhotos: photoPreviews,
            hasMultiplePhotos: photoPreviews.length > 1,
            isDescriptionLong: isDescriptionLong,
            attributes: attributes,
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            sellerName: store.user?.name || 'Вы',
            sellerSince: store.user?.created_at
                ? new Date(store.user.created_at).toLocaleDateString('ru-RU', {
                      month: 'long',
                      year: 'numeric',
                  })
                : 'сегодня',
            avatarUrl: store.user?.avatar_path
                ? store.user.avatar_path.startsWith('http') ||
                  store.user.avatar_path.startsWith('data:')
                    ? store.user.avatar_path
                    : `${CONFIG.API.BASE_URL}/${store.user.avatar_path}`
                : '/images/logo/avatar.jpeg',
        };
    }

    private static attachEventListeners(): void {
        const backBtn = document.querySelector('[data-action="back-to-edit"]');
        if (backBtn) {
            const handler = (e: Event) => {
                e.preventDefault();
                // window.dispatchEvent(new CustomEvent('app:navigate', { detail: { path: '/place-ad' } }),);
                window.location.href = '/place-ad';
            };
            backBtn.addEventListener('click', handler);
            this._handlers.set('back-to-edit', handler);
        }

        const publishBtn = document.querySelector('[data-action="publish-ad"]');

        if (publishBtn) {
            const handler = async (e: Event) => {
                e.preventDefault();
                await this.publishAd();
            };
            publishBtn.addEventListener('click', handler);
            this._handlers.set('publish-ad', handler);
        } else {
            console.error('❌ Publish button NOT found in DOM');
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

        // Обработчик для открытия просмотрщика фото
        const mainPhoto = document.getElementById('mainPhoto');
        if (mainPhoto && this.draftData?.photoFiles) {
            const handler = async (e: Event) => {
                e.preventDefault();

                // Создаем превью для всех фото при первом клике
                const previews = await this.createPhotoPreviews(this.draftData!.photoFiles);

                import('@modules/announcements/shared/photo-view/photoViewer').then(
                    ({ PhotoViewer }) => {
                        PhotoViewer.init();
                        PhotoViewer.open(previews, this.currentPhotoIndex);
                    },
                );
            };
            mainPhoto.addEventListener('click', handler);
            this._handlers.set('openPhotoViewer', handler);
        }
    }

    private static navigateGallery(direction: number): void {
        const allPhotos = this.draftData?.photoFiles || [];
        const newIndex = this.currentPhotoIndex + direction;

        if (newIndex >= 0 && newIndex < allPhotos.length) {
            this.currentPhotoIndex = newIndex;
            this.updateMainPhoto();
        }
    }

    private static async updateMainPhoto(): Promise<void> {
        const targetIndex = this.currentPhotoIndex;
        const mainPhoto = document.getElementById('mainPhoto') as HTMLImageElement;
        if (mainPhoto && this.draftData?.photoFiles[targetIndex]) {
            const preview = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(this.draftData!.photoFiles[targetIndex]);
            });
            if (this.currentPhotoIndex !== targetIndex) return;
            mainPhoto.src = preview;
            this.setActiveThumbnail(this.currentPhotoIndex);
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
        window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));

        try {
            if (!this.draftData) {
                throw new Error('Нет данных для публикации');
            }

            if (this.draftData.photoFiles.length === 0) {
                uiActions.showError('Добавьте хотя бы одно фото');
                return;
            }

            const adData: CreateAdData = {
                category_id: this.draftData.formData.category_id,
                title: this.draftData.formData.title,
                description: this.draftData.formData.description || '',
                price: this.draftData.formData.price,
                status: 'active',
                location: this.draftData.formData.location || '',
                category_characteristics: this.draftData.formData.category_characteristics || [],
                custom_characteristics: this.draftData.formData.custom_characteristics || [],
            };

            if (!networkStatus.isOnline) {
                await this.saveForOfflinePublish(adData, this.draftData.photoFiles);
                return;
            }

            const formData = new FormData();
            formData.append('data', JSON.stringify(adData));
            this.draftData.photoFiles.forEach((file: File) => {
                formData.append('photos', file);
            });

            const result = await apiClient.post(API_ENDPOINTS.ADS.CREATE, formData);

            if (result.success) {
                NotificationComponent.show({
                    type: 'success',
                    message: 'Объявление успешно опубликовано!',
                });
                await AdDraftService.clear();

                const adId = result.data?.ad_id || result.data?.id;
                // window.dispatchEvent(new CustomEvent('app:navigate', {detail: { path: adId ? `/ad/${adId}` : '/profile' },}),);
                window.location.href = adId ? `/ad/${adId}` : '/profile';
            } else {
                NotificationComponent.show({
                    type: 'error',
                    message: result.error || 'Ошибка при публикации объявления',
                });
            }
        } catch (error) {
            console.error('Error publishing ad:', error);
            if (!networkStatus.isOnline) {
                await this.saveForOfflinePublish(
                    this.draftData!.formData,
                    this.draftData!.photoFiles,
                );
            } else {
                NotificationComponent.show({
                    type: 'error',
                    message: 'Не удалось опубликовать объявление',
                });
            }
        } finally {
            window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: false } }));
        }
    }

    private static async saveForOfflinePublish(formData: any, photoFiles: File[]): Promise<void> {
        try {
            const draftId = await AdDraftService.save(formData, photoFiles);
            await syncQueue.add({
                type: 'CREATE_AD',
                payload: { draft_id: draftId },
                timestamp: Date.now(),
            });
            networkStatus.setOffline();
            NotificationComponent.show({
                type: 'info',
                message: 'Объявление будет опубликовано при подключении к интернету',
                duration: 5000,
            });
            // window.dispatchEvent(new CustomEvent('app:navigate', { detail: { path: '/' } }));
            window.location.href = '/';
        } catch {
            NotificationComponent.show({
                type: 'error',
                message: 'Не удалось сохранить объявление',
            });
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
            } else if (key === 'toggle-description') {
                element = document.querySelector('[data-action="toggle-description"]');
            } else if (key?.startsWith('thumb-')) {
                const thumbIndex = parseInt(key.split('-')[1]);
                const thumbnails = document.querySelectorAll('[data-thumbnail]');
                element = thumbnails[thumbIndex];
            }

            if (element) {
                element.removeEventListener('click', handler);
            }
        });

        this._handlers.clear();
        this.draftData = null;
        this.currentPhotoIndex = 0;
    }
}
