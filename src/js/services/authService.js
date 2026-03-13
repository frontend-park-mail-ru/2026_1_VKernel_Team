import { API_ENDPOINTS, apiClient } from "../api/apiClient";
import { Storage } from "../utils/storage";

const HTTP_STATUS = {
    UNAUTHORIZED: 401
};

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

const AuthService = {
    async register(userData) {
        console.log('Попытка регистрации:', userData);

        const result = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
            name: userData.name || userData.username,
            email: userData.email,
            password: userData.password
        });

        if (!result.success) {
            console.log('Ошибка регистрации. Статус:', result.status, 'Ошибка:', result.error);

            // Обработка ошибок по Swagger
            const fieldErrors = {};
            const errorMsg = result.error.toLowerCase();
            const translatedError = AuthErrorMap[result.error] || result.error;

            if (errorMsg.includes('email') || errorMsg.includes('exists') || errorMsg.includes('format')) {
                fieldErrors.email = translatedError;
            } else if (errorMsg.includes('password') || errorMsg.includes('short') || errorMsg.includes('digit') || errorMsg.includes('letter') || errorMsg.includes('special')) {
                fieldErrors.password = translatedError;
            } else if (errorMsg.includes('name')) {
                fieldErrors.name = translatedError;
            }
            if (result.data) {
                if (result.data.email) fieldErrors.email = AuthErrorMap[result.data.email] || result.data.email;
                if (result.data.password) fieldErrors.password = AuthErrorMap[result.data.password] || result.data.password;
            }

            return {
                success: false,
                error: Object.keys(fieldErrors).length ? 'Ошибка в полях' : translatedError,
                fieldErrors: fieldErrors,
                status: result.status
            };
        }

        console.log('Регистрация успешна, user_id:', result.data.user_id);
        
        if (result.data.user) {
            Storage.setUser(result.data.user);
        }

        return {
            success: true,
            data: {
                message: 'Регистрация успешна',
                user_id: result.data.user_id
            },
            error: null
        };
    },

    async login(credentials) {
        console.log('Попытка входа:', credentials.email);

        const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
            email: credentials.email,
            password: credentials.password
        });

        if (!result.success) {
            console.log('Ошибка входа:', result.error);
            const translatedError = AuthErrorMap[result.error] || result.error;

            return {
                success: false,
                error: translatedError,
                fieldErrors: null,
                status: result.status
            };
        }

        console.log('Вход успешен, данные:', result.data);
        
        if (result.data.user) {
            Storage.setUser(result.data.user);
        } else {
            Storage.setUser({ email: credentials.email });
        }

        return {
            success: true,
            data: result.data,
            error: null
        };
    },

    async logout() {
        const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

        if (result.success) {
            console.log('Выход успешен');
        } else if (result.status === HTTP_STATUS.UNAUTHORIZED) {
            console.log('Токен не валиден, но всё равно выходим');
        } else {
            console.error('Ошибка при выходе:', result.error);
        }

        Storage.logout();
        
        // Здесь должен быть вызов роутера для навигации
        // Пока оставляем window.location, но в идеале использовать роутер
        window.location.href = '/';
    },

    async getCurrentUser() {
        const result = await apiClient.get(API_ENDPOINTS.AUTH.ME);

        if (!result.success) {
            console.error('Ошибка получения пользователя:', result.error);
            return {
                success: false
            };
        }

        return {
            success: true,
            user: result.data
        };
    }
};

export { AuthService };
