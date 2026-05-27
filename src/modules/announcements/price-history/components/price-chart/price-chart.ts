import {
    createChart,
    ColorType,
    CrosshairMode,
    LineSeries,
    IChartApi,
    ISeriesApi,
} from 'lightweight-charts';
import type { ChartPoint } from '../../types';
import { formatDateForDisplay } from '../../utils';

export class PriceHistoryChart {
    private chart: IChartApi | null = null;
    private series: ISeriesApi<'Line'> | null = null;
    private container: HTMLElement | null = null;
    private tooltip: HTMLElement | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private resizeHandler: (() => void) | null = null;
    private pendingData: ChartPoint[] | null = null;

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

    private getContainerWidth(): number {
        if (!this.container) return 0;
        const rect = this.container.getBoundingClientRect();
        return Math.max(rect.width || this.container.clientWidth || 0, 0);
    }

    private createChart(): void {
        if (!this.container) return;

        const initialWidth = this.getContainerWidth() || 600;

        this.chart = createChart(this.container, {
            width: initialWidth,
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
                    style: 2,
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
                mode: 0,
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
                precision: 0,
                minMove: 1,
            },
        });

        this.chart.subscribeCrosshairMove((param) => {
            if (!this.tooltip || !param.point || !param.time || !this.series) {
                this.hideTooltip();
                return;
            }

            const price = param.seriesData.get(this.series);
            if (!price || typeof price !== 'object' || !('value' in price)) {
                this.hideTooltip();
                return;
            }

            let date: Date;
            if (typeof param.time === 'string') {
                date = new Date(param.time);
            } else {
                date = new Date((param.time as number) * 1000);
            }
            const dateStr = formatDateForDisplay(date.toISOString());

            const priceValue = (price as { value: number }).value;
            this.tooltip.style.display = 'block';
            this.tooltip.innerHTML = `${dateStr}<br><strong>${priceValue.toLocaleString('ru-RU')} ₽</strong>`;
            this.tooltip.style.left = `${param.point.x}px`;
            this.tooltip.style.top = `${param.point.y - 40}px`;
        });

        this.chart.subscribeClick(() => {
            this.hideTooltip();
        });

        // ResizeObserver вместо window resize — реагирует на изменения родителя
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(this.container);
        }

        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
    }

    setData(points: ChartPoint[]): void {
        if (!this.series || !this.chart) return;

        const chartData = points.map((point) => ({
            time: point.time as never,
            value: point.value,
        }));

        this.pendingData = points;
        this.series.setData(chartData);

        if (chartData.length > 0) {
            // Если контейнер только что показан и ширина была 0 — ждём кадр и подгоняем
            requestAnimationFrame(() => {
                this.resize();
                this.chart?.timeScale().fitContent();
            });
        }
    }

    private hideTooltip(): void {
        if (this.tooltip) {
            this.tooltip.style.display = 'none';
        }
    }

    resize(): void {
        if (!this.chart || !this.container) return;
        const width = this.getContainerWidth();
        if (width <= 0) return;
        this.chart.applyOptions({ width });
        this.chart.timeScale().fitContent();
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
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
        if (this.chart) {
            this.chart.remove();
            this.chart = null;
            this.series = null;
        }
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
        this.pendingData = null;
    }
}
