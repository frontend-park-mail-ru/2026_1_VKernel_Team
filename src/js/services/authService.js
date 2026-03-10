const AuthService = {
    API_URL: 'http://212.233.96.172:8000/api/v1',
    
    // Мок-база данных пользователей (keep this from your version)
    mockUsers: [
        {
            email: 'test@test.com',
            password: '12345678',
            user: {
                id: 1,
                username: 'Тестовый',
                email: 'test@test.com',
                createdAt: '2024-01-01'
            }
        }
    ],
    
    async register(userData) {
        console.log('Попытка регистрации:', userData); // Keep your log
        try {
            const response = await fetch(`${this.API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include'
            });
            console.log('Статус ответа:', response.status); // Keep your log
            
            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error('Ответ не в JSON:', e);
                return {
                    success: false,
                    error: 'Ошибка формата ответа от сервера'
                };
            }
            
            if (response.ok) {
                console.log('Регистрация успешна:', data); // Keep your log
                return {
                    success: true,
                    data: data,
                    error: null
                };
            } else {
                console.log('Ошибка регистрации:', data); // Keep your log
                return {
                    success: false,
                    error: data.error || data.message || 'Ошибка при регистрации'
                };
            }
        } catch (error) {
            console.error('Ошибка сети в register:', error);
            return {
                success: false,
                error: 'Не удалось соединиться с сервером. Проверьте, запущен ли бекенд.'
            };
        }
    },
    
    async login(credentials) {
        console.log('Попытка входа:', credentials.email); // Keep your log
        try {
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });
            
            console.log('Статус ответа:', response.status); // Keep your log
            
            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error('Ответ не в JSON:', e);
                return {
                    success: false,
                    error: 'Ошибка формата ответа от сервера'
                };
            }
            
            if (response.ok && data.token) {
                console.log('Вход успешен:', data.user);
                
                // Сохраняем токен и данные пользователя
                if (Storage && Storage.setToken) Storage.setToken(data.token);
                if (data.user && Storage && Storage.setUser) Storage.setUser(data.user);
                
                return {
                    success: true,
                    data: data,
                    error: null
                };
            } else {
                console.log('Ошибка входа:', data);
                return {
                    success: false,
                    error: data.error || data.message || 'Неверный email или пароль'
                };
            }
        } catch (error) {
            console.error('Ошибка сети в login:', error);
            return {
                success: false,
                error: 'Не удалось соединиться с сервером.'
            };
        }
    },
    
    async checkAuth() {
        if (!Storage || !Storage.getToken) return false;
        const token = Storage.getToken();
        if (!token) return false;
        
        try {
            const response = await fetch(`${this.API_URL}/auth/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.ok;
        } catch (error) {
            console.error('Ошибка проверки авторизации:', error);
            return false;
        }
    },
    
    async logout() {
        try {
            const token = Storage && Storage.getToken ? Storage.getToken() : null;
            if (token) {
                await fetch(`${this.API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            if (Storage && Storage.logout) Storage.logout();
        }
    }
};