/**
 * Контроллер страницы создания и редактирования объявления
 * Реализована поддержка оффлайн-сохранения (IndexedDB) и режима редактирования
 */

import './css/place-an-ad.scss';
import Handlebars from 'handlebars';
import placeAnAdTpl from './templates/place-an-ad.hbs';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { AdDraftService } from '@/services/adDraftService';
import { categoryService } from '@/services/categoryService';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { syncQueue } from '@modules/common/offline/sync/syncQueue';
import { NotificationComponent } from '@modules/common/notifications/notification';
import { adsService } from '@/services/adsServices';
import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import { AdValidator } from '@/validators/adValidator';
import { ICONS } from '@/utils/icons';
import '@modules/common/components/modal/modal.scss';
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

    private static dynamicAttributes: DynamicAttribute[] = [];

    private static categoryCharacteristicsDefs: CategoryCharacteristic[] = [];
    private static categoryCharacteristicsValues: Map<number, string> = new Map();

    private static readonly MAX_PHOTO_SIZE = 5 * 1024 * 1024;
    private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    private static readonly MAX_CUSTOM_CHARS = 10;

    private static editingAdId: string | null = null;
    private static existingPhotos: string[] = [];

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
        window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));

        try {
            if (!store.isAuthenticated) {
                window.location.href = '/login';
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
            window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: false } }));
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
                window.location.href = '/profile';
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
                    this.applyAdCategoryCharacteristics(ad.category_characteristics);
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
                    this.applyDraftCategoryCharacteristics(draft.formData.category_characteristics);
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

    // Бэкенд отдаёт ad.category_characteristics как {name, value} без id —
    // сопоставляем с определениями категории по имени.
    private static applyAdCategoryCharacteristics(chars: any[]): void {
        const defIdByName = new Map<string, number>();
        for (const def of this.categoryCharacteristicsDefs) {
            defIdByName.set(def.name, def.id);
        }
        for (const char of chars) {
            const charId =
                char.category_characteristic_id ||
                char.id ||
                (char.name ? defIdByName.get(char.name) : undefined);
            if (charId && char.value) {
                this.categoryCharacteristicsValues.set(charId, char.value);
            }
        }
    }

    // Локальный драфт хранит характеристики уже с category_characteristic_id.
    private static applyDraftCategoryCharacteristics(chars: any[]): void {
        for (const char of chars) {
            if (char.category_characteristic_id && char.value) {
                this.categoryCharacteristicsValues.set(char.category_characteristic_id, char.value);
            }
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
                    const photosGrid = document.getElementById('photosGrid');
                    if (photosGrid?.classList.contains('error')) {
                        photosGrid.classList.remove('error');
                        photosGrid
                            .closest('.photos-section')
                            ?.querySelector('.field-error')
                            ?.remove();
                    }
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
                <button type="button" class="remove-attr-btn" data-index="${index}" aria-label="Удалить характеристику">${ICONS.close}</button>
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

    private static clearFieldErrors(): void {
        document.querySelectorAll('.place-ad-page .field-error').forEach((el) => el.remove());
        document
            .querySelectorAll('.place-ad-page .error')
            .forEach((el) => el.classList.remove('error'));
    }

    private static showFieldError(fieldId: string, message: string): void {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.add('error');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;

        const section = field.closest('.form-section') || field.closest('.photos-section');
        if (section) {
            section.appendChild(errorDiv);
        } else {
            field.parentElement?.appendChild(errorDiv);
        }
    }

    private static validateAndShowErrors(): boolean {
        this.clearFieldErrors();

        const titleInput = document.getElementById('title') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const priceInput = document.getElementById('price') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;

        const locationInput = document.getElementById('location') as HTMLInputElement;

        const result = AdValidator.validateForm({
            title: titleInput?.value || '',
            categoryId: parseInt(categorySelect?.value || '0'),
            price: parseInt(priceInput?.value || '0'),
            description: descriptionTextarea?.value || '',
            location: locationInput?.value || '',
            photosCount: this.photoFiles.length + this.existingPhotos.length,
        });

        if (!result.isValid) {
            Object.entries(result.fieldErrors).forEach(([field, error]) => {
                if (error) this.showFieldError(field, error);
            });

            const firstErrorField = Object.keys(result.fieldErrors)[0];
            if (firstErrorField) {
                document
                    .getElementById(firstErrorField)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return result.isValid;
    }

    private static async handleSubmit(mode: 'publish' | 'draft'): Promise<void> {
        if (mode !== 'draft' && !this.validateAndShowErrors()) return;

        window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));
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
                if (!this.editingAdId) await AdDraftService.clear();
                this.clearAllData();
                NotificationComponent.show({ type: 'success', message: 'Успешно сохранено!' });
                window.location.href = adId ? `/ad/${adId}` : '/profile';
            } else {
                NotificationComponent.show({
                    type: 'error',
                    message: result.error || 'Ошибка сохранения',
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            if (!networkStatus.isOnline) {
                await this.saveForOfflinePublish(this.collectFormData());
            } else {
                NotificationComponent.show({
                    type: 'error',
                    message: 'Произошла ошибка при публикации',
                });
            }
        } finally {
            window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: false } }));
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
            window.location.href = '/';
        } catch (error) {
            NotificationComponent.show({ type: 'error', message: 'Не удалось сохранить оффлайн' });
        }
    }

    private static showCancelModal(): void {
        const modal = document.getElementById('cancelAdModal');
        if (modal) modal.style.display = 'flex';
    }

    private static hideCancelModal(): void {
        const modal = document.getElementById('cancelAdModal');
        if (modal) modal.style.display = 'none';
    }

    /**
     * Подтверждение в модалке. Сейчас модалка обслуживает только сценарий
     * «Очистить черновик» — выходим тут же на очистку формы.
     */
    private static async handleCancelConfirm(): Promise<void> {
        this.hideCancelModal();
        await this.handleClearDraft();
    }

    private static async handleSaveDraft(): Promise<void> {
        try {
            const formData = this.collectFormData();
            await AdDraftService.save(formData, this.photoFiles);
            NotificationComponent.show({ type: 'success', message: 'Черновик сохранён' });
        } catch (error) {
            console.error('Draft save error:', error);
            NotificationComponent.show({ type: 'error', message: 'Не удалось сохранить черновик' });
        }
    }

    private static async handleClearDraft(): Promise<void> {
        await AdDraftService.clear();
        this.clearAllData();

        const titleInput = document.getElementById('title') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const priceInput = document.getElementById('price') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;

        if (titleInput) titleInput.value = '';
        if (categorySelect) categorySelect.value = '';
        if (priceInput) priceInput.value = '0';
        if (descriptionTextarea) descriptionTextarea.value = '';
        if (locationInput) locationInput.value = '';

        this.renderCategoryCharacteristicsForm();
        this.renderDynamicAttributes();
        this.renderPhotosGrid();
        this.clearFieldErrors();

        NotificationComponent.show({ type: 'success', message: 'Черновик очищен' });
    }

    private static async handlePreview(): Promise<void> {
        if (!this.validateAndShowErrors()) {
            return;
        }
        window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));
        try {
            const formData = this.collectFormData();
            await AdDraftService.save(formData, this.photoFiles);

            window.location.href = '/ad-preview';
        } catch (error) {
            console.error('Preview error:', error);
            uiActions.showError('Не удалось создать предпросмотр');
        } finally {
            window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: false } }));
        }
    }

    private static attachEventListeners(): void {
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        categorySelect?.addEventListener('change', async () => {
            if (categorySelect.classList.contains('error')) {
                categorySelect.classList.remove('error');
                categorySelect.closest('.form-section')?.querySelector('.field-error')?.remove();
            }
            await this.loadCategoryCharacteristics(parseInt(categorySelect.value));
            this.autoSaveDraft();
        });

        ['title', 'price', 'description', 'location'].forEach((id) => {
            document.getElementById(id)?.addEventListener('input', (e) => {
                const el = e.target as HTMLElement;
                if (el.classList.contains('error')) {
                    el.classList.remove('error');
                    el.closest('.form-section')?.querySelector('.field-error')?.remove();
                }
                this.autoSaveDraft();
            });
        });

        document
            .getElementById('saveDraftBtn')
            ?.addEventListener('click', () => this.handleSaveDraft());
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
        document
            .getElementById('clearDraftBtn')
            ?.addEventListener('click', () => this.showCancelModal());

        const cancelModal = document.getElementById('cancelAdModal');
        cancelModal?.addEventListener('click', (e) => {
            if (e.target === cancelModal) this.hideCancelModal();
        });
        document
            .getElementById('cancelAdModalClose')
            ?.addEventListener('click', () => this.hideCancelModal());
        document
            .getElementById('cancelAdModalConfirm')
            ?.addEventListener('click', () => this.handleCancelConfirm());

        document.querySelectorAll('[data-action="back"]').forEach((btn) =>
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.editingAdId) {
                    window.location.href = `/ad/${this.editingAdId}`;
                } else {
                    window.location.href = '/';
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
