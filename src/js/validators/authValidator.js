const AuthValidator = {
    validateUsername(username) {
        if (!username) return false;
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        return username.length >= 3 && usernameRegex.test(username);
    },
    validateEmail(email) {
        if (!email) return false;
        const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
        return emailRegex.test(email.toLowerCase());
    },
    validatePassword(password) {
        if (!password || password.length < 8) return false;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        return hasLetter && hasDigit;
    },
    validateLogin(email, password) {
        const errors = [];
        
        if (!email || !this.validateEmail(email) || !password || !this.validatePassword(password)) {
            errors.push('Неверный email или пароль');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            generalError: errors.length > 0 ? 'Неверный email или пароль' : null
        };
    },
    validateRegister(username, email, password, confirmPassword) {
        const fieldErrors = {
            username: null,
            email: null,
            password: null,
            confirmPassword: null
        };
        
        if (!username) {
            fieldErrors.username = 'Имя пользователя обязательно';
        } else if (!this.validateUsername(username)) {
            fieldErrors.username = 'Имя должно содержать только латиницу, цифры и _, минимум 3 символа';
        }
        
        if (!email) {
            fieldErrors.email = 'Email обязателен';
        } else if (!this.validateEmail(email)) {
            fieldErrors.email = 'Некорректный email';
        }
        
        if (!password) {
            fieldErrors.password = 'Пароль обязателен';
        } else if (!this.validatePassword(password)) {
            fieldErrors.password = 'Пароль должен быть не менее 8 символов и содержать хотя бы одну букву и одну цифру';
        }
        
        if (password !== confirmPassword) {
            fieldErrors.confirmPassword = 'Пароли не совпадают';
        }
        
        const hasErrors = Object.values(fieldErrors).some(error => error !== null);
        return {
            isValid: !hasErrors,
            fieldErrors: fieldErrors,
            errors: Object.values(fieldErrors).filter(e => e !== null)
        };
    }
};