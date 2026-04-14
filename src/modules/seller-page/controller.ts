import { sellerPageActions } from '@modules/seller-page/actions';
import { sellerPageStore } from '@modules/seller-page/store';
import { store } from '@/core/store';
import { getTemplate } from '@modules/seller-page/pages/seller-page/seller-page';
import { CartButtonComponent } from '@modules/cart/components/cart-button/cart-button';
import { cartActions } from '@modules/cart/actions';
import { cartStore } from '@modules/cart/store';

export const SellerPageController = {
    async renderSellerPage(sellerId: string): Promise<void> {
        await sellerPageActions.loadSellerPage(sellerId);

        const app = document.getElementById('app');
        const template = getTemplate();
        if (!app || !template) return;

        const state = sellerPageStore.getState();

        if (state.error || !state.profile) {
            app.innerHTML =
                '<div class="seller-ads-empty" style="padding:80px 0">Продавец не найден</div>';
            return;
        }

        document.body.classList.remove('auth-page');

        const isOwner = store.isAuthenticated && store.user?.id === state.profile.id;
        const showCartButton = store.isAuthenticated && !isOwner;

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            seller: state.profile,
            activeAds: state.activeAds,
            closedAds: state.closedAds,
            activeAdsCount: state.activeAds.length,
            closedAdsCount: state.closedAds.length,
            showCartButton,
        });

        if (showCartButton) {
            if (cartStore.getState().items.length === 0) {
                await cartActions.loadCart();
            }
            CartButtonComponent.initAll();
        }

        this.attachEventListeners();
    },

    attachEventListeners(): void {
        const tabs = document.querySelectorAll('.seller-tab');
        const contents = document.querySelectorAll('.seller-tab-content');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = (tab as HTMLElement).dataset.tab;

                tabs.forEach((t) => t.classList.remove('seller-tab--active'));
                tab.classList.add('seller-tab--active');

                contents.forEach((c) => {
                    const content = c as HTMLElement;
                    if (content.dataset.tabContent === target) {
                        content.classList.remove('seller-tab-content--hidden');
                    } else {
                        content.classList.add('seller-tab-content--hidden');
                    }
                });
            });
        });
            
        document.querySelectorAll('.rec-card').forEach((card) => {
            card.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.closest('.rec-card-fav') || target.closest('.rec-card-cart')) {
                    return;
                }

                // Получаем ID объявления из data-id атрибута
                const adId = (card as HTMLElement).dataset.id;
                if (adId) {
                    // Используем navigateTo из AppController
                    import('@/controllers/AppController').then(({ AppController }) => {
                        AppController.navigateTo(`/ad/${adId}`);
                    });
                }
            });
        });
    },
};
