// // // import './price-history-modal.scss';
// // // import template from './price-history-modal.hbs?raw';
// // // import { createBaseModal } from '@modules/common/components/modal/modal';
// // // import { PriceChartComponent } from '../components/price-chart/price-chart';
// // // import { priceHistoryApi } from '../api';
// // // import { priceHistoryStore } from '../store';
// // // import { convertToChartPoints, calculateStats } from '../utils';
// // // import type { PriceHistoryData, ChartStats } from '../types';

// // // const MODAL_ID = 'priceHistoryModal';

// // // export class PriceHistoryModal {
// // //     private static instance: PriceHistoryModal | null = null;
// // //     private modal = createBaseModal({ id: MODAL_ID });
// // //     private chart: PriceChartComponent | null = null;
// // //     private isLoading = false;

// // //     static getInstance(): PriceHistoryModal {
// // //         if (!PriceHistoryModal.instance) {
// // //             PriceHistoryModal.instance = new PriceHistoryModal();
// // //         }
// // //         return PriceHistoryModal.instance;
// // //     }

// // //     static getTemplate(): string {
// // //         return template;
// // //     }

// // //     private constructor() {
// // //         this.initModal();
// // //     }

// // //     private initModal(): void {
// // //         const modalElement = this.modal.getElement();
// // //         if (!modalElement) return;

// // //         this.modal.bindBaseEvents(() => this.close());
// // //     }

// // //     async open(data: PriceHistoryData): Promise<void> {
// // //         if (this.isLoading) return;

// // //         this.modal.open();
// // //         this.showLoader(true);

// // //         const history = await this.loadHistory(data.adId);

// // //         const chartPoints = convertToChartPoints(
// // //             history,
// // //             data.createdAt,
// // //             data.currentPrice
// // //         );

// // //         if (chartPoints.length === 0) {
// // //             this.showError('Не удалось загрузить данные для графика');
// // //             return;
// // //         }

// // //         const stats = calculateStats(chartPoints, data.currentPrice, history.length);

// // //         this.updateStats(stats, data);
// // //         await this.renderChart(chartPoints);

// // //         this.showLoader(false);
// // //     }

// // //     private async loadHistory(adId: number | string): Promise<any[]> {
// // //         const cached = await priceHistoryStore.load(adId);
// // //         if (cached && cached.length > 0) {
// // //             return cached;
// // //         }

// // //         try {
// // //             const history = await priceHistoryApi.getPriceHistory(adId);
// // //             if (history.length > 0) {
// // //                 await priceHistoryStore.save(adId, history);
// // //             }
// // //             return history;
// // //         } catch (error) {
// // //             console.error('Failed to load price history:', error);
// // //             return [];
// // //         }
// // //     }

// // //     private async renderChart(points: any[]): Promise<void> {
// // //         await new Promise(resolve => setTimeout(resolve, 50));

// // //         const container = document.getElementById('priceHistoryChartContainer');
// // //         if (!container) return;

// // //         if (this.chart) {
// // //             this.chart.destroy();
// // //             this.chart = null;
// // //         }

// // //         this.chart = new PriceChartComponent();
// // //         this.chart.init('priceHistoryChartContainer');
// // //         this.chart.setData(points);
// // //     }

// // //     private updateStats(stats: ChartStats, data: PriceHistoryData): void {
// // //         const modalElement = this.modal.getElement();
// // //         if (!modalElement) return;

// // //         const currentPriceEl = modalElement.querySelector('.current-price');
// // //         const minPriceEl = modalElement.querySelector('.price-history-stat:nth-child(2) .stat-value');
// // //         const minDateEl = modalElement.querySelector('.price-history-stat:nth-child(2) .stat-date');
// // //         const maxPriceEl = modalElement.querySelector('.price-history-stat:nth-child(3) .stat-value');
// // //         const maxDateEl = modalElement.querySelector('.price-history-stat:nth-child(3) .stat-date');
// // //         const changesEl = modalElement.querySelector('.price-history-stat:nth-child(4) .stat-value');
// // //         const titleSpan = modalElement.querySelector('.price-history-ad-title');

