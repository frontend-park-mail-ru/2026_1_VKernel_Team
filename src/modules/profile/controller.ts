import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileService } from '@modules/profile/service';
import { eventBus } from '@/core/eventBus';
import type { HandlebarsTemplateFunction } from '@/types';
import type { ProfileTab, UserProfile } from '@modules/profile/types';
import '@modules/profile/pages/profile/profile.scss';
import profileContentTpl from '@modules/profile/components/profile-content/profile-content.hbs';
import profileSidebarTpl from '@modules/profile/components/profile-sidebar/profile-sidebar.hbs';
import { ProfileAvatar } from '@modules/profile/components/profile-avatar/profile-avatar';
import { ProfileSidebar } from '@modules/profile/components/profile-sidebar/profile-sidebar';
import { ProfileContent } from '@modules/profile/components/profile-content/profile-content';
import { EditNameModal } from '@modules/profile/components/edit-name-modal/edit-name-modal';
import { CloseAdModal } from '@modules/profile/components/close-ad-modal/close-ad-modal';
import { FavoriteCard } from '@modules/profile/components/favorite-card/favorite-card';
import { TopupModal } from '@modules/wallet/components/topup-modal/topup-modal';
import { WalletTab } from '@modules/wallet/components/wallet-tab/wallet-tab';
import { PromoHistoryTab } from '@modules/promotion/components/history-tab/history-tab';
import { promotionService } from '@modules/promotion/service';
import type { ActivePromotion } from '@modules/promotion/types';
import { walletStore } from '@modules/wallet/store';
import { walletService } from '@modules/wallet/service';
import { PROFILE_CONFIG } from '@modules/profile/config';
import { MyReviewsPage } from '@modules/reviews/pages/my-reviews/my-reviews';

import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import { purchasesStore } from '@modules/profile/purchases-store';
import { cartService } from '@modules/cart/service';
import { cartStore } from '@modules/cart/store';
import { CartButtonComponent } from '@modules/cart/components/cart-button/cart-button';
import type { PurchaseItem } from '@modules/profile/purchases-store';
import { unreadStore, UNREAD_CHANGED_EVENT } from '@modules/chat/unread-store';

const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';

interface UserAd {
    id: number;
    title: string;
    price: number;
    description?: string;
    photos?: string[];
    views_count?: number;
    created_at?: string;
    location?: string;
    status?: string;
    [key: string]: unknown;
}

