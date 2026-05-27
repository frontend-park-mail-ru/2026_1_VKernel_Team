import type { PriceHistoryPoint } from './api';

export interface ChartPoint {
    time: string;
    value: number;
}

export interface FormattedPoint {
    date: string;
    price: number;
    originalDate: string;
}

export interface ChartStats {
    currentPrice: number;
    minPrice: number;
    minPriceDate: string;
    maxPrice: number;
    maxPriceDate: string;
    changesCount: number;
    changesToday: number;
}

export interface PriceHistoryData {
    adId: number | string;
    adTitle: string;
    createdAt: string;
    currentPrice: number;
}
