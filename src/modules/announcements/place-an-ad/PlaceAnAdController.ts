/**
 * Контроллер страницы создания объявления
 * Полностью переработан для поддержки характеристик согласно бэкенду
 */

import Handlebars from 'handlebars';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { AppController } from '@/controllers/AppController';
import { AdDraftService } from '@/services/adDraftService';
import { categoryService } from '@/services/categoryService';
import type { 
    Category, 
    CategoryCharacteristic, 
    CharacteristicInput, 
    CustomCharacteristicInput,
    CreateAdData,
    ValidationErrors,
    ApiError
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

    static async render(): Promise<void> {
        
        const app = document.getElementById('app');
        if (!app) return;
        
        document.body.classList.remove('auth-page');
        
        AppController.showLoading(true);
        
        try {
            if (!store.isAuthenticated) {
                AppController.navigateTo('/login');
                uiActions.showError('Пожалуйста, войдите в систему');
                return;
            }
            
            // Загружаем категории с бэкенда
            const categories = await categoryService.getAllCategories();
            
            const response = await fetch('/src/modules/announcements/place-an-ad/templates/place-an-ad.hbs');
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            const templateSource = await response.text();
            const template = Handlebars.compile(templateSource);
            
            const templateData = {
                isAuthenticated: store.isAuthenticated,
                user: store.user,
                categories: categories,
            };
            
            app.innerHTML = template(templateData);
            
            // Инициализация обработчиков
            this.attachEventListeners();
            
            // Восстанавливаем черновик после того, как DOM готов
            await this.restoreDraft();
            
        } catch (error) {
            console.error('Error loading place-an-ad page:', error);
            await this.showNotFound();
        } finally {
            AppController.showLoading(false);
        }
    }
    
    private static async restoreDraft(): Promise<void> {
        const draft = AdDraftService.get();
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
                        this.categoryCharacteristicsValues.set(char.category_characteristic_id, char.value);
                    }
                }
                this.renderCategoryCharacteristicsForm();
            }
        }
        
        // Восстанавливаем пользовательские характеристики
        if (draft.formData.custom_characteristics && draft.formData.custom_characteristics.length > 0) {
            this.dynamicAttributes = draft.formData.custom_characteristics.map((c: any) => ({
                name: c.name,
                value: c.value
            }));
            this.renderDynamicAttributes();
        }
        
        // Восстанавливаем фото
        if (draft.photoFiles.length > 0) {
            this.photoFiles = draft.photoFiles;
            for (const file of draft.photoFiles) {
                const preview = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(file);
                });
                this.photoPreviews.push(preview);
            }
            this.renderPhotosGrid();
            uiActions.showSuccess(`Восстановлен черновик: ${draft.formData.title}`);
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
            this.categoryCharacteristicsDefs = await categoryService.getCategoryCharacteristics(categoryId);
            // Очищаем старые значения
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
            container.innerHTML = '<div class="no-characteristics">Для этой категории нет дополнительных характеристик</div>';
            return;
        }
        
        const html = this.categoryCharacteristicsDefs.map(def => {
            const currentValue = this.categoryCharacteristicsValues.get(def.id) || '';
            
            if (def.allowed_values !== null && def.allowed_values.length > 0) {
                // Рендерим select для enum
                const options = [
                    '<option value="">Не выбрано</option>',
                    ...def.allowed_values.map(val => 
                        `<option value="${this.escapeHtml(val)}" ${currentValue === val ? 'selected' : ''}>${this.escapeHtml(val)}</option>`
                    )
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
                // Рендерим input для свободного ввода
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
        }).join('');
        
        container.innerHTML = html;
        
        // Добавляем обработчики для сохранения значений
        container.querySelectorAll('.category-characteristic').forEach(el => {
            const charId = parseInt((el as HTMLElement).dataset.charId!);
            const saveHandler = () => {
                const value = (el as HTMLInputElement | HTMLSelectElement).value.trim();
                if (value) {
                    this.categoryCharacteristicsValues.set(charId, value);
                } else {
                    this.categoryCharacteristicsValues.delete(charId);
                }
            };
            el.addEventListener('change', saveHandler);
            el.addEventListener('input', saveHandler);
        });
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
            };
            categorySelect.addEventListener('change', handler);
            this._handlers.set('categoryChange', handler);
        }
        
        // Обработчик отправки формы
        const form = document.getElementById('placeAdForm');
        if (form) {
            const handler = (e: Event) => {
                e.preventDefault();
                this.handleSubmit('publish');
            };
            form.addEventListener('submit', handler);
            this._handlers.set('submit', handler);
        }
        
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
        
        // Кнопка "Назад"
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
        
        // Удаление пользовательской характеристики (делегирование)
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
                uiActions.showError(`Файл "${file.name}" не поддерживается. Используйте JPEG, PNG или WEBP`);
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
        existingCards.forEach(card => card.remove());
        
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
    
    private static updateDynamicAttribute(index: number, field: 'name' | 'value', value: string): void {
        if (this.dynamicAttributes[index]) {
            this.dynamicAttributes[index][field] = value;
        }
    }
    
    private static renderDynamicAttributes(): void {
        const container = document.getElementById('dynamicAttributesContainer');
        if (!container) return;
        
        if (this.dynamicAttributes.length === 0) {
            container.innerHTML = '<div class="no-characteristics">Добавьте свои характеристики</div>';
            return;
        }
        
        container.innerHTML = this.dynamicAttributes.map((attr, index) => `
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
        `).join('');
        
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
                    value: value.trim()
                });
            }
        }
        
        // Собираем пользовательские характеристики
        const customCharacteristics: CustomCharacteristicInput[] = [];
        for (const attr of this.dynamicAttributes) {
            if (attr.name.trim() && attr.value.trim()) {
                customCharacteristics.push({
                    name: attr.name.trim(),
                    value: attr.value.trim()
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
            category_characteristics: categoryCharacteristics.length > 0 ? categoryCharacteristics : undefined,
            custom_characteristics: customCharacteristics.length > 0 ? customCharacteristics : undefined,
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
            
            const multipartFormData = new FormData();
            multipartFormData.append('data', JSON.stringify(formData));
            
            this.photoFiles.forEach((file) => {
                multipartFormData.append('photos', file);
            });
            
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/ads', {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: multipartFormData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                const adId = result.ad_id || result.data?.id;
                
                if (mode === 'publish') {
                    uiActions.showSuccess('Объявление успешно опубликовано!');
                    if (adId) {
                        AppController.navigateTo(`/ad/${adId}`);
                    } else {
                        AppController.navigateTo('/');
                    }
                } else {
                    uiActions.showSuccess('Объявление сохранено в черновики');
                    AppController.navigateTo('/profile');
                }
            } else {
                this.showFormErrors(result);
                const errorMessage = result.error || result.message || 'Ошибка при сохранении объявления';
                uiActions.showError(errorMessage);
            }
        } catch (error) {
            console.error('Error submitting ad:', error);
            uiActions.showError('Не удалось соединиться с сервером');
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
            
            // Сохраняем черновик для предпросмотра
            AdDraftService.save({
                title: formData.title,
                category_id: formData.category_id,
                price: formData.price,
                description: formData.description,
                location: formData.location,
                category_characteristics: formData.category_characteristics || [],
                custom_characteristics: formData.custom_characteristics || [],
            }, this.photoFiles);
            
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
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
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
            uiActions.showError(`Ошибка в пользовательских характеристиках: ${result.custom_characteristics}`);
        }
    }
    
    static cleanup(): void {
        // Удаляем все обработчики
        this._handlers.forEach((handler, key) => {
            let element: Element | null = null;
            
            if (key === 'submit') {
                element = document.getElementById('placeAdForm');
                if (element) element.removeEventListener('submit', handler);
            } else if (key === 'categoryChange') {
                element = document.getElementById('category');
                if (element) element.removeEventListener('change', handler);
            } else if (key === 'addAttribute') {
                element = document.getElementById('addAttributeBtn');
                if (element) element.removeEventListener('click', handler);
            } else if (key === 'addPhotoBtn') {
                element = document.getElementById('addPhotoBtn');
                if (element) element.removeEventListener('click', handler);
            } else if (key === 'photosInput') {
                element = document.getElementById('photosInput');
                if (element) element.removeEventListener('change', handler);
            } else if (key === 'removeAttribute') {
                element = document.getElementById('dynamicAttributesContainer');
                if (element) element.removeEventListener('click', handler);
            } else if (key === 'saveDraft') {
                element = document.getElementById('saveDraftBtn');
                if (element) element.removeEventListener('click', handler);
            } else if (key === 'preview') {
                element = document.getElementById('previewBtn');
                if (element) element.removeEventListener('click', handler);
            } else if (key.startsWith('back-')) {
                const btns = document.querySelectorAll('[data-action="back"]');
                element = btns[parseInt(key.split('-')[1])] || null;
                if (element) element.removeEventListener('click', handler);
            } else if (key.startsWith('removePhoto-')) {
                const btns = document.querySelectorAll('.photo-remove-btn');
                element = btns[parseInt(key.split('-')[1])] || null;
                if (element) element.removeEventListener('click', handler);
            }
        });
        
        this._handlers.clear();
        
        // Очищаем данные
        this.photoPreviews.forEach(preview => {
            if (preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        });
        
        this.photoFiles = [];
        this.photoPreviews = [];
        this.dynamicAttributes = [];
        this.categoryCharacteristicsDefs = [];
        this.categoryCharacteristicsValues.clear();
    }
}
