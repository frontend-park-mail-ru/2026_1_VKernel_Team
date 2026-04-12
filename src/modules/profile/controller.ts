import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileService } from './service';
import type { ProfileTab, HandlebarsTemplateFunction } from '@/types';

// Импорт стилей
import './pages/profile/profile.css';

// Импорт шаблонов для динамики
import profileContentTpl from './components/profile-content/profile-content.hbs';
import profileSidebarTpl from './components/profile-sidebar/profile-sidebar.hbs';

export const ProfileController = {
  currentTab: 'info' as ProfileTab,
  _isEventsAttached: false,
  templates: {} as Record<string, HandlebarsTemplateFunction>,

  async showProfile(): Promise<void> {
    if (!store.isAuthenticated) {
      uiActions.navigateTo('/login');
      return;
    }

    const app = document.getElementById('app');
    const template = this.templates['profile-page'];
    if (!app || !template) return;

    // Данные для отрисовки (с аватаркой по умолчанию)
    const user = {
        ...(store.user || {}),
        name: store.user?.name || 'Пользователь',
        avatar_path: store.user?.avatar_path || ''
    };

    // Рендерим основной каркас
    app.innerHTML = template({
      user: user,
      currentTab: this.currentTab,
      isAuthenticated: store.isAuthenticated,
      avatarUrl: user.avatar_path ? `/api/v1${user.avatar_path}` : '/images/logo/avatar.jpeg'
    });

    this.attachEventListeners();
    
    // Сразу отрисовываем контент, чтобы не было пустоты
    this.rerenderTab();
    this.rerenderSidebar();

    await this.loadProfileData();
  },

  attachEventListeners(): void {
    if (this._isEventsAttached) return; 
    this._isEventsAttached = true;

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Переключение вкладок
      const tabBtn = target.closest('.profile-nav-item[data-tab]');
      if (tabBtn) {
        e.preventDefault();
        this.currentTab = (tabBtn as HTMLElement).dataset.tab as ProfileTab;
        this.rerenderTab();
        this.rerenderSidebar(); 
      }

      // Управление модалкой
      if (target.closest('[data-action="open-edit-name"]')) {
         const modal = document.getElementById('editNameModal');
         if (modal) modal.style.display = 'flex';
      }

      if (target.closest('[data-action="close-modal"]')) {
         const modal = document.getElementById('editNameModal');
         if (modal) modal.style.display = 'none';
      }

      if (target.closest('[data-action="save-name"]')) {
         this.saveName();
      }

      // Клик по аватару
      if (target.closest('.avatar-btn') || target.closest('[data-action="edit-avatar"]')) {
         document.getElementById('avatarUpload')?.click();
      }

      if (target.closest('[data-action="logout"]')) {
         e.preventDefault();
         this.handleLogout();
      }
    });

    document.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.id === 'avatarUpload' && target.files?.length) {
        await this.handleAvatarUpload(target.files[0]);
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
      console.error('Ошибка загрузки профиля:', err);
    } finally {
      uiActions.showLoading(false);
    }
  },

  rerenderTab(): void {
    const contentEl = document.getElementById('tabContent');
    if (!contentEl) return;
    
    const user = store.user || { name: 'Пользователь' };
    contentEl.innerHTML = profileContentTpl({
      currentTab: this.currentTab,
      user: user,
      avatarUrl: (user as any).avatar_path ? `/api/v1${(user as any).avatar_path}` : '/images/logo/avatar.jpeg'
    });
  },

  rerenderSidebar(): void {
    const sidebarEl = document.querySelector('.profile-layout__sidebar');
    if (!sidebarEl) return;
    
    sidebarEl.innerHTML = profileSidebarTpl({
      currentTab: this.currentTab,
      user: store.user || {}
    });
  },

  async saveName(): Promise<void> {
    const input = document.getElementById('editNameInput') as HTMLInputElement;
    const newName = input?.value.trim();
    if (!newName || newName.length < 2) return;

    uiActions.showLoading(true);
    try {
      const res = await ProfileService.updateName(newName);
      if (res.success) {
        store.setState({ user: { ...store.user, name: newName } });
        const modal = document.getElementById('editNameModal');
        if (modal) modal.style.display = 'none';
        uiActions.showSuccess('Имя изменено');
        this.rerenderTab();
      }
    } catch (err) {
      uiActions.showError('Ошибка сохранения');
    } finally {
      uiActions.showLoading(false);
    }
  },

  async handleAvatarUpload(file: File): Promise<void> {
    uiActions.showLoading(true);
    try {
      const res = await ProfileService.uploadAvatar(file);
      if (res.success) {
        const newPath = res.avatar_path || res.data?.avatar_path;
        store.setState({ user: { ...store.user, avatar_path: newPath } });
        uiActions.showSuccess('Фото обновлено');
        this.rerenderTab();
      }
    } catch (err) {
      uiActions.showError('Ошибка загрузки');
    } finally {
      uiActions.showLoading(false);
    }
  },

  async handleLogout(): Promise<void> {
    try {
      await ProfileService.logout();
      store.setState({ isAuthenticated: false, user: null });
      uiActions.navigateTo('/login');
    } catch (err) {
      uiActions.showError('Ошибка выхода');
    }
  }
};
