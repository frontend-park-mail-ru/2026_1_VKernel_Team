import { store } from '@/core/store';

export const uiActions = {
    showLoading: (show: boolean) => {
        store.setState({ isLoading: show });
    },

    showError: (message: string) => {
        store.setState({ error: message });
        const toast = document.createElement('div');
        toast.className = 'toast toast-error';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    showSuccess: (message: string) => {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    navigateTo: (path: string) => {
        store.setState({ currentPage: path });
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    },
};
