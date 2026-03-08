const AuthService = {
    API_URL: '',
    async register(userData) {
        try {
            const response = await fetch(`${this.API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            return {
                success: response.ok,
                data: data,
                error: data.error
            };
        } catch (error) {
            return {
                success: false,
                error: 'Ошибка соединения с сервером'
            };
        }
    },
    async login(credentials) {
        try {
            const response = await fetch(`${this.API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (response.ok && data.token) {
                Storage.setToken(data.token);
                if (data.user) {
                    Storage.setUser(data.user);
                }
            }
            return {
                success: response.ok,
                data: data,
                error: data.error
            };
        } catch (error) {
            return {
                success: false,
                error: 'Ошибка соединения с сервером'
            };
        }
    }
};