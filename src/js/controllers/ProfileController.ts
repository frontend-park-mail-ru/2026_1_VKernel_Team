// import { store } from '@/core/store';
// import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
// import { uiActions } from '@/actions/uiActions';
// import type { HandlebarsTemplateFunction, User, Ad, ProfileTab } from '@/types';
// declare const Handlebars: any;

// export const ProfileController = {
//   templates: {} as Record<string, HandlebarsTemplateFunction>,
//   currentTab: 'info' as ProfileTab,

//   showProfile(): void {
//     if (!store.isAuthenticated) {
//       window.history.pushState({}, '', '/login');
//       window.dispatchEvent(new PopStateEvent('popstate'));
//       return;
//     }
//     document.body.classList.add('profile-page');
//     this.renderMainTemplate();
//     this.loadProfileData();
//   },

//   renderMainTemplate(): void {
//     const app = document.getElementById('app');
//     const template = this.templates['user-profile'];
//     if (!app || !template) return;

//     const user = store.user || {};
//     const avatarUrl = user.avatar_path ? `/api/v1${user.avatar_path}` : '/images/logo/avatar.jpeg';
//     const registeredAt = user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '—';

//     app.innerHTML = template({
//       user,
//       registeredAt,
//       activeTab: this.currentTab || 'info',
//       avatarUrl,
//       eq: (a: any, b: any) => a === b
//     });
//   },

//   async loadProfileData(): Promise<void> {
//     uiActions.showLoading(true);
//     try {
//       const res = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
//       if (res.success && res.data) {
//         store.setState({ user: res.data });
//         this.renderMainTemplate();
//         this.attachEventListeners();
//       } else {
//         uiActions.showError(res.error || 'Не удалось загрузить профиль');
//       }
//     } catch {
//       uiActions.showError('Ошибка сети при загрузке профиля');
//     } finally {
//       uiActions.showLoading(false);
//     }
//   },

//   attachEventListeners(): void {
//     const modal = document.getElementById('editProfileModal');
//     const editBtn = document.getElementById('editNameBtn');
//     const cancelBtn = document.getElementById('cancelNameBtn');
//     const saveBtn = document.getElementById('saveNameBtn');
//     const avatarInput = document.getElementById('avatarUpload') as HTMLInputElement;
//     const changeAvatarBtn = document.getElementById('changeAvatarBtn');
//     const logoutBtn = document.getElementById('logoutBtn');

//     // 1. Переключение вкладок
//     document.querySelectorAll('.profile-tab-btn').forEach(btn => {
//       btn.addEventListener('click', async (e) => {
//         e.preventDefault();
//         const tab = (e.currentTarget as HTMLElement).dataset.tab as ProfileTab;
//         if (tab && tab !== this.currentTab) {
//           this.currentTab = tab;
//           document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
//           (e.currentTarget as HTMLElement).classList.add('active');
//           await this.loadTabContent(tab);
//         }
//       });
//     });

//     // 2. Модальное окно
//     if (editBtn && modal) editBtn.addEventListener('click', () => modal.classList.add('show'));
//     if (cancelBtn && modal) cancelBtn.addEventListener('click', () => modal.classList.remove('show'));
//     if (modal) {
//       modal.addEventListener('click', (e) => {
//         if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
//           modal.classList.remove('show');
//         }
//       });
//     }

//     // 3. Сохранение имени
//     if (saveBtn) {
//       saveBtn.addEventListener('click', async () => {
//         const input = document.getElementById('editNameInput') as HTMLInputElement;
//         if (!input) return;
//         const newName = input.value.trim();
//         if (newName.length < 3) return uiActions.showError('Имя должно быть от 3 символов');

//         uiActions.showLoading(true);
//         try {
//           const res = await apiClient.request<User>('/profile', 'PATCH', { name: newName });
//           if (res.success && res.data) {
//             store.setState({ user: res.data });
//             this.renderMainTemplate();
//             this.attachEventListeners();
//             modal?.classList.remove('show');
//             uiActions.showSuccess('Имя успешно обновлено');
//           } else {
//             uiActions.showError(res.error || 'Ошибка обновления имени');
//           }
//         } catch (err: any) {
//           console.error('Update error:', err);
//           uiActions.showError('Ошибка сети при обновлении');
//         } finally {
//           uiActions.showLoading(false);
//         }
//       });
//     }

