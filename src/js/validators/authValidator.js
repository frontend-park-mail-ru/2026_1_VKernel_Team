// const AuthValidator = {
//     validateEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     },
//     validatePassword(password) {
//         return password && password.length >= 6;
//     },
//     validateUsername(username) {
//         return username && username.length >= 3;
//     },
//     validateLogin(email, password) {
//         const errors = [];
//         if (!email) errors.push('Email обязателен');
//         else if (!this.validateEmail(email)) errors.push('Некорректный email');
//         if (!password) errors.push('Пароль обязателен');
//         else if (!this.validatePassword(password)) errors.push('Пароль должен быть не менее 8 символов');
//         return {
//             isValid: errors.length === 0,
//             errors
//         };
//     },
//     validateRegister(username, email, password, confirmPassword) {
//         const errors = [];
//         if (!username) errors.push('Имя пользователя обязательно');
//         else if (!this.validateUsername(username)) errors.push('Имя должно быть не менее 3 символов');
//         if (!email) errors.push('Email обязателен');
//         else if (!this.validateEmail(email)) errors.push('Некорректный email');
//         if (!password) errors.push('Пароль обязателен');
//         else if (!this.validatePassword(password)) errors.push('Пароль должен быть не менее 8 символов');
//         if (password !== confirmPassword) errors.push('Пароли не совпадают');
//         return {
//             isValid: errors.length === 0,
//             errors
//         };
//     }
// };

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
        } else if (password.length < 8) {
            fieldErrors.password = 'Пароль должен быть не менее 8 символов';
        } else {
            const hasLetter = /[a-zA-Z]/.test(password);
            const hasDigit = /[0-9]/.test(password);
            
            if (!hasLetter && !hasDigit) {
                fieldErrors.password = 'Пароль должен содержать хотя бы одну букву и одну цифру';
            } else if (!hasLetter) {
                fieldErrors.password = 'Пароль должен содержать хотя бы одну букву';
            } else if (!hasDigit) {
                fieldErrors.password = 'Пароль должен содержать хотя бы одну цифру';
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
    },
    validatePasswordStrength(password) {
        const result = {
            isValid: false,
            errors: []
        };
        if (!password) {
            result.errors.push('Пароль обязателен');
            return result;
        }
        if (password.length < 8) {
            result.errors.push('Минимум 8 символов');
        }
        if (!/[a-zA-Z]/.test(password)) {
            result.errors.push('Хотя бы одна буква');
        }
        if (!/[0-9]/.test(password)) {
            result.errors.push('Хотя бы одна цифра');
        }
        result.isValid = result.errors.length === 0;
        return result;
    }
};

