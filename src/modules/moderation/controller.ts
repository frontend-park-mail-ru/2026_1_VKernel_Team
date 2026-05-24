import '@modules/moderation/styles/moderation.scss';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { CONFIG } from '@/core/config';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { moderationApi } from '@modules/moderation/api';
import { moderationStore } from '@modules/moderation/store';
import type { Ad } from '@/types';

import pageTemplateRaw from '@modules/moderation/pages/moderation-page.hbs?raw';
import itemTemplateRaw from '@modules/moderation/components/moderation-queue-item/moderation-queue-item.hbs?raw';

declare const Handlebars: any;

const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';

let pageCompiled: ((ctx: any) => string) | null = null;
let itemCompiled: ((ctx: any) => string) | null = null;

function buildImageUrl(ad: Ad): string {
    if (!ad.photos || ad.photos.length === 0) return DEFAULT_AD_IMAGE;
    const path = ad.photos[0]?.trim();
    if (!path) return DEFAULT_AD_IMAGE;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${CONFIG.API.BASE_URL}${normalized}`;
}

function formatAd(ad: Ad): any {
    return {
        id: ad.id,
        title: ad.title || 'Без названия',
        formattedPrice: ad.price === 0 ? 'Бесплатно' : `${ad.price.toLocaleString('ru-RU')} ₽`,
        image: buildImageUrl(ad),
        location: ad.location || '',
        description: ad.description || '',
        sellerName: ad.seller_name || '',
    };
}

function compilePartials(): void {
    if (!itemCompiled) {
        itemCompiled = Handlebars.compile(itemTemplateRaw);
        Handlebars.registerPartial(
            'moderation/components/moderation-queue-item/moderation-queue-item',
            itemTemplateRaw,
        );
    }
    Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());
    if (!pageCompiled) {
        pageCompiled = Handlebars.compile(pageTemplateRaw);
    }
}

function isAdmin(): boolean {
    return store.user?.role === 'admin';
}

export const ModerationController = {
    _ads: [] as Ad[],
    _enabled: false,

    async render(): Promise<void> {
        const app = document.getElementById('app');
        if (!app) return;

        if (!store.isAuthenticated || !isAdmin()) {
            window.dispatchEvent(new CustomEvent('app:navigate', { detail: { path: '/' } }));
            return;
        }

        compilePartials();
        app.innerHTML = '<div class="moderation-page"><p>Загрузка…</p></div>';

        const [settingsRes, queueRes] = await Promise.all([
            moderationApi.getSettings(),
            moderationApi.getQueue(),
        ]);

        this._enabled = !!(settingsRes.success && settingsRes.data?.enabled);

        let ads: Ad[] = [];
        if (queueRes.success && queueRes.data) {
            const data: any = queueRes.data;
            if (Array.isArray(data.ads)) {
                ads = data.ads;
            } else if (Array.isArray(data)) {
                ads = data;
            } else {
                const arrays = Object.values(data).filter(Array.isArray);
                if (arrays.length > 0) ads = arrays[0] as Ad[];
            }
        }
        this._ads = ads;
        moderationStore.set(ads.length);

        this.renderPage(app);
    },

    renderPage(app: HTMLElement): void {
        if (!pageCompiled) return;
        app.innerHTML = pageCompiled({
            enabled: this._enabled,
            ads: this._ads.map(formatAd),
        });
        this.attachEvents();
        SearchSectionComponent.initSearchHandlers();
    },

    renderQueue(): void {
        const queueEl = document.getElementById('moderationQueue');
        if (!queueEl || !itemCompiled) return;

        if (this._ads.length === 0) {
            queueEl.innerHTML =
                '<div class="moderation-queue__empty">Очередь модерации пуста</div>';
            return;
        }

        queueEl.innerHTML = this._ads.map((ad) => itemCompiled!(formatAd(ad))).join('');
    },

    attachEvents(): void {
        const toggle = document.getElementById('moderationToggle') as HTMLInputElement | null;
        if (toggle) {
            toggle.addEventListener('change', async () => {
                const next = toggle.checked;
                toggle.disabled = true;
                const res = await moderationApi.updateSettings(next);
                if (res.success && res.data) {
                    this._enabled = !!res.data.enabled;
                    uiActions.showSuccess(
                        this._enabled ? 'Модерация включена' : 'Модерация выключена',
                    );
                    const labelEl = document.querySelector(
                        '.moderation-page__settings-label',
                    ) as HTMLElement | null;
                    if (labelEl) {
                        labelEl.textContent = this._enabled
                            ? 'Модерация включена'
                            : 'Модерация выключена';
                    }
                    toggle.checked = this._enabled;
                } else {
                    toggle.checked = !next;
                    uiActions.showError(res.error || 'Не удалось обновить настройку');
                }
                toggle.disabled = false;
            });
        }

        const queueEl = document.getElementById('moderationQueue');
        if (!queueEl) return;

        queueEl.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const actionEl = target.closest('[data-action]') as HTMLElement | null;
            if (!actionEl) return;

            const action = actionEl.dataset.action;
            const adId = actionEl.dataset.adId;
            if (!adId) return;

            if (action === 'moderation-open-ad') {
                window.dispatchEvent(
                    new CustomEvent('app:navigate', { detail: { path: `/ad/${adId}` } }),
                );
                return;
            }

            const card = actionEl.closest('[data-moderation-card]') as HTMLElement | null;
            if (!card) return;

            if (action === 'moderation-approve') {
                this.handleApprove(adId, card, actionEl as HTMLButtonElement);
                return;
            }

            if (action === 'moderation-reject-toggle') {
                const form = card.querySelector(
                    '[data-moderation-reject-form]',
                ) as HTMLElement | null;
                if (form) {
                    form.style.display = form.style.display === 'none' ? 'flex' : 'none';
                    if (form.style.display !== 'none') {
                        const ta = form.querySelector(
                            '[data-moderation-reject-reason]',
                        ) as HTMLTextAreaElement | null;
                        ta?.focus();
                    }
                }
                return;
            }

            if (action === 'moderation-reject-cancel') {
                const form = card.querySelector(
                    '[data-moderation-reject-form]',
                ) as HTMLElement | null;
                if (form) form.style.display = 'none';
                return;
            }

            if (action === 'moderation-reject-submit') {
                this.handleReject(adId, card, actionEl as HTMLButtonElement);
            }
        });
    },

    async handleApprove(adId: string, card: HTMLElement, btn: HTMLButtonElement): Promise<void> {
        btn.disabled = true;
        const res = await moderationApi.approve(adId);
        if (res.success) {
            uiActions.showSuccess('Объявление одобрено');
            this.removeAd(adId, card);
        } else {
            uiActions.showError(res.error || 'Не удалось одобрить объявление');
            btn.disabled = false;
        }
    },

    async handleReject(adId: string, card: HTMLElement, btn: HTMLButtonElement): Promise<void> {
        const ta = card.querySelector(
            '[data-moderation-reject-reason]',
        ) as HTMLTextAreaElement | null;
        const reason = ta?.value.trim() || '';

        btn.disabled = true;
        const res = await moderationApi.reject(adId, reason);
        if (res.success) {
            uiActions.showSuccess('Объявление отклонено');
            this.removeAd(adId, card);
        } else {
            uiActions.showError(res.error || 'Не удалось отклонить объявление');
            btn.disabled = false;
        }
    },

    removeAd(adId: string, card: HTMLElement): void {
        this._ads = this._ads.filter((ad) => String(ad.id) !== String(adId));
        moderationStore.set(this._ads.length);
        card.remove();

        if (this._ads.length === 0) {
            const queueEl = document.getElementById('moderationQueue');
            if (queueEl) {
                queueEl.innerHTML =
                    '<div class="moderation-queue__empty">Очередь модерации пуста</div>';
            }
        }
    },
};
