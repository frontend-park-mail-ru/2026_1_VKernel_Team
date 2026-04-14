import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileService } from './service';
import { eventBus } from '@/core/eventBus'; 
import type { HandlebarsTemplateFunction } from '@/types'; 
import type { ProfileTab, UserProfile } from './types'; 

// Твои импорты стилей (не меняем)
import './pages/profile/profile.css'; 
import profileContentTpl from './components/profile-content/profile-content.hbs';
import profileSidebarTpl from './components/profile-sidebar/profile-sidebar.hbs';

// ИСПРАВЛЕНО: Импортируем логику из TS, а не из CSS
import { ProfileAvatar } from './components/profile-avatar/profile-avatar';
import { ProfileSidebar } from './components/profile-sidebar/profile-sidebar';
import { ProfileContent } from './components/profile-content/profile-content';

export const ProfileController = {
  currentTab: 'info' as ProfileTab,
  templates: {} as Record<string, HandlebarsTemplateFunction>,
  mainTemplate: null as any, 
  isInitialized: false,

  initEvents(): void {
    if (this.isInitialized) return;
    
    // Подписываемся на события компонентов
    eventBus.on('profile:switch-tab', (tab: ProfileTab) => this.switchTab(tab));
    eventBus.on('profile:logout', () => this.handleLogout());
    eventBus.on('profile:update-ui', () => this.refreshUI());

    this.isInitialized = true;
  },

  async showProfile(): Promise<void> {
    this.initEvents(); // Настраиваем связи

    if (!store.isAuthenticated) {
      uiActions.navigateTo('/login');
      return;
    }

    const app = document.getElementById('app');
    const template = this.mainTemplate || this.templates['profile-page'];
    if (!app || !template) return;

    const user = store.user || { name: 'Пользователь', avatar_path: '' };
    app.innerHTML = template({
      user: user,
      currentTab: this.currentTab,
      isAuthenticated: store.isAuthenticated
    });

    this.renderAll();
    await this.loadProfileData();
  },

  renderAll(): void {
    this.refreshUI();
    this.attachEventListeners();
  },

  refreshUI(): void {
    const user = { name: 'Пользователь', avatar_path: '', ...(store.user || {}) } as UserProfile; 
    this.rerenderTab(user);
    this.rerenderSidebar(user);
    // После перерисовки innerHTML события нужно привязать заново!
    this.attachEventListeners();
  },

  rerenderTab(user: UserProfile): void {
    const contentEl = document.getElementById('tabContent');
    if (contentEl) {
        contentEl.innerHTML = profileContentTpl({
            currentTab: this.currentTab,
            user,
            isAuthenticated: store.isAuthenticated
        });
    }
  },

  rerenderSidebar(user: UserProfile): void {
    const sidebarEl = document.querySelector('#sidebarContainer'); 
    if (sidebarEl) {
        sidebarEl.innerHTML = profileSidebarTpl({
            currentTab: this.currentTab,
            user,
            isAuthenticated: store.isAuthenticated
        });
    }
  },

  switchTab(tab: ProfileTab): void {
    this.currentTab = tab;
    this.renderAll();
  },

  attachEventListeners(): void {
    // Проверка на undefined защищает от ошибок при загрузке
    if (ProfileAvatar?.init) ProfileAvatar.init();
    if (ProfileSidebar?.init) ProfileSidebar.init();
    if (ProfileContent?.init) ProfileContent.init();
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
  }
};
