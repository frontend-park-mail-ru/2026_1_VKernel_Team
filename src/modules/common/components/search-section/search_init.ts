// src/modules/common/search-init.ts

// Маппинг категорий
const CATEGORY_ID_MAP: Record<string, number> = {
    'Авто': 21,
    'Недвижимость': 2,
    'Работа': 22,
    'Одежда, обувь, аксессуары': 11,
    'Хобби и отдых': 4,
    'Животные': 16,
    'Электроника': 1,
    'Для дома и дачи': 17,
    'Запчасти': 18,
    'Товары для детей': 23,
    'Красота и здоровье': 15,
    'Музыка': 5,
    'Ремонт': 6,
    'Туризм': 7,
    'Техника для дома': 8,
    'Игрушки': 9,
    'Настольные игры': 10,
    'Книги': 14,
    'Спорт': 19,
    'Канцелярия': 20,
};

let categoryObserver: MutationObserver | null = null;

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

// src/modules/common/search-section/search-init.ts

let initAttempts = 0;
const MAX_ATTEMPTS = 10;

function initSearchHandlers(): void {
    const searchInput = document.getElementById('globalSearchInput') as HTMLInputElement;
    const searchBtn = document.getElementById('globalSearchBtn') as HTMLButtonElement;
    
    console.log('🔍 searchInput найден:', searchInput);
    console.log('🔍 searchBtn найден:', searchBtn);
    
    if (!searchInput || !searchBtn) {
        if (initAttempts < MAX_ATTEMPTS) {
            initAttempts++;
            console.log(`⚠️ Попытка ${initAttempts} из ${MAX_ATTEMPTS}, повтор через 500ms...`);
            setTimeout(initSearchHandlers, 500);
        } else {
            console.error('❌ Элементы поиска не найдены после всех попыток');
        }
        return;
    }
    
    initAttempts = 0;
    
    const performSearch = () => {
        const query = searchInput.value.trim();
        console.log('🔍 Поиск:', query);
        if (query) {
            window.location.href = `/search?query=${encodeURIComponent(query)}`;
        }
    };
    
    // Удаляем старые обработчики, чтобы не дублировать
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
    
    console.log('✅ Search handlers attached');
}

export function initGlobalSearch(): void {
    // Запускаем инициализацию с задержкой
    setTimeout(initSearchHandlers, 500);
    
    // Следим за изменениями в DOM (для страницы поиска)
    const observer = new MutationObserver(() => {
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            initSearchHandlers();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
