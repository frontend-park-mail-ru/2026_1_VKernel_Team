/**
 * Контроллер страницы создания объявления
 * Полностью переработан для поддержки характеристик согласно бэкенду
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
    ValidationErrors,
    ApiError,
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

    // Категорийные характеристики (хранят DOM элементы и их значения)
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
        // Защита от повторного рендера
        if (this.isRendering) {
            return;
        }

        this.isRendering = true;

        // Сохраняем adId в локальную переменную, т.к. cleanup из повторного
        // вызова router() может сбросить this.editingAdId во время await
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

            // Очищаем данные перед рендером
            this.clearAllData();

            // Режим редактирования
            this.editingAdId = editingId;

            const categories = await categoryService.getAllCategories();

            const template = placeAnAdTpl;

            const isEditing = !!editingId;

            const templateData = {
                isAuthenticated: store.isAuthenticated,
                user: store.user,
                categories: categories,
                isEditing,
                avatarUrl: (() => {
                    const src = store.user?.avatar_path;
                    if (!src) return '/images/logo/avatar.jpeg';
                    return src.startsWith('http') ? src : `${CONFIG.API.BASE_URL}/${src}`;
                })(),
            };

            // Восстанавливаем editingAdId (мог быть сброшен cleanup)
            this.editingAdId = editingId;

            app.innerHTML = template(templateData);

            this.attachEventListeners();

            if (editingId) {
                // Режим редактирования: загружаем данные объявления
                await this.loadAdForEditing(editingId);
            } else {
                // Режим создания: восстанавливаем черновик
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

<<<<<<< HEAD
    private static async restoreDraft(): Promise<void> {
        const draft = await AdDraftService.get();
        if (!draft) return;

        const titleInput = document.getElementById('title') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const priceInput = document.getElementById('price') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;

        if (titleInput) titleInput.value = draft.formData.title || '';
        if (priceInput) priceInput.value = String(draft.formData.price || 0);
        if (descriptionTextarea) descriptionTextarea.value = draft.formData.description || '';
        if (locationInput) locationInput.value = draft.formData.location || '';

        // Если была выбрана категория, загружаем ее характеристики и восстанавливаем значения
        if (draft.formData.category_id && categorySelect) {
            categorySelect.value = String(draft.formData.category_id);
            await this.loadCategoryCharacteristics(parseInt(draft.formData.category_id));

            // Восстанавливаем значения категорийных характеристик из черновика
            if (draft.formData.category_characteristics) {
                for (const char of draft.formData.category_characteristics) {
                    if (char.category_characteristic_id && char.value) {
                        this.categoryCharacteristicsValues.set(
                            char.category_characteristic_id,
                            char.value,
                        );
=======
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

            // Заполняем поля формы
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

            // Устанавливаем категорию и загружаем характеристики
            if (ad.category_id && categorySelect) {
                categorySelect.value = String(ad.category_id);
                await this.loadCategoryCharacteristics(ad.category_id);

                // Заполняем значения категорийных характеристик
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


            // Заполняем кастомные характеристики
            if (ad.custom_characteristics && ad.custom_characteristics.length > 0) {
                this.dynamicAttributes = ad.custom_characteristics.map((c: any) => ({
                    name: c.name,
                    value: c.value,
                }));
                this.renderDynamicAttributes();
            }
            }

            // Загружаем существующие фото
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
            AppController.navigateTo('/profile');
        }
    }

    private static async restoreDraft(): Promise<void> {
        // Защита от двойного вызова
        if (this.isRestoring) {
            return;
        }

        this.isRestoring = true;

        try {
            const draft = await AdDraftService.get();
            if (!draft) return;

            // Жёсткая очистка всех данных
            this.photoFiles = [];
            this.photoPreviews = [];
            this.dynamicAttributes = [];
            this.categoryCharacteristicsDefs = [];
            this.categoryCharacteristicsValues.clear();

            // Очищаем DOM сетку фото
            const grid = document.getElementById('photosGrid');
            if (grid) {
                const existingCards = grid.querySelectorAll('.photo-card');
                existingCards.forEach((card) => card.remove());
            }

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
                // Создаём превью для всех фото
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
            uiActions.showError('Не удалось загрузить характеристики категории');
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

<<<<<<< HEAD
=======
    private static renderPhotosGrid(): void {
        const grid = document.getElementById('photosGrid');
        if (!grid) return;

        const addBtn = document.getElementById('addPhotoBtn');
        if (!addBtn) return;

        // Удаляем все существующие карточки
        const existingCards = grid.querySelectorAll('.photo-card');
        existingCards.forEach((card) => card.remove());

        // Все превью: существующие фото (URL) + новые файлы
        const allPreviews = [
            ...this.existingPhotos,
            ...this.photoPreviews.slice(this.existingPhotos.length),
        ];

        // Создаем карточки заново
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

            if (!this.ALLOWED_TYPES.includes(file.type)) {
                uiActions.showError(
                    `Файл "${file.name}" не поддерживается. Используйте JPEG, PNG или WEBP`,
                );
                continue;
            }

            if (file.size > this.MAX_PHOTO_SIZE) {
                uiActions.showError(`Файл "${file.name}" превышает 5MB`);
                continue;
            }

            filesToAdd.push(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                const previewUrl = e.target?.result as string;
                previewsToAdd.push(previewUrl);
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
            // Удаляем существующее фото (URL)
            this.existingPhotos.splice(index, 1);
            this.photoPreviews.splice(index, 1);
        } else {
            // Удаляем новое фото (File)
            const fileIndex = index - this.existingPhotos.length;
            this.photoFiles.splice(fileIndex, 1);
            this.photoPreviews.splice(index, 1);
        }

        this.renderPhotosGrid();

        if (!this.editingAdId) {
            this.autoSaveDraft();
        }

        const remaining = this.existingPhotos.length + this.photoFiles.length;
        if (remaining === 0) {
            uiActions.showSuccess('Все фото удалены');
        } else {
            uiActions.showSuccess('Фото удалено');
        }
    }

    private static addDynamicAttribute(): void {
        if (this.dynamicAttributes.length >= this.MAX_CUSTOM_CHARS) {
            uiActions.showError(`Максимум ${this.MAX_CUSTOM_CHARS} пользовательских характеристик`);
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
                <input
                    type="text"
                    class="form-input attr-name"
                    placeholder="Название (например, Цвет)"
                    value="${this.escapeHtml(attr.name)}"
                    data-attr-name="${index}"
                    maxlength="100"
                >
                <input
                    type="text"
                    class="form-input attr-value"
                    placeholder="Значение (например, Черный)"
                    value="${this.escapeHtml(attr.value)}"
                    data-attr-value="${index}"
                    maxlength="500"
                >
                <button type="button" class="remove-attr-btn" data-index="${index}">✕</button>
            </div>
        `,
            )
            .join('');

        document.querySelectorAll('[data-attr-name]').forEach((input) => {
            const el = input as HTMLInputElement;
            const index = parseInt(el.dataset.attrName!);
            const handler = (e: Event) => {
                this.updateDynamicAttribute(index, 'name', (e.target as HTMLInputElement).value);
            };
            el.removeEventListener('input', handler);
            el.addEventListener('input', handler);
        });

        document.querySelectorAll('[data-attr-value]').forEach((input) => {
            const el = input as HTMLInputElement;
            const index = parseInt(el.dataset.attrValue!);
            const handler = (e: Event) => {
                this.updateDynamicAttribute(index, 'value', (e.target as HTMLInputElement).value);
            };
            el.removeEventListener('input', handler);
            el.addEventListener('input', handler);
        });
    }

    private static autoSaveDraft(): void {
        // Не сохраняем черновик в режиме редактирования
        if (this.editingAdId) return;

        const formData = this.collectFormData();

        if (!formData.title && !formData.description && this.photoFiles.length === 0) {
            return;
        }

        AdDraftService.save(formData, this.photoFiles);
    }

    private static collectFormData(): CreateAdData {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const priceInput = document.getElementById('price') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;

        const categoryCharacteristics: CharacteristicInput[] = [];
        for (const [charId, value] of this.categoryCharacteristicsValues) {
            if (value && value.trim()) {
                categoryCharacteristics.push({
                    category_characteristic_id: charId,
                    value: value.trim(),
                });
            }
        }

        const customCharacteristics: CustomCharacteristicInput[] = [];
        for (const attr of this.dynamicAttributes) {
            if (attr.name.trim() && attr.value.trim()) {
                customCharacteristics.push({
                    name: attr.name.trim(),
                    value: attr.value.trim(),
                });
            }
        }

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

    private static validateForm(data: CreateAdData, mode: 'publish' | 'draft'): boolean {
        if (mode === 'publish') {
            if (!data.title) {
                uiActions.showError('Введите название объявления');
                return false;
            }

            if (data.title.length < 5) {
                uiActions.showError('Название должно быть не менее 5 символов');
                return false;
            }

            if (data.title.length > 150) {
                uiActions.showError('Название не должно превышать 150 символов');
                return false;
            }

            if (!data.category_id || data.category_id === 0) {
                uiActions.showError('Выберите категорию');
                return false;
            }

            if (isNaN(data.price) || data.price < 0) {
                uiActions.showError('Цена не может быть отрицательной');
                return false;
            }

            if (data.description && data.description.length > 5000) {
                uiActions.showError('Описание не должно превышать 5000 символов');
                return false;
            }

            if (!data.location) {
                uiActions.showError('Укажите местоположение');
                return false;
            }

            if (this.photoFiles.length === 0 && this.existingPhotos.length === 0) {
                uiActions.showError('Добавьте хотя бы одно фото');
                return false;
            }
        } else {
            if (!data.title) {
                uiActions.showError('Введите название объявления');
                return false;
            }
        }

        return true;
    }

    private static async handleSubmit(mode: 'publish' | 'draft'): Promise<void> {
        AppController.showLoading(true);

        try {
            const formData = this.collectFormData();

            if (!this.validateForm(formData, mode)) {
                AppController.showLoading(false);
                return;
            }

            if (mode === 'draft') {
                formData.status = 'draft';
            }

            const multipartFormData = new FormData();
            multipartFormData.append('data', JSON.stringify(formData));

            // Добавляем новые фото-файлы
            this.photoFiles.forEach((file) => {
                multipartFormData.append('photos', file);
            });

            // В режиме редактирования передаём список существующих фото, которые нужно сохранить
            if (this.editingAdId && this.existingPhotos.length > 0) {
                multipartFormData.append('existing_photos', JSON.stringify(this.existingPhotos));
            }

            const isEditing = !!this.editingAdId;

            const result = isEditing
                ? await apiClient.put(
                      API_ENDPOINTS.ADS.UPDATE(this.editingAdId!),
                      multipartFormData,
                  )
                : await apiClient.post(API_ENDPOINTS.ADS.CREATE, multipartFormData);

            if (result.success) {
                if (isEditing) {
                    const editedId = this.editingAdId;
                    this.clearAllData();
                    uiActions.showSuccess('Объявление успешно обновлено!');
                    AppController.navigateTo(`/ad/${editedId}`);
                } else {
                    const responseData = result.data;
                    const adId = responseData?.ad_id || responseData?.id;
                    AdDraftService.clear();
                    this.clearAllData();

                    if (mode === 'publish') {
                        uiActions.showSuccess('Объявление успешно опубликовано!');
                        AppController.navigateTo(adId ? `/ad/${adId}` : '/');
                    } else {
                        uiActions.showSuccess('Объявление сохранено в черновики');
                        AppController.navigateTo('/profile');
                    }
                }
            } else {
                uiActions.showError(result.error || 'Ошибка при сохранении объявления');
            }
        } catch (error: any) {
            console.error('Error submitting ad:', error);
            console.error('Error details:', error?.message, error?.stack);
            uiActions.showError(error?.message || 'Не удалось соединиться с сервером');
        } finally {
            AppController.showLoading(false);
        }
    }

    private static async handlePreview(): Promise<void> {
        AppController.showLoading(true);

        try {
            const formData = this.collectFormData();

            if (!formData.title) {
                uiActions.showError('Введите название объявления');
                return;
            }

            if (!formData.category_id || formData.category_id === 0) {
                uiActions.showError('Выберите категорию');
                return;
            }

            this.autoSaveDraft();

            AppController.navigateTo('/ad-preview');
        } catch (error) {
            console.error('Error creating preview:', error);
            uiActions.showError('Не удалось создать предпросмотр');
        } finally {
            AppController.showLoading(false);
        }
    }

    private static escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

>>>>>>> origin/dev
    private static async showNotFound(): Promise<void> {
        const app = document.getElementById('app');
        if (!app) return;

        try {
            const response = await fetch('/templates/not-found.hbs');
            const templateSource = await response.text();
            const template = Handlebars.compile(templateSource);
            app.innerHTML = template({});
        } catch (error) {
            app.innerHTML = '<h1>404 - Страница не найдена</h1>';
        }
    }

    private static attachEventListeners(): void {
        // Обработчик выбора категории
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        if (categorySelect) {
            const handler = async () => {
                const categoryId = parseInt(categorySelect.value);
                await this.loadCategoryCharacteristics(categoryId);
                this.autoSaveDraft();
            };
            categorySelect.addEventListener('change', handler);
            this._handlers.set('categoryChange', handler);
        }

<<<<<<< HEAD
        // Обработчик отправки формы
        const form = document.getElementById('placeAdForm');
        if (form) {
=======
        // Обработчики полей ввода
        const titleInput = document.getElementById('title') as HTMLInputElement;
        if (titleInput) {
            const handler = () => this.autoSaveDraft();
            titleInput.addEventListener('input', handler);
            this._handlers.set('titleInput', handler);
        }

        const priceInput = document.getElementById('price') as HTMLInputElement;
        if (priceInput) {
            const handler = () => this.autoSaveDraft();
            priceInput.addEventListener('input', handler);
            this._handlers.set('priceInput', handler);
        }

        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
        if (descriptionTextarea) {
            const handler = () => this.autoSaveDraft();
            descriptionTextarea.addEventListener('input', handler);
            this._handlers.set('description', handler);
        }

        const locationInput = document.getElementById('location') as HTMLInputElement;
        if (locationInput) {
            const handler = () => this.autoSaveDraft();
            locationInput.addEventListener('input', handler);
            this._handlers.set('location', handler);
        }

        // Кнопки "Назад" и "Логотип"
        const backBtns = document.querySelectorAll('[data-action="back"]');
        for (let i = 0; i < backBtns.length; i++) {
            const btn = backBtns[i];
>>>>>>> origin/dev
            const handler = (e: Event) => {
                e.preventDefault();
                if (this.editingAdId) {
                    const editedId = this.editingAdId;
                    this.clearAllData();
                    AppController.navigateTo(`/ad/${editedId}`);
                } else {
                    this.autoSaveDraft();
                    AppController.navigateTo('/');
                }
            };
            btn.addEventListener('click', handler);
            this._handlers.set(`back-${i}`, handler);
        }

<<<<<<< HEAD
=======
        // Кнопка "Отмена"
        const cancelBtn = document.querySelector('[data-action="cancel-ad"]');
        if (cancelBtn) {
            const handler = (e: Event) => {
                e.preventDefault();
                if (this.editingAdId) {
                    const editedId = this.editingAdId;
                    this.clearAllData();
                    AppController.navigateTo(`/ad/${editedId}`);
                } else {
                    if (
                        confirm(
                            'Вы уверены, что хотите отменить создание объявления? Все введенные данные будут потеряны.',
                        )
                    ) {
                        AdDraftService.clear();
                        this.clearAllData();
                        AppController.navigateTo('/');
                    }
                }
            };
            cancelBtn.addEventListener('click', handler);
            this._handlers.set('cancel-ad', handler);
        }

>>>>>>> origin/dev
        // Кнопка сохранения черновика
        const draftBtn = document.getElementById('saveDraftBtn');
        if (draftBtn) {
            const handler = () => {
                this.handleSubmit('draft');
            };
            draftBtn.addEventListener('click', handler);
            this._handlers.set('saveDraft', handler);
        }

        // Кнопка предпросмотра
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            const handler = async () => {
                await this.handlePreview();
            };
            previewBtn.addEventListener('click', handler);
            this._handlers.set('preview', handler);
        }

<<<<<<< HEAD
        // Кнопка "Назад"
        const backBtns = document.querySelectorAll('[data-action="back"]');
        for (let i = 0; i < backBtns.length; i++) {
            const btn = backBtns[i];
            const handler = (e: Event) => {
                e.preventDefault();
                AppController.navigateTo('/');
=======
        // Кнопка "Сохранить изменения" (режим редактирования)
        const saveEditBtn = document.getElementById('saveEditBtn');
        if (saveEditBtn) {
            const handler = () => {
                this.handleSubmit('publish');
>>>>>>> origin/dev
            };
            saveEditBtn.addEventListener('click', handler);
            this._handlers.set('saveEdit', handler);
        }

        // Загрузка фото
        const addPhotoBtn = document.getElementById('addPhotoBtn');
        const photosInput = document.getElementById('photosInput') as HTMLInputElement;

        if (addPhotoBtn && photosInput) {
            const clickHandler = () => {
                photosInput.click();
            };
            addPhotoBtn.addEventListener('click', clickHandler);
            this._handlers.set('addPhotoBtn', clickHandler);

            const changeHandler = () => {
                this.handlePhotoUpload(photosInput);
            };
            photosInput.addEventListener('change', changeHandler);
            this._handlers.set('photosInput', changeHandler);
        }

        // Добавление пользовательской характеристики
        const addAttrBtn = document.getElementById('addAttributeBtn');
        if (addAttrBtn) {
            const handler = () => {
                this.addDynamicAttribute();
            };
            addAttrBtn.addEventListener('click', handler);
            this._handlers.set('addAttribute', handler);
        }

<<<<<<< HEAD
        // Удаление пользовательской характеристики (делегирование)
=======
        // Удаление пользовательской характеристики
>>>>>>> origin/dev
        const dynamicContainer = document.getElementById('dynamicAttributesContainer');
        if (dynamicContainer) {
            const handler = (e: Event) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('remove-attr-btn')) {
                    const index = target.dataset.index;
                    if (index !== undefined) {
                        this.removeDynamicAttribute(parseInt(index));
                    }
                }
            };
            dynamicContainer.addEventListener('click', handler);
            this._handlers.set('removeAttribute', handler);
        }
    }

<<<<<<< HEAD
    private static handlePhotoUpload(input: HTMLInputElement): void {
        const files = input.files;
        if (!files) return;

        const maxPhotos = 10;
        const currentCount = this.photoFiles.length;
        const availableSlots = maxPhotos - currentCount;

        if (files.length > availableSlots) {
            uiActions.showError(`Можно загрузить не более ${maxPhotos} фото`);
            input.value = '';
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!this.ALLOWED_TYPES.includes(file.type)) {
                uiActions.showError(
                    `Файл "${file.name}" не поддерживается. Используйте JPEG, PNG или WEBP`,
                );
                continue;
            }

            if (file.size > this.MAX_PHOTO_SIZE) {
                uiActions.showError(`Файл "${file.name}" превышает 5MB`);
                continue;
            }

            this.photoFiles.push(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                const previewUrl = e.target?.result as string;
                this.photoPreviews.push(previewUrl);
                this.renderPhotosGrid();
            };
            reader.readAsDataURL(file);
        }

        input.value = '';
    }

    private static renderPhotosGrid(): void {
        const grid = document.getElementById('photosGrid');
        if (!grid) return;

        const addBtn = document.getElementById('addPhotoBtn');
        if (!addBtn) return;

        const template = document.getElementById('photoCardTemplate') as HTMLTemplateElement;
        if (!template) return;

        const existingCards = grid.querySelectorAll('.photo-card');
        existingCards.forEach((card) => card.remove());

        this.photoPreviews.forEach((preview, index) => {
            const cardContent = document.importNode(template.content, true);
            const photoCard = cardContent.firstElementChild as HTMLElement;

            if (!photoCard) return;

            const img = photoCard.querySelector('img') as HTMLImageElement;
            const removeBtn = photoCard.querySelector('.photo-remove-btn') as HTMLButtonElement;
            const coverBadge = photoCard.querySelector('.photo-cover-badge') as HTMLElement;

            if (img) {
                img.src = preview;
                img.alt = `Фото ${index + 1}`;
            }

            if (removeBtn) {
                removeBtn.setAttribute('data-index', String(index));
                const newHandler = (e: Event) => {
                    e.stopPropagation();
                    this.removePhoto(index);
                };
                // Удаляем старый обработчик, если есть
                const oldHandler = this._handlers.get(`removePhoto-${index}`);
                if (oldHandler) {
                    removeBtn.removeEventListener('click', oldHandler);
                }
                removeBtn.addEventListener('click', newHandler);
                this._handlers.set(`removePhoto-${index}`, newHandler);
            }

            if (coverBadge && index !== 0) {
                coverBadge.style.display = 'none';
            }

            photoCard.dataset.photoIndex = String(index);
            grid.insertBefore(photoCard, addBtn);
        });
    }

    private static removePhoto(index: number): void {
        this.photoFiles.splice(index, 1);
        this.photoPreviews.splice(index, 1);
        this.renderPhotosGrid();

        if (this.photoFiles.length === 0) {
            uiActions.showSuccess('Все фото удалены');
        } else {
            uiActions.showSuccess('Фото удалено');
        }
    }

    private static addDynamicAttribute(): void {
        if (this.dynamicAttributes.length >= this.MAX_CUSTOM_CHARS) {
            uiActions.showError(`Максимум ${this.MAX_CUSTOM_CHARS} пользовательских характеристик`);
            return;
        }
        this.dynamicAttributes.push({ name: '', value: '' });
        this.renderDynamicAttributes();
    }

    private static removeDynamicAttribute(index: number): void {
        this.dynamicAttributes.splice(index, 1);
        this.renderDynamicAttributes();
    }

    private static updateDynamicAttribute(
        index: number,
        field: 'name' | 'value',
        value: string,
    ): void {
        if (this.dynamicAttributes[index]) {
            this.dynamicAttributes[index][field] = value;
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
                <input
                    type="text"
                    class="form-input attr-name"
                    placeholder="Название (например, Цвет)"
                    value="${this.escapeHtml(attr.name)}"
                    data-attr-name="${index}"
                    maxlength="100"
                >
                <input
                    type="text"
                    class="form-input attr-value"
                    placeholder="Значение (например, Черный)"
                    value="${this.escapeHtml(attr.value)}"
                    data-attr-value="${index}"
                    maxlength="500"
                >
                <button type="button" class="remove-attr-btn" data-index="${index}">✕</button>
            </div>
        `,
            )
            .join('');

        // Навешиваем обработчики для обновления значений
        document.querySelectorAll('[data-attr-name]').forEach((input) => {
            const el = input as HTMLInputElement;
            const index = parseInt(el.dataset.attrName!);
            const handler = (e: Event) => {
                this.updateDynamicAttribute(index, 'name', (e.target as HTMLInputElement).value);
            };
            el.removeEventListener('input', handler);
            el.addEventListener('input', handler);
        });

        document.querySelectorAll('[data-attr-value]').forEach((input) => {
            const el = input as HTMLInputElement;
            const index = parseInt(el.dataset.attrValue!);
            const handler = (e: Event) => {
                this.updateDynamicAttribute(index, 'value', (e.target as HTMLInputElement).value);
            };
            el.removeEventListener('input', handler);
            el.addEventListener('input', handler);
        });
    }

    private static escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    private static collectFormData(): CreateAdData {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const priceInput = document.getElementById('price') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;

        // Собираем категорийные характеристики
        const categoryCharacteristics: CharacteristicInput[] = [];
        for (const [charId, value] of this.categoryCharacteristicsValues) {
            if (value && value.trim()) {
                categoryCharacteristics.push({
                    category_characteristic_id: charId,
                    value: value.trim(),
                });
            }
        }

        // Собираем пользовательские характеристики
        const customCharacteristics: CustomCharacteristicInput[] = [];
        for (const attr of this.dynamicAttributes) {
            if (attr.name.trim() && attr.value.trim()) {
                customCharacteristics.push({
                    name: attr.name.trim(),
                    value: attr.value.trim(),
                });
            }
        }

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

    private static validateForm(data: CreateAdData, mode: 'publish' | 'draft'): boolean {
        if (mode === 'publish') {
            if (!data.title) {
                uiActions.showError('Введите название объявления');
                return false;
            }

            if (data.title.length < 5) {
                uiActions.showError('Название должно быть не менее 5 символов');
                return false;
            }

            if (data.title.length > 150) {
                uiActions.showError('Название не должно превышать 150 символов');
                return false;
            }

            if (!data.category_id || data.category_id === 0) {
                uiActions.showError('Выберите категорию');
                return false;
            }

            if (isNaN(data.price) || data.price < 0) {
                uiActions.showError('Цена не может быть отрицательной');
                return false;
            }

            if (data.description && data.description.length > 5000) {
                uiActions.showError('Описание не должно превышать 5000 символов');
                return false;
            }

            if (!data.location) {
                uiActions.showError('Укажите местоположение');
                return false;
            }

            if (this.photoFiles.length === 0) {
                uiActions.showError('Добавьте хотя бы одно фото');
                return false;
            }
        } else {
            // Для черновика достаточно названия
            if (!data.title) {
                uiActions.showError('Введите название объявления');
                return false;
            }
        }

        return true;
    }

    private static async handleSubmit(mode: 'publish' | 'draft'): Promise<void> {
        AppController.showLoading(true);

        try {
            const formData = this.collectFormData();

            if (!this.validateForm(formData, mode)) {
                AppController.showLoading(false);
                return;
            }

            // Для черновика меняем статус
            if (mode === 'draft') {
                formData.status = 'draft';
            }

            // Оффлайн-путь: сохраняем черновик и ставим в очередь
            if (!networkStatus.isOnline) {
                await this.saveForOfflinePublish(formData);
                return;
            }

            const multipartFormData = new FormData();
            multipartFormData.append('data', JSON.stringify(formData));

            this.photoFiles.forEach((file) => {
                multipartFormData.append('photos', file);
            });

            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/ads', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: multipartFormData,
            });

            const result = await response.json();

            if (response.ok) {
                const adId = result.ad_id || result.data?.id;

                if (mode === 'publish') {
                    NotificationComponent.show({
                        type: 'success',
                        message: 'Объявление успешно опубликовано!',
                    });
                    if (adId) {
                        AppController.navigateTo(`/ad/${adId}`);
                    } else {
                        AppController.navigateTo('/');
                    }
                } else {
                    NotificationComponent.show({
                        type: 'success',
                        message: 'Объявление сохранено в черновики',
                    });
                    AppController.navigateTo('/profile');
                }
            } else {
                this.showFormErrors(result);
                const errorMessage =
                    result.error || result.message || 'Ошибка при сохранении объявления';
                NotificationComponent.show({ type: 'error', message: errorMessage });
            }
        } catch (error) {
            console.error('Error submitting ad:', error);
            // Фолбек на оффлайн при сетевой ошибке
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
                message: 'Объявление будет опубликовано при подключении к интернету',
                duration: 5000,
            });
            AppController.navigateTo('/');
        } catch {
            NotificationComponent.show({
                type: 'error',
                message: 'Не удалось сохранить объявление',
            });
        }
    }

    private static async handlePreview(): Promise<void> {
        AppController.showLoading(true);

        try {
            const formData = this.collectFormData();

            if (!formData.title) {
                uiActions.showError('Введите название объявления');
                return;
            }

            if (!formData.category_id || formData.category_id === 0) {
                uiActions.showError('Выберите категорию');
                return;
            }

            // Сохраняем черновик для предпросмотра
            await AdDraftService.save(
                {
                    title: formData.title,
                    category_id: formData.category_id,
                    price: formData.price,
                    description: formData.description,
                    location: formData.location,
                    category_characteristics: formData.category_characteristics || [],
                    custom_characteristics: formData.custom_characteristics || [],
                },
                this.photoFiles,
            );

            AppController.navigateTo('/ad-preview');
        } catch (error) {
            console.error('Error creating preview:', error);
            uiActions.showError('Не удалось создать предпросмотр');
        } finally {
            AppController.showLoading(false);
        }
    }

    private static showFormErrors(result: any): void {
        // Удаляем старые ошибки
        document.querySelectorAll('.field-error').forEach((el) => el.remove());
        document.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));

        if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, error]) => {
                const input = document.getElementById(field);
                if (input && error) {
                    input.classList.add('error');
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'field-error';
                    errorDiv.textContent = error as string;
                    input.parentNode?.appendChild(errorDiv);
                }
            });
        }

        // Обработка ошибок характеристик
        if (result.category_characteristics) {
            uiActions.showError(`Ошибка в характеристиках: ${result.category_characteristics}`);
        }
        if (result.custom_characteristics) {
            uiActions.showError(
                `Ошибка в пользовательских характеристиках: ${result.custom_characteristics}`,
            );
        }
    }

=======
>>>>>>> origin/dev
    static cleanup(): void {
        // Не очищаем данные если идёт рендеринг (cleanup может быть вызван
        // повторным router() во время async render)
        if (this.isRendering) return;

        this._handlers.forEach((handler, key) => {
<<<<<<< HEAD
            if (key === 'submit') {
                document.getElementById('placeAdForm')?.removeEventListener('submit', handler);
            } else if (key === 'categoryChange') {
                document.getElementById('category')?.removeEventListener('change', handler);
            } else if (key === 'addAttribute') {
                document.getElementById('addAttributeBtn')?.removeEventListener('click', handler);
            } else if (key === 'addPhotoBtn') {
                document.getElementById('addPhotoBtn')?.removeEventListener('click', handler);
            } else if (key === 'photosInput') {
                document.getElementById('photosInput')?.removeEventListener('change', handler);
            } else if (key === 'removeAttribute') {
                document
                    .getElementById('dynamicAttributesContainer')
                    ?.removeEventListener('click', handler);
            } else if (key === 'saveDraft') {
                document.getElementById('saveDraftBtn')?.removeEventListener('click', handler);
            } else if (key === 'preview') {
                document.getElementById('previewBtn')?.removeEventListener('click', handler);
            } else if (key.startsWith('back-')) {
                const btns = document.querySelectorAll('[data-action="back"]');
                const element = btns[parseInt(key.split('-')[1])];
                if (element) element.removeEventListener('click', handler);
            } else if (key.startsWith('removePhoto-')) {
                const btns = document.querySelectorAll('.photo-remove-btn');
                const element = btns[parseInt(key.split('-')[1])];
                if (element) element.removeEventListener('click', handler);
=======
            let element: Element | null = null;

            if (key === 'categoryChange') {
                element = document.getElementById('category');
            } else if (key === 'titleInput') {
                element = document.getElementById('title');
            } else if (key === 'priceInput') {
                element = document.getElementById('price');
            } else if (key === 'description') {
                element = document.getElementById('description');
            } else if (key === 'location') {
                element = document.getElementById('location');
            } else if (key === 'saveDraft') {
                element = document.getElementById('saveDraftBtn');
            } else if (key === 'preview') {
                element = document.getElementById('previewBtn');
            } else if (key === 'saveEdit') {
                element = document.getElementById('saveEditBtn');
            } else if (key === 'addPhotoBtn') {
                element = document.getElementById('addPhotoBtn');
            } else if (key === 'photosInput') {
                element = document.getElementById('photosInput');
            } else if (key === 'addAttribute') {
                element = document.getElementById('addAttributeBtn');
            } else if (key === 'removeAttribute') {
                element = document.getElementById('dynamicAttributesContainer');
            } else if (key === 'cancel-ad') {
                element = document.querySelector('[data-action="cancel-ad"]');
            } else if (key.startsWith('back-')) {
                const btns = document.querySelectorAll('[data-action="back"]');
                element = btns[parseInt(key.split('-')[1])] || null;
            }

            if (element) {
                element.removeEventListener('click', handler);
                element.removeEventListener('change', handler);
                element.removeEventListener('input', handler);
>>>>>>> origin/dev
            }
        });

        this._handlers.clear();
<<<<<<< HEAD

        // Очищаем данные
        this.photoPreviews.forEach((preview) => {
            if (preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        });

        this.photoFiles = [];
        this.photoPreviews = [];
        this.dynamicAttributes = [];
        this.categoryCharacteristicsDefs = [];
        this.categoryCharacteristicsValues.clear();
=======
        this.clearAllData();
>>>>>>> origin/dev
    }
}
