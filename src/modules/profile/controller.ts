import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileService } from '@modules/profile/service';
import { eventBus } from '@/core/eventBus';
import type { HandlebarsTemplateFunction } from '@/types';
import type { ProfileTab, UserProfile } from '@modules/profile/types';
import '@modules/profile/pages/profile/profile.css';
import profileContentTpl from '@modules/profile/components/profile-content/profile-content.hbs';
import profileSidebarTpl from '@modules/profile/components/profile-sidebar/profile-sidebar.hbs';
import { ProfileAvatar } from '@modules/profile/components/profile-avatar/profile-avatar';
import { ProfileSidebar } from '@modules/profile/components/profile-sidebar/profile-sidebar';
import { ProfileContent } from '@modules/profile/components/profile-content/profile-content';
import { EditNameModal } from '@modules/profile/components/edit-name-modal/edit-name-modal';
import { CloseAdModal } from '@modules/profile/components/close-ad-modal/close-ad-modal';

import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';

const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';

interface UserAd {
    id: number;
    title: string;
    price: number;
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
    };
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
            eventBus.on('profile:ad-closed', (closedAdId: number | string) => {
                this.userAds = this.userAds.map((ad) =>
                    String(ad.id) === String(closedAdId) ? { ...ad, status: 'archived' } : ad,
                );
                this.rerenderTab(store.user as UserProfile);
                ProfileContent.init();
            }),
        );
        this.isInitialized = true;
    },

    cleanup(): void {
        this._unsubscribers.forEach((unsub) => unsub());
        this._unsubscribers = [];
        this.isInitialized = false;
    },

    userAds: [] as any[],

    async loadUserAds(): Promise<void> {
        const userId = store.user?.id;
        if (!userId || typeof userId !== 'number') return;

        try {
            const result = await apiClient.get<{ ads: UserAd[] }>(
                API_ENDPOINTS.USERS.GET_ADS(userId),
            );
            if (result.success && result.data?.ads) {
                this.userAds = result.data.ads.map((ad: UserAd) => formatAdCard(ad));
                this.rerenderTab(store.user as UserProfile);
            }
        } catch (error) {
            console.error('Failed to load user ads:', error);
            this.userAds = [];
        }
    },

    async showProfile(): Promise<void> {
        this.cleanup();
        this.initEvents();

        if (!store.isAuthenticated) {
            uiActions.navigateTo('/login');
            return;
        }

        await this.loadUserAds();

        const app = document.getElementById('app');
        const template = this.templates['profile-page'];
        if (!app || !template) return;

        const user = store.user || { name: 'Пользователь', avatar_path: '' };
        app.innerHTML = template({
            user: user,
            currentTab: this.currentTab,
            isAuthenticated: store.isAuthenticated,
        });

        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-root';
        modalContainer.innerHTML =
            EditNameModal.getTemplate()({ user }) + CloseAdModal.getTemplate()({});
        app.appendChild(modalContainer);

        this.renderAll();
        await this.loadProfileData();
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

    rerenderTab(user: UserProfile): void {
        const contentEl = document.getElementById('tabContent');
        if (!contentEl) return;

        const activeAds = this.userAds.filter((ad) => ad.status !== 'archived');
        const archivedAds = this.userAds.filter((ad) => ad.status === 'archived');

        contentEl.innerHTML = profileContentTpl({
            currentTab: this.currentTab,
            user,
            activeAds,
            archivedAds,
            activeAdsCount: activeAds.length,
            archivedAdsCount: archivedAds.length,
            isAuthenticated: store.isAuthenticated,
        });
    },

    rerenderSidebar(user: UserProfile): void {
        const sidebarEl = document.querySelector('#sidebarContainer');
        if (!sidebarEl) return;

        sidebarEl.innerHTML = profileSidebarTpl({
            currentTab: this.currentTab,
            user,
            totalAdsCount: this.userAds.length,
            isAuthenticated: store.isAuthenticated,
        });
    },

    switchTab(tab: ProfileTab): void {
        this.currentTab = tab;
        this.renderAll();
    },

    attachEventListeners(): void {
        if (ProfileAvatar?.init) ProfileAvatar.init();
        if (ProfileSidebar?.init) ProfileSidebar.init();
        if (ProfileContent?.init) ProfileContent.init();
        if (EditNameModal?.init) EditNameModal.init();
        if (CloseAdModal?.init) CloseAdModal.init();
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

    async handleLogout(): Promise<void> {
        try {
            await ProfileService.logout();
            store.setState({ isAuthenticated: false, user: null });
            window.history.pushState({}, '', '/login');
            uiActions.navigateTo('/login');
        } catch (err) {
            uiActions.showError('Ошибка при выходе');
        }
    },
};
