// /**
//  * Контроллер страницы создания объявления
//  */

// import Handlebars from 'handlebars';
// import { store } from '@/core/store';
// import { uiActions } from '@/actions/uiActions';
// import { AppController } from '@/controllers/AppController';

// export class PlaceAnAdController {
//     private static _handlers: Map<string, EventListener> = new Map();
//     private static photoFiles: File[] = [];
//     private static photoPreviews: string[] = [];

//     static async render(): Promise<void> {
//         console.log('=== PlaceAnAdController.render ===');
        
//         const app = document.getElementById('app');
//         if (!app) return;
        
//         document.body.classList.remove('auth-page');
        
//         AppController.showLoading(true);
        
//         try {
//             // Проверяем авторизацию
//             if (!store.isAuthenticated) {
//                 AppController.navigateTo('/login');
//                 uiActions.showError('Пожалуйста, войдите в систему');
//                 return;
//             }
            
//             const response = await fetch('/src/js/announcements/place-an-ad/templates/place-an-ad.hbs');
//             if (!response.ok) {
//                 throw new Error(`Failed to load template: ${response.status}`);
//             }
//             const templateSource = await response.text();
//             const template = Handlebars.compile(templateSource);
            
//             const templateData = {
//                 isAuthenticated: store.isAuthenticated,
//                 user: store.user,
//                 categories: await this.loadCategories(),
//             };
            
//             app.innerHTML = template(templateData);
//             this.attachEventListeners();
            
//         } catch (error) {
//             console.error('Error loading place-an-ad page:', error);
//             await this.showNotFound(); // Показываем 404 как в AdDetailController
//         } finally {
//             AppController.showLoading(false);
//         }
//     }
    
//     // Метод для показа 404 - точно как в AdDetailController
//     private static async showNotFound(): Promise<void> {
//         const app = document.getElementById('app');
//         if (!app) return;
        
//         try {
//             const response = await fetch('/templates/not-found.hbs');
//             const templateSource = await response.text();
//             const template = Handlebars.compile(templateSource);
//             app.innerHTML = template({});
//         } catch (error) {
//             app.innerHTML = '<h1>404 - Страница не найдена</h1>';
//         }
//     }
    
//     private static async loadCategories(): Promise<Array<{id: number, name: string}>> {
//         // try {
//         //     const response = await fetch('/api/v1/categories');
//         //     const result = await response.json();
//         //     if (result.success && result.data) {
//         //         return result.data;
//         //     }
//         //     return [];
//         // } catch (error) {
//         //     console.error('Error loading categories:', error);
//         //     return [];
//         // }
//         return [
//             { id: 1, name: 'Электроника' },
//             { id: 2, name: 'Одежда' },
//             { id: 3, name: 'Авто' },
//             { id: 4, name: 'Недвижимость' },
//             { id: 5, name: 'Дом и сад' },
//         ];
//     }
    
//     private static attachEventListeners(): void {
//         const form = document.getElementById('placeAdForm');
//         if (form) {
//             const handler = (e: Event) => {
//                 e.preventDefault();
//                 this.handleSubmit();
//             };
//             form.addEventListener('submit', handler);
//             this._handlers.set('submit', handler);
//         }
        
//         const backBtns = document.querySelectorAll('[data-action="back"]');
//         for (let i = 0; i < backBtns.length; i++) {
//             const btn = backBtns[i];
//             const handler = (e: Event) => {
//                 e.preventDefault();
//                 AppController.navigateTo('/');
//             };
//             btn.addEventListener('click', handler);
//             this._handlers.set(`back-${i}`, handler);
//         }
        
//         const photoInput = document.getElementById('photos') as HTMLInputElement;
//         if (photoInput) {
//             const handler = () => {
//                 this.handlePhotoPreview(photoInput);
//             };
//             photoInput.addEventListener('change', handler);
//             this._handlers.set('photos', handler);
//         }
        
//         const photoContainer = document.getElementById('photoPreviewContainer');
//         if (photoContainer) {
//             const handler = (e: Event) => {
//                 const target = e.target as HTMLElement;
//                 if (target.classList.contains('remove-photo')) {
//                     const index = target.dataset.index;
//                     if (index !== undefined) {
//                         this.removePhoto(parseInt(index));
//                     }
//                 }
//             };
//             photoContainer.addEventListener('click', handler);
//             this._handlers.set('remove-photo', handler);
//         }
//     }
    
//     private static handlePhotoPreview(input: HTMLInputElement): void {
//         const files = input.files;
//         if (!files) return;
        
//         const maxPhotos = 10;
//         const currentCount = this.photoFiles.length;
//         const availableSlots = maxPhotos - currentCount;
        
//         if (files.length > availableSlots) {
//             uiActions.showError(`Можно загрузить не более ${maxPhotos} фото`);
//             return;
//         }
        
//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];
//             if (file.type.startsWith('image/')) {
//                 this.photoFiles.push(file);
                
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     const previewUrl = e.target?.result as string;
//                     this.photoPreviews.push(previewUrl);
//                     this.renderPhotoPreviews();
//                 };
//                 reader.readAsDataURL(file);
//             }
//         }
        
//         input.value = '';
//     }
    
//     private static renderPhotoPreviews(): void {
//         const container = document.getElementById('photoPreviewContainer');
//         if (!container) return;
        
//         container.innerHTML = this.photoPreviews.map((preview, index) => `
//             <div class="photo-preview">
//                 <img src="${preview}" alt="Фото ${index + 1}">
//                 <button type="button" class="remove-photo" data-index="${index}">×</button>
//             </div>
//         `).join('');
//     }
    
//     private static removePhoto(index: number): void {
//         this.photoFiles.splice(index, 1);
//         this.photoPreviews.splice(index, 1);
//         this.renderPhotoPreviews();
//     }
    
//     // private static async handleSubmit(): Promise<void> {
//     //     AppController.showLoading(true);
        
//     //     try {
//     //         const titleInput = document.getElementById('title') as HTMLInputElement;
//     //         const categorySelect = document.getElementById('category') as HTMLSelectElement;
//     //         const priceInput = document.getElementById('price') as HTMLInputElement;
//     //         const locationInput = document.getElementById('location') as HTMLInputElement;
//     //         const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
            
