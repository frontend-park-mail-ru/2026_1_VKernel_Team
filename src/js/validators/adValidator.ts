/**
 * Валидация формы создания/редактирования объявления
 */
import type { FieldErrors } from '@/types';

export interface AdValidationResult {
    isValid: boolean;
    fieldErrors: FieldErrors;
}

export const AdValidator = {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 5000,
    MAX_PRICE: 999_999_999,

    validateTitle(title: string): string | null {
        const trimmed = title.trim();
        if (!trimmed) return 'Укажите название объявления';
        if (trimmed.length < this.TITLE_MIN_LENGTH) {
            return `Название должно содержать минимум ${this.TITLE_MIN_LENGTH} символа`;
        }
        if (trimmed.length > this.TITLE_MAX_LENGTH) {
            return `Название не должно превышать ${this.TITLE_MAX_LENGTH} символов`;
        }
        return null;
    },

    validateCategory(categoryId: number): string | null {
        if (!categoryId || categoryId <= 0) return 'Выберите категорию';
        return null;
    },

    validatePrice(price: number): string | null {
        if (isNaN(price) || price < 0) return 'Цена не может быть отрицательной';
        if (price > this.MAX_PRICE) return 'Слишком большая цена';
        return null;
    },

    validateDescription(description: string): string | null {
        const trimmed = description.trim();
        if (!trimmed) return 'Добавьте описание объявления';
        if (trimmed.length > this.DESCRIPTION_MAX_LENGTH) {
            return `Описание не должно превышать ${this.DESCRIPTION_MAX_LENGTH} символов`;
        }
        return null;
    },

    validateLocation(location: string): string | null {
        if (!location.trim()) return 'Укажите местоположение';
        return null;
    },

    validatePhotos(photosCount: number): string | null {
        if (photosCount === 0) return 'Добавьте хотя бы одну фотографию';
        return null;
    },

    validateForm(data: {
        title: string;
        categoryId: number;
        price: number;
        description: string;
        location: string;
        photosCount: number;
    }): AdValidationResult {
        const fieldErrors: FieldErrors = {};

        const titleError = this.validateTitle(data.title);
        if (titleError) fieldErrors.title = titleError;

        const categoryError = this.validateCategory(data.categoryId);
        if (categoryError) fieldErrors.category = categoryError;

        const priceError = this.validatePrice(data.price);
        if (priceError) fieldErrors.price = priceError;

        const descriptionError = this.validateDescription(data.description);
        if (descriptionError) fieldErrors.description = descriptionError;

        const locationError = this.validateLocation(data.location);
        if (locationError) fieldErrors.location = locationError;

        const photosError = this.validatePhotos(data.photosCount);
        if (photosError) fieldErrors.photosGrid = photosError;

        return {
            isValid: Object.keys(fieldErrors).length === 0,
            fieldErrors,
        };
    },
};
