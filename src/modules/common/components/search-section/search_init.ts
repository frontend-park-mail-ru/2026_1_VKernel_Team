const CATEGORY_ID_MAP: Record<string, number> = {
    Авто: 21,
    Недвижимость: 2,
    Работа: 22,
    'Одежда, обувь, аксессуары': 11,
    'Хобби и отдых': 4,
    Животные: 16,
    Электроника: 1,
    'Для дома и дачи': 17,
    Запчасти: 18,
    'Товары для детей': 23,
    'Красота и здоровье': 15,
    Музыка: 5,
    Ремонт: 6,
    Туризм: 7,
    'Техника для дома': 8,
    Игрушки: 9,
    'Настольные игры': 10,
    Книги: 14,
    Спорт: 19,
    Канцелярия: 20,
};

const categoryObserver: MutationObserver | null = null;

function handleCategoryClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    const card = e.currentTarget as HTMLElement;
    const titleElement = card.querySelector('.card-title');
    let categoryTitle = titleElement?.textContent?.trim() || '';

    if (categoryTitle === 'Все категории' || categoryTitle === 'Все<br>категории') {
        return;
    }

    categoryTitle = categoryTitle.replace(/→/g, '').trim();
    const categoryId = CATEGORY_ID_MAP[categoryTitle];

    let searchUrl = `/search?query=${encodeURIComponent(categoryTitle)}`;
    if (categoryId) {
        searchUrl += `&category_id=${categoryId}`;
    }

    window.location.href = searchUrl;
}

function initCategoryHandlers(): void {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card) => {
        card.removeEventListener('click', handleCategoryClick);
        card.addEventListener('click', handleCategoryClick);
    });
}

let initAttempts = 0;
const MAX_ATTEMPTS = 10;

function initSearchHandlers(): void {
    const searchInput = document.getElementById('globalSearchInput') as HTMLInputElement;
    const searchBtn = document.getElementById('globalSearchBtn') as HTMLButtonElement;

    if (!searchInput || !searchBtn) {
        if (initAttempts < MAX_ATTEMPTS) {
            initAttempts++;
            setTimeout(initSearchHandlers, 500);
        } else {
            console.error('Search elements not found after all attempts');
        }
        return;
    }

    initAttempts = 0;

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `/search?query=${encodeURIComponent(query)}`;
        }
    };

    searchBtn.removeEventListener('click', performSearch);
    searchInput.removeEventListener('keydown', handleKeyPress);

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', handleKeyPress);

    function handleKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    }
}

export function initGlobalSearch(): void {
    setTimeout(initSearchHandlers, 500);

    // На странице поиска инпут перерисовывается при роутинге — наблюдаем за DOM
    const observer = new MutationObserver(() => {
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            initSearchHandlers();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
