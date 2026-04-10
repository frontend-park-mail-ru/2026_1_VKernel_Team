/**
 * Контроллер страницы создания объявления
 */

import Handlebars from 'handlebars';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { AppController } from '@/controllers/AppController';

export class PlaceAnAdController {
    private static _handlers: Map<string, EventListener> = new Map();
    private static photoFiles: File[] = [];
    private static photoPreviews: string[] = [];

    static async render(): Promise<void> {
        console.log('=== PlaceAnAdController.render ===');
        
        const app = document.getElementById('app');
        if (!app) return;
        
        document.body.classList.remove('auth-page');
        
        AppController.showLoading(true);
        
        try {
            // Проверяем авторизацию
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
            };
            
            app.innerHTML = template(templateData);
            this.attachEventListeners();
            
        } catch (error) {
            console.error('Error loading place-an-ad page:', error);
            await this.showNotFound(); // Показываем 404 как в AdDetailController
        } finally {
            AppController.showLoading(false);
        }
    }
    
    // Метод для показа 404 - точно как в AdDetailController
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
        // try {
        //     const response = await fetch('/api/v1/categories');
        //     const result = await response.json();
        //     if (result.success && result.data) {
        //         return result.data;
        //     }
        //     return [];
        // } catch (error) {
        //     console.error('Error loading categories:', error);
        //     return [];
        // }
        return [
            { id: 1, name: 'Электроника' },
            { id: 2, name: 'Одежда' },
            { id: 3, name: 'Авто' },
            { id: 4, name: 'Недвижимость' },
            { id: 5, name: 'Дом и сад' },
        ];
    }
    
    private static attachEventListeners(): void {
        const form = document.getElementById('placeAdForm');
        if (form) {
            const handler = (e: Event) => {
                e.preventDefault();
                this.handleSubmit();
            };
            form.addEventListener('submit', handler);
            this._handlers.set('submit', handler);
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
        
        const photoInput = document.getElementById('photos') as HTMLInputElement;
        if (photoInput) {
            const handler = () => {
                this.handlePhotoPreview(photoInput);
            };
            photoInput.addEventListener('change', handler);
            this._handlers.set('photos', handler);
        }
        
        const photoContainer = document.getElementById('photoPreviewContainer');
        if (photoContainer) {
            const handler = (e: Event) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('remove-photo')) {
                    const index = target.dataset.index;
                    if (index !== undefined) {
                        this.removePhoto(parseInt(index));
                    }
                }
            };
            photoContainer.addEventListener('click', handler);
            this._handlers.set('remove-photo', handler);
        }
    }
    
    private static handlePhotoPreview(input: HTMLInputElement): void {
        const files = input.files;
        if (!files) return;
        
        const maxPhotos = 10;
        const currentCount = this.photoFiles.length;
        const availableSlots = maxPhotos - currentCount;
        
        if (files.length > availableSlots) {
            uiActions.showError(`Можно загрузить не более ${maxPhotos} фото`);
            return;
        }
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                this.photoFiles.push(file);
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewUrl = e.target?.result as string;
                    this.photoPreviews.push(previewUrl);
                    this.renderPhotoPreviews();
                };
                reader.readAsDataURL(file);
            }
        }
        
        input.value = '';
    }
    
    private static renderPhotoPreviews(): void {
        const container = document.getElementById('photoPreviewContainer');
        if (!container) return;
        
        container.innerHTML = this.photoPreviews.map((preview, index) => `
            <div class="photo-preview">
                <img src="${preview}" alt="Фото ${index + 1}">
                <button type="button" class="remove-photo" data-index="${index}">×</button>
            </div>
        `).join('');
    }
    
    private static removePhoto(index: number): void {
        this.photoFiles.splice(index, 1);
        this.photoPreviews.splice(index, 1);
        this.renderPhotoPreviews();
    }
    
    // private static async handleSubmit(): Promise<void> {
    //     AppController.showLoading(true);
        
    //     try {
    //         const titleInput = document.getElementById('title') as HTMLInputElement;
    //         const categorySelect = document.getElementById('category') as HTMLSelectElement;
    //         const priceInput = document.getElementById('price') as HTMLInputElement;
    //         const locationInput = document.getElementById('location') as HTMLInputElement;
    //         const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
            
    //         // Валидация
    //         if (!titleInput?.value.trim()) {
    //             uiActions.showError('Введите название объявления');
    //             return;
    //         }
            
    //         if (!categorySelect?.value) {
    //             uiActions.showError('Выберите категорию');
    //             return;
    //         }
            
    //         const formData = new FormData();
    //         formData.append('title', titleInput.value.trim());
    //         formData.append('category_id', categorySelect.value);
    //         formData.append('price', priceInput?.value || '0');
    //         formData.append('location', locationInput?.value || '');
    //         formData.append('description', descriptionTextarea?.value || '');
            
    //         this.photoFiles.forEach((file) => {
    //             formData.append('photos', file);
    //         });
            
    //         const token = localStorage.getItem('token');
    //         const response = await fetch('/api/v1/ads', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': token ? `Bearer ${token}` : '',
    //             },
    //             body: formData,
    //         });
            
    //         const result = await response.json();
            
    //         if (response.ok && result.success) {
    //             uiActions.showSuccess('Объявление успешно создано!');
    //             AppController.navigateTo(`/ad/${result.data.id}`);
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
    private static async handleSubmit(): Promise<void> {
        AppController.showLoading(true);
        
        try {
            // Валидация формы
            if (!this.validateForm()) {
                AppController.showLoading(false);
                return;
            }
            
            const titleInput = document.getElementById('title') as HTMLInputElement;
            const categorySelect = document.getElementById('category') as HTMLSelectElement;
            const priceInput = document.getElementById('price') as HTMLInputElement;
            const locationInput = document.getElementById('location') as HTMLInputElement;
            const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
            
            const formData = new FormData();
            
            // Формируем data как JSON строку
            const adData = {
                title: titleInput.value.trim(),
                category_id: parseInt(categorySelect.value),
                price: parseInt(priceInput?.value || '0'),
                location: locationInput?.value.trim() || '',
                description: descriptionTextarea?.value.trim() || '',
                status: 'active'
            };
            
            formData.append('data', JSON.stringify(adData));
            
            // Добавляем фотографии
            this.photoFiles.forEach((file) => {
                formData.append('photos', file);
            });
            
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/ads', {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: formData,
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                uiActions.showSuccess('Объявление успешно создано!');
                if (result.data && result.data.id) {
                    AppController.navigateTo(`/ad/${result.data.id}`);
                } else {
                    AppController.navigateTo('/');
                }
            } else {
                this.showFormErrors(result);
                uiActions.showError(result.error || 'Ошибка при создании объявления');
            }
        } catch (error) {
            console.error('Error submitting ad:', error);
            uiActions.showError('Не удалось соединиться с сервером');
        } finally {
            AppController.showLoading(false);
        }
    }
    
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
            } else if (key === 'back') {
                element = document.querySelector('[data-action="back"]');
            } else if (key === 'photos') {
                element = document.getElementById('photos');
            } else if (key === 'remove-photo') {
                element = document.getElementById('photoPreviewContainer');
            }
            
            if (element) {
                if (key === 'submit') {
                    element.removeEventListener('submit', handler);
                } else {
                    element.removeEventListener('click', handler);
                    if (key === 'photos') {
                        element.removeEventListener('change', handler);
                    }
                }
            }
        });
        
        this._handlers.clear();
        this.photoFiles = [];
        this.photoPreviews = [];
    }

    // В методе handleSubmit добавим проверки:
    // private static validateForm(): boolean {
    //     const title = (document.getElementById('title') as HTMLInputElement)?.value.trim();
    //     const description = (document.getElementById('description') as HTMLTextAreaElement)?.value.trim();
    //     const price = parseInt((document.getElementById('price') as HTMLInputElement)?.value || '0');
        
    //     // title: 5-150 символов
    //     if (title.length < 5) {
    //         uiActions.showError('Название должно быть не менее 5 символов');
    //         return false;
    //     }
    //     if (title.length > 150) {
    //         uiActions.showError('Название не должно превышать 150 символов');
    //         return false;
    //     }
        
    //     // description: 10-5000 символов (если указано)
    //     if (description && description.length > 0) {
    //         if (description.length < 10) {
    //             uiActions.showError('Описание должно быть не менее 10 символов');
    //             return false;
    //         }
    //         if (description.length > 5000) {
    //             uiActions.showError('Описание не должно превышать 5000 символов');
    //             return false;
    //         }
    //     }
        
    //     // price: ≥ 0
    //     if (price < 0) {
    //         uiActions.showError('Цена не может быть отрицательной');
    //         return false;
    //     }
        
    //     return true;
    // }
    private static validateForm(): boolean {
        const title = (document.getElementById('title') as HTMLInputElement)?.value.trim();
        const description = (document.getElementById('description') as HTMLTextAreaElement)?.value.trim();
        const price = parseInt((document.getElementById('price') as HTMLInputElement)?.value || '0');
        const category = (document.getElementById('category') as HTMLSelectElement)?.value;
        
        // Категория обязательна
        if (!category) {
            uiActions.showError('Выберите категорию');
            return false;
        }
        
        // title: 5-150 символов
        if (!title) {
            uiActions.showError('Введите название объявления');
            return false;
        }
        if (title.length < 5) {
            uiActions.showError('Название должно быть не менее 5 символов');
            return false;
        }
        if (title.length > 150) {
            uiActions.showError('Название не должно превышать 150 символов');
            return false;
        }
        
        // description: 10-5000 символов (если указано)
        if (description && description.length > 0) {
            if (description.length < 10) {
                uiActions.showError('Описание должно быть не менее 10 символов');
                return false;
            }
            if (description.length > 5000) {
                uiActions.showError('Описание не должно превышать 5000 символов');
                return false;
            }
        }
        
        // price: ≥ 0
        if (isNaN(price) || price < 0) {
            uiActions.showError('Цена не может быть отрицательной');
            return false;
        }
        
        return true;
    }
}
