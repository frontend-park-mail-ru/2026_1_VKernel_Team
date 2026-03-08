const Storage = {
    setToken(token) {
        localStorage.setItem('auth_token', token);
    },
    getToken() {
        return localStorage.getItem('auth_token');
    },
    removeToken() {
        localStorage.removeItem('auth_token');
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
        return !!this.getToken();
    },
    logout() {
        this.removeToken();
        this.removeUser();
    }
};