const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400
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
        const result = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
            name: userData.name || userData.username,
            email: userData.email,
            password: userData.password
        });

        if (!result.success) {
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
        const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
            email: credentials.email,
            password: credentials.password
        });

        if (!result.success) {
            if (result.status === HTTP_STATUS.UNAUTHORIZED) {
                const fieldErrors = {
                    email: ' ',
                    password: ' '
                };
                
                return {
                    success: false,
                    error: 'Неверный email или пароль',
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
        }

        console.log('Вход успешен, данные:', result.data);
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
        window.location.href = '/';
    },

    async check() {
        const result = await apiClient.get(API_ENDPOINTS.AUTH.CHECK);

        if (!result.success) {
            if (result.status === HTTP_STATUS.UNAUTHORIZED) {
                console.log('Пользователь не авторизован');
                return {
                    success: false,
                    isAuthenticated: false,
                    user: null
                };
            }
            console.error('Ошибка проверки авторизации:', result.error);
            return {
                success: false,
                isAuthenticated: false,
                user: null
            };
        }
        return {
            success: true,
            isAuthenticated: true,
            user: result.data 
        };
    },
    async getCurrentUser() {
        const result = await this.check();
        return {
            success: result.isAuthenticated,
            user: result.user
        };
    }
};

if (typeof window !== 'undefined') {
    window.AuthService = AuthService;
}