//     //         // Валидация
//     //         if (!titleInput?.value.trim()) {
//     //             uiActions.showError('Введите название объявления');
//     //             return;
//     //         }
            
//     //         if (!categorySelect?.value) {
//     //             uiActions.showError('Выберите категорию');
//     //             return;
//     //         }
            
//     //         const formData = new FormData();
//     //         formData.append('title', titleInput.value.trim());
//     //         formData.append('category_id', categorySelect.value);
//     //         formData.append('price', priceInput?.value || '0');
//     //         formData.append('location', locationInput?.value || '');
//     //         formData.append('description', descriptionTextarea?.value || '');
            
//     //         this.photoFiles.forEach((file) => {
//     //             formData.append('photos', file);
//     //         });
            
//     //         const token = localStorage.getItem('token');
//     //         const response = await fetch('/api/v1/ads', {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Authorization': token ? `Bearer ${token}` : '',
//     //             },
//     //             body: formData,
//     //         });
            
//     //         const result = await response.json();
            
//     //         if (response.ok && result.success) {
//     //             uiActions.showSuccess('Объявление успешно создано!');
//     //             AppController.navigateTo(`/ad/${result.data.id}`);
//     //         } else {
//     //             this.showFormErrors(result);
//     //             uiActions.showError(result.error || 'Ошибка при создании объявления');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error submitting ad:', error);
//     //         uiActions.showError('Не удалось соединиться с сервером');
//     //     } finally {
//     //         AppController.showLoading(false);
//     //     }
//     // }
//     private static async handleSubmit(): Promise<void> {
//         AppController.showLoading(true);
        
//         try {
//             // Валидация формы
//             if (!this.validateForm()) {
//                 AppController.showLoading(false);
//                 return;
//             }
            
//             const titleInput = document.getElementById('title') as HTMLInputElement;
//             const categorySelect = document.getElementById('category') as HTMLSelectElement;
//             const priceInput = document.getElementById('price') as HTMLInputElement;
//             const locationInput = document.getElementById('location') as HTMLInputElement;
//             const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
            
//             const formData = new FormData();
            
//             // Формируем data как JSON строку
//             const adData = {
//                 title: titleInput.value.trim(),
//                 category_id: parseInt(categorySelect.value),
//                 price: parseInt(priceInput?.value || '0'),
//                 location: locationInput?.value.trim() || '',
//                 description: descriptionTextarea?.value.trim() || '',
//                 status: 'active'
//             };
            
//             formData.append('data', JSON.stringify(adData));
            
//             // Добавляем фотографии
//             this.photoFiles.forEach((file) => {
//                 formData.append('photos', file);
//             });
            
//             const token = localStorage.getItem('token');
//             const response = await fetch('/api/v1/ads', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': token ? `Bearer ${token}` : '',
//                 },
//                 body: formData,
//             });
            
//             const result = await response.json();
            
//             if (response.ok && result.success) {
//                 uiActions.showSuccess('Объявление успешно создано!');
//                 if (result.data && result.data.id) {
//                     AppController.navigateTo(`/ad/${result.data.id}`);
//                 } else {
//                     AppController.navigateTo('/');
//                 }
//             } else {
//                 this.showFormErrors(result);
//                 uiActions.showError(result.error || 'Ошибка при создании объявления');
//             }
//         } catch (error) {
//             console.error('Error submitting ad:', error);
//             uiActions.showError('Не удалось соединиться с сервером');
//         } finally {
//             AppController.showLoading(false);
//         }
//     }
    
//     private static showFormErrors(result: any): void {
//         document.querySelectorAll('.field-error').forEach(el => el.remove());
//         document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
//         if (result.fieldErrors) {
//             Object.entries(result.fieldErrors).forEach(([field, error]) => {
//                 const input = document.getElementById(field);
//                 if (input && error) {
//                     input.classList.add('error');
//                     const errorDiv = document.createElement('div');
//                     errorDiv.className = 'field-error';
//                     errorDiv.textContent = error as string;
//                     input.parentNode?.appendChild(errorDiv);
//                 }
//             });
//         }
//     }
    
//     static cleanup(): void {
//         this._handlers.forEach((handler, key) => {
//             let element: Element | null = null;
//             if (key === 'submit') {
//                 element = document.getElementById('placeAdForm');
//             } else if (key === 'back') {
//                 element = document.querySelector('[data-action="back"]');
//             } else if (key === 'photos') {
//                 element = document.getElementById('photos');
//             } else if (key === 'remove-photo') {
//                 element = document.getElementById('photoPreviewContainer');
//             }
            
//             if (element) {
//                 if (key === 'submit') {
//                     element.removeEventListener('submit', handler);
//                 } else {
//                     element.removeEventListener('click', handler);
//                     if (key === 'photos') {
//                         element.removeEventListener('change', handler);
//                     }
//                 }
//             }
//         });
        
//         this._handlers.clear();
//         this.photoFiles = [];
//         this.photoPreviews = [];
//     }

//     // В методе handleSubmit добавим проверки:
//     // private static validateForm(): boolean {
//     //     const title = (document.getElementById('title') as HTMLInputElement)?.value.trim();
//     //     const description = (document.getElementById('description') as HTMLTextAreaElement)?.value.trim();
//     //     const price = parseInt((document.getElementById('price') as HTMLInputElement)?.value || '0');
        
//     //     // title: 5-150 символов
//     //     if (title.length < 5) {
//     //         uiActions.showError('Название должно быть не менее 5 символов');
//     //         return false;
//     //     }
//     //     if (title.length > 150) {
//     //         uiActions.showError('Название не должно превышать 150 символов');
//     //         return false;
//     //     }
        
//     //     // description: 10-5000 символов (если указано)
//     //     if (description && description.length > 0) {
//     //         if (description.length < 10) {
//     //             uiActions.showError('Описание должно быть не менее 10 символов');
//     //             return false;
//     //         }
//     //         if (description.length > 5000) {
//     //             uiActions.showError('Описание не должно превышать 5000 символов');
//     //             return false;
//     //         }
//     //     }
        
//     //     // price: ≥ 0
//     //     if (price < 0) {
//     //         uiActions.showError('Цена не может быть отрицательной');
//     //         return false;
//     //     }
        
