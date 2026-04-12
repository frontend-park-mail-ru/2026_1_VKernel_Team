import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileService } from './service';
// Убираем неиспользуемый импорт ProfileData
// import type { ProfileData } from './types'; 

export const ProfileController = {
  currentTab: 'info',

  async showProfile(): Promise<void> {
    if (!store.isAuthenticated) {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    document.body.classList.add('profile-page');

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="profile-container">
          <h1>Личный кабинет</h1>
          <p>Добро пожаловать, ${store.user?.name || 'Пользователь'}</p>
          <div id="profile-content">
             <button id="refresh-profile-btn">Обновить данные</button>
             <button id="logout-btn">Выйти</button>
          </div>
        </div>
      `;

      document.getElementById('refresh-profile-btn')?.addEventListener('click', () => this.loadProfileData());
      document.getElementById('logout-btn')?.addEventListener('click', () => this.handleLogout());
      
      this.loadProfileData();
    }
  },

  async loadProfileData(): Promise<void> {
    try {
      const res = await ProfileService.getProfile();
      if (res.success && res.data) {
        store.setState({ user: res.data });
        console.log('Profile updated:', res.data);
      } else {
        uiActions.showError(res.error || 'Не удалось загрузить профиль');
      }
    } catch (err) {
      uiActions.showError('Ошибка сети');
    }
  },

  async handleLogout(): Promise<void> {
    try {
      await ProfileService.logout();
      store.setState({ isAuthenticated: false, user: null });
      uiActions.showSuccess('Вы вышли из системы');
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      uiActions.showError('Ошибка при выходе');
    }
  }
};
