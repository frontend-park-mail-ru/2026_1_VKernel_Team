const Storage = {
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    removeUser() {
        localStorage.removeItem('user');
    },
    isAuthenticated() {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        
        // Проверяем возможные названия сессионных кук
        const sessionCookies = ['session_id', 'sessionid', 'connect.sid', 'token', 'auth_token'];
        return sessionCookies.some(cookieName => cookies[cookieName] !== undefined);
    },
    logout() {
        this.removeUser();
    }
};
if (typeof window !== 'undefined') {
    window.Storage = Storage;
}
