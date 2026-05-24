import template from '@modules/reviews/components/star-rating-input/star-rating-input.hbs';
import '@modules/reviews/components/star-rating-input/star-rating-input.scss';
import starFilled from '@assets/icons/star-filled.svg?raw';
import starEmpty from '@assets/icons/star-empty.svg?raw';

export interface StarRatingInputApi {
    setValue(value: number): void;
    getValue(): number;
    destroy(): void;
}

export const StarRatingInputComponent = {
    getTemplate() {
        return template;
    },
};

export function mountStarRatingInput(
    root: HTMLElement,
    options: { value?: number; onChange?: (value: number) => void } = {},
): StarRatingInputApi {
    const stars = Array.from(root.querySelectorAll<HTMLButtonElement>('.star-rating-input__star'));
    const valueLabel = root.querySelector<HTMLElement>('.star-rating-input__value');
    let currentValue = options.value ?? 0;

    function paint(target: number): void {
        stars.forEach((btn) => {
            const star = Number(btn.dataset.star);
            const filled = star <= target;
            const iconWrap = btn.querySelector<HTMLElement>('.star-rating-input__icon');
            if (iconWrap) {
                iconWrap.dataset.state = filled ? 'filled' : 'empty';
                iconWrap.innerHTML = filled ? starFilled : starEmpty;
            }
        });
    }

    function syncAccessibility(value: number): void {
        stars.forEach((btn) => {
            const star = Number(btn.dataset.star);
            const checked = star === value;
            btn.setAttribute('aria-checked', checked ? 'true' : 'false');
            btn.tabIndex = checked || (value === 0 && star === 1) ? 0 : -1;
        });
        root.dataset.rating = String(value);
        if (valueLabel) {
            valueLabel.textContent = value > 0 ? `${value} из 5` : 'Выберите оценку';
        }
    }

    function setValue(value: number): void {
        const clamped = Math.max(0, Math.min(5, Math.floor(value)));
        currentValue = clamped;
        paint(clamped);
        syncAccessibility(clamped);
        options.onChange?.(clamped);
    }

    const perStarHandlers: Array<{
        btn: HTMLButtonElement;
        enter: (e: Event) => void;
        click: (e: Event) => void;
    }> = [];

    stars.forEach((btn) => {
        const star = Number(btn.dataset.star) || 0;
        const enter = () => paint(star);
        const click = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            setValue(star);
        };
        btn.addEventListener('mouseenter', enter);
        btn.addEventListener('click', click);
        perStarHandlers.push({ btn, enter, click });
    });

    function onPointerLeave(): void {
        paint(currentValue);
    }

    function onKeydown(e: KeyboardEvent): void {
        const key = e.key;
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
            e.preventDefault();
            const delta = key === 'ArrowRight' || key === 'ArrowUp' ? 1 : -1;
            const next = Math.max(1, Math.min(5, (currentValue || 1) + delta));
            setValue(next);
            return;
        }
        if (/^[1-5]$/.test(key)) {
            e.preventDefault();
            setValue(Number(key));
        }
    }

    root.addEventListener('mouseleave', onPointerLeave);
    root.addEventListener('keydown', onKeydown);

    setValue(currentValue);

    return {
        setValue,
        getValue: () => currentValue,
        destroy(): void {
            root.removeEventListener('mouseleave', onPointerLeave);
            root.removeEventListener('keydown', onKeydown);
            perStarHandlers.forEach(({ btn, enter, click }) => {
                btn.removeEventListener('mouseenter', enter);
                btn.removeEventListener('click', click);
            });
        },
    };
}
