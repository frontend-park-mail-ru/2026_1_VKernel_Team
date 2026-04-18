import template from '@modules/profile/components/edit-name-modal/edit-name-modal.hbs';
import '@modules/common/components/modal/modal.css';
import '@modules/profile/components/edit-name-modal/style.css';
import { ProfileService } from '@modules/profile/service';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { syncQueue } from '@modules/common/offline/sync/syncQueue';

export const EditNameModal = {
    _boundElement: null as HTMLElement | null,

    getTemplate() {
        return template;
    },

    init(): void {
        const modal = document.getElementById('editNameModal');
        if (!modal || modal === this._boundElement) return;
        this._boundElement = modal;

        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-action="close-modal"]')) {
                this.close();
            }
            if (target.closest('[data-action="save-name"]')) {
                this.handleSave();
            }
        });
    },

    open(): void {
        const modal = document.getElementById('editNameModal');
        if (modal) modal.style.display = 'flex';
    },

    close(): void {
        const modal = document.getElementById('editNameModal');
        if (modal) modal.style.display = 'none';
    },

    async handleSave(): Promise<void> {
        const input = document.getElementById('editNameInput') as HTMLInputElement;
        const newName = input?.value.trim();

        if (!newName || newName.length < 2) {
            uiActions.showError('Имя слишком короткое');
            return;
        }

        if (!networkStatus.isOnline) {
            // Offline: сохраняем локально и ставим в очередь
            store.setState({ user: { ...(store.user ?? {}), name: newName } });
            await syncQueue.add({
                type: 'UPDATE_NAME',
                payload: { name: newName },
                timestamp: Date.now(),
            });
            uiActions.showSuccess('Имя сохранено, обновится при подключении');
            this.close();
            eventBus.emit('profile:update-ui');
            return;
        }

        uiActions.showLoading(true);
        try {
            const res = await ProfileService.updateName(newName);
            if (res.success && res.data) {
                store.setState({ user: { ...(store.user ?? {}), name: res.data.name } });
                uiActions.showSuccess('Имя обновлено');
                this.close();
                eventBus.emit('profile:update-ui');
            }
        } catch {
            // Если запрос упал — сохраняем для синхронизации
            store.setState({ user: { ...(store.user ?? {}), name: newName } });
            await syncQueue.add({
                type: 'UPDATE_NAME',
                payload: { name: newName },
                timestamp: Date.now(),
            });
            uiActions.showSuccess('Имя сохранено, обновится при подключении');
            this.close();
            eventBus.emit('profile:update-ui');
        } finally {
            uiActions.showLoading(false);
        }
    },
};
