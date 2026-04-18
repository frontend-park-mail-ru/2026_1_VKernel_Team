/**
 * Контроллер страницы создания и редактирования объявления
 * Реализована поддержка оффлайн-сохранения (IndexedDB) и режима редактирования
 */

import Handlebars from 'handlebars';
import placeAnAdTpl from './templates/place-an-ad.hbs';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { AppController } from '@/controllers/AppController';
import { AdDraftService } from '@/services/adDraftService';
import { categoryService } from '@/services/categoryService';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { syncQueue } from '@modules/common/offline/sync/syncQueue';
import { NotificationComponent } from '@modules/common/notifications/notification';
import { adsService } from '@/services/adsServices';
import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import type {
    Category,
    CategoryCharacteristic,
    CharacteristicInput,
    CustomCharacteristicInput,
    CreateAdData,
} from '@/types';

interface DynamicAttribute {
    name: string;
    value: string;
}

export class PlaceAnAdController {
    private static _handlers: Map<string, EventListener> = new Map();
    private static photoFiles: File[] = [];
    private static photoPreviews: string[] = [];

    // Динамические характеристики (custom_characteristics)
    private static dynamicAttributes: DynamicAttribute[] = [];

    // Категорийные характеристики
    private static categoryCharacteristicsDefs: CategoryCharacteristic[] = [];
    private static categoryCharacteristicsValues: Map<number, string> = new Map();

    private static readonly MAX_PHOTO_SIZE = 5 * 1024 * 1024;
    private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    private static readonly MAX_CUSTOM_CHARS = 10;

    // Режим редактирования
    private static editingAdId: string | null = null;
    private static existingPhotos: string[] = [];

    // Флаги для защиты от двойных вызовов
    private static isRendering: boolean = false;
    private static isRestoring: boolean = false;

    static async render(adId?: string): Promise<void> {
        if (this.isRendering) return;
        this.isRendering = true;

        const editingId = adId || null;
        const app = document.getElementById('app');
        if (!app) {
            this.isRendering = false;
            return;
        }

        document.body.classList.remove('auth-page');
        AppController.showLoading(true);

        try {
            if (!store.isAuthenticated) {
                AppController.navigateTo('/login');
                uiActions.showError('Пожалуйста, войдите в систему');
                return;
            }

            this.clearAllData();
            this.editingAdId = editingId;

            const categories = await categoryService.getAllCategories();
            const isEditing = !!editingId;

            const templateData = {
                isAuthenticated: store.isAuthenticated,
                user: store.user,
                categories: categories,
                isEditing,
                avatarUrl: (() => {
                    const src = store.user?.avatar_path;
                    if (!src) return '/images/logo/avatar.jpeg';
                    if (src.startsWith('http') || src.startsWith('data:')) return src;
                    return `${CONFIG.API.BASE_URL}/${src}`;
                })(),
            };

            app.innerHTML = placeAnAdTpl(templateData);
            this.attachEventListeners();

            if (editingId) {
                await this.loadAdForEditing(editingId);
            } else {
                await this.restoreDraft();
            }
        } catch (error) {
            console.error('Error loading place-an-ad page:', error);
            await this.showNotFound();
        } finally {
            AppController.showLoading(false);
            this.isRendering = false;
        }
    }

    private static clearAllData(): void {
        this.photoFiles = [];
        this.photoPreviews = [];
        this.existingPhotos = [];
        this.dynamicAttributes = [];
        this.categoryCharacteristicsDefs = [];
        this.categoryCharacteristicsValues.clear();
        this._handlers.clear();
        this.editingAdId = null;
    }

