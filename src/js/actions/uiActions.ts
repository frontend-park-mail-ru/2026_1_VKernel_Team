import { store } from '@/core/store';
import { notifications } from '@modules/common/components/notification/notification';

export const uiActions = {
    navigateTo(path: string): void {
        if (store.getState().currentPage !== path) {
            store.setState({ currentPage: path });
        }
    },
    showLoading(show: boolean): void {
        store.setState({ isLoading: show });
        const loader = document.getElementById('global-loader');
        if (loader) loader.style.display = show ? 'flex' : 'none';
    },
    showError(message: string): void {
        notifications.error(message);
    },
    showSuccess(message: string): void {
        notifications.success(message);
    },
    showWarning(message: string): void {
        notifications.warning(message);
    },
    showInfo(message: string): void {
        notifications.info(message);
    },
    clearError(): void {
        if (store.getState().error !== null) {
            store.setState({ error: null });
        }
    },
};
