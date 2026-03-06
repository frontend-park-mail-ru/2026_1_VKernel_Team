const AuthValidator = {
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    validatePassword(password) {
        return password && password.length >= 6;
    },
    validateUsername(username) {
        return username && username.length >= 3;
    },
    validateLogin(email, password) {
        const errors = [];
        if (!email) errors.push('Email обязателен');
        else if (!this.validateEmail(email)) errors.push('Некорректный email');
        if (!password) errors.push('Пароль обязателен');
        else if (!this.validatePassword(password)) errors.push('Пароль должен быть не менее 6 символов');
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    validateRegister(username, email, password, confirmPassword) {
        const errors = [];
        if (!username) errors.push('Имя пользователя обязательно');
        else if (!this.validateUsername(username)) errors.push('Имя должно быть не менее 3 символов');
        if (!email) errors.push('Email обязателен');
        else if (!this.validateEmail(email)) errors.push('Некорректный email');
        if (!password) errors.push('Пароль обязателен');
        else if (!this.validatePassword(password)) errors.push('Пароль должен быть не менее 6 символов');
        if (password !== confirmPassword) errors.push('Пароли не совпадают');
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};