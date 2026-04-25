import { authService } from '@/services/authService';
import { store } from '@/core/store';
import { AuthValidator } from '@/validators/authValidator';
import type { AuthCredentials, RegisterData, ValidationResult } from '@/types';

export const authActions = {
    async login(credentials: AuthCredentials): Promise<ValidationResult> {
        const validation = AuthValidator.validateLogin(credentials.email, credentials.password);
        if (!validation.isValid) {
            return validation;
        }

        store.setState({ error: null });

        try {
            const result = await authService.login(credentials);

            if (result.success && result.data) {
                store.setState({
                    isAuthenticated: true,
                    user: result.data,
                });
                return { isValid: true };
            }

            return {
                isValid: false,
                error: result.error || 'Ошибка входа',
                fieldErrors: result.fieldErrors,
            };
        } catch (error) {
            return {
                isValid: false,
                error: 'Не удалось соединиться с сервером',
            };
        }
    },

    async register(data: RegisterData): Promise<ValidationResult> {
        const validation = AuthValidator.validateRegister(
            data.name,
            data.email,
            data.password,
            data.confirmPassword,
        );
        if (!validation.isValid) {
            return validation;
        }

        store.setState({ error: null });

        try {
            const result = await authService.register(data);

            if (result.success && result.data) {
                store.setState({
                    isAuthenticated: true,
                    user: result.data,
                });
                return { isValid: true };
            }

            return {
                isValid: false,
                error: result.error || 'Ошибка регистрации',
                fieldErrors: result.fieldErrors,
            };
        } catch (error) {
            return {
                isValid: false,
                error: 'Не удалось соединиться с сервером',
            };
        }
    },

    async logout(): Promise<void> {
        await authService.logout();
        store.setState({
            isAuthenticated: false,
            user: null,
        });
    },

    async checkAuth(): Promise<void> {
        const result = await authService.check();

        // При сетевой ошибке — доверяем localStorage, не трогаем state
        if (result.networkError) {
            return;
        }

        if (result.isAuthenticated && result.user) {
            store.setState({
                isAuthenticated: true,
                user: result.user,
            });
        } else {
            // Сервер ответил, но не авторизован — сбрасываем
            store.setState({
                isAuthenticated: false,
                user: null,
            });
        }
    },
};
