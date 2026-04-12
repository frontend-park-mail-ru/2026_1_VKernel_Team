import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileService } from './service';
import type { ProfileTab, HandlebarsTemplateFunction } from '@/types';

// Импортируем шаблоны для вкладок
import profileContentTpl from './components/profile-content/profile-content.hbs';
import profileSidebarTpl from './components/profile-sidebar/profile-sidebar.hbs';

export const ProfileController = {
  currentTab: 'info' as ProfileTab,
  _isEventsAttached: false,
  
  // Сюда AppController при инициализации положит шаблон профиля
  templates: {} as Record<string, HandlebarsTemplateFunction>,

  async showProfile(): Promise<void> {
    if (!store.isAuthenticated) {
      uiActions.navigateTo('/login');
      return;
    }

    const app = document.getElementById('app');
    if (!app) return;

    // Теперь берем шаблон напрямую из своих ресурсов
    const template = this.templates['profile-page'];
    if (!template) {
      app.innerHTML = '<div style="padding:40px;text-align:center;color:red">Ошибка: Шаблон профиля не передан в контроллер.</div>';
      return;
    }

    app.innerHTML = template({
      user: store.user || { name: 'Пользователь', rating: 0, ads_count: 0, favorites_count: 0 },
      currentTab: this.currentTab,
      avatarUrl: store.user?.avatar_path ? `/api/v1${store.user.avatar_path}` : '/images/logo/avatar.jpeg'
    });

    this.attachEventListeners();
    await this.loadProfileData();
  },

  attachEventListeners(): void {
    if (this._isEventsAttached) return; 
    this._isEventsAttached = true;

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      const tabBtn = target.closest('.profile-nav-item[data-tab]');
      if (tabBtn) {
        e.preventDefault();
        const tab = (tabBtn as HTMLElement).dataset.tab as ProfileTab;
        if (tab && tab !== this.currentTab) {
          this.currentTab = tab;
          this.rerenderTab();
          this.rerenderSidebar(); 
        }
      }

      if (target.closest('[data-action="logout"]')) {
         e.preventDefault();
         this.handleLogout();
      }
    });
  },

  async loadProfileData(): Promise<void> {
    uiActions.showLoading(true);
    try {
      const res = await ProfileService.getProfile();
      if (res.success && res.data) {
        store.setState({ user: res.data });
        this.rerenderTab(); 
        this.rerenderSidebar();
      }
    } catch (err) {
      uiActions.showError('Не удалось обновить данные профиля');
    } finally {
      uiActions.showLoading(false);
    }
  },

  rerenderTab(): void {
    const contentEl = document.getElementById('tabContent');
    if (!contentEl) return;
    contentEl.innerHTML = profileContentTpl({
      currentTab: this.currentTab,
      user: store.user
    });
  },

  rerenderSidebar(): void {
    const sidebarEl = document.querySelector('.profile-layout__sidebar');
    if (!sidebarEl) return;
    sidebarEl.innerHTML = profileSidebarTpl({
      currentTab: this.currentTab,
      user: store.user
    });
  },

  async handleLogout(): Promise<void> {
    try {
      await ProfileService.logout();
      store.setState({ isAuthenticated: false, user: null });
      uiActions.showSuccess('Вы вышли из аккаунта');
      
      // Корректный переход на главную без window.AppController
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      uiActions.showError('Ошибка при выходе');
    }
  }
};