function formatAdImageUrl(imagePath: string): string {
    if (!imagePath) return DEFAULT_AD_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${CONFIG.API.BASE_URL}${normalized}`;
}

function formatAdCard(ad: UserAd) {
    const imageUrl =
        ad.photos && ad.photos.length > 0 && ad.photos[0]?.trim()
            ? formatAdImageUrl(ad.photos[0].trim())
            : DEFAULT_AD_IMAGE;

    const formattedPrice = ad.price === 0 ? 'Бесплатно' : `${ad.price.toLocaleString('ru-RU')} ₽`;

    return {
        ...ad,
        formattedPrice,
        image: imageUrl,
        views: ad.views_count || 0,
        location: ad.location || 'Москва',
        createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        shortDescription: ad.description
            ? ad.description.length > 100
                ? ad.description.slice(0, 100) + '…'
                : ad.description
            : '',
    };
}

function formatTimeLeftFromMs(ms: number): string {
    if (ms <= 0) return 'завершено';
    const totalHours = Math.floor(ms / 3600000);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const parts: string[] = [];
    if (days > 0) {
        const word = days === 1 ? 'день' : days < 5 ? 'дня' : 'дней';
        parts.push(`${days} ${word}`);
    }
    if (hours > 0) {
        const word = hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов';
        parts.push(`${hours} ${word}`);
    }
    if (parts.length === 0) parts.push('менее часа');
    return `ещё ${parts.join(' ')}`;
}

export const ProfileController = {
    currentTab: 'ads' as ProfileTab,
    templates: {} as Record<string, HandlebarsTemplateFunction>,
    isInitialized: false,
    _unsubscribers: [] as Array<() => void>,

    initEvents(): void {
        if (this.isInitialized) return;
        this._unsubscribers.push(
            eventBus.on('profile:switch-tab', (tab: ProfileTab) => this.switchTab(tab)),
            eventBus.on('profile:logout', () => this.handleLogout()),
            eventBus.on('profile:update-ui', () => this.refreshUI()),
            eventBus.on('wallet:updated', () => {
                if (store.user) this.rerenderSidebar(store.user as UserProfile);
            }),
            eventBus.on('profile:favorite-removed', (removedAdId: number) => {
                this.userFavorites = this.userFavorites.filter(
                    (ad) => Number(ad.id) !== removedAdId,
                );
                this.refreshUI();
            }),
            eventBus.on('profile:ad-closed', (closedAdId: number | string) => {
                this.userAds = this.userAds.map((ad) =>
                    String(ad.id) === String(closedAdId) ? { ...ad, status: 'archived' } : ad,
                );
                this.rerenderTab(store.user as UserProfile);
                ProfileContent.init();
            }),
        );
        const onUnreadChanged = () => {
            if (store.user) {
                this.rerenderSidebar(store.user as UserProfile);
                if (ProfileSidebar?.init) ProfileSidebar.init();
            }
        };
        window.addEventListener(UNREAD_CHANGED_EVENT, onUnreadChanged);
        this._unsubscribers.push(() =>
            window.removeEventListener(UNREAD_CHANGED_EVENT, onUnreadChanged),
        );
        this.isInitialized = true;
    },

    cleanup(): void {
        this._unsubscribers.forEach((unsub) => unsub());
        this._unsubscribers = [];
        MyReviewsPage.unmount();
        this.isInitialized = false;
    },

    userAds: [] as any[],
    userPendingAds: [] as any[],
    userPurchases: [] as PurchaseItem[],
    userFavorites: [] as any[],

    async loadUserPendingAds(): Promise<void> {
        const userId = store.user?.id;
        if (!userId || typeof userId !== 'number') return;
        try {
            const { moderationApi } = await import('@modules/moderation/api');
            const result = await moderationApi.getPendingAds(userId);
            if (result.success && result.data) {
                const data: any = result.data;
                let ads: any[] = [];
                if (Array.isArray(data.ads)) ads = data.ads;
                else if (Array.isArray(data)) ads = data;
                else {
                    const arrays = Object.values(data).filter(Array.isArray);
                    if (arrays.length > 0) ads = arrays[0] as any[];
                }
                this.userPendingAds = ads.map((ad) => formatAdCard(ad));
                this.rerenderTab(store.user as UserProfile);
                this.attachEventListeners();
            }
        } catch (error) {
            console.error('Failed to load pending ads:', error);
            this.userPendingAds = [];
        }
    },

    async loadUserAds(): Promise<void> {
        const userId = store.user?.id;
        if (!userId || typeof userId !== 'number') return;

        try {
            const result = await apiClient.get<{ ads: UserAd[] }>(
                API_ENDPOINTS.USERS.GET_ADS(userId),
            );
            if (result.success && result.data?.ads) {
                this.userAds = result.data.ads.map((ad: UserAd) => formatAdCard(ad));
                this.loadAdPromotions();
                this.rerenderTab(store.user as UserProfile);
                this.attachEventListeners();
            }
        } catch (error) {
            console.error('Failed to load user ads:', error);
            this.userAds = [];
        }
    },

    async loadAdPromotions(): Promise<void> {
        const adIds = this.userAds
            .filter((ad) => ad.status !== 'archived' && ad.status !== 'sold')
            .map((ad) => Number(ad.id));
        if (adIds.length === 0) return;

        const results = await Promise.allSettled(
            adIds.map((id) => promotionService.getAdPromotions(id)),
        );

        let hasActivePromo = false;
        results.forEach((res, i) => {
            if (res.status !== 'fulfilled' || !res.value.success || !res.value.data) return;
            const promotions: ActivePromotion[] = res.value.data;
            const adId = adIds[i];
            const ad = this.userAds.find((a) => Number(a.id) === adId);
            if (!ad) return;

            const now = Date.now();
            const activeByKind: Record<string, number> = {};
            for (const p of promotions) {
                const ms = new Date(p.expires_at).getTime() - now;
                if (ms > 0) activeByKind[p.kind] = (activeByKind[p.kind] || 0) + ms;
            }

            ad.is_boosted = !!activeByKind['boost'];
            ad.is_highlighted = !!activeByKind['highlight'];
            ad.boost_time_left = activeByKind['boost']
                ? formatTimeLeftFromMs(activeByKind['boost'])
                : '';
            ad.highlight_time_left = activeByKind['highlight']
                ? formatTimeLeftFromMs(activeByKind['highlight'])
                : '';

            if (ad.is_boosted || ad.is_highlighted) hasActivePromo = true;
        });

        if (hasActivePromo) {
            this.rerenderTab(store.user as UserProfile);
            this.attachEventListeners();
        }
    },

    async loadUserPurchases(): Promise<void> {
        // Сначала показываем кэш (мгновенный рендер), потом тянем с сервера.
        await purchasesStore.loadFromCache();
        this.userPurchases = purchasesStore.getState().items;
        this.rerenderTab(store.user as UserProfile);
        this.attachEventListeners();

        await purchasesStore.fetch({ force: true });
        this.userPurchases = purchasesStore.getState().items;
        this.rerenderTab(store.user as UserProfile);
        this.attachEventListeners();
    },

    async loadUserFavorites(): Promise<void> {
        try {
            const result = await apiClient.get<any>(PROFILE_CONFIG.API.GET_FAVORITES);
            if (result.success && result.data) {
                let favoritesArray: any[] = [];

                if (Array.isArray(result.data)) {
                    favoritesArray = result.data;
                } else if (Array.isArray(result.data.ads)) {
                    favoritesArray = result.data.ads;
                } else if (Array.isArray(result.data.data)) {
                    favoritesArray = result.data.data;
                } else if (typeof result.data === 'object') {
                    // Бэкенд иногда заворачивает массив в произвольный ключ (например, additionalProp1) —
                    // берём первый попавшийся массив внутри объекта.
                    const arrays = Object.values(result.data).filter(Array.isArray);
                    if (arrays.length > 0) {
                        favoritesArray = arrays[0] as any[];
                    }
                }

                this.userFavorites = favoritesArray.map((ad: any) => formatAdCard(ad));
                this.rerenderTab(store.user as UserProfile);
                this.attachEventListeners();
            }
        } catch (error) {
            console.error('Failed to load user favorites:', error);
            this.userFavorites = [];
        }
    },

    async showProfile(): Promise<void> {
        this.cleanup();
        this.initEvents();

        if (!store.isAuthenticated) {
            uiActions.navigateTo('/login');
            return;
        }

        const app = document.getElementById('app');
        const template = this.templates['profile-page'];
        if (!app || !template) return;

        // Сначала рендерим из кэшированных данных, чтобы не показывать пустую страницу
        const user = store.user || { name: 'Пользователь', avatar_path: '' };
        app.innerHTML = template({
            user: user,
            currentTab: this.currentTab,
            isAuthenticated: store.isAuthenticated,
        });

        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-root';
        modalContainer.innerHTML =
            EditNameModal.getTemplate()({ user }) +
            CloseAdModal.getTemplate()({}) +
            TopupModal.getTemplate()({});
        app.appendChild(modalContainer);

        this.renderAll();

        this.loadUserAds();
        this.loadProfileData();

        if (this.currentTab === 'favorites') {
            this.loadUserFavorites();
        }
        if (this.currentTab === 'pending') {
            this.loadUserPendingAds();
        }
        if (this.currentTab === 'purchases') {
            this.loadUserPurchases();
        }
        if (this.currentTab === 'wallet') {
            this.loadWalletData();
        }
        if (this.currentTab === 'paid_services') {
            this.loadPromoHistory();
        }
        if (this.currentTab === 'reviews') {
            this.mountMyReviewsTab();
        }
    },

    mountMyReviewsTab(): void {
        const host = document.getElementById('myReviewsHost');
        if (!host) return;
        void MyReviewsPage.mount(host);
    },

    renderAll(): void {
        this.refreshUI();
    },

    refreshUI(): void {
        const user = {
            name: 'Пользователь',
            avatar_path: '',
            ...(store.user || {}),
        } as UserProfile;
        this.rerenderTab(user);
        this.rerenderSidebar(user);
        this.attachEventListeners();
    },

    formatPurchases(items: PurchaseItem[]) {
        return items.map((item) => ({
            ...item,
            imageUrl: cartService.getImageUrl(item.photo || ''),
            formattedPrice: cartService.formatPrice(item.price),
            location: item.location || 'Не указано',
            purchasedDate: new Date(item.purchased_at).toLocaleDateString('ru-RU'),
            sellerId: item.seller?.id,
            sellerName: item.seller?.name || 'Продавец',
            isChatPurchase: item.source === 'chat' && !!item.chat_id,
        }));
    },

    rerenderTab(user: UserProfile): void {
        const contentEl = document.getElementById('tabContent');
        if (!contentEl) return;
        const topupModal = document.getElementById('topupModal');
        if (topupModal && topupModal.style.display !== 'none') return;
        const promoteModal = document.getElementById('promoteModal');
        if (promoteModal && promoteModal.style.display !== 'none') return;

        const isArchivedStatus = (status?: string) => status === 'archived' || status === 'sold';
        const activeAds = this.userAds.filter((ad) => !isArchivedStatus(ad.status));
        const archivedAds = this.userAds.filter((ad) => isArchivedStatus(ad.status));

        contentEl.innerHTML = profileContentTpl({
            currentTab: this.currentTab,
            user,
            activeAds,
            archivedAds,
            pendingAds: this.userPendingAds,
            activeAdsCount: activeAds.length,
            archivedAdsCount: archivedAds.length,
            purchases: this.formatPurchases(this.userPurchases),
            favorites: this.userFavorites,
            isAuthenticated: store.isAuthenticated,
            ...WalletTab.buildTemplateData(walletStore.getState()),
            ...PromoHistoryTab.buildTemplateData(),
        });
    },

    rerenderSidebar(user: UserProfile): void {
        const sidebarEl = document.querySelector('#sidebarContainer');
        if (!sidebarEl) return;

        // Счётчик непрочитанных чатов рисуем через `messages_count` — в шаблоне
        // бейдж берётся по `lookup user (concat tab '_count')`.
        const userWithUnread = {
            ...user,
            messages_count: unreadStore.count,
            cart_count: cartStore.getState().items.length,
            favorites_count: store.favoriteIds.size,
            pending_count: this.userPendingAds?.length ?? 0,
        };

        sidebarEl.innerHTML = profileSidebarTpl({
            currentTab: this.currentTab,
            user: userWithUnread,
            totalAdsCount: this.userAds.length,
            isAuthenticated: store.isAuthenticated,
            walletBalance: walletStore.getState().balance,
        });
    },

    switchTab(tab: ProfileTab): void {
        this.currentTab = tab;

        const tabUrl = tab === 'ads' ? '/profile' : `/profile?tab=${tab}`;
        if (window.location.pathname + window.location.search !== tabUrl) {
            window.history.replaceState({}, '', tabUrl);
        }

        if (tab === 'purchases') {
            this.loadUserPurchases();
        } else if (tab === 'favorites') {
            this.loadUserFavorites();
        } else if (tab === 'wallet') {
            this.loadWalletData();
        } else if (tab === 'paid_services') {
            this.loadPromoHistory();
        } else if (tab === 'pending') {
            this.loadUserPendingAds();
        }

        if (tab !== 'reviews') {
            MyReviewsPage.unmount();
        }

        this.renderAll();

        if (tab === 'reviews') {
            this.mountMyReviewsTab();
        }
    },

    attachEventListeners(): void {
        if (ProfileAvatar?.init) ProfileAvatar.init();
        if (ProfileSidebar?.init) ProfileSidebar.init();
        if (ProfileContent?.init) ProfileContent.init();
        if (EditNameModal?.init) EditNameModal.init();
        if (CloseAdModal?.init) CloseAdModal.init();
        if (FavoriteCard?.init) FavoriteCard.init();
        if (TopupModal?.init) TopupModal.init();
        if (WalletTab?.init) WalletTab.init();
        if (PromoHistoryTab?.init) PromoHistoryTab.init();
        // На вкладках с карточками рендерится partial cart-button — нужно
        // подключить его обработчики (добавление в корзину со страницы
        // «Избранное», «Мои покупки», «Объявления»).
        CartButtonComponent.initAll();
        if (this.currentTab === 'reviews' && document.getElementById('myReviewsHost')) {
            this.mountMyReviewsTab();
        }
    },

    async loadProfileData(): Promise<void> {
        try {
            const res = await ProfileService.getProfile();
            if (res.success && res.data) {
                store.setState({ user: res.data });
                this.renderAll();
            }
        } catch (err) {
            console.error('Ошибка загрузки профиля:', err);
        }
    },

    async loadPromoHistory(): Promise<void> {
        await PromoHistoryTab.loadHistory();
        this.attachEventListeners();
    },

    async handleLogout(): Promise<void> {
        try {
            await ProfileService.logout();
            store.setState({ isAuthenticated: false, user: null });
            window.location.href = '/';
        } catch (err) {
            uiActions.showError('Ошибка при выходе');
        }
    },

    async loadWalletData(): Promise<void> {
        await walletStore.loadFromCache();
        const balanceRes = await walletService.getBalance();
        if (balanceRes.success && balanceRes.data) {
            walletStore.setState({
                balance: balanceRes.data.balance,
                currency: balanceRes.data.currency,
                isLoading: false,
            });
        }
        const txRes = await walletService.getTransactions(20);
        if (txRes.success && txRes.data) {
            walletStore.setState({
                transactions: txRes.data.items,
                nextCursor: txRes.data.next_cursor ?? null,
            });
        }
        this.rerenderTab(store.user as UserProfile);
        this.attachEventListeners();
    },
};