// // //         if (currentPriceEl) currentPriceEl.textContent = `${stats.currentPrice} ₽`;
// // //         if (minPriceEl) minPriceEl.textContent = `${stats.minPrice} ₽`;
// // //         if (minDateEl) minDateEl.textContent = stats.minPriceDate;
// // //         if (maxPriceEl) maxPriceEl.textContent = `${stats.maxPrice} ₽`;
// // //         if (maxDateEl) maxDateEl.textContent = stats.maxPriceDate;
// // //         if (titleSpan) titleSpan.textContent = data.adTitle;

// // //         if (changesEl && stats.changesCount > 0) {
// // //             changesEl.textContent = String(stats.changesCount);
// // //             const changesContainer = changesEl.closest('.price-history-stat');
// // //             if (changesContainer) changesContainer.style.display = 'flex';
// // //         }
// // //     }

// // //     private showLoader(show: boolean): void {
// // //         this.isLoading = show;
// // //         if (this.chart) {
// // //             this.chart.showLoader(show);
// // //         }
// // //     }

// // //     private showError(message: string): void {
// // //         this.showLoader(false);
// // //         const container = document.getElementById('priceHistoryChartContainer');
// // //         if (container) {
// // //             const errorDiv = document.createElement('div');
// // //             errorDiv.textContent = message;
// // //             errorDiv.style.cssText = `
// // //                 text-align: center;
// // //                 padding: 60px 20px;
// // //                 color: #ee5253;
// // //                 font-size: 14px;
// // //             `;
// // //             container.appendChild(errorDiv);
// // //             setTimeout(() => errorDiv.remove(), 3000);
// // //         }
// // //     }

// // //     close(): void {
// // //         if (this.chart) {
// // //             this.chart.destroy();
// // //             this.chart = null;
// // //         }
// // //         this.modal.close();
// // //     }
// // // }

// // import { createBaseModal } from '@modules/common/components/modal/modal';
// // import { priceHistoryApi } from '../api';
// // import { priceHistoryStore } from '../store';
// // import { PriceHistoryChart } from '../components/price-chart/price-chart';
// // import { convertToChartPoints, calculateStats } from '../utils';
// // import type { PriceHistoryData, ChartStats } from '../types';
// // import './price-history-modal.scss';

// // const MODAL_ID = 'priceHistoryModal';

// // export class PriceHistoryModal {
// //     private static instance: PriceHistoryModal | null = null;
// //     private modal = createBaseModal({ id: MODAL_ID });
// //     private chart: PriceHistoryChart | null = null;
// //     private isLoading = false;

// //     static getInstance(): PriceHistoryModal {
// //         if (!PriceHistoryModal.instance) {
// //             PriceHistoryModal.instance = new PriceHistoryModal();
// //         }
// //         return PriceHistoryModal.instance;
// //     }

// //     private constructor() {
// //         this.initModal();
// //     }

// //     private initModal(): void {
// //         const modalElement = this.modal.getElement();
// //         if (!modalElement) return;

// //         this.modal.bindBaseEvents(() => this.close());
// //     }

// //     async open(data: PriceHistoryData): Promise<void> {
// //         console.log('🟢 PriceHistoryModal.open() вызван', data);

// //         const modalElement = this.modal.getElement();
// //         console.log('🟢 modalElement =', modalElement);

// //         if (!modalElement) {
// //             console.error('🟢 Модалка не найдена в DOM!');
// //             return;
// //         }

// //         console.log('🟢 Продолжаем открытие...');

// //         if (this.isLoading) return;

// //         this.modal.open();
// //         this.showLoader(true);

// //         const history = await this.loadHistory(data.adId);

// //         const chartPoints = convertToChartPoints(
// //             history,
// //             data.createdAt,
// //             data.currentPrice
// //         );

// //         if (chartPoints.length === 0) {
// //             this.showError('Не удалось загрузить данные для графика');
// //             return;
// //         }

// //         const stats = calculateStats(chartPoints, data.currentPrice, history.length);

// //         this.updateStats(stats, data);
// //         await this.renderChart(chartPoints);

// //         this.showLoader(false);
// //     }

// //     private async loadHistory(adId: number | string): Promise<any[]> {
// //         const cached = await priceHistoryStore.load(adId);
// //         if (cached && cached.length > 0) {
// //             return cached;
// //         }

// //         try {
// //             const history = await priceHistoryApi.getPriceHistory(adId);
// //             if (history.length > 0) {
// //                 await priceHistoryStore.save(adId, history);
// //             }
// //             return history;
// //         } catch (error) {
// //             console.error('Failed to load price history:', error);
// //             return [];
// //         }
// //     }