    private static async loadAdForEditing(adId: string): Promise<void> {
        try {
            const result = await adsService.getAdById(adId);

            if (!result.success || !result.data) {
                uiActions.showError('Не удалось загрузить объявление');
                AppController.navigateTo('/profile');
                return;
            }

            const ad = result.data;

            const titleInput = document.getElementById('title') as HTMLInputElement;
            const categorySelect = document.getElementById('category') as HTMLSelectElement;
            const priceInput = document.getElementById('price') as HTMLInputElement;
            const descriptionTextarea = document.getElementById(
                'description',
            ) as HTMLTextAreaElement;
            const locationInput = document.getElementById('location') as HTMLInputElement;

            if (titleInput) titleInput.value = ad.title || '';
            if (priceInput) priceInput.value = String(ad.price || 0);
            if (descriptionTextarea) descriptionTextarea.value = ad.description || '';
            if (locationInput) locationInput.value = ad.location || '';

            if (ad.category_id && categorySelect) {
                categorySelect.value = String(ad.category_id);
                await this.loadCategoryCharacteristics(ad.category_id);

                if (ad.category_characteristics && ad.category_characteristics.length > 0) {
                    for (const char of ad.category_characteristics) {
                        const charId = char.category_characteristic_id || char.id;
                        if (charId && char.value) {
                            this.categoryCharacteristicsValues.set(charId, char.value);
                        }
                    }
                    this.renderCategoryCharacteristicsForm();
                }
            }

            if (ad.custom_characteristics && ad.custom_characteristics.length > 0) {
                this.dynamicAttributes = ad.custom_characteristics.map((c: any) => ({
                    name: c.name,
                    value: c.value,
                }));
                this.renderDynamicAttributes();
            }

            if (ad.photos && ad.photos.length > 0) {
                this.existingPhotos = ad.photos.map((photo: string) =>
                    photo.startsWith('http') ? photo : `${CONFIG.API.BASE_URL}${photo}`,
                );
                this.photoPreviews = [...this.existingPhotos];
                this.renderPhotosGrid();
            }
        } catch (error) {
            console.error('Error loading ad for editing:', error);
            uiActions.showError('Ошибка загрузки объявления');
        }
    }