//     // 4. Загрузка аватара
//     if (changeAvatarBtn && avatarInput) {
//       changeAvatarBtn.addEventListener('click', () => avatarInput.click());
//     }
//     if (avatarInput) {
//       avatarInput.addEventListener('change', async (e) => {
//         const file = (e.target as HTMLInputElement).files?.[0];
//         if (!file) return;

//         uiActions.showLoading(true);
//         try {
//           const formData = new FormData();
//           formData.append('avatar', file);
//           const response = await fetch(`/api/v1${API_ENDPOINTS.PROFILE.AVATAR}`, {
//             method: 'POST',
//             headers: { 'X-CSRF-Token': this.getCookie('csrf_token') || '' },
//             credentials: 'include',
//             body: formData
//           });

//           if (response.ok) {
//             const data = await response.json();
//             store.setState({ user: data });
//             this.renderMainTemplate();
//             this.attachEventListeners(); 
//             uiActions.showSuccess('Аватар обновлен');
//           } else {
//             uiActions.showError('Ошибка загрузки аватара');
//           }
//         } catch {
//           uiActions.showError('Ошибка сети при загрузке аватара');
//         } finally {
//           uiActions.showLoading(false);
//         }
//       });
//     }

//     // 5. Выход из аккаунта
//     if (logoutBtn) {
//       logoutBtn.addEventListener('click', async () => {
//         uiActions.showLoading(true);
//         try {
//           await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, null);
//           store.setState({ isAuthenticated: false, user: null });
//           uiActions.showSuccess('Вы успешно вышли из аккаунта');
//           window.history.pushState({}, '', '/');
//           window.dispatchEvent(new PopStateEvent('popstate'));
//         } catch (err: any) {
//           console.error('Logout error:', err);
//           uiActions.showError('Ошибка при выходе');
//         } finally {
//           uiActions.showLoading(false);
//         }
//       });
//     }
//   },

//   async loadTabContent(tab: ProfileTab): Promise<void> {
//     const contentEl = document.getElementById('tabContent');
//     if (!contentEl) return;
//     contentEl.innerHTML = '<div class="loader-wrapper"><div class="loader"></div></div>';

//     try {
//       let html = '';
//       switch (tab) {
//         case 'info':
//           html = '<div class="empty-state">Ваши личные данные отображаются в верхней карточке профиля.</div>';
//           break;
//         case 'ads': {
//           const user = store.user;
//           const res = user?.id ? await apiClient.get<Ad[]>(API_ENDPOINTS.USERS.GET_ADS(user.id)) : { success: false };
//           html = this.renderGrid(res.data || [], 'ad');
//           break;
//         }
//         case 'favorites': {
//           const res = await apiClient.get<Ad[]>(API_ENDPOINTS.FAVORITES.GET_ALL);
//           html = this.renderGrid(res.data || [], 'ad');
//           break;
//         }
//         case 'cart': {
//           const res = await apiClient.get<any>(API_ENDPOINTS.CART.GET_ALL);
//           html = this.renderCart(res.data?.items || []);
//           break;
//         }
//         case 'settings':
//           html = '<div class="empty-state">Настройки аккаунта скоро будут доступны.</div>';
//           break;
//       }
//       contentEl.innerHTML = html;
//     } catch {
//       contentEl.innerHTML = '<div class="error-state">Ошибка загрузки данных</div>';
//       uiActions.showError('Не удалось загрузить содержимое');
//     }
//   },

//   renderGrid(items: Ad[], type: 'ad'): string {
//     if (!items.length) return '<div class="empty-state">Список пуст</div>';
//     return `<div class="items-grid">${items.map(item => `
//       <div class="item-card">
//         <h4>${item.title}</h4>
//         <p>${Number(item.price).toLocaleString('ru-RU')} ₽</p>
//         <span>${item.location || '—'}</span>
//       </div>
//     `).join('')}</div>`;
//   },

//   renderCart(items: any[]): string {
//     if (!items.length) return '<div class="empty-state">Корзина пуста</div>';
//     return `<div class="cart-list">${items.map(item => `
//       <div class="cart-item">
//         <h4>${item.title}</h4>
//         <p>${item.seller_name}</p>
//         <span>${Number(item.price).toLocaleString('ru-RU')} ₽</span>
//       </div>
//     `).join('')}</div>`;
//   },

//   getCookie(name: string): string | null {
//     const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//     return match ? match[2] : null;
//   }
// };