// //     private async renderChart(points: any[]): Promise<void> {
// //         await new Promise(resolve => setTimeout(resolve, 50));

// //         const container = document.getElementById('priceHistoryChartContainer');
// //         if (!container) return;

// //         if (this.chart) {
// //             this.chart.destroy();
// //             this.chart = null;
// //         }

// //         this.chart = new PriceHistoryChart();
// //         this.chart.init('priceHistoryChartContainer');
// //         this.chart.setData(points);
// //     }

// //     private updateStats(stats: ChartStats, data: PriceHistoryData): void {
// //         const modalElement = this.modal.getElement();
// //         if (!modalElement) return;

// //         // Приводим к HTMLElement для доступа к style
// //         const modalElem = modalElement as HTMLElement;

// //         const currentPriceEl = modalElem.querySelector('.current-price');
// //         const minPriceEl = modalElem.querySelector('.price-history-stat:nth-child(2) .stat-value');
// //         const minDateEl = modalElem.querySelector('.price-history-stat:nth-child(2) .stat-date');
// //         const maxPriceEl = modalElem.querySelector('.price-history-stat:nth-child(3) .stat-value');
// //         const maxDateEl = modalElem.querySelector('.price-history-stat:nth-child(3) .stat-date');
// //         const changesEl = modalElem.querySelector('.price-history-stat:nth-child(4) .stat-value');
// //         const titleSpan = modalElem.querySelector('.price-history-ad-title');

// //         if (currentPriceEl) currentPriceEl.textContent = `${stats.currentPrice} ₽`;
// //         if (minPriceEl) minPriceEl.textContent = `${stats.minPrice} ₽`;
// //         if (minDateEl) minDateEl.textContent = stats.minPriceDate;
// //         if (maxPriceEl) maxPriceEl.textContent = `${stats.maxPrice} ₽`;
// //         if (maxDateEl) maxDateEl.textContent = stats.maxPriceDate;
// //         if (titleSpan) titleSpan.textContent = data.adTitle;

// //         if (changesEl && stats.changesCount > 0) {
// //             changesEl.textContent = String(stats.changesCount);
// //             const changesContainer = changesEl.closest('.price-history-stat');
// //             if (changesContainer) {
// //                 (changesContainer as HTMLElement).style.display = 'flex';
// //             }
// //         }
// //     }

// //     private showLoader(show: boolean): void {
// //         this.isLoading = show;
// //         if (this.chart) {
// //             this.chart.showLoader(show);
// //         }
// //     }

// //     private showError(message: string): void {
// //         this.showLoader(false);
// //         const container = document.getElementById('priceHistoryChartContainer');
// //         if (container) {
// //             const errorDiv = document.createElement('div');
// //             errorDiv.textContent = message;
// //             (errorDiv as HTMLElement).style.cssText = `
// //                 text-align: center;
// //                 padding: 60px 20px;
// //                 color: #ee5253;
// //                 font-size: 14px;
// //             `;
// //             container.appendChild(errorDiv);
// //             setTimeout(() => errorDiv.remove(), 3000);
// //         }
// //     }

// //     close(): void {
// //         if (this.chart) {
// //             this.chart.destroy();
// //             this.chart = null;
// //         }
// //         this.modal.close();
// //     }
// // }

// import './price-history-modal.scss';
// import template from './price-history-modal.hbs?raw';
// import { createBaseModal } from '@modules/common/components/modal/modal';
// import { PriceHistoryChart } from '../components/price-chart/price-chart';
// import { priceHistoryApi } from '../api';
// import { priceHistoryStore } from '../store';
// import { convertToChartPoints, calculateStats } from '../utils';
// import type { PriceHistoryData, ChartStats } from '../types';

// const MODAL_ID = 'priceHistoryModal';

// export class PriceHistoryModal {
//     private static instance: PriceHistoryModal | null = null;
//     private modal = createBaseModal({ id: MODAL_ID });
//     private chart: PriceHistoryChart | null = null;
//     private isLoading = false;

//     // Возвращает HTML шаблона для вставки в DOM
//     static getTemplate(): string {
//         return template;
//     }

