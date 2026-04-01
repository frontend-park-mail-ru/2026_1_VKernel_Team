/**
 * Валидатор для форм авторизации
 * Проверяет, правильно ли пользователь заполнил поля:
 * - email должен быть настоящим
 * - пароль достаточно сложный
 * - имя содержит только допустимые символы
 *
 * @module authValidator
 */

const AuthValidator = {

    NAME_REGEX: /^[\p{L}\s'-]{3,50}$/u,
    EMAIL_REGEX: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z0-9]{2,}$/,
    LETTER_REGEX: /[a-zA-Z]/,
    DIGIT_REGEX: /[0-9]/,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 8,

    // validateUsername(username: string): boolean {
    //     if (!username) return false;
    //     return username.length >= this.USERNAME_MIN_LENGTH && this.USERNAME_REGEX.test(username);
    // },

    validateName(name: string): { isValid: boolean; error: string | null } {
        // На всякий случай обрезаем пробелы в начале и конце еще раз
        const trimmedName = name.trim();

        if (!trimmedName) {
            return { isValid: false, error: 'Имя не может быть пустым' };
        }

        // Проверка длины в символах (Unicode points)
        const length = [...trimmedName].length; // Более надежный способ для Unicode
        if (length < this.USERNAME_MIN_LENGTH) {
            return { isValid: false, error: `Имя должно содержать минимум ${this.USERNAME_MIN_LENGTH} символа` };
        }
        if (length > this.USERNAME_MAX_LENGTH) {
            return { isValid: false, error: `Имя должно содержать не более ${this.USERNAME_MAX_LENGTH} символов` };
        }

        // Проверка на разрешенные символы
        if (!this.NAME_REGEX.test(trimmedName)) {
            return { isValid: false, error: 'Имя может содержать только буквы (любых алфавитов), пробелы, дефисы (-) и апострофы (\')' };
        }

        return { isValid: true, error: null };
    },

    validateEmail(email: string): boolean {
        if (!email) return false;
        return this.EMAIL_REGEX.test(email.toLowerCase());
    },

    validatePassword(password: string): { isValid: boolean; error: string | null } {
        if (!password) {
            return {
                isValid: false,
                error: 'Пароль обязателен',
            };
        }

        if ([...password].length < this.PASSWORD_MIN_LENGTH) {
            return {
                isValid: false,
                error: `Пароль должен быть не менее ${this.PASSWORD_MIN_LENGTH} символов`,
            };
        }

        const hasLetter = this.LETTER_REGEX.test(password);
        const hasDigit = this.DIGIT_REGEX.test(password);

        if (!hasLetter && !hasDigit) {
            return {
                isValid: false,
                error: 'Пароль должен содержать хотя бы одну букву и одну цифру',
            };
        }

        if (!hasLetter) {
            return {
                isValid: false,
                error: 'Пароль должен содержать хотя бы одну букву',
            };
        }

        if (!hasDigit) {
            return {
                isValid: false,
                error: 'Пароль должен содержать хотя бы одну цифру',
            };
        }

        return {
            isValid: true,
            error: null,
        };
    },

    validateLogin(email: string, password: string): { isValid: boolean; error: string | null } {
        if (!email || !password) {
            return {
                isValid: false,
                error: 'Заполните поля',
            };
        }
        if (!this.validateEmail(email)) {
            return {
                isValid: false,
                error: 'Неверный email или пароль',
            };
        }

        // Для логина мы не проверяем сложность пароля на фронте, так как это делается на бэкенде
        // и мы просто передаем его дальше. Ошибка придет с сервера, если пароль не подходит.
        return {
            isValid: true,
            error: null,
        };
    },

    validateRegister(
        name: string,
        email: string,
        password: string,
        confirmPassword: string,
    ): {
        isValid: boolean;
        fieldErrors: Record<string, string | null>;
        errors: string[];
    } {
        const fieldErrors: Record<string, string | null> = {
            name: null,
            email: null,
            password: null,
            confirmPassword: null,
        };

        const nameValidation = this.validateName(name);
        if (!nameValidation.isValid) {
            fieldErrors.name = nameValidation.error;
        }

        if (!email) {
            fieldErrors.email = 'Email обязателен';
        } else if (!this.validateEmail(email)) {
            fieldErrors.email = 'Некорректный email. Пример: ivanov@iv.ru';
        }

        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            fieldErrors.password = passwordValidation.error;
        }

        if (password !== confirmPassword) {
            fieldErrors.confirmPassword = 'Пароли не совпадают';
        }

        const hasErrors = Object.values(fieldErrors).some(error => error !== null);
        return {
            isValid: !hasErrors,
            fieldErrors: fieldErrors,
            errors: Object.values(fieldErrors).filter(e => e !== null) as string[],
        };
    },
};

export { AuthValidator };
