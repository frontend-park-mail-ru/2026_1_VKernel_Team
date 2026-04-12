import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileService } from './service';
import type { ProfileTab } from './types';

export const ProfileController = {
  currentTab: 'info' as ProfileTab,

  async showProfile(): Promise<void> {
    if (!store.isAuthenticated) {
      uiActions.navigateTo('/login');
      return;
    }

    const app = document.getElementById('app');
    if (!app) return;

    // Загружаем шаблон через глобальный хелпер AppController (или импорт, если настроен)
    const template = (window as any).AppController?.templates?.['profile-page'];
    if (!template) {
      app.innerHTML = '<div style="padding:40px;text-align:center;color:red">Шаблон профиля не загружен</div>';
      return;
    }

    app.innerHTML = template({
      user: store.user || { name: 'Пользователь', rating: 0, reviews_count: 0, ads_count: 0, favorites_count: 0, cart_count: 0, messages_count: 0 },
      currentTab: this.currentTab,
      avatarUrl: store.user?.avatar_path ? `/api/v1${store.user.avatar_path}` : ''
    });

    this.attachEventListeners();
    this.loadProfileData();
  },

  attachEventListeners(): void {
    // Переключение табов
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = (e.currentTarget as HTMLElement).dataset.tab as ProfileTab;
        if (tab && tab !== this.currentTab) {
          this.currentTab = tab;
          this.rerenderTab();
        }
      });
    });

    // Кнопки
    document.getElementById('editNameBtn')?.addEventListener('click', () => this.openModal(true));
    document.getElementById('cancelNameBtn')?.addEventListener('click', () => this.openModal(false));
    document.getElementById('saveNameBtn')?.addEventListener('click', () => this.saveName());
    document.getElementById('changeAvatarBtn')?.addEventListener('click', () => document.getElementById('avatarUpload')?.click());
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
    document.getElementById('sidebarLogoutBtn')?.addEventListener('click', () => this.handleLogout());

    // Закрытие модалки по клику вне
    document.getElementById('editProfileModal')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.openModal(false);
    });
  },

  async loadProfileData(): Promise<void> {
    uiActions.showLoading(true);
    try {
      const res = await ProfileService.getProfile();
      if (res.success && res.data) {
        store.setState({ user: res.data });
        this.rerenderTab(); // обновляем только контент таба
      }
    } catch (err) {
      uiActions.showError('Не удалось загрузить профиль');
    } finally {
      uiActions.showLoading(false);
    }
  },

  rerenderTab(): void {
    const contentEl = document.getElementById('tabContent');
    if (!contentEl) return;
    // Здесь позже будет рендер компонентов. Пока заглушка:
    contentEl.innerHTML = `<div class="tab-content-placeholder"><h2 class="section-title">${this.getTabTitle()}</h2><p>Загрузка раздела "${this.currentTab}"...</p></div>`;
  },

  getTabTitle(): string {
    const titles: Record<ProfileTab, string> = {
      info: 'Личные данные', ads: 'Мои объявления', favorites: 'Избранное', cart: 'Корзина',
      messages: 'Сообщения', purchases: 'Мои покупки', wallet: 'Кошелёк', settings: 'Настройки'
    };
    return titles[this.currentTab] || 'Профиль';
  },

  openModal(show: boolean): void {
    const modal = document.getElementById('editProfileModal');
    if (show) modal?.classList.add('show');
    else modal?.classList.remove('show');
  },

  async saveName(): Promise<void> {
    const input = document.getElementById('editNameInput') as HTMLInputElement;
    if (!input) return;
    const name = input.value.trim();
    if (name.length < 2) return uiActions.showError('Имя слишком короткое');

    uiActions.showLoading(true);
    try {
      const res = await ProfileService.updateName(name);
      if (res.success && res.data) {
        store.setState({ user: res.data });
        this.openModal(false);
        uiActions.showSuccess('Имя обновлено');
        this.rerenderTab();
      }
    } catch (err) {
      uiActions.showError('Ошибка при сохранении');
    } finally {
      uiActions.showLoading(false);
    }
  },

  async handleLogout(): Promise<void> {
    try {
      await ProfileService.logout();
      store.setState({ isAuthenticated: false, user: null });
      uiActions.showSuccess('Вы вышли из аккаунта');
      uiActions.navigateTo('/login');
    } catch (err) {
      uiActions.showError('Ошибка при выходе');
    }
  }
};
