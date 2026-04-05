/**
 * Система событий для реактивного обновления состояния
 * Позволяет компонентам подписываться на изменения и получать уведомления
 */

type Callback = (data?: any) => void;

export class EventBus {
    private events: Map<string, Set<Callback>> = new Map();

    /**
     * Подписка на событие
     * @returns функция для отписки
     */
    on(event: string, callback: Callback): () => void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)!.add(callback);

        return () => this.off(event, callback);
    }

    /**
     * Отписка от события
     */
    off(event: string, callback: Callback): void {
        this.events.get(event)?.delete(callback);
    }

    /**
     * Публикация события
     */
    emit(event: string, data?: any): void {
        this.events.get(event)?.forEach(callback => callback(data));
    }

    /**
     * Очистка всех событий
     */
    clear(): void {
        this.events.clear();
    }
}

export const eventBus = new EventBus();
