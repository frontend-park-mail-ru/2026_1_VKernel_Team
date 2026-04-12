import { eventBus } from '@/core/eventBus';
import { cartActions } from '@modules/cart/actions';
import { cartStore } from '@modules/cart/store';
import { CartButtonComponent } from '@modules/cart/components/cart-button/cart-button';
import { store } from '@/core/store';

const ADS_PAGE_RENDERED = 'page:adsRendered';

const handleAdsRendered = async (): Promise<void> => {
    if (!store.isAuthenticated) {
        CartButtonComponent.initAll();
        return;
    }

    const cartState = cartStore.getState();
    if (cartState.items.length === 0) {
        await cartActions.loadCart();
    }
    CartButtonComponent.initAll();
};

// Подписываемся на событие рендера страницы объявлений
eventBus.on(ADS_PAGE_RENDERED, handleAdsRendered);
