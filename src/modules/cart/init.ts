import { eventBus } from '@/core/eventBus';
import { cartActions } from '@modules/cart/actions';
import { cartStore } from '@modules/cart/store';
import { CartButtonComponent } from '@modules/cart/components/cart-button/cart-button';
import { store } from '@/core/store';
import { networkStatus } from '@modules/common/offline/network/networkStatus';

const ADS_PAGE_RENDERED = 'page:adsRendered';

const handleAdsRendered = async (): Promise<void> => {
    if (!store.isAuthenticated) {
        CartButtonComponent.initAll();
        return;
    }

    await cartActions.loadFromCache();
    CartButtonComponent.initAll();

    if (networkStatus.isOnline) {
        await cartActions.loadCart();
    }
};

eventBus.on(ADS_PAGE_RENDERED, handleAdsRendered);