//     //     return true;
//     // }
//     private static validateForm(): boolean {
//         const title = (document.getElementById('title') as HTMLInputElement)?.value.trim();
//         const description = (document.getElementById('description') as HTMLTextAreaElement)?.value.trim();
//         const price = parseInt((document.getElementById('price') as HTMLInputElement)?.value || '0');
//         const category = (document.getElementById('category') as HTMLSelectElement)?.value;
        
//         // Категория обязательна
//         if (!category) {
//             uiActions.showError('Выберите категорию');
//             return false;
//         }
        
//         // title: 5-150 символов
//         if (!title) {
//             uiActions.showError('Введите название объявления');
//             return false;
//         }
//         if (title.length < 5) {
//             uiActions.showError('Название должно быть не менее 5 символов');
//             return false;
//         }
//         if (title.length > 150) {
//             uiActions.showError('Название не должно превышать 150 символов');
//             return false;
//         }
        
//         // description: 10-5000 символов (если указано)
//         if (description && description.length > 0) {
//             if (description.length < 10) {
//                 uiActions.showError('Описание должно быть не менее 10 символов');
//                 return false;
//             }
//             if (description.length > 5000) {
//                 uiActions.showError('Описание не должно превышать 5000 символов');
//                 return false;
//             }
//         }
        
//         // price: ≥ 0
//         if (isNaN(price) || price < 0) {
//             uiActions.showError('Цена не может быть отрицательной');
//             return false;
//         }
        
//         return true;
//     }
// }


/* ----------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------- */


// /**
//  * Контроллер страницы создания объявления
//  */

// import Handlebars from 'handlebars';
// import { store } from '@/core/store';
// import { uiActions } from '@/actions/uiActions';
// import { AppController } from '@/controllers/AppController';

// interface DynamicAttribute {
//     name: string;
//     value: string;
// }

// export class PlaceAnAdController {
//     private static _handlers: Map<string, EventListener> = new Map();
//     private static photoFiles: File[] = [];
//     private static photoPreviews: string[] = [];
//     private static dynamicAttributes: DynamicAttribute[] = [];

//     static async render(): Promise<void> {
//         console.log('=== PlaceAnAdController.render ===');
        
//         const app = document.getElementById('app');
//         if (!app) return;
        
//         document.body.classList.remove('auth-page');
        
//         AppController.showLoading(true);
        
//         try {
//             // Проверяем авторизацию
//             if (!store.isAuthenticated) {
//                 AppController.navigateTo('/login');
//                 uiActions.showError('Пожалуйста, войдите в систему');
//                 return;
//             }
            
//             const response = await fetch('/src/js/announcements/place-an-ad/templates/place-an-ad.hbs');
//             if (!response.ok) {
//                 throw new Error(`Failed to load template: ${response.status}`);
//             }
//             const templateSource = await response.text();
//             const template = Handlebars.compile(templateSource);
            
//             const templateData = {
//                 isAuthenticated: store.isAuthenticated,
//                 user: store.user,
//                 categories: await this.loadCategories(),
//                 state: await this.loadState(),
//             };
            
//             app.innerHTML = template(templateData);
//             this.attachEventListeners();
            
//         } catch (error) {
//             console.error('Error loading place-an-ad page:', error);
//             await this.showNotFound();
//         } finally {
//             AppController.showLoading(false);
//         }
//     }
    
//     private static async showNotFound(): Promise<void> {
//         const app = document.getElementById('app');
//         if (!app) return;
        
//         try {
//             const response = await fetch('/templates/not-found.hbs');
//             const templateSource = await response.text();
//             const template = Handlebars.compile(templateSource);
//             app.innerHTML = template({});
//         } catch (error) {
//             app.innerHTML = '<h1>404 - Страница не найдена</h1>';
//         }
//     }
    
//     private static async loadCategories(): Promise<Array<{id: number, name: string}>> {
//         // TODO: заменить на реальный API
//         return [
//             { id: 1, name: 'Обувь' },
//             { id: 2, name: 'Одежда' },
//             { id: 3, name: 'Электроника' },
//             { id: 4, name: 'Авто' },
//             { id: 5, name: 'Запчасти' },
//             { id: 6, name: 'Недвижимость' },
//             { id: 7, name: 'Дом и сад' },
//             { id: 8, name: 'Спорт и отдых' },
//         ];
//     }

//     private static async loadState(): Promise<Array<{id: number, name: string}>> {
//         // TODO: заменить на реальный API
//         return [
//             { id: 1, name: 'Новое' },
//             { id: 2, name: 'Б/у' },
//             { id: 3, name: 'Отличное' },
//             { id: 4, name: 'Хорошее' },
//             { id: 5, name: 'Плохое' },
//         ];
//     }
    
//     private static attachEventListeners(): void {
//         const form = document.getElementById('placeAdForm');
//         if (form) {
//             const handler = (e: Event) => {
//                 e.preventDefault();
//                 this.handleSubmit();
//             };
//             form.addEventListener('submit', handler);
//             this._handlers.set('submit', handler);
//         }
        
//         // Кнопка "Назад"
//         const backBtns = document.querySelectorAll('[data-action="back"]');
//         for (let i = 0; i < backBtns.length; i++) {
//             const btn = backBtns[i];
//             const handler = (e: Event) => {
//                 e.preventDefault();
//                 AppController.navigateTo('/');
//             };
//             btn.addEventListener('click', handler);
//             this._handlers.set(`back-${i}`, handler);
//         }
        
//         // Загрузка фото
//         const photoUploadArea = document.getElementById('photoUploadArea');
//         const photoInput = document.getElementById('photos') as HTMLInputElement;
        
//         if (photoUploadArea && photoInput) {
//             // Клик по области открывает диалог выбора файлов
//             const clickHandler = () => {
//                 photoInput.click();
//             };
//             photoUploadArea.addEventListener('click', clickHandler);
//             this._handlers.set('photoUploadArea', clickHandler);
            
//             // Обработчик выбора файлов (уже есть, но проверим)
//             const changeHandler = () => {
//                 this.handlePhotoPreview(photoInput);
//             };
//             photoInput.addEventListener('change', changeHandler);
//             this._handlers.set('photos', changeHandler);
//         }
        
