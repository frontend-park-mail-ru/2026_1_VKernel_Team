import '@modules/common/components/search-section/styles.css';

export const SearchSectionComponent = {
    getTemplate(): string {
        return `
<div class="search-section">
    <div class="search-row">
        <div class="brand">
            <img src="images/logo/logo_clover2.jpeg" alt="Логотип" class="logo" data-nav="/">
        </div>
        <div class="search-wrapper">
            <input type="text" class="search-input" placeholder="Поиск объявлений...">
            <button class="btn place-ad-btn">Найти</button>
        </div>
        <div class="geo">
            <span class="icon">📍</span>
            <span class="city">Москва</span>
        </div>
    </div>
</div>
        `.trim();
    },
};
