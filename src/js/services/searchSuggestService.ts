/**
 * Сервис подсказок поиска. Запрашивает существующий endpoint /ads,
 * затем фильтрует результат на клиенте по вхождению query в title —
 * backend сейчас игнорирует параметр query и отдаёт все объявления,
 * поэтому без клиентской фильтрации dropdown показывал всё подряд.
 */

import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import { store } from '@/core/store';

export interface SuggestItem {
    id: number;
    title: string;
    image: string;
    price: number;
}

const STATIC_BACKEND = CONFIG.API.BASE_URL;
const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';

const buildImageUrl = (raw: string): string => {
    if (!raw) return DEFAULT_AD_IMAGE;
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
        return raw;
    }
    const normalized = raw.startsWith('/') ? raw : `/${raw}`;
    return `${STATIC_BACKEND}${normalized}`;
};

const pickImage = (ad: any): string => {
    const candidate =
        (Array.isArray(ad?.photos) && ad.photos[0]) ||
        ad?.image_path ||
        ad?.image ||
        ad?.preview ||
        '';
    return buildImageUrl(typeof candidate === 'string' ? candidate.trim() : '');
};

const FETCH_LIMIT = 80;

const matches = (haystack: string, needle: string): boolean =>
    haystack.toLowerCase().includes(needle.toLowerCase());

export const searchSuggestService = {
    async search(query: string, limit = 8): Promise<SuggestItem[]> {
        const trimmed = query.trim();
        if (trimmed.length < 1) return [];

        // Сначала пробуем уже загруженный список с главной — это даёт мгновенный отклик.
        const cached = (store.ads as any[]) || [];
        if (cached.length > 0) {
            const filtered = cached
                .filter((ad) => ad?.title && matches(String(ad.title), trimmed))
                .slice(0, limit)
                .map((ad: any) => ({
                    id: Number(ad.id),
                    title: String(ad.title),
                    image: pickImage(ad),
                    price: Number(ad.price || 0),
                }))
                .filter((item) => item.id && item.title);
            if (filtered.length > 0) return filtered;
        }

        const url = `${API_ENDPOINTS.ADS.GET_ALL}?query=${encodeURIComponent(trimmed)}&limit=${FETCH_LIMIT}`;
        const result = await apiClient.get<any>(url);
        if (!result.success || !result.data) return [];

        const data = result.data;
        const list: any[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.ads)
              ? data.ads
              : Array.isArray(data?.data)
                ? data.data
                : [];

        return list
            .filter((ad) => ad && ad.title && matches(String(ad.title), trimmed))
            .slice(0, limit)
            .map((ad: any) => ({
                id: Number(ad.id),
                title: String(ad.title),
                image: pickImage(ad),
                price: Number(ad.price || 0),
            }))
            .filter((item) => item.id && item.title);
    },
};
