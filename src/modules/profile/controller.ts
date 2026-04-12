import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileService } from './service';
import type { HandlebarsTemplateFunction } from '@/types'; 
import type { ProfileTab, UserProfile } from './types'; 

// Импорт стилей
import './pages/profile/profile.css';
// Импорт шаблонов
import profileContentTpl from './components/profile-content/profile-content.hbs';
import profileSidebarTpl from './components/profile-sidebar/profile-sidebar.hbs';

export const ProfileController = {
  currentTab: 'info' as ProfileTab,
  _isEventsAttached: false,
  templates: {} as Record<string, HandlebarsTemplateFunction>,

  /**
   * Главный метод инициализации страницы профиля.
   */
  async showProfile(): Promise<void> {
    if (!store.isAuthenticated) {
      uiActions.navigateTo('/login');
      return;
    }

    const app = document.getElementById('app');
    const template = this.templates['profile-page'];
    if (!app || !template) return;

    // Сначала берем данные из стора (быстрая отрисовка)
    const user = store.user || { name: 'Пользователь', avatar_path: '' };

    // Отрисовка основного каркаса страницы
    app.innerHTML = template({
      user: user,
      currentTab: this.currentTab,
      isAuthenticated: store.isAuthenticated
    });

    this.attachEventListeners();
    
    // Отрисовываем динамические части
    this.refreshUI();

    // Загружаем свежие данные с сервера
    await this.loadProfileData();
  },

  /**
   * Навешивание обработчиков событий
   */
  attachEventListeners(): void {
    if (this._isEventsAttached) return; 
    this._isEventsAttached = true;

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Клик по аватару
      if (target.closest('.avatar-wrapper') || target.closest('[data-action="edit-avatar"]')) {
         document.getElementById('avatarUpload')?.click();
      }

      // Переключение вкладок
      const tabBtn = target.closest('.profile-nav-item[data-tab]');
      if (tabBtn) {
        e.preventDefault();
        this.currentTab = (tabBtn as HTMLElement).dataset.tab as ProfileTab;
        this.refreshUI();
      }

      // Модалка имени
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

      // Выход
      if (target.closest('[data-action="logout"]')) {
         e.preventDefault();
         this.handleLogout();
      }
    });

    // Загрузка файла
    document.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.id === 'avatarUpload' && target.files?.length) {
        await this.handleAvatarUpload(target.files[0]);
      }
    });
  },

  /**
   * Загрузка данных профиля с API
   */
  async loadProfileData(): Promise<void> {
    try {
      const res = await ProfileService.getProfile();
      if (res.success && res.data) {
        store.setState({ user: res.data });
        this.refreshUI();
      }
    } catch (err) {
      console.error('Не удалось загрузить данные профиля:', err);
    }
  },

  /**
   * Обновление всех динамических зон на странице
   */
  refreshUI(): void {
 // Собираем объект, который гарантированно соответствует UserProfile
    const user = {
        name: 'Пользователь',
        avatar_path: '',
        messages_count: 0, // Добавляем дефолтное значение
        ...(store.user || {}),
    } as UserProfile; // Явное приведение типа
    
    this.rerenderTab(user);
    this.rerenderSidebar(user);
  },

  rerenderTab(user: UserProfile): void {
    const contentEl = document.getElementById('tabContent');
    if (!contentEl) return;
    
    contentEl.innerHTML = profileContentTpl({
      currentTab: this.currentTab,
      user: user,
      isAuthenticated: store.isAuthenticated
    });
  },

  rerenderSidebar(user: UserProfile): void {
    const sidebarEl = document.querySelector('.profile-layout__sidebar');
    if (!sidebarEl) return;
    
    sidebarEl.innerHTML = profileSidebarTpl({
      currentTab: this.currentTab,
      user: user,
      isAuthenticated: store.isAuthenticated
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
        store.setState({ user: { ...store.user, name: newName } as UserProfile });
        const modal = document.getElementById('editNameModal');
        if (modal) modal.style.display = 'none';
        uiActions.showSuccess('Имя успешно изменено');
        this.refreshUI();
      }
    } catch (err) {
      uiActions.showError('Ошибка при сохранении имени');
    } finally {
      uiActions.showLoading(false);
    }
  },

  async handleAvatarUpload(file: File): Promise<void> {
    uiActions.showLoading(true);
    try {
      const res = await ProfileService.uploadAvatar(file);
      if (res.success && res.data) {
        // Сервер вернул новый путь в avatar_path
        store.setState({ 
            user: { ...store.user, avatar_path: res.data.avatar_path } as UserProfile 
        });
        uiActions.showSuccess('Фото профиля обновлено');
        this.refreshUI();
      }
    } catch (err) {
      uiActions.showError('Не удалось загрузить фото');
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
      uiActions.showError('Ошибка при выходе');
    }
  }
};
