import '@modules/common/components/search-section/style.scss';

export const SearchSectionComponent = {
    getTemplate(): string {
        return `
<div class="search-section">
    <div class="search-row">
        <div class="brand">
            <img src="/images/logo/logo_clover2.jpeg" alt="Логотип" class="logo" data-nav="/">
        </div>
        <div class="search-wrapper">
            <input 
                type="text" 
                class="search-input" 
                id="globalSearchInput"
                placeholder="Поиск объявлений..."
            >
            <button class="btn place-ad-btn" id="globalSearchBtn">Найти</button>
        </div>
        <div class="geo">
            <span class="icon">📍</span>
            <span class="city">Москва</span>
        </div>
    </div>
</div>
        `.trim();
    },

    initSearchHandlers(): void {
        const searchInput = document.getElementById('globalSearchInput') as HTMLInputElement;
        const searchBtn = document.getElementById('globalSearchBtn') as HTMLButtonElement;

        if (!searchInput || !searchBtn) return;

        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/search?query=${encodeURIComponent(query)}`;
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    },
};
