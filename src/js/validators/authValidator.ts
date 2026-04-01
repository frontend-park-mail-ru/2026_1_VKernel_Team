/**
 * Валидация форм авторизации и регистрации
 */

import type { ValidationResult, FieldErrors } from '@/types';

export const AuthValidator = {
    validateEmail(email: string): string | null {
        if (!email) return 'Email обязателен';
        if (!email.includes('@')) return 'Неверный формат email';
        if (email.length < 5) return 'Email слишком короткий';
        return null;
    },

    validatePassword(password: string): string | null {
        if (!password) return 'Пароль обязателен';
        if (password.length < 8) return 'Пароль должен быть не менее 8 символов';
        if (password.length > 50) return 'Пароль слишком длинный';
        return null;
    },

    validateName(name: string): string | null {
        if (!name) return 'Имя обязательно';
        if (name.length < 2) return 'Имя должно быть не менее 2 символов';
        if (name.length > 50) return 'Имя слишком длинное';
        return null;
    },

    validateLogin(email: string, password: string): ValidationResult {
        const fieldErrors: FieldErrors = {};

        const emailError = this.validateEmail(email);
        if (emailError) fieldErrors.email = emailError;

        const passwordError = this.validatePassword(password);
        if (passwordError) fieldErrors.password = passwordError;

        return {
            isValid: Object.keys(fieldErrors).length === 0,
            fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
        };
    },

    validateRegister(
        name: string,
        email: string,
        password: string,
        confirmPassword: string,
    ): ValidationResult {
        const fieldErrors: FieldErrors = {};

        const nameError = this.validateName(name);
        if (nameError) fieldErrors.name = nameError;

        const emailError = this.validateEmail(email);
        if (emailError) fieldErrors.email = emailError;

        const passwordError = this.validatePassword(password);
        if (passwordError) fieldErrors.password = passwordError;

        if (password !== confirmPassword) {
            fieldErrors.confirmPassword = 'Пароли не совпадают';
        }

        return {
            isValid: Object.keys(fieldErrors).length === 0,
            fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
        };
    },
};
