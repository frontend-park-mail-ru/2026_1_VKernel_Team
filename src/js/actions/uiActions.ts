/**
 * UI действия
 * Управление интерфейсом: навигация, лоадеры, уведомления
 */

import { store } from '@/core/store';

export const uiActions = {
    navigateTo(path: string): void {
        if (store.getState().currentPage !== path) {
            store.setState({ currentPage: path });
        }
    },

    showLoading(show: boolean): void {
        if (store.getState().isLoading !== show) {
            store.setState({ isLoading: show });
        }
    },

    showError(message: string): void {
        console.error('UI Error:', message);
        // TODO: Добавить систему toast-уведомлений без store
    },

    clearError(): void {
        if (store.getState().error !== null) {
            store.setState({ error: null });
        }
    },

    showSuccess(message: string): void {
        console.log('UI Success:', message);
    },
};
