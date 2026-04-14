/**
 * Profile Content Component
 * Логика управления вкладками профиля, модалками и редактированием данных.
 */

import './style.css';
import template from './profile-content.hbs?raw';
import { ProfileService } from '../../service';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { ProfileController } from '../../controller';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

export const ProfileContent = {
    /**
     * Возвращает скомпилированный шаблон компонента
     */
    getTemplate(): HandlebarsTemplateFunction | null {
        if (!compiledTemplate) {
            compiledTemplate = Handlebars.compile(template);
        }
        return compiledTemplate;
    },

    /**
     * Инициализация обработчиков событий внутри контента
     */
    init(): void {
        const content = document.querySelector('.profile-tab-content');
        if (!content) return;

        content.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // 1. Глазик пароля (переключение видимости)
            const toggleBtn = target.closest('[data-action="toggle-password"]');
            if (toggleBtn) {
                const input = document.getElementById('profile-password') as HTMLInputElement;
                const icon = document.getElementById('eye-icon') as HTMLImageElement;
                if (input && icon) {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    icon.src = isPassword ? '/images/icons/Eye-off.jpeg' : '/images/icons/views.jpeg';
                }
            }

            // 2. Управление модалкой (Открыть)
            if (target.closest('[data-action="open-edit-name"]')) {
                const modal = document.getElementById('editNameModal');
                if (modal) modal.style.display = 'flex';
            }

            // 3. Управление модалкой (Закрыть)
            if (target.closest('[data-action="close-modal"]')) {
                const modal = document.getElementById('editNameModal');
                if (modal) modal.style.display = 'none';
            }

            // 4. Сохранение имени
            if (target.closest('[data-action="save-name"]')) {
                this.saveName();
            }
        });
    },

    /**
     * Отправка запроса на обновление имени пользователя
     */
    async saveName(): Promise<void> {
        const input = document.getElementById('editNameInput') as HTMLInputElement;
        const newName = input?.value.trim();
        
        if (!newName || newName.length < 2) {
            uiActions.showError('Имя слишком короткое');
            return;
        }

        uiActions.showLoading(true);
        try {
            const res = await ProfileService.updateName(newName);
            
            // Заглядываем в res.data, так как apiClient возвращает ApiResponse<User>
            if (res.success && res.data?.name) {
                store.setState({ 
                    user: { ...store.user, name: res.data.name } 
                });
                
                uiActions.showSuccess('Имя сохранено');
                
                const modal = document.getElementById('editNameModal');
                if (modal) modal.style.display = 'none';
                
                // Перерисовываем UI через главный контроллер
                ProfileController.refreshUI();
            } else {
                uiActions.showError(res.error || 'Не удалось сохранить имя');
            }
        } catch (err) {
            uiActions.showError('Ошибка сохранения');
        } finally {
            uiActions.showLoading(false);
        }
    }
};
