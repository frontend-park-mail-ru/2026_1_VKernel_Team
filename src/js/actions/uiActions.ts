/**
 * UI действия
 * Управление интерфейсом: навигация, лоадеры, уведомления
 */

import { store } from '@/core/store';

export const uiActions = {
    navigateTo(path: string): void {
        store.setState({ currentPage: path });
    },

    showLoading(show: boolean): void {
        store.setState({ isLoading: show });
    },

    showError(message: string): void {
        store.setState({ error: message });
        console.error('UI Error:', message);
    },

    clearError(): void {
        store.setState({ error: null });
    },

    showSuccess(message: string): void {
        console.log('UI Success:', message);
    },
};
