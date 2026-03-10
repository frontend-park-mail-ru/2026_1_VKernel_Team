const AuthValidator = {
    validateName(name) {
        if (!name) return false;
        const nameRegex = /^[\p{L}\s'-]+$/u;
        return name.length >= 2 && nameRegex.test(name);
    },

    validateEmail(email) {
        if (!email) return false;
        const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
        return emailRegex.test(email.toLowerCase());
    },

    validatePasswordStrength(password) {
        if (!password) return { isValid: false, message: 'Пароль обязателен' };
        if (password.length < 8) return { isValid: false, message: 'Пароль должен быть не менее 8 символов' };
        
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasForbidden = /[^a-zA-Z0-9_]/.test(password);
        
        if (hasForbidden) return { isValid: false, message: 'Пароль может содержать только латинские буквы, цифры и нижнее подчёркивание' };
        if (!hasLetter && !hasDigit) return { isValid: false, message: 'Пароль должен содержать хотя бы одну букву и одну цифру' };
        if (!hasLetter) return { isValid: false, message: 'Пароль должен содержать хотя бы одну букву' };
        if (!hasDigit) return { isValid: false, message: 'Пароль должен содержать хотя бы одну цифру' };
        
        return { isValid: true };
    },

    validatePassword(password) {
        const strength = this.validatePasswordStrength(password);
        return strength.isValid;
    },

    validateLogin(email, password) {
        const errors = [];
        
        if (!email || !password) {
            errors.push('Заполните поля');
        } else if (!this.validateEmail(email) || !this.validatePassword(password)) {
            errors.push('Неверный email или пароль');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            generalError: errors.length > 0 ? errors[0] : null
        };
    },

    validateRegister(name, email, password, confirmPassword) {
        const fieldErrors = {
            name: null,
            email: null,
            password: null,
            confirmPassword: null
        };
        
        if (!name) {
            fieldErrors.name = 'Имя обязательно';
        } else if (!this.validateName(name)) {
            fieldErrors.name = 'Имя может содержать буквы, пробелы, апострофы и дефисы';
        }
        
        if (!email) {
            fieldErrors.email = 'Email обязателен';
        } else if (!this.validateEmail(email)) {
            fieldErrors.email = 'Некорректный email';
        }
        
        if (!password) {
            fieldErrors.password = 'Пароль обязателен';
        } else {
            const strength = this.validatePasswordStrength(password);
            if (!strength.isValid) {
                fieldErrors.password = strength.message;
            }
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

