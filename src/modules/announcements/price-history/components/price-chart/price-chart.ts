import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts';
import type { ChartPoint } from '../../types';
import { formatDateForDisplay } from '../../utils';

export class PriceHistoryChart {
    private chart: IChartApi | null = null;
    private series: ISeriesApi<'Line'> | null = null;
    private container: HTMLElement | null = null;
    private tooltip: HTMLElement | null = null;

    init(containerId: string): void {
        this.container = document.getElementById(containerId) as HTMLElement | null;
        if (!this.container) return;

        this.container.innerHTML = '';

        this.createTooltip();
        this.createChart();
    }

    private createTooltip(): void {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'price-chart-tooltip';
        (this.tooltip as HTMLElement).style.cssText = `
            position: absolute;
            display: none;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            pointer-events: none;
            z-index: 100;
            white-space: nowrap;
        `;
        this.container?.appendChild(this.tooltip);
    }

    private createChart(): void {
        if (!this.container) return;

        this.chart = createChart(this.container, {
            width: this.container.clientWidth,
            height: 280,
            layout: {
                background: { type: ColorType.Solid, color: '#ffffff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    width: 1,
                    color: '#2bde8c',
                    style: 2, // LineStyle.Dashed
                    labelBackgroundColor: '#2bde8c',
                },
                horzLine: {
                    width: 1,
                    color: '#ccc',
                    style: 2,
                    labelBackgroundColor: '#ccc',
                },
            },
            rightPriceScale: {
                borderColor: '#e0e0e0',
                textColor: '#666',
                // visible: true,
                mode: 0, // 0 = normal, 1 = logarithmic, 2 = percentage
                scaleMargins: {
                    top: 0.15,
                    bottom: 0.15,
                },
                entireTextOnly: false,
            },
            timeScale: {
                borderColor: '#e0e0e0',
                tickMarkFormatter: (time: number | string) => {
                    let date: Date;

                    if (typeof time === 'string') {
                        date = new Date(time);
                    } else {
                        date = new Date(time * 1000);
                    }

                    if (isNaN(date.getTime())) return '';

                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    return `${day}.${month}`;
                },
            },
            localization: {
                locale: 'ru-RU',
                dateFormat: 'dd.MM.yyyy',
            },
        });

        // Используем addSeries вместо addLineSeries
        this.series = this.chart.addSeries(LineSeries, {
            color: '#2bde8c',
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 4,
            crosshairMarkerBorderColor: '#fff',
            crosshairMarkerBackgroundColor: '#2bde8c',
            priceFormat: {
                type: 'price',
                precision: 0, // ← 0 знаков после запятой
                minMove: 1, // ← минимальный шаг 1
            },
        });

        // Подписка на движение курсора
        this.chart.subscribeCrosshairMove((param) => {
            if (!this.tooltip || !param.point || !param.time) {
                this.hideTooltip();
                return;
            }

            // Получаем цену через seriesData
            const price = param.seriesData.get(this.series!);
            if (!price || typeof price === 'object') {
                this.hideTooltip();
                return;
            }

            const date = new Date((param.time as number) * 1000);
            const dateStr = formatDateForDisplay(date.toISOString());

            this.tooltip.style.display = 'block';
            this.tooltip.innerHTML = `${dateStr}<br><strong>${price} ₽</strong>`;

            this.tooltip.style.left = `${param.point.x}px`;
            this.tooltip.style.top = `${param.point.y - 40}px`;
        });

        this.chart.subscribeClick(() => {
            this.hideTooltip();
        });

        window.addEventListener('resize', () => this.resize());
    }

    setData(points: ChartPoint[]): void {
        if (!this.series) return;

        const chartData = points.map((point) => ({
            time: point.time,
            value: point.value,
        }));

        this.series.setData(chartData);

        if (this.chart && chartData.length > 0) {
            this.chart.timeScale().fitContent();
        }
    }

    private hideTooltip(): void {
        if (this.tooltip) {
            this.tooltip.style.display = 'none';
        }
    }

    resize(): void {
        if (this.chart && this.container) {
            this.chart.applyOptions({ width: this.container.clientWidth });
            setTimeout(() => {
                this.chart?.timeScale().fitContent();
            }, 100);
        }
    }

    showLoader(show: boolean): void {
        if (!this.container) return;
        let loader = this.container.querySelector('.price-chart-loader') as HTMLElement;
        if (show && !loader) {
            loader = document.createElement('div');
            loader.className = 'price-chart-loader';
            loader.innerHTML = '<div class="spinner"></div>';
            this.container.appendChild(loader);
        }
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    destroy(): void {
        if (this.chart) {
            this.chart.remove();
            this.chart = null;
            this.series = null;
        }
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
}

// Импортируем LineSeries после createChart
import { LineSeries } from 'lightweight-charts';
