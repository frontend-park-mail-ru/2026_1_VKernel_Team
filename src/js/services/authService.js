const AuthService = {
    API_URL: 'http://212.233.96.172:8000/api/v1',
    
    async register(userData) {
        console.log('Попытка регистрации:', userData);
        
        try {
            // Swagger принимает только email и password
            const requestBody = {
                email: userData.email,
                password: userData.password
            };
            
            const response = await fetch(`${this.API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                credentials: 'include' // важно для куки
            });
            
            console.log('Статус ответа:', response.status);
            
            const data = await response.json();
            
            if (response.ok) {
                console.log('Регистрация успешна, user_id:', data.user_id);
                
                // После успешной регистрации бек автоматически входит
                // Можно сразу получить данные пользователя через отдельный запрос
                // или пока просто вернуть успех
                return {
                    success: true,
                    data: {
                        message: 'Регистрация успешна',
                        user_id: data.user_id
                    },
                    error: null
                };
            } else {
                // Обработка ошибок валидации (400)
                if (response.status === 400 || response.status === 401) {
                    // Формат ошибки: { "email": "...", "password": "..." }
                    const errorMessage = data.email || data.password || 'Ошибка валидации';
                    return {
                        success: false,
                        error: errorMessage,
                        fieldErrors: data // сохраняем для детальной валидации
                    };
                } else {
                    // Обычная ошибка (500)
                    return {
                        success: false,
                        error: data.error || 'Ошибка сервера'
                    };
                }
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
                credentials: 'include' // важно! токен в куке
            });
            
            console.log('Статус ответа:', response.status);
            
            const data = await response.json();
            
            if (response.ok) {
                console.log('Вход успешен');
                
                // Так как токен в куке, нам не нужно его сохранять в localStorage
                // Но можем сохранить информацию о пользователе, если нужно
                
                // TODO: сделать отдельный запрос /auth/me для получения данных пользователя
                // Пока сохраняем только email из запроса
                Storage.setUser({
                    email: credentials.email,
                    // username пока неизвестен
                });
                
                return {
                    success: true,
                    data: {
                        message: 'Вход выполнен успешно'
                    },
                    error: null
                };
            } else {
                // Обработка ошибок валидации (401)
                if (response.status === 401) {
                    // Формат: { "email": "...", "password": "..." }
                    const errorMessage = data.email || data.password || 'Неверный email или пароль';
                    return {
                        success: false,
                        error: errorMessage,
                        fieldErrors: data
                    };
                } else {
                    return {
                        success: false,
                        error: data.error || 'Ошибка сервера'
                    };
                }
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
                credentials: 'include'
            });
            
            if (response.ok) {
                console.log('Выход успешен');
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            // В любом случае чистим localStorage
            Storage.logout();
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
