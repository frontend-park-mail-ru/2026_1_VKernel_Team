import { apiClient, API_ENDPOINTS } from '../api/apiClient.js';
import { CONFIG } from '../core/config.js';
import { AppController } from './AppController.js';
const AdsController = {
    async renderMain() {
        document.body.classList.remove('auth-page');
        const app = document.getElementById('app');
        if (!app || !AppController.templates['main-page'])
            return;
        const adsResult = await apiClient.get(API_ENDPOINTS.ADS.GET_ALL);
        const ads = adsResult.success && adsResult.data ? adsResult.data : [];
        const formattedAds = ads.map((ad) => this.formatAdCard(ad));
        app.innerHTML = AppController.templates['main-page']({
            isAuthenticated: AppController.isAuthenticated,
            user: AppController.user,
            recommendations: formattedAds,
        });
        this.attachMainEventListeners();
    },
    formatAdCard(ad) {
        let imageUrl = AppController.UI_CONSTANTS.DEFAULT_AD_IMAGE;
        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0];
            if (photoPath) {
                imageUrl = photoPath.startsWith('http')
                    ? photoPath
                    : `${CONFIG.API.BASE_URL}${photoPath}`;
            }
        }
        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl,
            views: ad.views_count || 0,
            favorites: ad.favorites_count || 0,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        };
    },
    attachMainEventListeners() {
        const profileIcon = document.querySelector('.profile-icon');
        profileIcon?.addEventListener('click', (e) => {
            e.preventDefault();
            AppController.navigateTo(AppController.isAuthenticated ? '/profile' : '/login');
        });
        const placeAdBtn = document.querySelector('.place-ad-btn');
        if (placeAdBtn) {
            placeAdBtn.disabled = true;
            placeAdBtn.title = 'Функция временно недоступна';
        }
        document.querySelectorAll('.ad-card').forEach(card => {
            card.addEventListener('click', () => {
                const adId = card.dataset.id;
                console.log('Ad clicked:', adId);
            });
        });
    },
};
export { AdsController };
