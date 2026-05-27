import { store } from '@/core/store';

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
        const toast = document.createElement('div');
        toast.className = 'toast toast-error';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },
    showSuccess(message: string): void {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },
    showInfo(message: string): void {
        const toast = document.createElement('div');
        toast.className = 'toast toast-info';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    },
    clearError(): void {
        if (store.getState().error !== null) {
            store.setState({ error: null });
        }
    },
};
