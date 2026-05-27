import './price-history-modal.scss';
import template from './price-history-modal.hbs?raw';
import { PriceHistoryChart } from '../components/price-chart/price-chart';
import { priceHistoryApi } from '../api';
import { priceHistoryStore } from '../store';
import { convertToChartPoints, calculateStats } from '../utils';
import type { PriceHistoryData, ChartStats } from '../types';

const MODAL_ID = 'priceHistoryModal';

export class PriceHistoryModal {
    private static instance: PriceHistoryModal | null = null;
    private modalElement: HTMLElement | null = null;
    private chart: PriceHistoryChart | null = null;
    private isLoading = false;

    static getInstance(): PriceHistoryModal {
        if (!PriceHistoryModal.instance) {
            PriceHistoryModal.instance = new PriceHistoryModal();
        }
        return PriceHistoryModal.instance;
    }

    private constructor() {}

    // Создаём модалку только когда она нужна
    private ensureModal(): HTMLElement {
        if (this.modalElement && document.body.contains(this.modalElement)) {
            return this.modalElement;
        }

        // Создаём модалку
        const wrapper = document.createElement('div');
        wrapper.innerHTML = template;
        this.modalElement = wrapper.firstElementChild as HTMLElement;
        document.body.appendChild(this.modalElement);

        // Инициализируем события
        this.initModalEvents();

        return this.modalElement;
    }

    private initModalEvents(): void {
        if (!this.modalElement) return;

        // Закрытие по крестику
        const closeBtn = this.modalElement.querySelector('.price-history-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Закрытие по клику на оверлей
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.close();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalElement?.style.display !== 'none') {
                this.close();
            }
        });
    }

    async open(data: PriceHistoryData): Promise<void> {
        if (this.isLoading) return;

        // Создаём или получаем модалку
        const modalElement = this.ensureModal();

        this.modalElement = modalElement;
        this.modalElement.style.display = 'flex';
        this.showLoader(true);

        const history = await this.loadHistory(data.adId);

        const chartPoints = convertToChartPoints(history, data.createdAt, data.currentPrice);

        if (chartPoints.length === 0) {
            this.showError('Не удалось загрузить данные для графика');
            this.showLoader(false);
            return;
        }

        const stats = calculateStats(chartPoints, data.currentPrice, history);
        const hasMultiplePrices = stats.minPrice !== stats.maxPrice;

        this.updateStats(stats, data, hasMultiplePrices);
        await this.renderChart(chartPoints);

        this.showLoader(false);
    }

    private async loadHistory(adId: number | string): Promise<any[]> {
        const cached = await priceHistoryStore.load(adId);
        if (cached && cached.length > 0) {
            return cached;
        }

        try {
            const history = await priceHistoryApi.getPriceHistory(adId);
            if (history.length > 0) {
                await priceHistoryStore.save(adId, history);
            }
            return history;
        } catch (error) {
            console.error('Failed to load price history:', error);
            return [];
        }
    }

    private async renderChart(points: any[]): Promise<void> {
        // Ждём 2 кадра — гарантируем, что модалка вычислила свою ширину
        await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );

        const container = document.getElementById('priceHistoryChartContainer');
        if (!container) return;

        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        this.chart = new PriceHistoryChart();
        this.chart.init('priceHistoryChartContainer');
        this.chart.setData(points);
    }

    private updateStats(
        stats: ChartStats,
        data: PriceHistoryData,
        hasMultiplePrices: boolean,
    ): void {
        if (!this.modalElement) return;

        const titleSpan = this.modalElement.querySelector('.price-history-ad-title');
        if (titleSpan) titleSpan.textContent = data.adTitle;

        const currentPriceEl = this.modalElement.querySelector('.current-price');
        if (currentPriceEl)
            currentPriceEl.textContent = `${stats.currentPrice.toLocaleString('ru-RU')} ₽`;

        const minPriceEl = this.modalElement.querySelector('.min-price');
        const minDateEl = this.modalElement.querySelector('.min-date');
        const maxPriceEl = this.modalElement.querySelector('.max-price');
        const maxDateEl = this.modalElement.querySelector('.max-date');
        const changesEl = this.modalElement.querySelector('.changes-count');
        const changesTodayEl = this.modalElement.querySelector('.changes-today');
        const extraStats = this.modalElement.querySelectorAll('.extra-stat');

        if (hasMultiplePrices) {
            if (minPriceEl) minPriceEl.textContent = `${stats.minPrice.toLocaleString('ru-RU')} ₽`;
            if (minDateEl) minDateEl.textContent = stats.minPriceDate;
            if (maxPriceEl) maxPriceEl.textContent = `${stats.maxPrice.toLocaleString('ru-RU')} ₽`;
            if (maxDateEl) maxDateEl.textContent = stats.maxPriceDate;
            if (changesEl) changesEl.textContent = String(stats.changesCount);
            if (changesTodayEl) changesTodayEl.textContent = String(stats.changesToday);
            extraStats.forEach((el) => el.classList.remove('hidden'));
        } else {
            extraStats.forEach((el) => el.classList.add('hidden'));
        }
    }

    private showLoader(show: boolean): void {
        this.isLoading = show;
        if (this.chart) {
            this.chart.showLoader(show);
        }
    }

    private showError(message: string): void {
        this.showLoader(false);
        const container = document.getElementById('priceHistoryChartContainer');
        if (container) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = message;
            (errorDiv as HTMLElement).style.cssText = `
                text-align: center;
                padding: 60px 20px;
                color: #ee5253;
                font-size: 14px;
            `;
            container.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 3000);
        }
    }

    close(): void {
        if (this.modalElement) {
            this.modalElement.style.display = 'none';
        }
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
