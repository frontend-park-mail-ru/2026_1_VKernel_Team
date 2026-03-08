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
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    validatePassword(password) {
        return password && password.length >= 8;
    },
    validateUsername(username) {
        return username && username.length >= 3;
    },
    
    // Для логина — оставляем общую ошибку
    validateLogin(email, password) {
        const errors = [];
        
        if (!email || !this.validateEmail(email) || !password || !this.validatePassword(password)) {
            errors.push('Неверный email или пароль');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            // Добавляем поле для общей ошибки
            generalError: errors.length > 0 ? 'Неверный email или пароль' : null
        };
    },
    
    // Для регистрации — ошибки по полям
    validateRegister(username, email, password, confirmPassword) {
        const fieldErrors = {
            username: null,
            email: null,
            password: null,
            confirmPassword: null
        };
        
        // Проверка username
        if (!username) {
            fieldErrors.username = 'Имя пользователя обязательно';
        } else if (!this.validateUsername(username)) {
            fieldErrors.username = 'Имя должно содержать не менее 3 символов';
        }
        
        // Проверка email
        if (!email) {
            fieldErrors.email = 'Email обязателен';
        } else if (!this.validateEmail(email)) {
            fieldErrors.email = 'Некорректный email';
        }
        
        // Проверка password
        if (!password) {
            fieldErrors.password = 'Пароль обязателен';
        } else if (!this.validatePassword(password)) {
            fieldErrors.password = 'Пароль должен быть не менее 8 символов';
        }
        
        // Проверка confirmPassword
        if (password !== confirmPassword) {
            fieldErrors.confirmPassword = 'Пароли не совпадают';
        }
        
        // Есть ли хоть одна ошибка?
        const hasErrors = Object.values(fieldErrors).some(error => error !== null);
        
        return {
            isValid: !hasErrors,
            fieldErrors: fieldErrors,
            // Для совместимости с существующим кодом
            errors: Object.values(fieldErrors).filter(e => e !== null)
        };
    }
};