    private static async restoreDraft(): Promise<void> {
        if (this.isRestoring) return;
        this.isRestoring = true;

        try {
            const draft = await AdDraftService.get();
            if (!draft) return;

            const titleInput = document.getElementById('title') as HTMLInputElement;
            const categorySelect = document.getElementById('category') as HTMLSelectElement;
            const priceInput = document.getElementById('price') as HTMLInputElement;
            const descriptionTextarea = document.getElementById(
                'description',
            ) as HTMLTextAreaElement;
            const locationInput = document.getElementById('location') as HTMLInputElement;

            if (titleInput) titleInput.value = draft.formData.title || '';
            if (priceInput) priceInput.value = String(draft.formData.price || 0);
            if (descriptionTextarea) descriptionTextarea.value = draft.formData.description || '';
            if (locationInput) locationInput.value = draft.formData.location || '';

            if (draft.formData.category_id && categorySelect) {
                categorySelect.value = String(draft.formData.category_id);
                await this.loadCategoryCharacteristics(parseInt(draft.formData.category_id));

                if (draft.formData.category_characteristics) {
                    for (const char of draft.formData.category_characteristics) {
                        if (char.category_characteristic_id && char.value) {
                            this.categoryCharacteristicsValues.set(
                                char.category_characteristic_id,
                                char.value,
                            );
                        }
                    }
                    this.renderCategoryCharacteristicsForm();
                }
            }

            if (
                draft.formData.custom_characteristics &&
                draft.formData.custom_characteristics.length > 0
            ) {
                this.dynamicAttributes = draft.formData.custom_characteristics.map((c: any) => ({
                    name: c.name,
                    value: c.value,
                }));
                this.renderDynamicAttributes();
            }

            if (draft.photoFiles.length > 0) {
                for (const file of draft.photoFiles) {
                    const preview = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target?.result as string);
                        reader.readAsDataURL(file);
                    });
                    this.photoPreviews.push(preview);
                }
                this.photoFiles = [...draft.photoFiles];
                this.renderPhotosGrid();
                NotificationComponent.show({
                    type: 'success',
                    message: `Восстановлен черновик: ${draft.formData.title}`,
                });
            }
        } finally {
            this.isRestoring = false;
        }
    }

    private static async loadCategoryCharacteristics(categoryId: number): Promise<void> {
        if (!categoryId) {
            this.categoryCharacteristicsDefs = [];
            this.categoryCharacteristicsValues.clear();
            this.renderCategoryCharacteristicsForm();
            return;
        }

        try {
            this.categoryCharacteristicsDefs =
                await categoryService.getCategoryCharacteristics(categoryId);
            this.categoryCharacteristicsValues.clear();
            this.renderCategoryCharacteristicsForm();
        } catch (error) {
            console.error('Error loading category characteristics:', error);
        }
    }

    private static renderCategoryCharacteristicsForm(): void {
        const container = document.getElementById('categoryCharacteristicsContainer');
        if (!container) return;

        if (this.categoryCharacteristicsDefs.length === 0) {
            container.innerHTML =
                '<div class="no-characteristics">Для этой категории нет дополнительных характеристик</div>';
            return;
        }

        const html = this.categoryCharacteristicsDefs
            .map((def) => {
                const currentValue = this.categoryCharacteristicsValues.get(def.id) || '';

                if (def.allowed_values !== null && def.allowed_values.length > 0) {
                    const options = [
                        '<option value="">Не выбрано</option>',
                        ...def.allowed_values.map(
                            (val) =>
                                `<option value="${this.escapeHtml(val)}" ${currentValue === val ? 'selected' : ''}>${this.escapeHtml(val)}</option>`,
                        ),
                    ].join('');

                    return `
                    <div class="form-section" data-char-id="${def.id}">
                        <label class="section-label">${this.escapeHtml(def.name)}</label>
                        <select class="form-select category-characteristic" data-char-id="${def.id}">
                            ${options}
                        </select>
                    </div>
                `;
                } else {
                    return `
                    <div class="form-section" data-char-id="${def.id}">
                        <label class="section-label">${this.escapeHtml(def.name)}</label>
                        <input
                            type="text"
                            class="form-input category-characteristic"
                            data-char-id="${def.id}"
                            placeholder="${this.escapeHtml(def.name)}"
                            value="${this.escapeHtml(currentValue)}"
                            maxlength="500"
                        >
                    </div>
                `;
                }
            })
            .join('');

        container.innerHTML = html;

        container.querySelectorAll('.category-characteristic').forEach((el) => {
            const charId = parseInt((el as HTMLElement).dataset.charId!);
            const saveHandler = () => {
                const value = (el as HTMLInputElement | HTMLSelectElement).value.trim();
                if (value) {
                    this.categoryCharacteristicsValues.set(charId, value);
                } else {
                    this.categoryCharacteristicsValues.delete(charId);
                }
                this.autoSaveDraft();
            };
            el.addEventListener('change', saveHandler);
            el.addEventListener('input', saveHandler);
        });
    }

    private static renderPhotosGrid(): void {
        const grid = document.getElementById('photosGrid');
        if (!grid) return;

        const addBtn = document.getElementById('addPhotoBtn');
        if (!addBtn) return;

        const existingCards = grid.querySelectorAll('.photo-card');
        existingCards.forEach((card) => card.remove());

        const allPreviews = [
            ...this.existingPhotos,
            ...this.photoPreviews.slice(this.existingPhotos.length),
        ];

        allPreviews.forEach((preview, index) => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            photoCard.dataset.photoIndex = String(index);

            const img = document.createElement('img');
            img.src = preview;
            img.alt = `Фото ${index + 1}`;

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'photo-remove-btn';
            removeBtn.setAttribute('data-index', String(index));

            const removeHandler = (e: Event) => {
                e.stopPropagation();
                this.removePhoto(index);
            };
            removeBtn.addEventListener('click', removeHandler);

            photoCard.appendChild(img);
            photoCard.appendChild(removeBtn);

            if (index === 0) {
                const coverBadge = document.createElement('div');
                coverBadge.className = 'photo-cover-badge';
                coverBadge.textContent = 'Обложка';
                photoCard.appendChild(coverBadge);
            }

            grid.insertBefore(photoCard, addBtn);
        });
    }

    private static handlePhotoUpload(input: HTMLInputElement): void {
        const files = input.files;
        if (!files) return;

        const maxPhotos = 10;
        const currentCount = this.photoFiles.length + this.existingPhotos.length;
        const availableSlots = maxPhotos - currentCount;

        if (files.length > availableSlots) {
            uiActions.showError(`Можно загрузить не более ${maxPhotos} фото`);
            input.value = '';
            return;
        }

        const filesToAdd: File[] = [];
        const previewsToAdd: string[] = [];
        let processedCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!this.ALLOWED_TYPES.includes(file.type) || file.size > this.MAX_PHOTO_SIZE) {
                uiActions.showError(`Файл "${file.name}" не подходит по типу или размеру`);
                continue;
            }

            filesToAdd.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                previewsToAdd.push(e.target?.result as string);
                processedCount++;
                if (processedCount === filesToAdd.length) {
                    this.photoFiles.push(...filesToAdd);
                    this.photoPreviews.push(...previewsToAdd);
                    this.renderPhotosGrid();
                    this.autoSaveDraft();
                }
            };
            reader.readAsDataURL(file);
        }
        input.value = '';
    }

    private static removePhoto(index: number): void {
        const totalPhotos = this.existingPhotos.length + this.photoFiles.length;
        if (index < 0 || index >= totalPhotos) return;

        if (index < this.existingPhotos.length) {
            this.existingPhotos.splice(index, 1);
            this.photoPreviews.splice(index, 1);
        } else {
            const fileIndex = index - this.existingPhotos.length;
            this.photoFiles.splice(fileIndex, 1);
            this.photoPreviews.splice(index, 1);
        }

        this.renderPhotosGrid();
        if (!this.editingAdId) this.autoSaveDraft();
        uiActions.showSuccess('Фото удалено');
    }

    private static addDynamicAttribute(): void {
        if (this.dynamicAttributes.length >= this.MAX_CUSTOM_CHARS) {
            uiActions.showError(`Максимум ${this.MAX_CUSTOM_CHARS} характеристик`);
            return;
        }
        this.dynamicAttributes.push({ name: '', value: '' });
        this.renderDynamicAttributes();
        this.autoSaveDraft();
    }

    private static removeDynamicAttribute(index: number): void {
        this.dynamicAttributes.splice(index, 1);
        this.renderDynamicAttributes();
        this.autoSaveDraft();
    }

    private static updateDynamicAttribute(
        index: number,
        field: 'name' | 'value',
        value: string,
    ): void {
        if (this.dynamicAttributes[index]) {
            this.dynamicAttributes[index][field] = value;
            this.autoSaveDraft();
        }
    }

    private static renderDynamicAttributes(): void {
        const container = document.getElementById('dynamicAttributesContainer');
        if (!container) return;

        if (this.dynamicAttributes.length === 0) {
            container.innerHTML =
                '<div class="no-characteristics">Добавьте свои характеристики</div>';
            return;
        }

        container.innerHTML = this.dynamicAttributes
            .map(
                (attr, index) => `
            <div class="dynamic-attribute" data-attr-index="${index}">
                <input type="text" class="form-input attr-name" placeholder="Название" value="${this.escapeHtml(attr.name)}" data-attr-name="${index}">
                <input type="text" class="form-input attr-value" placeholder="Значение" value="${this.escapeHtml(attr.value)}" data-attr-value="${index}">
                <button type="button" class="remove-attr-btn" data-index="${index}">✕</button>
            </div>`,
            )
            .join('');

        container.querySelectorAll('[data-attr-name]').forEach((el) => {
            el.addEventListener('input', (e) =>
                this.updateDynamicAttribute(
                    parseInt((el as HTMLElement).dataset.attrName!),
                    'name',
                    (e.target as HTMLInputElement).value,
                ),
            );
        });
        container.querySelectorAll('[data-attr-value]').forEach((el) => {
            el.addEventListener('input', (e) =>
                this.updateDynamicAttribute(
                    parseInt((el as HTMLElement).dataset.attrValue!),
                    'value',
                    (e.target as HTMLInputElement).value,
                ),
            );
        });
        container.querySelectorAll('.remove-attr-btn').forEach((el) => {
            el.addEventListener('click', () =>
                this.removeDynamicAttribute(parseInt((el as HTMLElement).dataset.index!)),
            );
        });
    }

    private static autoSaveDraft(): void {
        if (this.editingAdId) return;
        const formData = this.collectFormData();
        if (!formData.title && !formData.description && this.photoFiles.length === 0) return;
        AdDraftService.save(formData, this.photoFiles);
    }

    private static collectFormData(): CreateAdData {
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const priceInput = document.getElementById('price') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;

        const categoryCharacteristics: CharacteristicInput[] = [];
        for (const [charId, value] of this.categoryCharacteristicsValues) {
            if (value?.trim())
                categoryCharacteristics.push({
                    category_characteristic_id: charId,
                    value: value.trim(),
                });
        }

        const customCharacteristics: CustomCharacteristicInput[] = this.dynamicAttributes
            .filter((attr) => attr.name.trim() && attr.value.trim())
            .map((attr) => ({ name: attr.name.trim(), value: attr.value.trim() }));

        return {
            category_id: parseInt(categorySelect?.value || '0'),
            title: titleInput?.value.trim() || '',
            description: descriptionTextarea?.value.trim() || '',
            price: parseInt(priceInput?.value || '0'),
            status: 'active',
            location: locationInput?.value.trim() || '',
            category_characteristics:
                categoryCharacteristics.length > 0 ? categoryCharacteristics : undefined,
            custom_characteristics:
                customCharacteristics.length > 0 ? customCharacteristics : undefined,
        };
    }

    private static async handleSubmit(mode: 'publish' | 'draft'): Promise<void> {
        AppController.showLoading(true);
        try {
            const formData = this.collectFormData();
            if (mode === 'draft') formData.status = 'draft';

            if (!networkStatus.isOnline) {
                await this.saveForOfflinePublish(formData);
                return;
            }

            const multipartFormData = new FormData();
            multipartFormData.append('data', JSON.stringify(formData));
            this.photoFiles.forEach((file) => multipartFormData.append('photos', file));
            if (this.editingAdId && this.existingPhotos.length > 0) {
                multipartFormData.append('existing_photos', JSON.stringify(this.existingPhotos));
            }

            const result = this.editingAdId
                ? await apiClient.put(API_ENDPOINTS.ADS.UPDATE(this.editingAdId), multipartFormData)
                : await apiClient.post(API_ENDPOINTS.ADS.CREATE, multipartFormData);

            if (result.success) {
                const adId = result.data?.ad_id || result.data?.id || this.editingAdId;
                if (!this.editingAdId) AdDraftService.clear();
                this.clearAllData();
                NotificationComponent.show({ type: 'success', message: 'Успешно сохранено!' });
                AppController.navigateTo(adId ? `/ad/${adId}` : '/profile');
            } else {
                NotificationComponent.show({
                    type: 'error',
                    message: result.error || 'Ошибка сохранения',
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            await this.saveForOfflinePublish(this.collectFormData());
        } finally {
            AppController.showLoading(false);
        }
    }

    private static async saveForOfflinePublish(formData: CreateAdData): Promise<void> {
        try {
            const draftId = await AdDraftService.save(formData, this.photoFiles);
            await syncQueue.add({
                type: 'CREATE_AD',
                payload: { draft_id: draftId },
                timestamp: Date.now(),
            });
            networkStatus.setOffline();
            NotificationComponent.show({
                type: 'info',
                message: 'Будет опубликовано при подключении к сети',
                duration: 5000,
            });
            AppController.navigateTo('/');
        } catch (error) {
            NotificationComponent.show({ type: 'error', message: 'Не удалось сохранить оффлайн' });
        }
    }

    private static async handlePreview(): Promise<void> {
        AppController.showLoading(true);
        try {
            const formData = this.collectFormData();
            await AdDraftService.save(formData, this.photoFiles);
            AppController.navigateTo('/ad-preview');
        } catch (error) {
            uiActions.showError('Не удалось создать предпросмотр');
        } finally {
            AppController.showLoading(false);
        }
    }

    private static attachEventListeners(): void {
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        categorySelect?.addEventListener('change', async () => {
            await this.loadCategoryCharacteristics(parseInt(categorySelect.value));
            this.autoSaveDraft();
        });

        ['title', 'price', 'description', 'location'].forEach((id) => {
            document.getElementById(id)?.addEventListener('input', () => this.autoSaveDraft());
        });

        document
            .getElementById('saveDraftBtn')
            ?.addEventListener('click', () => this.handleSubmit('draft'));
        document
            .getElementById('previewBtn')
            ?.addEventListener('click', () => this.handlePreview());
        document
            .getElementById('saveEditBtn')
            ?.addEventListener('click', () => this.handleSubmit('publish'));
        document
            .getElementById('addPhotoBtn')
            ?.addEventListener('click', () =>
                (document.getElementById('photosInput') as HTMLInputElement)?.click(),
            );
        document
            .getElementById('photosInput')
            ?.addEventListener('change', (e) =>
                this.handlePhotoUpload(e.target as HTMLInputElement),
            );
        document
            .getElementById('addAttributeBtn')
            ?.addEventListener('click', () => this.addDynamicAttribute());

        document.querySelectorAll('[data-action="back"]').forEach((btn) =>
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.editingAdId) {
                    AppController.navigateTo(`/ad/${this.editingAdId}`);
                } else {
                    AppController.navigateTo('/');
                }
            }),
        );
    }

    static cleanup(): void {
        if (this.isRendering) return;
        this.clearAllData();
    }

    private static escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    private static async showNotFound(): Promise<void> {
        const app = document.getElementById('app');
        if (app) app.innerHTML = '<h1>404 - Страница не найдена</h1>';
    }
}
