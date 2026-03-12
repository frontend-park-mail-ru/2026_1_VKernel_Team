const Storage = {
    setToken(token) {
        localStorage.setItem('token', token);
    },
    getToken() {
        return localStorage.getItem('token');
    },
    removeToken() {
        localStorage.removeItem('token');
    },
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
        const hasTokenCookie = document.cookie.includes('session_id') || document.cookie.includes('token');
        return hasTokenCookie;
    },
    logout() {
        this.removeToken();
        this.removeUser();
    }
};

