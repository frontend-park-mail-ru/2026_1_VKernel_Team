import { sellerService } from '@modules/seller-page/service';
import { sellerPageStore } from '@modules/seller-page/store';
import type { SellerAd } from '@modules/seller-page/types';

const activeStatuses = new Set(['active']);
const closedStatuses = new Set(['reserved', 'sold', 'archived']);

export const sellerPageActions = {
    async loadSellerPage(sellerId: string): Promise<void> {
        sellerPageStore.setState({ error: null, isLoading: true });

        try {
            const profileRes = await sellerService.getProfile(sellerId);

            if (!profileRes.success || !profileRes.data) {
                sellerPageStore.setState({
                    profile: null,
                    error: 'Продавец не найден',
                    isLoading: false,
                });
                return;
            }

            const profile = sellerService.formatProfile(profileRes.data);

            const adsRes = await sellerService.getAds(sellerId).catch(() => ({
                success: false as const,
                data: [] as SellerAd[],
            }));

            const allAds = adsRes.success && Array.isArray(adsRes.data) ? adsRes.data : [];

            const activeAds = allAds
                .filter((ad: SellerAd) => {
                    const status = ad.status?.toLowerCase();
                    return status ? activeStatuses.has(status) : true;
                })
                .map((ad: SellerAd) => sellerService.formatAdCard(ad));

            const closedAds = allAds
                .filter((ad: SellerAd) => {
                    const status = ad.status?.toLowerCase();
                    return status ? closedStatuses.has(status) : false;
                })
                .map((ad: SellerAd) => ({ ...sellerService.formatAdCard(ad), archived: true }));

            sellerPageStore.setState({
                profile,
                activeAds,
                closedAds,
                isLoading: false,
            });
        } catch (error) {
            sellerPageStore.setState({
                error: 'Не удалось соединиться с сервером',
                isLoading: false,
            });
        }
    },
};
