import { eventBus } from '@/core/eventBus';
import { cartActions } from './actions';
import { cartStore } from './store';
import { CartButton } from './cartButton';
import { store } from '@/core/store';

const ADS_PAGE_RENDERED = 'page:adsRendered';

const handleAdsRendered = async (): Promise<void> => {
    if (!store.isAuthenticated) {
        CartButton.initAll();
        return;
    }

    const cartState = cartStore.getState();
    if (cartState.items.length === 0) {
        await cartActions.loadCart();
    }
    CartButton.initAll();
};

// Подписываемся на событие рендера страницы объявлений
eventBus.on(ADS_PAGE_RENDERED, handleAdsRendered);
