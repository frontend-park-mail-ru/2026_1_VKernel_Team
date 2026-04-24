/**
 * Сервис для работы с авторизацией
 * @module authService
 */
import { API_ENDPOINTS, apiClient } from '@/api/apiClient';
import { storage } from '@/utils/storage';

const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
};

type AuthErrorMapType = {
    [key: string]: string;
};

const AuthErrorMap: AuthErrorMapType = {
    // Ошибки, которые могут вернуться как глобальные (не привязанные к полю)
    'invalid email format': 'Некорректный формат email', // ErrInvalidEmailFormat
    'wrong email or password': 'Неверный email или пароль', // ErrInvalidCredentials
    'user not found': 'Пользователь не найден',
    'user already exists': 'Этот email уже занят',
    'internal error': 'Внутренняя ошибка сервера',

    // Ошибки для поля password (могут приходить в поле 'password')
    'password must be at least 8 characters long': 'Пароль должен быть не менее 8 символов', // ErrPasswordTooShort
    'password must contain at least one digit': 'Пароль должен содержать хотя бы одну цифру', // ErrPasswordRequiresDigit
    'password must contain at least one latin letter':
        'Пароль должен содержать хотя бы одну латинскую букву', // ErrPasswordRequiresLetter

    // Ошибки для поля name
    'name cannot be empty': 'Имя не может быть пустым', // ErrNameEmpty
    'name must be at least 3 characters long': 'Имя должно быть не менее 3 символов', // ErrNameTooShort
    'name must be no more than 50 characters long': 'Имя должно быть не более 50 символов', // ErrNameTooLong
    'name contains invalid characters': 'Имя содержит недопустимые символы', // ErrNameInvalid
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
const authService = {
    /**
     * Регистрация нового пользователя
     */
    async register(userData: UserData): Promise<AuthResult> {
        const result = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
            name: userData.name || userData.username,
            email: userData.email,
            password: userData.password,
        });

        if (result.success) {
            // ИСПРАВЛЕНИЕ: Сохраняем токен, если бэкенд сразу авторизует после регистрации
            const token = result.data?.token || result.data?.access_token;
            if (token) {
                storage.setToken(token);
            }

            return {
                success: true,
                data: result.data,
                error: null,
            };
        }

        if (result.status === HTTP_STATUS.BAD_REQUEST && result.data) {
            const fieldErrors: Record<string, string> = {};
            const data = result.data as Record<string, string>;

            // Глобальная ошибка (например, "user already exists")
            if (data.error) {
                const translated = AuthErrorMap[data.error] || data.error;
                return {
                    success: false,
                    error: translated,
                    fieldErrors: { email: translated },
                    status: result.status,
                };
            }

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

        const translatedError = result.error
            ? AuthErrorMap[result.error] || result.error
            : 'Ошибка';
        return {
            success: false,
            error: translatedError,
            status: result.status,
        };
    },

    /**
     * Вход в систему
     */
    async login(credentials: { email: string; password: string }): Promise<AuthResult> {
        const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
            email: credentials.email,
            password: credentials.password,
        });

        if (result.success) {
            // ИСПРАВЛЕНИЕ: Сохраняем токен в localStorage
            const token = result.data?.token || result.data?.access_token;
            if (token) {
                storage.setToken(token);
            }

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

        const translatedError = result.error
            ? AuthErrorMap[result.error] || result.error
            : 'Ошибка';
        return {
            success: false,
            error: translatedError,
            status: result.status,
        };
    },

    async logout(): Promise<void> {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
        // ИСПРАВЛЕНИЕ: Удаляем токен из хранилища при выходе
        storage.removeToken();
    },

    async check(): Promise<{ isAuthenticated: boolean; user: any; networkError?: boolean }> {
        const result = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);

        // Сетевая ошибка или серверная ошибка (502 от прокси, 5xx) —
        // не можем определить авторизацию, сохраняем текущее состояние
        if (result.status === 0 || (result.status && result.status >= 500)) {
            return { isAuthenticated: false, user: null, networkError: true };
        }

        return {
            isAuthenticated: result.success,
            user: result.success ? result.data : null,
        };
    },
};

export { authService };
