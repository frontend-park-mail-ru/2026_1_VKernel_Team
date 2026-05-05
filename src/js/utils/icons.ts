/**
 * Реестр SVG-иконок проекта.
 * Иконки лежат в src/assets/icons/*.svg, импортируются как сырые строки
 * через `?raw` query (см. webpack.config.js — правило для svg + ?raw).
 *
 * Использование в шаблонах: {{{icon "arrow-left"}}} или {{icon "arrow-left"}}.
 * Использование в TS: ICONS['arrow-left'] возвращает строку SVG.
 */

import arrowLeft from '@assets/icons/arrow-left.svg?raw';
import arrowRight from '@assets/icons/arrow-right.svg?raw';
import chevronLeft from '@assets/icons/chevron-left.svg?raw';
import chevronRight from '@assets/icons/chevron-right.svg?raw';
import check from '@assets/icons/check.svg?raw';
import starFilled from '@assets/icons/star-filled.svg?raw';
import starEmpty from '@assets/icons/star-empty.svg?raw';
import starHalf from '@assets/icons/star-half.svg?raw';
import search from '@assets/icons/search.svg?raw';
import pin from '@assets/icons/pin.svg?raw';
import warning from '@assets/icons/warning.svg?raw';
import socialTg from '@assets/icons/social-tg.svg?raw';
import socialVk from '@assets/icons/social-vk.svg?raw';
import socialYt from '@assets/icons/social-yt.svg?raw';
import eye from '@assets/icons/eye.svg?raw';
import eyeOff from '@assets/icons/eye-off.svg?raw';
import views from '@assets/icons/views.svg?raw';
import cart from '@assets/icons/cart.svg?raw';
import trash from '@assets/icons/trash.svg?raw';
import edit from '@assets/icons/edit.svg?raw';
import close from '@assets/icons/close.svg?raw';
import camera from '@assets/icons/camera.svg?raw';
import bag from '@assets/icons/bag.svg?raw';
import inbox from '@assets/icons/inbox.svg?raw';
import user from '@assets/icons/user.svg?raw';

export const ICONS: Record<string, string> = {
    'arrow-left': arrowLeft,
    'arrow-right': arrowRight,
    'chevron-left': chevronLeft,
    'chevron-right': chevronRight,
    check,
    'star-filled': starFilled,
    'star-empty': starEmpty,
    'star-half': starHalf,
    search,
    pin,
    warning,
    'social-tg': socialTg,
    'social-vk': socialVk,
    'social-yt': socialYt,
    eye,
    'eye-off': eyeOff,
    views,
    cart,
    trash,
    edit,
    close,
    camera,
    bag,
    inbox,
    user,
};

/**
 * Возвращает SVG-строку иконки. Пустая строка, если имя не найдено.
 */
export const getIcon = (name: string): string => ICONS[name] || '';

/**
 * Рендерит шкалу из 5 звёзд по рейтингу 0..5 (с шагом 0.5).
 * Возвращает строку HTML с SVG-звёздами (filled/half/empty).
 */
export const renderStarsHTML = (rating: number): string => {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.floor(r);
    const hasHalf = r - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    let out = '';
    for (let i = 0; i < full; i++) out += starFilled;
    if (hasHalf) out += starHalf;
    for (let i = 0; i < empty; i++) out += starEmpty;
    return out;
};
