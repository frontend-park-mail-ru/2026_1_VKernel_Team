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

export function convertToChartPoints(
    history: PriceHistoryPoint[],
    createdAt: string,
    currentPrice: number,
): ChartPoint[] {
    const points: ChartPoint[] = [];

    if (!history.length) {
        points.push({
            time: formatDateForChart(createdAt),
            value: currentPrice,
        });

        const today = formatDateForChart(new Date().toISOString());
        if (today !== formatDateForChart(createdAt)) {
            points.push({
                time: today,
                value: currentPrice,
            });
        }

        return points;
    }

    for (const point of history) {
        points.push({
            time: formatDateForChart(point.changed_at),
            value: point.price,
        });
    }

    const lastPoint = points[points.length - 1];
    const today = formatDateForChart(new Date().toISOString());

    if (lastPoint.time !== today) {
        points.push({
            time: today,
            value: currentPrice,
        });
    }

    return points;
}

export function calculateStats(
    points: ChartPoint[],
    currentPrice: number,
    changesCount: number,
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

    return {
        currentPrice,
        minPrice: minPrice === Infinity ? currentPrice : minPrice,
        minPriceDate: minPriceDate || formatDateForDisplay(points[0]?.time || ''),
        maxPrice: maxPrice === -Infinity ? currentPrice : maxPrice,
        maxPriceDate: maxPriceDate || formatDateForDisplay(points[0]?.time || ''),
        changesCount,
    };
}
