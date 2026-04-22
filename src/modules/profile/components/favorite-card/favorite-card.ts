import { apiClient } from '@/api/apiClient';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';
import { store } from '@/core/store';
import { PROFILE_CONFIG } from '@modules/profile/config';

export const FavoriteCard = {
    _isInitialized: false,
    _handler: null as EventListener | null,
    _processingIds: new Set<number>(), // Хранилище ID, которые прямо сейчас удаляются

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

        // 1. Обработка клика по сердечку (Удаление из избранного)
        const favBtn = target.closest('[data-remove-fav-id]') as HTMLButtonElement | null;
        if (favBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const adId = Number(favBtn.getAttribute('data-remove-fav-id'));
            
            // Если ID не найден или этот товар УЖЕ в процессе удаления — игнорируем клик
            if (!adId || this._processingIds.has(adId)) return;

            // Блокируем клики для этого товара
            this._processingIds.add(adId);
            favBtn.disabled = true;
            favBtn.style.opacity = '0.5'; // Визуально делаем сердечко тусклым

            try {
                const result = await apiClient.delete(PROFILE_CONFIG.API.REMOVE_FAVORITE(adId));
                
                if (result.success) {
                    uiActions.showSuccess('Удалено из избранного');
                    
                    // Обновляем глобальный стор, чтобы главная страница тоже "забыла" лайк
                    const newFavorites = new Set(store.favoriteIds);
                    newFavorites.delete(adId);
                    store.setState({ favoriteIds: newFavorites });
                    
                    // Плавно скрываем карточку
                    const card = favBtn.closest('.rec-card');
                    if (card) {
                        (card as HTMLElement).style.opacity = '0';
                        setTimeout(() => {
                            // Сообщаем профилю, что пора убрать карточку навсегда
                            eventBus.emit('profile:favorite-removed', adId);
                        }, 300);
                    }
                } else {
                    uiActions.showError(result.error || 'Ошибка удаления');
                    favBtn.disabled = false;
                    favBtn.style.opacity = '1';
                }
            } catch (error) {
                console.error('Error removing favorite:', error);
                uiActions.showError('Не удалось удалить из избранного');
                favBtn.disabled = false;
                favBtn.style.opacity = '1';
            } finally {
                // Снимаем блокировку, когда запрос полностью завершен
                this._processingIds.delete(adId);
            }
            return;
        }

        // 2. Обработка клика по самой карточке (Переход на объявление)
        const card = target.closest('.rec-card');
        if (card && !target.closest('.rec-card-cart')) {
            const adId = card.getAttribute('data-id');
            if (adId) {
                window.dispatchEvent(new CustomEvent('app:navigate', { 
                    detail: { path: `/ad/${adId}` } 
                }));
            }
        }
    }
};