//     static getInstance(): PriceHistoryModal {
//         if (!PriceHistoryModal.instance) {
//             PriceHistoryModal.instance = new PriceHistoryModal();
//         }
//         return PriceHistoryModal.instance;
//     }

//     private constructor() {
//         this.initModal();
//     }

//     // private initModal(): void {
//     //     const modalElement = this.modal.getElement();
//     //     if (!modalElement) return;

//     //     this.modal.bindBaseEvents(() => this.close());
//     // }

//     private initModal(): void {
//         const modalElement = document.getElementById(MODAL_ID);
//         if (!modalElement) return;

//         // Закрытие по крестику
//         const closeBtn = modalElement.querySelector('.price-history-modal-close');
//         if (closeBtn) {
//             closeBtn.addEventListener('click', () => this.close());
//         }

//         // Закрытие по клику на оверлей
//         modalElement.addEventListener('click', (e) => {
//             if (e.target === modalElement) {
//                 this.close();
//             }
//         });

//         // Закрытие по Escape
//         document.addEventListener('keydown', (e) => {
//             if (e.key === 'Escape' && modalElement.style.display !== 'none') {
//                 this.close();
//             }
//         });
//     }

//     async open(data: PriceHistoryData): Promise<void> {
//         console.log('🟢 PriceHistoryModal.open() вызван', data);

//         if (this.isLoading) return;

//         const modalElement = this.modal.getElement();
//         console.log('🟢 modalElement =', modalElement);

//         if (!modalElement) {
//             console.error('🟢 Модалка не найдена в DOM!');
//             return;
//         }

//         this.modal.open();
//         this.showLoader(true);

//         const history = await this.loadHistory(data.adId);

//         const chartPoints = convertToChartPoints(
//             history,
//             data.createdAt,
//             data.currentPrice
//         );

//         if (chartPoints.length === 0) {
//             this.showError('Не удалось загрузить данные для графика');
//             return;
//         }

//         const stats = calculateStats(chartPoints, data.currentPrice, history.length);

//         const hasMultiplePrices = stats.minPrice !== stats.maxPrice;
//         this.updateStats(stats, data, hasMultiplePrices);
//         // this.updateStats(stats, data);
//         await this.renderChart(chartPoints);

//         this.showLoader(false);
//     }

//     private async loadHistory(adId: number | string): Promise<any[]> {
//         const cached = await priceHistoryStore.load(adId);
//         if (cached && cached.length > 0) {
//             return cached;
//         }

//         try {
//             const history = await priceHistoryApi.getPriceHistory(adId);
//             if (history.length > 0) {
//                 await priceHistoryStore.save(adId, history);
//             }
//             return history;
//         } catch (error) {
//             console.error('Failed to load price history:', error);
//             return [];
//         }
//     }

//     private async renderChart(points: any[]): Promise<void> {
//         await new Promise(resolve => setTimeout(resolve, 50));

//         const container = document.getElementById('priceHistoryChartContainer');
//         if (!container) return;

//         if (this.chart) {
//             this.chart.destroy();
//             this.chart = null;
//         }

//         this.chart = new PriceHistoryChart();
//         this.chart.init('priceHistoryChartContainer');
//         this.chart.setData(points);
//     }

//     // private updateStats(stats: ChartStats, data: PriceHistoryData): void {
//     //     const modalElement = this.modal.getElement();
//     //     if (!modalElement) return;

//     //     const modalElem = modalElement as HTMLElement;

//     //     const currentPriceEl = modalElem.querySelector('.current-price');
//     //     const minPriceEl = modalElem.querySelector('.price-history-stat:nth-child(2) .stat-value');
//     //     const minDateEl = modalElem.querySelector('.price-history-stat:nth-child(2) .stat-date');
//     //     const maxPriceEl = modalElem.querySelector('.price-history-stat:nth-child(3) .stat-value');
//     //     const maxDateEl = modalElem.querySelector('.price-history-stat:nth-child(3) .stat-date');
//     //     const changesEl = modalElem.querySelector('.price-history-stat:nth-child(4) .stat-value');
//     //     const titleSpan = modalElem.querySelector('.price-history-ad-title');

