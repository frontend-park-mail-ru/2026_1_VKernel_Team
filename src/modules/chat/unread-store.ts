/**
 * Клиентское хранение последнего прочтения чатов в localStorage.
 * Чат считается непрочитанным, если время последнего сообщения > сохранённого last-read.
 *
 * Состояние привязано к user_id, чтобы при повторном входе данные сохранялись,
 * а на одном браузере с несколькими аккаунтами состояния не смешивались.
 */
import { chatService } from '@modules/chat/service';
import { store } from '@/core/store';
import type { ChatPreview } from '@modules/chat/types';

const STORAGE_KEY = 'clover.chat.lastRead';
export const UNREAD_CHANGED_EVENT = 'chats:unread-changed';

type LastReadMap = Record<string, string>;
type AllMaps = Record<string, LastReadMap>;

function getCurrentUserKey(): string | null {
    const u = store.user;
    if (!u) return null;
    const id = (u.id ?? u.user_id) as number | string | undefined;
    return id != null ? String(id) : null;
}

function loadAllMaps(): AllMaps {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return typeof parsed === 'object' && parsed ? (parsed as AllMaps) : {};
    } catch {
        return {};
    }
}

function loadMap(): LastReadMap {
    const userKey = getCurrentUserKey();
    if (!userKey) return {};
    const all = loadAllMaps();
    return all[userKey] || {};
}

function saveMap(map: LastReadMap): void {
    const userKey = getCurrentUserKey();
    if (!userKey) return;
    try {
        const all = loadAllMaps();
        all[userKey] = map;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
        // quota / unavailable — игнорируем
    }
}

function lastMessageTs(chat: ChatPreview): number {
    const ts = chat.last_message?.created_at;
    if (!ts) return 0;
    const d = new Date(ts).getTime();
    return isNaN(d) ? 0 : d;
}

let cachedUnreadCount = 0;

export const unreadStore = {
    get count(): number {
        return cachedUnreadCount;
    },

    isUnread(chat: ChatPreview): boolean {
        const lastMsg = lastMessageTs(chat);
        if (!lastMsg) return false;
        const map = loadMap();
        const lastRead = map[String(chat.chat_id)];
        if (!lastRead) return true;
        return new Date(lastRead).getTime() < lastMsg;
    },

    /**
     * Пометить чат прочитанным на момент `uptoIso` (обычно — время последнего видимого сообщения).
     * Если `uptoIso` не передан — берётся текущее время.
     */
    markRead(chatId: number | string, uptoIso?: string): void {
        const map = loadMap();
        const prev = map[String(chatId)];
        const nextIso = uptoIso || new Date().toISOString();
        const prevTs = prev ? new Date(prev).getTime() : 0;
        const nextTs = new Date(nextIso).getTime();
        if (!isNaN(nextTs) && nextTs > prevTs) {
            map[String(chatId)] = nextIso;
            saveMap(map);
        }
    },

    /**
     * Пересчитать кэш количества непрочитанных по списку чатов и разослать событие.
     */
    recomputeFromChats(chats: ChatPreview[]): number {
        cachedUnreadCount = chats.reduce((sum, c) => sum + (this.isUnread(c) ? 1 : 0), 0);
        window.dispatchEvent(
            new CustomEvent(UNREAD_CHANGED_EVENT, { detail: { count: cachedUnreadCount } }),
        );
        return cachedUnreadCount;
    },

    /**
     * Подтянуть список чатов с сервера и обновить счётчик (fire-and-forget).
     * Используется при старте/логине, чтобы цифра сразу появилась в хедере.
     */
    async refreshCountFromServer(): Promise<void> {
        try {
            const result = await chatService.getChats();
            if (result.success && result.data?.chats) {
                this.recomputeFromChats(result.data.chats);
            }
        } catch {
            // fallback: оставляем прежний счётчик
        }
    },

    /**
     * Сбрасывает только кэш счётчика (обычно — при логауте, чтобы бейдж исчез).
     * Per-user-данные в localStorage не стираем: после повторного входа
     * пользователь увидит корректное состояние прочтений.
     */
    reset(): void {
        cachedUnreadCount = 0;
        window.dispatchEvent(new CustomEvent(UNREAD_CHANGED_EVENT, { detail: { count: 0 } }));
    },
};