//         // Удаление фото (делегирование)
//         const photoContainer = document.getElementById('photoPreviewContainer');
//         if (photoContainer) {
//             const handler = (e: Event) => {
//                 const target = e.target as HTMLElement;
//                 if (target.classList.contains('remove-photo')) {
//                     const index = target.dataset.index;
//                     if (index !== undefined) {
//                         this.removePhoto(parseInt(index));
//                     }
//                 }
//             };
//             photoContainer.addEventListener('click', handler);
//             this._handlers.set('remove-photo', handler);
//         }
        
//         // Кнопка добавления характеристики
//         const addAttrBtn = document.getElementById('addAttributeBtn');
//         if (addAttrBtn) {
//             const handler = () => {
//                 this.addDynamicAttribute();
//             };
//             addAttrBtn.addEventListener('click', handler);
//             this._handlers.set('addAttribute', handler);
//         }
        
//         // Удаление характеристики (делегирование)
//         const dynamicContainer = document.getElementById('dynamicAttributesContainer');
//         if (dynamicContainer) {
//             const handler = (e: Event) => {
//                 const target = e.target as HTMLElement;
//                 if (target.classList.contains('remove-attr-btn')) {
//                     const index = target.dataset.index;
//                     if (index !== undefined) {
//                         this.removeDynamicAttribute(parseInt(index));
//                     }
//                 }
//             };
//             dynamicContainer.addEventListener('click', handler);
//             this._handlers.set('removeAttribute', handler);
//         }
//     }
    
//     /**
//      * Добавление новой динамической характеристики
//      */
//     private static addDynamicAttribute(): void {
//         this.dynamicAttributes.push({ name: '', value: '' });
//         this.renderDynamicAttributes();
//     }
    
//     /**
//      * Удаление динамической характеристики
//      */
//     private static removeDynamicAttribute(index: number): void {
//         this.dynamicAttributes.splice(index, 1);
//         this.renderDynamicAttributes();
//     }
    
//     /**
//      * Обновление значения характеристики при вводе
//      */
//     private static updateDynamicAttribute(index: number, field: 'name' | 'value', value: string): void {
//         if (this.dynamicAttributes[index]) {
//             this.dynamicAttributes[index][field] = value;
//         }
//     }
    
//     /**
//      * Рендер динамических характеристик
//      */
//     private static renderDynamicAttributes(): void {
//         const container = document.getElementById('dynamicAttributesContainer');
//         if (!container) return;
        
//         container.innerHTML = this.dynamicAttributes.map((attr, index) => `
//             <div class="dynamic-attribute" data-attr-index="${index}">
//                 <input 
//                     type="text" 
//                     class="form-input attr-name" 
//                     placeholder="Название (например, Цвет)"
//                     value="${this.escapeHtml(attr.name)}"
//                     data-attr-name="${index}"
//                 >
//                 <input 
//                     type="text" 
//                     class="form-input attr-value" 
//                     placeholder="Значение (например, Черный)"
//                     value="${this.escapeHtml(attr.value)}"
//                     data-attr-value="${index}"
//                 >
//                 <button type="button" class="remove-attr-btn" data-index="${index}">×</button>
//             </div>
//         `).join('');
        
//         // Привязываем обработчики ввода к новым полям
//         document.querySelectorAll('[data-attr-name]').forEach((input) => {
//             const el = input as HTMLInputElement;
//             const index = parseInt(el.dataset.attrName!);
//             el.addEventListener('input', (e) => {
//                 this.updateDynamicAttribute(index, 'name', (e.target as HTMLInputElement).value);
//             });
//         });
        
//         document.querySelectorAll('[data-attr-value]').forEach((input) => {
//             const el = input as HTMLInputElement;
//             const index = parseInt(el.dataset.attrValue!);
//             el.addEventListener('input', (e) => {
//                 this.updateDynamicAttribute(index, 'value', (e.target as HTMLInputElement).value);
//             });
//         });
//     }
    
//     private static escapeHtml(str: string): string {
//         return str
//             .replace(/&/g, '&amp;')
//             .replace(/</g, '&lt;')
//             .replace(/>/g, '&gt;')
//             .replace(/"/g, '&quot;')
//             .replace(/'/g, '&#39;');
//     }
    
//     private static handlePhotoPreview(input: HTMLInputElement): void {
//         const files = input.files;
//         if (!files) return;
        
//         const maxPhotos = 10;
//         const currentCount = this.photoFiles.length;
//         const availableSlots = maxPhotos - currentCount;
        
//         if (files.length > availableSlots) {
//             uiActions.showError(`Можно загрузить не более ${maxPhotos} фото`);
//             return;
//         }
        
//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];
//             if (file.type.startsWith('image/')) {
//                 this.photoFiles.push(file);
                
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     const previewUrl = e.target?.result as string;
//                     this.photoPreviews.push(previewUrl);
//                     this.renderPhotoPreviews();
//                 };
//                 reader.readAsDataURL(file);
//             }
//         }
        
//         input.value = '';
//     }
    
//     private static renderPhotoPreviews(): void {
//         const container = document.getElementById('photoPreviewContainer');
//         if (!container) return;
        
//         container.innerHTML = this.photoPreviews.map((preview, index) => `
//             <div class="photo-preview">
//                 <img src="${preview}" alt="Фото ${index + 1}">
//                 <button type="button" class="remove-photo" data-index="${index}">×</button>
//             </div>
//         `).join('');
//     }
    
//     private static removePhoto(index: number): void {
//         this.photoFiles.splice(index, 1);
//         this.photoPreviews.splice(index, 1);
//         this.renderPhotoPreviews();
//     }
    
//     /**
//      * Сбор всех данных из формы
//      */
//     private static collectFormData(): any {
//         const titleInput = document.getElementById('title') as HTMLInputElement;
//         const categorySelect = document.getElementById('category') as HTMLSelectElement;
//         const adTypeRadios = document.querySelectorAll('input[name="adType"]');
//         const priceInput = document.getElementById('price') as HTMLInputElement;
//         const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
//         const conditionSelect = document.getElementById('condition') as HTMLSelectElement;
//         const brandInput = document.getElementById('brand') as HTMLInputElement;
//         const locationInput = document.getElementById('location') as HTMLInputElement;
        
