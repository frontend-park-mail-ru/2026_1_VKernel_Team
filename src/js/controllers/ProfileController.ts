import { store } from '@/core/store';
import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction, User, Ad, ProfileTab } from '@/types';

declare const Handlebars: any;

export const ProfileController = {
  templates: {} as Record<string, HandlebarsTemplateFunction>,
  currentTab: 'info' as ProfileTab,

  showProfile(): void {
    if (!store.isAuthenticated) {
      uiActions.navigateTo('/login');
      return;
    }
    document.body.classList.add('profile-page');
    this.renderMainTemplate();
    this.attachEventListeners();
    this.loadProfileData();
  },

  renderMainTemplate(): void {
    const app = document.getElementById('app');
    const template = this.templates['user-profile'];
    if (!app || !template) return;

    const user = store.user || {};
    app.innerHTML = template({
      user,
      registeredAt: user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '—',
      activeTab: this.currentTab,
      avatarUrl: user.avatar_path ? `/api/v1${user.avatar_path}` : '/images/logo/avatar.jpeg'
    });
  },

  async loadProfileData(): Promise<void> {
    uiActions.showLoading(true);
    const res = await apiClient.get<User>(API_ENDPOINTS.USERS.PROFILE);
    uiActions.showLoading(false);

    if (res.success && res.data) {
      store.setState({ user: res.data });
      this.renderMainTemplate(); // Обновляем статистику в шапке
    } else {
      uiActions.showError(res.error || 'Не удалось загрузить профиль');
    }
  },

  attachEventListeners(): void {
    // 1. Переключение вкладок
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const tab = (e.currentTarget as HTMLElement).dataset.tab as ProfileTab;
        if (tab && tab !== this.currentTab) {
          this.currentTab = tab;
          document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
          (e.currentTarget as HTMLElement).classList.add('active');
          await this.loadTabContent(tab);
        }
      });
    });

    // 2. Модальное окно редактирования имени
    const modal = document.getElementById('editProfileModal');
    document.getElementById('editNameBtn')?.addEventListener('click', () => modal?.classList.add('show'));
    document.getElementById('cancelNameBtn')?.addEventListener('click', () => modal?.classList.remove('show'));
    
    document.getElementById('saveNameBtn')?.addEventListener('click', async () => {
      const input = document.getElementById('editNameInput') as HTMLInputElement;
      const newName = input.value.trim();
      if (newName.length < 2) return uiActions.showError('Имя должно быть от 2 символов');

      uiActions.showLoading(true);
      const res = await apiClient.post<User>(API_ENDPOINTS.PROFILE.UPDATE, { name: newName });
      uiActions.showLoading(false);

      if (res.success && res.data) {
        store.setState({ user: res.data });
        this.renderMainTemplate();
        modal?.classList.remove('show');
        uiActions.showSuccess('Имя успешно обновлено');
      } else {
        uiActions.showError(res.error || 'Ошибка обновления имени');
      }
    });

    // 3. Загрузка аватара
    const avatarInput = document.getElementById('avatarUpload') as HTMLInputElement;
    document.getElementById('changeAvatarBtn')?.addEventListener('click', () => avatarInput?.click());
    
    avatarInput?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      uiActions.showLoading(true);
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await fetch(`/api/v1${API_ENDPOINTS.PROFILE.AVATAR}`, {
          method: 'POST',
          headers: { 'X-CSRF-Token': this.getCookie('csrf_token') || '' },
          credentials: 'include',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          store.setState({ user: data });
          this.renderMainTemplate();
          uiActions.showSuccess('Аватар обновлен');
        } else {
          uiActions.showError('Ошибка загрузки аватара');
        }
      } catch {
        uiActions.showError('Ошибка сети при загрузке аватара');
      } finally {
        uiActions.showLoading(false);
      }
    });

    // 4. Выход
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      uiActions.showLoading(true);
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
      store.setState({ isAuthenticated: false, user: null });
      uiActions.showLoading(false);
      uiActions.navigateTo('/login');
    });
  },

  async loadTabContent(tab: ProfileTab): Promise<void> {
    const contentEl = document.getElementById('tabContent');
    if (!contentEl) return;
    
    contentEl.innerHTML = '<div class="loader-wrapper"><div class="loader"></div></div>';
    
    try {
      let html = '';
      switch (tab) {
        case 'info':
          html = '<div class="empty-state">Ваши личные данные отображаются в верхней карточке профиля.</div>';
          break;
        case 'ads': {
          const user = store.user;
          const res = user?.id ? await apiClient.get<Ad[]>(API_ENDPOINTS.USERS.GET_ADS(user.id)) : { success: false };
          html = this.renderGrid(res.data || [], 'ad');
          break;
        }
        case 'favorites': {
          const res = await apiClient.get<Ad[]>(API_ENDPOINTS.FAVORITES.GET_ALL);
          html = this.renderGrid(res.data || [], 'ad');
          break;
        }
        case 'cart': {
          const res = await apiClient.get<any>(API_ENDPOINTS.CART.GET_ALL);
          html = this.renderCart(res.data?.items || []);
          break;
        }
        case 'settings':
          html = '<div class="empty-state">Настройки аккаунта скоро будут доступны.</div>';
          break;
      }
      contentEl.innerHTML = html;
    } catch {
      contentEl.innerHTML = '<div class="error-state">Ошибка загрузки данных</div>';
      uiActions.showError('Не удалось загрузить содержимое');
    }
  },

  renderGrid(items: Ad[], type: 'ad'): string {
    if (!items.length) return '<div class="empty-state">Список пуст</div>';
    return `<div class="items-grid">${items.map(item => `
      <div class="item-card">
        <img src="${item.photos?.[0] || '/images/logo/clover.jpeg'}" alt="${item.title}" loading="lazy">
        <div class="item-info">
          <h4>${item.title}</h4>
          <p class="price">${Number(item.price).toLocaleString('ru-RU')} ₽</p>
          <span class="location">${item.location || '—'}</span>
        </div>
      </div>
    `).join('')}</div>`;
  },

  renderCart(items: any[]): string {
    if (!items.length) return '<div class="empty-state">Корзина пуста</div>';
    return `<div class="cart-list">${items.map(item => `
      <div class="cart-item">
        <img src="${item.image_path || '/images/logo/clover.jpeg'}" alt="${item.title}" loading="lazy">
        <div class="item-details">
          <h4>${item.title}</h4>
          <p class="seller">${item.seller_name}</p>
          <span class="price">${Number(item.price).toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
    `).join('')}</div>`;
  },

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
};
