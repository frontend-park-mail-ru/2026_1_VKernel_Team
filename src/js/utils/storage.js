const Storage = {
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    },
    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Ошибка чтения из localStorage:', e);
            return null;
        }
    },
    removeItem(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    },
    setUserPreferences(prefs) {
        this.setItem('user_preferences', prefs);
    },
    getUserPreferences() {
        return this.getItem('user_preferences') || {};
    },
    setUser: undefined,
    getUser: undefined,
    removeUser: undefined,
    isAuthenticated: undefined,  
    logout: undefined  
};


