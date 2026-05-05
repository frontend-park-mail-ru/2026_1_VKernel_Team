import { apiClient } from '@/api/apiClient';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';
import { store } from '@/core/store';
import { PROFILE_CONFIG } from '@modules/profile/config';

export const FavoriteCard = {
    _isInitialized: false,
    _handler: null as EventListener | null,
    _processingIds: new Set<number>(),

    init(): void {
        const container = document.getElementById('tabContent');
        if (!container) return;

        if (this._isInitialized && this._handler) {
            container.removeEventListener('click', this._handler);
        }

        this._handler = this.handleCardClick.bind(this) as EventListener;
        container.addEventListener('click', this._handler);
        this._isInitialized = true;
    },
    async handleCardClick(e: Event): Promise<void> {
        const target = e.target as HTMLElement;
        const favBtn = target.closest('[data-remove-fav-id]') as HTMLButtonElement | null;
        if (favBtn) {
            await this.handleFavoriteClick(e, favBtn);
            return;
        }
        this.handleNavigationClick(target);
    },
    async handleFavoriteClick(e: Event, favBtn: HTMLButtonElement): Promise<void> {
        e.preventDefault();
        e.stopPropagation();

        const adId = Number(favBtn.getAttribute('data-remove-fav-id'));
        if (!adId || this._processingIds.has(adId)) return;

        this._processingIds.add(adId);
        favBtn.disabled = true;
        favBtn.style.opacity = '0.5';

        try {
            const result = await apiClient.delete(PROFILE_CONFIG.API.REMOVE_FAVORITE(adId));
            if (!result.success) {
                uiActions.showError(result.error || 'Ошибка удаления');
                favBtn.disabled = false;
                favBtn.style.opacity = '1';
                return;
            }

            uiActions.showSuccess('Удалено из избранного');

            const newFavorites = new Set(store.favoriteIds);
            newFavorites.delete(adId);
            store.setState({ favoriteIds: newFavorites });

            const card = favBtn.closest('.rec-card') as HTMLElement | null;
            if (!card) return;

            card.style.opacity = '0';
            setTimeout(() => {
                eventBus.emit('profile:favorite-removed', adId);
            }, 300);
        } catch (error) {
            console.error('Error removing favorite:', error);
            uiActions.showError('Не удалось удалить из избранного');
            favBtn.disabled = false;
            favBtn.style.opacity = '1';
        } finally {
            this._processingIds.delete(adId);
        }
    },
    handleNavigationClick(target: HTMLElement): void {
        const card = target.closest('.rec-card');
        const cartBtn = target.closest('.rec-card-cart');
        if (!card || cartBtn) return;

        const adId = card.getAttribute('data-id');
        if (!adId) return;
        eventBus.emit('app:navigate', `/ad/${adId}`);
    },
};
