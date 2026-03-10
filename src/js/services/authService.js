const AuthService = {
    API_URL: 'http://clover-go.ru:8000/api/v1',
    
    async register(userData) {
    console.log('Попытка регистрации:', userData);
    
    try {
        const requestBody = {
            email: userData.email,
            password: userData.password
        };
        
        console.log('Отправляю тело:', JSON.stringify(requestBody));
        
        const response = await fetch(`${this.API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });
        
        console.log('Статус ответа:', response.status);
        
        const responseText = await response.text();
        console.log('Текст ответа:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.log('Ответ не в JSON, это текст:', responseText);
            data = { error: responseText };
        }
        
        if (response.ok) {
            console.log('Регистрация успешна, user_id:', data.user_id);
            return {
                success: true,
                data: {
                    message: 'Регистрация успешна',
                    user_id: data.user_id
                },
                error: null
            };
        } else {
            console.log('Ошибка регистрации. Статус:', response.status);
            console.log('Тело ответа:', data);
            
            const fieldErrors = {};
            
            if (data.error) {
                if (data.error.includes('already exists') || data.error.includes('exists')) {
                    fieldErrors.email = 'Этот email уже занят';
                } else {
                    fieldErrors.general = data.error;
                }
            }
            
            if (data.email) {
                if (data.email.includes('already exists') || data.email.includes('exists')) {
                    fieldErrors.email = 'Этот email уже занят';
                } else if (data.email.includes('format')) {
                    fieldErrors.email = 'Некорректный формат email';
                } else {
                    fieldErrors.email = data.email;
                }
            }
            
            if (data.password) {
    const pwd = data.password.toLowerCase();
    
    if (pwd.includes('forbidden') || pwd.includes('characters') || pwd.includes('символ')) {
        fieldErrors.password = 'Пароль может содержать только латинские буквы и цифры';
    } else if (pwd.includes('special') || pwd.includes('спец')) {
        fieldErrors.password = 'Пароль не должен содержать специальные символы';
    } else if (pwd.includes('digit') || pwd.includes('цифр')) {
        fieldErrors.password = 'Пароль должен содержать хотя бы одну цифру';
    } else if (pwd.includes('letter') || pwd.includes('букв')) {
        fieldErrors.password = 'Пароль должен содержать хотя бы одну букву';
    } else if (pwd.includes('short') || pwd.includes('корот')) {
        fieldErrors.password = 'Пароль должен быть не менее 8 символов';
    } else if (pwd.includes('одну букву и одну цифру')) {
        fieldErrors.password = 'Пароль должен содержать хотя бы одну букву и одну цифру';
    } else {
        fieldErrors.password = data.password;
    }
}
            
            return {
                success: false,
                error: data.error || 'Ошибка при регистрации',
                fieldErrors: fieldErrors,
                status: response.status
            };
        }
        
    } catch (error) {
        console.error('Ошибка сети:', error);
        return {
            success: false,
            error: 'Не удалось соединиться с сервером'
        };
    }
    },
    
   async login(credentials) {
    console.log('Попытка входа:', credentials.email);
    
    try {
        const response = await fetch(`${this.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            }),
            credentials: 'include'
        });
        
        console.log('Статус ответа:', response.status);
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('Вход успешен, данные:', data);
            
            if (data.token) {
                Storage.setToken(data.token);
            }
            
            if (data.user) {
                Storage.setUser(data.user);
            } else {
                Storage.setUser({ email: credentials.email });
            }
            
            return {
                success: true,
                data: data,
                error: null
            };
        } else {
            console.log('Ошибка входа:', data);
            return {
                success: false,
                error: data.error || data.message || 'Неверный email или пароль',
                fieldErrors: data.email || data.password ? data : null
            };
        }
        
    } catch (error) {
        console.error('Ошибка сети:', error);
        return {
            success: false,
            error: 'Не удалось соединиться с сервером'
        };
    }
    },
    
    async logout() {
    try {
        const response = await fetch(`${this.API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            console.log('Выход успешен');
        } else if (response.status === 401) {
            console.log('Токен не валиден, но всё равно выходим');
        }
    } catch (error) {
        console.error('Ошибка при выходе:', error);
    } finally {
        Storage.logout();
        window.location.href = '/';
    }
    },
    
    async getCurrentUser() {
        try {
            const response = await fetch(`${this.API_URL}/auth/me`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    user: data
                };
            }
            return {
                success: false
            };
        } catch (error) {
            console.error('Ошибка получения пользователя:', error);
            return {
                success: false
            };
        }
    }
};

