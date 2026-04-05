/**
 * Валидация форм авторизации и регистрации
 */
import type { ValidationResult, FieldErrors } from '@/types';

export const AuthValidator = {
    NAME_REGEX: /^[\p{L}\s'-]{3,50}$/u,
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/,
    LETTER_REGEX: /[a-zA-Z]/,
    DIGIT_REGEX: /[0-9]/,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 8,

    validateEmail(email: string): string | null {
        if (!email) return 'Email обязателен';
        if (!this.EMAIL_REGEX.test(email)) return 'Неверный формат email';
        if (email.length < 5) return 'Email слишком короткий';
        return null;
    },

    validatePassword(password: string): string | null {
        if (!password) return 'Пароль обязателен';

        if ([...password].length < this.PASSWORD_MIN_LENGTH) {
            return `Пароль должен быть не менее ${this.PASSWORD_MIN_LENGTH} символов`;
        }
        if ([...password].length > 100) return 'Пароль слишком длинный';

        const hasLetter = this.LETTER_REGEX.test(password);
        const hasDigit = this.DIGIT_REGEX.test(password);

        if (!hasLetter && !hasDigit) {
            return 'Пароль должен содержать хотя бы одну букву и одну цифру';
        }
        if (!hasLetter) return 'Пароль должен содержать хотя бы одну букву';
        if (!hasDigit) return 'Пароль должен содержать хотя бы одну цифру';

        return null;
    },

    validateName(name: string): string | null {
        const trimmedName = name.trim();
        
        if (!trimmedName) return 'Имя не может быть пустым';

        const length = [...trimmedName].length;
        if (length < this.USERNAME_MIN_LENGTH) {
            return `Имя должно содержать минимум ${this.USERNAME_MIN_LENGTH} символа`;
        }
        if (length > this.USERNAME_MAX_LENGTH) {
            return `Имя должно содержать не более ${this.USERNAME_MAX_LENGTH} символов`;
        }

        if (!this.NAME_REGEX.test(trimmedName)) {
            return 'Имя может содержать только буквы, пробелы, дефисы (-) и апострофы (\')';
        }

        return null;
    },

    validateLogin(email: string, password: string): ValidationResult {
        if (!email || !password) {
            return { isValid: false, error: 'Заполните все поля' };
        }
        
        const emailError = this.validateEmail(email); 
        if (emailError) {
            return {
                isValid: false,
                error: emailError,
                fieldErrors: { email: emailError },
            };
        }

        if (!password) {
            return {
                isValid: false,
                error: 'Введите пароль',
                fieldErrors: { password: 'Пароль обязателен' },
            };
        }

        return { isValid: true };
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
