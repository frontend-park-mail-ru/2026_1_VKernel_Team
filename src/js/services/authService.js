// const AuthService = {
//     API_URL: '',
//     async register(userData) {
//         try {
//             const response = await fetch(`${this.API_URL}/api/register`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(userData)
//             });
//             const data = await response.json();
//             return {
//                 success: response.ok,
//                 data: data,
//                 error: data.error
//             };
//         } catch (error) {
//             return {
//                 success: false,
//                 error: 'Ошибка соединения с сервером'
//             };
//         }
//     },
//     async login(credentials) {
//         try {
//             const response = await fetch(`${this.API_URL}/api/login`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(credentials)
//             });
//             const data = await response.json();
//             if (response.ok && data.token) {
//                 Storage.setToken(data.token);
//                 if (data.user) {
//                     Storage.setUser(data.user);
//                 }
//             }
//             return {
//                 success: response.ok,
//                 data: data,
//                 error: data.error
//             };
//         } catch (error) {
//             return {
//                 success: false,
//                 error: 'Ошибка соединения с сервером'
//             };
//         }
//     }
// };

const AuthService = {
    API_URL: 'http://clover-go.ru:8000/api/v1',
    
    // Мок-база данных пользователей
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
        console.log('Попытка регистрации:', userData);
         
        const response =  await fetch(`${this.API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include',
        })
        console.log('Ответ от сервера:', response);
        
        try {
            // Проверяем, не занят ли email
            const existingUser = this.mockUsers.find(u => u.email === userData.email);
            
            if (existingUser) {
                console.log('Email уже занят');
                return {
                    success: false,
                    error: 'Пользователь с таким email уже существует'
                };
            }
            
            // Создаём нового пользователя
            const newUser = {
                id: this.mockUsers.length + 1,
                username: userData.username,
                email: userData.email,
                createdAt: new Date().toISOString()
            };
            
            // Сохраняем в мок-базу
            this.mockUsers.push({
                email: userData.email,
                password: userData.password,
                user: newUser
            });
            
            console.log('Регистрация успешна:', newUser);
            console.log('Все пользователи:', this.mockUsers);
            
            return {
                success: true,
                data: {
                    message: 'Регистрация успешна',
                    user: newUser
                },
                error: null
            };
            
        } catch (error) {
            console.error('Ошибка в register:', error);
            return {
                success: false,
                error: 'Ошибка при регистрации'
            };
        }
    },
    
    async login(credentials) {
        console.log('Попытка входа:', credentials.email);
        
        const response =  await fetch(`${this.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify(userData),
            credentials: 'include',
        })
        console.log('Ответ от сервера:', response);
        
        try {
            // Ищем пользователя в мок-данных
            console.log('Поиск в mockUsers:', this.mockUsers);
            
            const mockUser = this.mockUsers.find(
                u => u.email === credentials.email && u.password === credentials.password
            );
            
            if (mockUser) {
                // Создаём фейковый токен
                const token = 'mock-jwt-token-' + Date.now() + '-' + Math.random().toString(36);
                
                // Сохраняем в localStorage
                Storage.setToken(token);
                Storage.setUser(mockUser.user);
                
                console.log('Вход успешен:', mockUser.user);
                
                return {
                    success: true,
                    data: {
                        token: token,
                        user: mockUser.user
                    },
                    error: null
                };
            }
            
            console.log('Неверные учетные данные');
            return {
                success: false,
                error: 'Неверный email или пароль'
            };
            
        } catch (error) {
            console.error('Ошибка в login:', error);
            return {
                success: false,
                error: 'Ошибка при входе'
            };
        }
    }
};
