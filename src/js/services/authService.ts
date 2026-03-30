/**
 * Сервис для работы с авторизацией
 *
 * @module authService
 */

import { API_ENDPOINTS, apiClient } from '@/api/apiClient';

const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
};

type AuthErrorMapType = {
    [key: string]: string;
};

// Словарь ошибок
const AuthErrorMap: AuthErrorMapType = {
    'invalid input': 'Некорректный ввод',
    'wrong email or password': 'Неверный email или пароль',
    'password too short': 'Пароль должен быть не менее 8 символов',
    'user not found': 'Пользователь не найден',
    'user already exists': 'Этот email уже занят',
    'internal error': 'Внутренняя ошибка сервера',
    'too short': 'Пароль должен быть не менее 8 символов',
    'no digit': 'Пароль должен содержать хотя бы одну цифру',
    'no letter': 'Пароль должен содержать хотя бы одну букву',
    'special characters not allowed': 'Пароль может содержать только латинские буквы и цифры',
    'invalid email format': 'Некорректный формат email',
    'invalid credentials': 'Неверный email или пароль',
    'password must be at least 8 characters long': 'Пароль должен быть не менее 8 символов',
    'password must contain at least one digit': 'Пароль должен содержать хотя бы одну цифру',
    'password must contain at least one latin letter': 'Пароль должен содержать хотя бы одну букву',
    'password contains forbidden characters': 'Пароль может содержать только латинские буквы и цифры',
    'name cannot be empty': 'Имя не может быть пустым',
    'name contains invalid characters': 'Имя содержит недопустимые символы',
};

type UserData = {
    name?: string;
    username?: string;
    email: string;
    password: string;
};

type AuthResult = {
    success: boolean;
    data?: any;
    error?: string | null;
    fieldErrors?: Record<string, string>;
    status?: number;
};

/**
 * Объект реализующий авторизацию
 */
const AuthService = {
    /**
     * Регистрация нового пользователя
     * @async
     * @param {Object} userData - данные пользователя
     * @param {string} userData.name - имя пользователя
     * @param {string} userData.email - email
     * @param {string} userData.password - пароль
     * @returns {Promise<Object>} - результат регистрации
     *
     */
    async register(userData: UserData): Promise<AuthResult> {
        const result = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
            name: userData.name || userData.username,
            email: userData.email,
            password: userData.password,
        });

        if (result.success) {
            return {
                success: true,
                data: result.data,
                error: null,
            };
        }

        if (result.status === HTTP_STATUS.BAD_REQUEST && result.data) {
            const fieldErrors: Record<string, string> = {};
            const data = result.data as Record<string, string>;

            if (data.email) {
                fieldErrors.email = AuthErrorMap[data.email] || data.email;
            }
            if (data.password) {
                fieldErrors.password = AuthErrorMap[data.password] || data.password;
            }
            if (data.name) {
                fieldErrors.name = AuthErrorMap[data.name] || data.name;
            }

            return {
                success: false,
                error: 'Ошибка в полях',
                fieldErrors: fieldErrors,
                status: result.status,
            };
        }

        const translatedError = result.error ? (AuthErrorMap[result.error] || result.error) : 'Ошибка';
        return {
            success: false,
            error: translatedError,
            status: result.status,
        };
    },

    /**
     * Вход в систему
     * @async
     * @param {Object} credentials - учётные данные
     * @param {string} credentials.email - email
     * @param {string} credentials.password - пароль
     * @returns {Promise<Object>} - результат входа
     */
    async login(credentials: { email: string; password: string }): Promise<AuthResult> {
        const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
            email: credentials.email,
            password: credentials.password,
        });

        if (result.success) {
            return {
                success: true,
                data: result.data,
                error: null,
            };
        }

        if (result.status === HTTP_STATUS.UNAUTHORIZED) {
            return {
                success: false,
                error: 'Неверный email или пароль',
                fieldErrors: {
                    email: 'Неверный email',
                    password: 'Неверный пароль',
                },
                status: result.status,
            };
        }

        const translatedError = result.error ? (AuthErrorMap[result.error] || result.error) : 'Ошибка';
        return {
            success: false,
            error: translatedError,
            status: result.status,
        };
    },

    async logout(): Promise<void> {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    },

    async check(): Promise<{ isAuthenticated: boolean; user: any }> {
        const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {});

        return {
            isAuthenticated: result.success,
            user: result.success ? result.data : null,
        };
    },
};

export { AuthService };
