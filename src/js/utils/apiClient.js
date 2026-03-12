const API_URL = 'http://localhost:8000/api/v1';

const apiClient = {
    async request(endpoint, method = 'GET', body = null, customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        const config = {
            method,
            headers,
            credentials: 'include'
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const responseText = await response.text();

            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.warn('Ответ не в формате JSON', responseText);
                data = { message: responseText };
            }

            if (response.ok) {
                return { success: true, data };
            }

            return {
                success: false,
                error: data.message || data.error || 'Произошла неизвестная ошибка',
                data: data,
                status: response.status
            };

        } catch (error) {
            console.error('Ошибка сети:', error);
            return {
                success: false,
                error: 'Не удалось соединиться с сервером',
                status: 0
            };
        }
    },

    get(endpoint, headers) {
        return this.request(endpoint, 'GET', null, headers);
    },

    post(endpoint, body, headers) {
        return this.request(endpoint, 'POST', body, headers);
    },

    put(endpoint, body, headers) {
        return this.request(endpoint, 'PUT', body, headers);
    },

    delete(endpoint, headers) {
        return this.request(endpoint, 'DELETE', null, headers);
    }
};