//     //     if (currentPriceEl) currentPriceEl.textContent = `${stats.currentPrice} ₽`;
//     //     if (minPriceEl) minPriceEl.textContent = `${stats.minPrice} ₽`;
//     //     if (minDateEl) minDateEl.textContent = stats.minPriceDate;
//     //     if (maxPriceEl) maxPriceEl.textContent = `${stats.maxPrice} ₽`;
//     //     if (maxDateEl) maxDateEl.textContent = stats.maxPriceDate;
//     //     if (titleSpan) titleSpan.textContent = data.adTitle;

//     //     if (changesEl && stats.changesCount > 0) {
//     //         changesEl.textContent = String(stats.changesCount);
//     //         const changesContainer = changesEl.closest('.price-history-stat');
//     //         if (changesContainer) {
//     //             (changesContainer as HTMLElement).style.display = 'flex';
//     //         }
//     //     }
//     // }

//     private updateStats(stats: ChartStats, data: PriceHistoryData, hasMultiplePrices: boolean): void {
//         const modalElement = this.modal.getElement();
//         if (!modalElement) return;

//         const modalElem = modalElement as HTMLElement;

//         // Обновляем заголовок
//         const titleSpan = modalElem.querySelector('.price-history-ad-title');
//         if (titleSpan) titleSpan.textContent = data.adTitle;

//         // Текущая цена
//         const currentPriceEl = modalElem.querySelector('.current-price');
//         if (currentPriceEl) currentPriceEl.textContent = `${stats.currentPrice.toLocaleString('ru-RU')} ₽`;

//         // Дополнительная статистика (только если цены менялись)
//         const minPriceEl = modalElem.querySelector('.min-price');
//         const minDateEl = modalElem.querySelector('.min-date');
//         const maxPriceEl = modalElem.querySelector('.max-price');
//         const maxDateEl = modalElem.querySelector('.max-date');
//         const changesEl = modalElem.querySelector('.changes-count');
//         const extraStats = modalElem.querySelectorAll('.extra-stat');

//         if (hasMultiplePrices) {
//             if (minPriceEl) minPriceEl.textContent = `${stats.minPrice.toLocaleString('ru-RU')} ₽`;
//             if (minDateEl) minDateEl.textContent = stats.minPriceDate;
//             if (maxPriceEl) maxPriceEl.textContent = `${stats.maxPrice.toLocaleString('ru-RU')} ₽`;
//             if (maxDateEl) maxDateEl.textContent = stats.maxPriceDate;
//             if (changesEl) changesEl.textContent = String(stats.changesCount);

//             // Показываем блоки
//             extraStats.forEach(el => el.classList.remove('hidden'));
//         } else {
//             // Скрываем блоки
//             extraStats.forEach(el => el.classList.add('hidden'));
//         }
//     }

//     private showLoader(show: boolean): void {
//         this.isLoading = show;
//         if (this.chart) {
//             this.chart.showLoader(show);
//         }
//     }

//     private showError(message: string): void {
//         this.showLoader(false);
//         const container = document.getElementById('priceHistoryChartContainer');
//         if (container) {
//             const errorDiv = document.createElement('div');
//             errorDiv.textContent = message;
//             (errorDiv as HTMLElement).style.cssText = `
//                 text-align: center;
//                 padding: 60px 20px;
//                 color: #ee5253;
//                 font-size: 14px;
//             `;
//             container.appendChild(errorDiv);
//             setTimeout(() => errorDiv.remove(), 3000);
//         }
//     }

//     close(): void {
//         if (this.chart) {
//             this.chart.destroy();
//             this.chart = null;
//         }
//         this.modal.close();
//     }
// }

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
        console.log('🟢 PriceHistoryModal.open() вызван', data);

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
            return;
        }

        const stats = calculateStats(chartPoints, data.currentPrice, history.length);
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
        await new Promise((resolve) => setTimeout(resolve, 50));

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
        const extraStats = this.modalElement.querySelectorAll('.extra-stat');

        if (hasMultiplePrices) {
            if (minPriceEl) minPriceEl.textContent = `${stats.minPrice.toLocaleString('ru-RU')} ₽`;
            if (minDateEl) minDateEl.textContent = stats.minPriceDate;
            if (maxPriceEl) maxPriceEl.textContent = `${stats.maxPrice.toLocaleString('ru-RU')} ₽`;
            if (maxDateEl) maxDateEl.textContent = stats.maxPriceDate;
            if (changesEl) changesEl.textContent = String(stats.changesCount);
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