//         // Получаем выбранный тип объявления
//         let adType = 'sell';
//         for (const radio of adTypeRadios) {
//             if ((radio as HTMLInputElement).checked) {
//                 adType = (radio as HTMLInputElement).value;
//                 break;
//             }
//         }
        
//         // Собираем динамические характеристики (только заполненные)
//         const attributes: Record<string, string> = {};
        
//         // Добавляем обязательные характеристики
//         if (conditionSelect?.value) {
//             attributes['Состояние'] = conditionSelect.options[conditionSelect.selectedIndex]?.text || conditionSelect.value;
//         }
//         if (brandInput?.value.trim()) {
//             attributes['Производитель'] = brandInput.value.trim();
//         }
        
//         // Добавляем динамические
//         this.dynamicAttributes.forEach(attr => {
//             if (attr.name.trim() && attr.value.trim()) {
//                 attributes[attr.name.trim()] = attr.value.trim();
//             }
//         });
        
//         return {
//             title: titleInput?.value.trim() || '',
//             category_id: parseInt(categorySelect?.value || '0'),
//             ad_type: adType,
//             price: parseInt(priceInput?.value || '0'),
//             description: descriptionTextarea?.value.trim() || '',
//             condition: conditionSelect?.value || '',
//             brand: brandInput?.value.trim() || '',
//             attributes: attributes,
//             location: locationInput?.value.trim() || '',
//         };
//     }
    
//     private static validateForm(data: any): boolean {
//         if (!data.title) {
//             uiActions.showError('Введите название объявления');
//             return false;
//         }
        
//         if (data.title.length < 5) {
//             uiActions.showError('Название должно быть не менее 5 символов');
//             return false;
//         }
        
//         if (data.title.length > 150) {
//             uiActions.showError('Название не должно превышать 150 символов');
//             return false;
//         }
        
//         if (!data.category_id || data.category_id === 0) {
//             uiActions.showError('Выберите категорию');
//             return false;
//         }
        
//         if (isNaN(data.price) || data.price < 0) {
//             uiActions.showError('Цена не может быть отрицательной');
//             return false;
//         }
        
//         if (data.description && data.description.length > 5000) {
//             uiActions.showError('Описание не должно превышать 5000 символов');
//             return false;
//         }
        
//         if (!data.condition) {
//             uiActions.showError('Выберите состояние товара');
//             return false;
//         }
        
//         if (!data.brand) {
//             uiActions.showError('Укажите производителя');
//             return false;
//         }
        
//         if (!data.location) {
//             uiActions.showError('Укажите местоположение');
//             return false;
//         }
        
//         return true;
//     }
    
//     private static async handleSubmit(): Promise<void> {
//         AppController.showLoading(true);
        
//         try {
//             const formData = this.collectFormData();
            
//             if (!this.validateForm(formData)) {
//                 AppController.showLoading(false);
//                 return;
//             }
            
//             // Формируем data для отправки
//             const adData = {
//                 title: formData.title,
//                 category_id: formData.category_id,
//                 ad_type: formData.ad_type,
//                 price: formData.price,
//                 description: formData.description,
//                 condition: formData.condition,
//                 brand: formData.brand,
//                 attributes: formData.attributes,
//                 location: formData.location,
//                 status: 'active'
//             };
            
//             const multipartFormData = new FormData();
//             multipartFormData.append('data', JSON.stringify(adData));
            
//             // Добавляем фотографии
//             this.photoFiles.forEach((file) => {
//                 multipartFormData.append('photos', file);
//             });
            
//             const token = localStorage.getItem('token');
//             const response = await fetch('/api/v1/ads', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': token ? `Bearer ${token}` : '',
//                 },
//                 body: multipartFormData,
//             });
            
//             const result = await response.json();
            
//             if (response.ok && result.success) {
//                 uiActions.showSuccess('Объявление успешно создано!');
//                 if (result.data && result.data.id) {
//                     AppController.navigateTo(`/ad/${result.data.id}`);
//                 } else {
//                     AppController.navigateTo('/');
//                 }
//             } else {
//                 this.showFormErrors(result);
//                 uiActions.showError(result.error || 'Ошибка при создании объявления');
//             }
//         } catch (error) {
//             console.error('Error submitting ad:', error);
//             uiActions.showError('Не удалось соединиться с сервером');
//         } finally {
//             AppController.showLoading(false);
//         }
//     }
    
//     private static showFormErrors(result: any): void {
//         document.querySelectorAll('.field-error').forEach(el => el.remove());
//         document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
//         if (result.fieldErrors) {
//             Object.entries(result.fieldErrors).forEach(([field, error]) => {
//                 const input = document.getElementById(field);
//                 if (input && error) {
//                     input.classList.add('error');
//                     const errorDiv = document.createElement('div');
//                     errorDiv.className = 'field-error';
//                     errorDiv.textContent = error as string;
//                     input.parentNode?.appendChild(errorDiv);
//                 }
//             });
//         }
//     }
    
//     static cleanup(): void {
//         this._handlers.forEach((handler, key) => {
//             let element: Element | null = null;
//             if (key === 'submit') {
//                 element = document.getElementById('placeAdForm');
//             } else if (key === 'addAttribute') {
//                 element = document.getElementById('addAttributeBtn');
//             } else if (key === 'photos') {
//                 element = document.getElementById('photos');
//             } else if (key === 'remove-photo') {
//                 element = document.getElementById('photoPreviewContainer');
//             } else if (key === 'removeAttribute') {
//                 element = document.getElementById('dynamicAttributesContainer');
//             } else if (key.startsWith('back-')) {
//                 element = document.querySelector('[data-action="back"]');
//             }
            
//             if (element) {
//                 if (key === 'submit') {
//                     element.removeEventListener('submit', handler);
//                 } else {
//                     element.removeEventListener('click', handler);
//                     if (key === 'photos') {
//                         element.removeEventListener('change', handler);
//                     }
//                 }
//             }
//         });
        
//         this._handlers.clear();
//         this.photoFiles = [];
//         this.photoPreviews = [];
//         this.dynamicAttributes = [];
//     }
// }


