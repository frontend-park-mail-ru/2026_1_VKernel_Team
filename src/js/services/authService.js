/**
 * Сервис для работы с авторизацией
 *
 * @module authService
 */

import { API_ENDPOINTS, apiClient } from "../api/apiClient.js";
import { Storage } from "../utils/storage.js";

const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400
};

// Словарь ошибок
const AuthErrorMap = {
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
    'name contains invalid characters': 'Имя содержит недопустимые символы'
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
    async register(userData) {
        const result = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
            name: userData.name || userData.username, // поддерживаем оба варианта
            email: userData.email,
            password: userData.password
        });

        if (result.success) {
            // Бэкенд при регистрации сразу логинит и возвращает данные пользователя
            return {
                success: true,
                data: result.data, // { user_id, email, name }
                error: null
            };
        }

        if (result.status === HTTP_STATUS.BAD_REQUEST && result.data) {
            const fieldErrors = {};
            if (result.data.email) {
                fieldErrors.email = AuthErrorMap[result.data.email] || result.data.email;
            }
            if (result.data.password) {
                fieldErrors.password = AuthErrorMap[result.data.password] || result.data.password;
            }
            if (result.data.name) {
                fieldErrors.name = AuthErrorMap[result.data.name] || result.data.name;
            }

            return {
                success: false,
                error: 'Ошибка в полях',
                fieldErrors: fieldErrors,
                status: result.status
            };
        }

        const translatedError = AuthErrorMap[result.error] || result.error;
        return {
            success: false,
            error: translatedError,
            fieldErrors: null,
            status: result.status
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
    async login(credentials) {
        const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
            email: credentials.email,
            password: credentials.password
        });

        if (result.success) {
            return {
                success: true,
                data: result.data,
                error: null
            };
        }

        if (result.status === HTTP_STATUS.UNAUTHORIZED) {
            return {
                success: false,
                error: 'Неверный email или пароль',
                fieldErrors: {
                    email: ' ',
                    password: ' '
                },
                status: result.status
            };
        }

        const translatedError = AuthErrorMap[result.error] || result.error;
        return {
            success: false,
            error: translatedError,
            fieldErrors: null,
            status: result.status
        };
    },

    /**
     * Выход из системы
     * Удаляет сессию на сервере и чистит localStorage
     * @async
     */
    async logout() {
        // Инвалидируем токен на сервере (кука удалится сервером)
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        // Навигация управляется через App.logout() → App.navigateTo('/')
    },

    /**
     * Проверяет авторизацию через единую ручку POST /auth/login.
     * Если в куках есть валидный токен — бэкенд вернёт данные пользователя.
     * Если нет — вернёт 401.
     */
    async check() {
        // Отправляем POST без тела: бэкенд прочитает куку и вернёт данные
        const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN);

        return {
            isAuthenticated: result.success,
            user: result.success ? result.data : null
        };
    }
};

export { AuthService };
