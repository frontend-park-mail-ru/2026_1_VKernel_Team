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
        console.error('UI Error:', message);
    },
    showSuccess(message: string): void {
        console.log('UI Success:', message);
    },
    clearError(): void {
        if (store.getState().error !== null) {
            store.setState({ error: null });
        }
    },
};
