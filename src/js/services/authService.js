const AuthService = {
    API_URL: 'http://clover-go.ru:8000/api/v1',
    
    async register(userData) {
    console.log('Попытка регистрации:', userData);
    
    try {
        const requestBody = {
            email: userData.email,
            password: userData.password
        };
        
        console.log('Отправляю тело:', JSON.stringify(requestBody)); // Добавь эту строку
        
        const response = await fetch(`${this.API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });
        
        console.log('Статус ответа:', response.status);
        
        // Важно! Сначала проверь текст ответа
        const responseText = await response.text();
        console.log('Текст ответа:', responseText);
        
        // Пытаемся распарсить JSON
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
            
            return {
                success: false,
                error: data.error || 'Ошибка при регистрации',
                fieldErrors: data,
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
            
            // Сохраняем ВСЁ, что прислал сервер
            if (data.token) {
                Storage.setToken(data.token);
            }
            
            // Если сервер прислал пользователя
            if (data.user) {
                Storage.setUser(data.user);
            } else {
                // Если нет - сохраняем хотя бы email
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
        // В любом случае чистим localStorage
        Storage.logout();
        // Перенаправляем на главную
        window.location.href = '/';
    }
    },
    
    // Метод для получения данных текущего пользователя (если есть эндпоинт)
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
