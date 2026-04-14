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

import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import type { SellerAd } from '@modules/seller-page/types';

export const ProfileController = {
    currentTab: 'info' as ProfileTab,
    templates: {} as Record<string, HandlebarsTemplateFunction>,
    mainTemplate: null as any,
    isInitialized: false,

    initEvents(): void {
        if (this.isInitialized) return;
        eventBus.on('profile:switch-tab', (tab: ProfileTab) => this.switchTab(tab));
        eventBus.on('profile:logout', () => this.handleLogout());
        eventBus.on('profile:update-ui', () => this.refreshUI());
        this.isInitialized = true;
    },

    userAds: [] as any[],  // Поле для хранения объявлений

    async loadUserAds(): Promise<void> {
        // Проверяем, что id существует и это число
        const userId = store.user?.id;
        if (!userId || typeof userId !== 'number') return;
        
        try {
            const result = await apiClient.get<{ ads: SellerAd[] }>(`/users/${userId}/ads`);
            if (result.success && result.data?.ads) {
                const { sellerService } = await import('@modules/seller-page/service');
                this.userAds = result.data.ads.map((ad: SellerAd) => 
                    sellerService.formatAdCard(ad)
                );
                this.rerenderTab(store.user as UserProfile);
            }
        } catch (error) {
            console.error('Failed to load user ads:', error);
            this.userAds = [];
        }
    },

    async showProfile(): Promise<void> {
        this.initEvents();

        if (!store.isAuthenticated) {
            uiActions.navigateTo('/login');
            return;
        }

        // Загружаем объявления пользователя
        await this.loadUserAds();

        const app = document.getElementById('app');
        const template = this.mainTemplate || this.templates['profile-page'];
        if (!app || !template) return;

        const user = store.user || { name: 'Пользователь', avatar_path: '' };
        app.innerHTML = template({
            user: user,
            currentTab: this.currentTab,
            isAuthenticated: store.isAuthenticated,
        });

        // Рендерим модалку
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-root';
        modalContainer.innerHTML = EditNameModal.getTemplate()({ user });
        app.appendChild(modalContainer);

        this.renderAll();
        await this.loadProfileData();
    },

    renderAll(): void {
        this.refreshUI();
        this.attachEventListeners();
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
        if (contentEl) {
            contentEl.innerHTML = profileContentTpl({
                currentTab: this.currentTab,
                user,
                userAds: this.userAds,
                isAuthenticated: store.isAuthenticated,
            });
        }
    },

    rerenderSidebar(user: UserProfile): void {
        const sidebarEl = document.querySelector('#sidebarContainer');
        if (sidebarEl) {
            sidebarEl.innerHTML = profileSidebarTpl({
                currentTab: this.currentTab,
                user,
                isAuthenticated: store.isAuthenticated,
            });
        }
    },

    switchTab(tab: ProfileTab): void {
        this.currentTab = tab;
        this.renderAll();
    },

    attachEventListeners(): void {
        if (ProfileAvatar?.init) ProfileAvatar.init();
        if (ProfileSidebar?.init) ProfileSidebar.init();
        if (ProfileContent?.init) ProfileContent.init();
        if (EditNameModal?.init) EditNameModal.init(); // Привязываем события модалки

        // Добавьте обработчик для карточек объявлений
        const contentEl = document.getElementById('tabContent');
        if (contentEl) {
            contentEl.addEventListener('click', (e) => {
                const card = (e.target as HTMLElement).closest('.rec-card');
                if (!card) return;
                
                const target = e.target as HTMLElement;
                if (target.closest('.rec-card-fav') || target.closest('.rec-card-cart')) {
                    return;
                }
                
                const adId = card.getAttribute('data-id');
                if (adId) {
                    uiActions.navigateTo(`/ad/${adId}`);
                }
            });
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

    async handleLogout(): Promise<void> {
        try {
            await ProfileService.logout();
            store.setState({ isAuthenticated: false, user: null });
            uiActions.navigateTo('/login');
        } catch (err) {
            uiActions.showError('Ошибка при выходе');
        }
    },
};
