import type { PriceHistoryPoint } from './api';
import type { ChartPoint, ChartStats } from './types';

export function formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export function formatDateForChart(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Группирует историю по дню. Для каждого дня берём ПОСЛЕДНЕЕ изменение (по changed_at).
 * Возвращает массив { day, lastPrice, count } отсортированный по дню (возр.).
 */
export function aggregateByDay(
    history: PriceHistoryPoint[],
): { day: string; lastPrice: number; count: number; lastChangedAt: string }[] {
    const map = new Map<
        string,
        { day: string; lastPrice: number; count: number; lastChangedAt: string }
    >();

    for (const point of history) {
        const day = formatDateForChart(point.changed_at);
        if (!day) continue;
        const existing = map.get(day);
        if (!existing) {
            map.set(day, {
                day,
                lastPrice: point.price,
                count: 1,
                lastChangedAt: point.changed_at,
            });
        } else {
            existing.count += 1;
            // берём последний по времени
            if (new Date(point.changed_at).getTime() > new Date(existing.lastChangedAt).getTime()) {
                existing.lastPrice = point.price;
                existing.lastChangedAt = point.changed_at;
            }
        }
    }

    return Array.from(map.values()).sort((a, b) => (a.day < b.day ? -1 : 1));
}

export function convertToChartPoints(
    history: PriceHistoryPoint[],
    createdAt: string,
    currentPrice: number,
): ChartPoint[] {
    const points: ChartPoint[] = [];

    if (!history.length) {
        const createdDay = formatDateForChart(createdAt);
        if (createdDay) {
            points.push({ time: createdDay, value: currentPrice });
        }

        const today = formatDateForChart(new Date().toISOString());
        if (today && today !== createdDay) {
            points.push({ time: today, value: currentPrice });
        }

        return points;
    }

    const daily = aggregateByDay(history);
    for (const d of daily) {
        points.push({ time: d.day, value: d.lastPrice });
    }

    const today = formatDateForChart(new Date().toISOString());
    const lastPoint = points[points.length - 1];
    if (lastPoint && lastPoint.time !== today) {
        points.push({ time: today, value: currentPrice });
    }

    return points;
}

export function calculateStats(
    points: ChartPoint[],
    currentPrice: number,
    history: PriceHistoryPoint[],
): ChartStats {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let minPriceDate = '';
    let maxPriceDate = '';

    for (const point of points) {
        if (point.value < minPrice) {
            minPrice = point.value;
            minPriceDate = formatDateForDisplay(point.time);
        }
        if (point.value > maxPrice) {
            maxPrice = point.value;
            maxPriceDate = formatDateForDisplay(point.time);
        }
    }

    const changesCount = history.length;
    const today = formatDateForChart(new Date().toISOString());
    const changesToday = history.reduce(
        (acc, p) => (formatDateForChart(p.changed_at) === today ? acc + 1 : acc),
        0,
    );

    return {
        currentPrice,
        minPrice: minPrice === Infinity ? currentPrice : minPrice,
        minPriceDate: minPriceDate || formatDateForDisplay(points[0]?.time || ''),
        maxPrice: maxPrice === -Infinity ? currentPrice : maxPrice,
        maxPriceDate: maxPriceDate || formatDateForDisplay(points[0]?.time || ''),
        changesCount,
        changesToday,
    };
}