import Handlebars from 'handlebars';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { AppController } from '@/controllers/AppController';

interface DynamicAttribute {
    name: string;
    value: string;
}

interface Characteristic {
    name: string;
    value: string;
}

export class PlaceAnAdController {
    private static _handlers: Map<string, EventListener> = new Map();
    private static photoFiles: File[] = [];
    private static photoPreviews: string[] = [];
    private static dynamicAttributes: DynamicAttribute[] = [];

    static async render(): Promise<void> {
        console.log('=== PlaceAnAdController.render ===');
        
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
            
            const response = await fetch('/src/js/announcements/place-an-ad/templates/place-an-ad.hbs');
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            const templateSource = await response.text();
            const template = Handlebars.compile(templateSource);
            
            const templateData = {
                isAuthenticated: store.isAuthenticated,
                user: store.user,
                categories: await this.loadCategories(),
                state: await this.loadState(),
            };
            
            app.innerHTML = template(templateData);
            this.attachEventListeners();
            
        } catch (error) {
            console.error('Error loading place-an-ad page:', error);
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
            app.innerHTML = '<h1>404 - Страница не найдена</h1>';
        }
    }
    
    private static async loadCategories(): Promise<Array<{id: number, name: string}>> {
        return [
            { id: 1, name: 'Обувь' },
            { id: 2, name: 'Одежда' },
            { id: 3, name: 'Электроника' },
            { id: 4, name: 'Авто' },
            { id: 5, name: 'Запчасти' },
            { id: 6, name: 'Недвижимость' },
            { id: 7, name: 'Дом и сад' },
            { id: 8, name: 'Спорт и отдых' },
        ];
    }

    private static async loadState(): Promise<Array<{id: number, name: string}>> {
        return [
            { id: 1, name: 'Новое' },
            { id: 2, name: 'Б/у' },
            { id: 3, name: 'Отличное' },
            { id: 4, name: 'Хорошее' },
            { id: 5, name: 'Плохое' },
        ];
    }
    
    private static attachEventListeners(): void {
        const form = document.getElementById('placeAdForm');
        if (form) {
            const handler = (e: Event) => {
                e.preventDefault();
                this.handleSubmit('publish');
            };
            form.addEventListener('submit', handler);
            this._handlers.set('submit', handler);
        }
        
        // Кнопка "Сохранить в черновик"
        const draftBtn = document.getElementById('saveDraftBtn');
        if (draftBtn) {
            const handler = () => {
                this.handleSubmit('draft');
            };
            draftBtn.addEventListener('click', handler);
            this._handlers.set('saveDraft', handler);
        }
        
        // Кнопка "Посмотреть результат" (предпросмотр)
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            const handler = async () => {
                await this.handlePreview();
            };
            previewBtn.addEventListener('click', handler);
            this._handlers.set('preview', handler);
        }
        
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
        
        // === НОВАЯ СИСТЕМА ЗАГРУЗКИ ФОТО (сетка + кнопка "+") ===
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
        
        // Кнопка добавления характеристики
        const addAttrBtn = document.getElementById('addAttributeBtn');
        if (addAttrBtn) {
            const handler = () => {
                this.addDynamicAttribute();
            };
            addAttrBtn.addEventListener('click', handler);
            this._handlers.set('addAttribute', handler);
        }
        
        // Удаление характеристики (делегирование)
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
    
    /**
     * Обработка загрузки фото
     */
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
            if (!file.type.startsWith('image/')) {
                uiActions.showError(`Файл "${file.name}" не является изображением`);
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
    
    /**
     * Рендер сетки фото
     */
    // private static renderPhotosGrid(): void {
    //     const grid = document.getElementById('photosGrid');
    //     if (!grid) return;
        
    //     const addBtn = document.querySelector('#addPhotoBtn');
        
    //     // Удаляем все фото-карточки, оставляя только кнопку добавления
    //     const photoCards = grid.querySelectorAll('.photo-card');
    //     photoCards.forEach(card => card.remove());
        
    //     // Добавляем все фото перед кнопкой добавления
    //     this.photoPreviews.forEach((preview, index) => {
    //         const photoCard = document.createElement('div');
    //         photoCard.className = 'photo-card';
    //         photoCard.dataset.photoIndex = String(index);
            
    //         photoCard.innerHTML = `
    //             <img src="${preview}" alt="Фото ${index + 1}">
    //             <button type="button" class="photo-remove-btn" data-index="${index}">×</button>
    //             ${index === 0 ? '<div class="photo-cover-badge">Обложка</div>' : ''}
    //         `;
            
    //         grid.insertBefore(photoCard, addBtn);
    //     });
        
    //     // Привязываем обработчики удаления
    //     this.attachPhotoRemoveHandlers();
    // }

    private static renderPhotosGrid(): void {
        const grid = document.getElementById('photosGrid');
        if (!grid) return;
        
        const addBtn = document.getElementById('addPhotoBtn');
        if (!addBtn) return;
        
        // Получаем шаблон
        const template = document.getElementById('photoCardTemplate') as HTMLTemplateElement;
        if (!template) return;
        
        // Удаляем все существующие фото-карточки
        const existingCards = grid.querySelectorAll('.photo-card');
        existingCards.forEach(card => card.remove());
        
        // Создаем новые карточки из шаблона
        this.photoPreviews.forEach((preview, index) => {
            // Клонируем содержимое шаблона
            const cardContent = document.importNode(template.content, true);
            const photoCard = cardContent.firstElementChild as HTMLElement;
            
            if (!photoCard) return;
            
            // Заполняем данные
            const img = photoCard.querySelector('img') as HTMLImageElement;
            const removeBtn = photoCard.querySelector('.photo-remove-btn') as HTMLButtonElement;
            const coverBadge = photoCard.querySelector('.photo-cover-badge') as HTMLElement;
            
            if (img) {
                img.src = preview;
                img.alt = `Фото ${index + 1}`;
            }
            
            if (removeBtn) {
                removeBtn.setAttribute('data-index', String(index));
                removeBtn.addEventListener('click', this.handlePhotoRemove);
            }
            
            // Показываем бейдж обложки только для первого фото
            if (coverBadge && index !== 0) {
                coverBadge.style.display = 'none'; // Теперь ошибки нет, т.к. coverBadge имеет тип HTMLElement
            }
            
            photoCard.dataset.photoIndex = String(index);
            
            // Вставляем перед кнопкой добавления
            grid.insertBefore(photoCard, addBtn);
        });
    }
    
    /**
     * Привязка обработчиков удаления фото
     */
    private static attachPhotoRemoveHandlers(): void {
        const removeBtns = document.querySelectorAll('.photo-remove-btn');
        removeBtns.forEach(btn => {
            btn.removeEventListener('click', this.handlePhotoRemove);
            btn.addEventListener('click', this.handlePhotoRemove);
        });
    }
    
    /**
     * Обработчик удаления фото
     */
    private static handlePhotoRemove = (e: Event) => {
        // e.stopPropagation();
        // const btn = e.currentTarget as HTMLButtonElement;
        // const index = parseInt(btn.dataset.index || '0');
        // this.removePhoto(index);
        e.stopPropagation();
        const btn = e.currentTarget as HTMLButtonElement;
        const index = parseInt(btn.getAttribute('data-index') || '0');
        PlaceAnAdController.removePhoto(index);
    };
    
    /**
     * Удаление фото
     */
    private static removePhoto(index: number): void {
        // this.photoFiles.splice(index, 1);
        // this.photoPreviews.splice(index, 1);
        // this.renderPhotosGrid();
        
        // if (this.photoFiles.length === 0) {
        //     uiActions.showSuccess('Все фото удалены');
        // } else {
        //     uiActions.showSuccess('Фото удалено');
        // }
        PlaceAnAdController.photoFiles.splice(index, 1);
        PlaceAnAdController.photoPreviews.splice(index, 1);
        PlaceAnAdController.renderPhotosGrid();
        
        if (PlaceAnAdController.photoFiles.length === 0) {
            uiActions.showSuccess('Все фото удалены');
        } else {
            uiActions.showSuccess('Фото удалено');
        }
    }
    
    /**
     * Добавление новой динамической характеристики
     */
    private static addDynamicAttribute(): void {
        this.dynamicAttributes.push({ name: '', value: '' });
        this.renderDynamicAttributes();
    }
    
    /**
     * Удаление динамической характеристики
     */
    private static removeDynamicAttribute(index: number): void {
        this.dynamicAttributes.splice(index, 1);
        this.renderDynamicAttributes();
    }
    
    /**
     * Обновление значения характеристики при вводе
     */
    private static updateDynamicAttribute(index: number, field: 'name' | 'value', value: string): void {
        if (this.dynamicAttributes[index]) {
            this.dynamicAttributes[index][field] = value;
        }
    }
    
    /**
     * Рендер динамических характеристик
     */
    private static renderDynamicAttributes(): void {
        const container = document.getElementById('dynamicAttributesContainer');
        if (!container) return;
        
        container.innerHTML = this.dynamicAttributes.map((attr, index) => `
            <div class="dynamic-attribute" data-attr-index="${index}">
                <input 
                    type="text" 
                    class="form-input attr-name" 
                    placeholder="Название (например, Цвет)"
                    value="${this.escapeHtml(attr.name)}"
                    data-attr-name="${index}"
                >
                <input 
                    type="text" 
                    class="form-input attr-value" 
                    placeholder="Значение (например, Черный)"
                    value="${this.escapeHtml(attr.value)}"
                    data-attr-value="${index}"
                >
                <button type="button" class="remove-attr-btn" data-index="${index}">×</button>
            </div>
        `).join('');
        
        // Привязываем обработчики ввода к новым полям
        document.querySelectorAll('[data-attr-name]').forEach((input) => {
            const el = input as HTMLInputElement;
            const index = parseInt(el.dataset.attrName!);
            el.addEventListener('input', (e) => {
                this.updateDynamicAttribute(index, 'name', (e.target as HTMLInputElement).value);
            });
        });
        
        document.querySelectorAll('[data-attr-value]').forEach((input) => {
            const el = input as HTMLInputElement;
            const index = parseInt(el.dataset.attrValue!);
            el.addEventListener('input', (e) => {
                this.updateDynamicAttribute(index, 'value', (e.target as HTMLInputElement).value);
            });
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
    
    /**
     * Сбор всех данных из формы
     */
    private static collectFormData(): any {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const adTypeRadios = document.querySelectorAll('input[name="adType"]');
        const priceInput = document.getElementById('price') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
        const conditionSelect = document.getElementById('condition') as HTMLSelectElement;
        const brandInput = document.getElementById('brand') as HTMLInputElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;
        const categoryCharacteristics: Characteristic[] = [];
        const customCharacteristics: Characteristic[] = [];
        
        let adType = 'sell';
        for (const radio of adTypeRadios) {
            if ((radio as HTMLInputElement).checked) {
                adType = (radio as HTMLInputElement).value;
                break;
            }
        }
        
        // Разделяем характеристики на категорийные и пользовательские
        
        if (conditionSelect?.value) {
            const conditionText = conditionSelect.options[conditionSelect.selectedIndex]?.text || conditionSelect.value;
            categoryCharacteristics.push({
                name: "Состояние",
                value: conditionText
            });
        }
        
        if (brandInput?.value.trim()) {
            categoryCharacteristics.push({
                name: "Производитель",
                value: brandInput.value.trim()
            });
        }
        
        this.dynamicAttributes.forEach(attr => {
            if (attr.name.trim() && attr.value.trim()) {
                customCharacteristics.push({
                    name: attr.name.trim(),
                    value: attr.value.trim()
                });
            }
        });
        
        return {
            title: titleInput?.value.trim() || '',
            category_id: parseInt(categorySelect?.value || '0'),
            ad_type: adType,
            price: parseInt(priceInput?.value || '0'),
            description: descriptionTextarea?.value.trim() || '',
            location: locationInput?.value.trim() || '',
            category_characteristics: categoryCharacteristics,
            custom_characteristics: customCharacteristics
        };
    }
    
    private static validateForm(data: any): boolean {
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
        
        return true;
    }
    
    // private static async handleSubmit(): Promise<void> {
    //     AppController.showLoading(true);
        
    //     try {
    //         const formData = this.collectFormData();
            
    //         if (!this.validateForm(formData)) {
    //             AppController.showLoading(false);
    //             return;
    //         }
            
    //         const multipartFormData = new FormData();
            
    //         // Отправляем каждое поле отдельно
    //         multipartFormData.append('title', formData.title);
    //         multipartFormData.append('category_id', String(formData.category_id));
    //         multipartFormData.append('ad_type', formData.ad_type);
    //         multipartFormData.append('price', String(formData.price));
    //         multipartFormData.append('description', formData.description || '');
    //         multipartFormData.append('location', formData.location || '');
    //         multipartFormData.append('category_characteristics', JSON.stringify(formData.category_characteristics));
    //         multipartFormData.append('custom_characteristics', JSON.stringify(formData.custom_characteristics));
            
    //         // Добавляем фотографии
    //         this.photoFiles.forEach((file) => {
    //             multipartFormData.append('photos', file);
    //         });
            
    //         const token = localStorage.getItem('token');
    //         const response = await fetch('/api/v1/ads', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': token ? `Bearer ${token}` : '',
    //             },
    //             body: multipartFormData,
    //         });
            
    //         const result = await response.json();
            
    //         if (response.ok && result.success) {
    //             uiActions.showSuccess('Объявление успешно создано!');
    //             if (result.data && result.data.id) {
    //                 AppController.navigateTo(`/ad/${result.data.id}`);
    //             } else {
    //                 AppController.navigateTo('/');
    //             }
    //         } else {
    //             this.showFormErrors(result);
    //             uiActions.showError(result.error || 'Ошибка при создании объявления');
    //         }
    //     } catch (error) {
    //         console.error('Error submitting ad:', error);
    //         uiActions.showError('Не удалось соединиться с сервером');
    //     } finally {
    //         AppController.showLoading(false);
    //     }
    // }
    
    private static showFormErrors(result: any): void {
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
    }
    
    static cleanup(): void {
        this._handlers.forEach((handler, key) => {
            let element: Element | null = null;
            if (key === 'submit') {
                element = document.getElementById('placeAdForm');
            } else if (key === 'addAttribute') {
                element = document.getElementById('addAttributeBtn');
            } else if (key === 'addPhotoBtn') {
                element = document.getElementById('addPhotoBtn');
            } else if (key === 'photosInput') {
                element = document.getElementById('photosInput');
            } else if (key === 'removeAttribute') {
                element = document.getElementById('dynamicAttributesContainer');
            } else if (key.startsWith('back-')) {
                element = document.querySelector('[data-action="back"]');
            }
            
            if (element) {
                if (key === 'submit') {
                    element.removeEventListener('submit', handler);
                } else {
                    element.removeEventListener('click', handler);
                    if (key === 'photosInput') {
                        element.removeEventListener('change', handler);
                    }
                }
            }
        });
        
        this._handlers.clear();
        this.photoFiles = [];
        this.photoPreviews = [];
        this.dynamicAttributes = [];
    }

    private static async handleSubmit(mode: 'publish' | 'draft'): Promise<void> {
        AppController.showLoading(true);
        
        try {
            const formData = this.collectFormData();
            
            // Для черновиков валидация мягче
            if (mode === 'publish') {
                if (!this.validateForm(formData)) {
                    AppController.showLoading(false);
                    return;
                }
            } else {
                // Для черновика проверяем только минимальные поля
                if (!formData.title) {
                    uiActions.showError('Введите название объявления');
                    AppController.showLoading(false);
                    return;
                }
            }
            
            const multipartFormData = new FormData();
            
            multipartFormData.append('title', formData.title);
            multipartFormData.append('category_id', String(formData.category_id));
            multipartFormData.append('ad_type', formData.ad_type);
            multipartFormData.append('price', String(formData.price));
            multipartFormData.append('description', formData.description || '');
            multipartFormData.append('location', formData.location || '');
            multipartFormData.append('category_characteristics', JSON.stringify(formData.category_characteristics));
            multipartFormData.append('custom_characteristics', JSON.stringify(formData.custom_characteristics));
            multipartFormData.append('status', mode === 'publish' ? 'active' : 'draft');
            
            // Добавляем фотографии
            this.photoFiles.forEach((file) => {
                multipartFormData.append('photos', file);
            });
            
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
                if (mode === 'publish') {
                    uiActions.showSuccess('Объявление успешно опубликовано!');
                    if (result.data && result.data.id) {
                        AppController.navigateTo(`/ad/${result.data.id}`);
                    } else {
                        AppController.navigateTo('/');
                    }
                } else {
                    uiActions.showSuccess('Объявление сохранено в черновики');
                    AppController.navigateTo('/profile/drafts'); // Страница с черновиками
                }
            } else {
                this.showFormErrors(result);
                uiActions.showError(result.error || 'Ошибка при сохранении объявления');
            }
        } catch (error) {
            console.error('Error submitting ad:', error);
            uiActions.showError('Не удалось соединиться с сервером');
        } finally {
            AppController.showLoading(false);
        }
    }

    /**
     * Предпросмотр объявления перед публикацией
     */
    private static async handlePreview(): Promise<void> {
        AppController.showLoading(true);
        
        try {
            const formData = this.collectFormData();
            
            // Минимальная валидация для предпросмотра
            if (!formData.title) {
                uiActions.showError('Введите название объявления');
                AppController.showLoading(false);
                return;
            }
            
            // Сохраняем данные в sessionStorage для предпросмотра
            const previewData = {
                title: formData.title,
                category_id: formData.category_id,
                ad_type: formData.ad_type,
                price: formData.price,
                description: formData.description,
                location: formData.location,
                category_characteristics: formData.category_characteristics,
                custom_characteristics: formData.custom_characteristics,
                photos: this.photoPreviews, // Сохраняем превью для отображения
            };
            
            sessionStorage.setItem('adPreviewData', JSON.stringify(previewData));
            
            // Переходим на страницу предпросмотра
            AppController.navigateTo('/ad-preview');
            
        } catch (error) {
            console.error('Error creating preview:', error);
            uiActions.showError('Не удалось создать предпросмотр');
        } finally {
            AppController.showLoading(false);
        }
    }
}
