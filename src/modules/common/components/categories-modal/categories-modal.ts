import './categories-modal.scss';
import { categoryService } from '@/services/categoryService';
import { eventBus } from '@/core/eventBus';

const ROOT_ID = 'clover-categories-modal-root';

const ensureRoot = (): HTMLElement => {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;

    root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'categories-modal';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', `${ROOT_ID}-title`);
    root.innerHTML = `
        <div class="categories-modal__dialog">
            <div class="categories-modal__header">
                <h2 id="${ROOT_ID}-title" class="categories-modal__title">Все категории</h2>
                <button type="button" class="categories-modal__close" data-modal-close aria-label="Закрыть">×</button>
            </div>
            <div class="categories-modal__body">
                <div class="categories-modal__grid"></div>
            </div>
        </div>
    `;
    document.body.appendChild(root);
    return root;
};

const close = (): void => {
    const root = document.getElementById(ROOT_ID);
    if (root) root.classList.remove('is-open');
};

const renderItems = (root: HTMLElement, categories: { id: number; name: string }[]): void => {
    const grid = root.querySelector('.categories-modal__grid');
    if (!grid) return;
    grid.innerHTML = categories
        .map(
            (c) =>
                `<button type="button" class="categories-modal__item" data-category-id="${c.id}">${c.name}</button>`,
        )
        .join('');
};

let attached = false;

const attachHandlers = (root: HTMLElement): void => {
    if (attached) return;
    attached = true;

    // Закрытие по клику на overlay
    root.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target === root) {
            close();
            return;
        }
        if (target.closest('[data-modal-close]')) {
            close();
            return;
        }
        const item = target.closest('[data-category-id]') as HTMLElement | null;
        if (item) {
            const id = item.dataset.categoryId;
            close();
            eventBus.emit('app:navigate', `/search?category_id=${id}`);
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && root.classList.contains('is-open')) {
            close();
        }
    });
};

export const CategoriesModal = {
    async open(): Promise<void> {
        const root = ensureRoot();
        attachHandlers(root);

        // Изначально показываем фолбэк, чтобы не было пустоты во время загрузки.
        renderItems(root, categoryService.getFallbackCategories());
        root.classList.add('is-open');

        try {
            const cats = await categoryService.getAllCategories();
            if (Array.isArray(cats) && cats.length > 0) {
                renderItems(root, cats);
            }
        } catch {
            // Уже отрисовали фолбэк — ничего не делаем
        }
    },

    close,
};
