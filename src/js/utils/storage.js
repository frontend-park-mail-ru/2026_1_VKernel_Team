/**
 * Модуль для работы с локальным хранилищем браузера (localStorage)
 * Здесь сохраняем данные пользователя и проверяем авторизацию
 * 
 * @module storage
 */

/**
 * Объект с методами для сохранения и получения данных
 * Использует localStorage для долговременного хранения
 */
const Storage = {
    // Сохраняем данные пользователя в localStorage
    // @param {Object} user - объект с данными пользователя
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Получаем данные пользователя из localStorage
    // @returns {Object|null} - объект пользователя или null, если данных нет
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    removeUser() {
        localStorage.removeItem('user');
    },

    /**
     * Проверяем, авторизован ли пользователь
     * Смотрим не в localStorage, а в куках (там хранится сессия)
     * @returns {boolean} - true если есть сессионная кука
     */ 
    isAuthenticated() {
        // Парсим все куки из document.cookie
        // document.cookie выглядит как "session_id=abc123; theme=dark"
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        
        // Разные серверы могут называть сессионную куку по-разному
        // Проверяем все возможные названия
        const sessionCookies = ['session_id', 'sessionid', 'connect.sid', 'token', 'auth_token'];
        
        // Если хотя бы одна из этих кук есть - пользователь авторизован
        return sessionCookies.some(cookieName => cookies[cookieName] !== undefined);
    },

    /**
     * Удаляет пользователя из localStorage
     */
    logout() {
        this.removeUser();
    }
};

export { Storage };
