const AdsService = {
    API_URL: 'http://clover-go.ru:8000/api/v1',
    
    async getAllAds() {
        try {
            const response = await fetch(`${this.API_URL}/ads`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Ошибка загрузки объявлений');
            }
            
            const data = await response.json();
            return {
                success: true,
                ads: data
            };
        } catch (error) {
            console.error('Ошибка получения объявлений:', error);
            return {
                success: false,
                error: 'Не удалось загрузить объявления'
            };
        }
    },
    
    async getAdById(id) {
        try {
            const response = await fetch(`${this.API_URL}/ads/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Объявление не найдено');
            }
            
            const data = await response.json();
            return {
                success: true,
                ad: data
            };
        } catch (error) {
            console.error('Ошибка получения объявления:', error);
            return {
                success: false,
                error: 'Не удалось загрузить объявление'
            };
        }
    },
    
    formatAdCard(ad) {
    const STATIC_URL = 'http://clover-go.ru:8000';
    const firstPhoto = ad.photos?.[0] || '';
    const imageUrl = firstPhoto 
        ? `${STATIC_URL}${firstPhoto}` 
        : '/images/placeholder.jpg';
    
    return {
        id: ad.id,
        title: ad.title,
        description: ad.description?.substring(0, 100) + '...',
        price: ad.price.toLocaleString('ru-RU') + ' ₽',
        location: ad.location || 'Не указано',
        image: imageUrl,
        views: ad.views_count || 0,
        favorites: ad.favorites_count || 0,
        date: new Date(ad.created_at).toLocaleDateString('ru-RU')
    };
    }
};