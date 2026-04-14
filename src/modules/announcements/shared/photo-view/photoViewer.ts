/**
 * Компонент для просмотра фото в полный экран
 */

export class PhotoViewer {
    private static overlay: HTMLElement | null = null;
    private static imageElement: HTMLImageElement | null = null;
    private static photos: string[] = [];
    private static currentIndex: number = 0;
    private static isZoomed: boolean = false;

    /**
     * Инициализация просмотрщика
     */
    static init(): void {
        // Создаем HTML если его нет
        if (!this.overlay) {
            this.createViewer();
        }

        // Навешиваем глобальные обработчики
        this.attachGlobalHandlers();
    }

    /**
     * Создает DOM элементы просмотрщика
     */
    private static createViewer(): void {
        const viewerHTML = `
            <div class="photo-viewer-overlay" id="photoViewerOverlay">
                <div class="photo-viewer-container">
                    <button class="photo-viewer-close" id="photoViewerClose">×</button>
                    
                    <div class="photo-viewer-main">
                        <img src="" alt="Просмотр фото" class="photo-viewer-image" id="photoViewerImage">
                        
                        <button class="photo-viewer-nav photo-viewer-prev" id="photoViewerPrev">‹</button>
                        <button class="photo-viewer-nav photo-viewer-next" id="photoViewerNext">›</button>
                    </div>
                    
                    <div class="photo-viewer-footer">
                        <div class="photo-viewer-counter" id="photoViewerCounter">
                            <span id="currentIndex">1</span> / <span id="totalCount">1</span>
                        </div>
                        <div class="photo-viewer-thumbnails" id="photoViewerThumbnails"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', viewerHTML);
        this.overlay = document.getElementById('photoViewerOverlay');
        this.imageElement = document.getElementById('photoViewerImage') as HTMLImageElement;
    }

    /**
     * Глобальные обработчики
     */
    private static attachGlobalHandlers(): void {
        if (!this.overlay) return;

        // Закрытие по крестику
        const closeBtn = document.getElementById('photoViewerClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Закрытие по клику на фон
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (this.overlay?.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.close();
                } else if (e.key === 'ArrowLeft') {
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    this.next();
                }
            }
        });

        // Навигация
        const prevBtn = document.getElementById('photoViewerPrev');
        const nextBtn = document.getElementById('photoViewerNext');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());

        // Зум по клику на фото
        if (this.imageElement) {
            this.imageElement.addEventListener('click', () => this.toggleZoom());
        }
    }

    /**
     * Открыть просмотрщик
     */
    static open(photos: string[], startIndex: number = 0): void {
        if (!this.overlay || !this.imageElement) {
            this.init();
        }

        if (!photos || photos.length === 0) return;

        this.photos = photos;
        this.currentIndex = Math.max(0, Math.min(startIndex, photos.length - 1));
        this.isZoomed = false;

        // Показываем первое фото
        this.updateImage();
        this.updateThumbnails();
        this.updateCounter();

        // Показываем оверлей
        this.overlay?.classList.add('active');

        // Блокируем скролл body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Закрыть просмотрщик
     */
    static close(): void {
        this.overlay?.classList.remove('active');
        document.body.style.overflow = '';
        this.isZoomed = false;
        if (this.imageElement) {
            this.imageElement.classList.remove('zoomed');
        }
    }

    /**
     * Следующее фото
     */
    static next(): void {
        if (this.currentIndex < this.photos.length - 1) {
            this.currentIndex++;
            this.updateImage();
            this.updateActiveThumbnail();
            this.updateCounter();
            this.resetZoom();
        }
    }

    /**
     * Предыдущее фото
     */
    static prev(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateImage();
            this.updateActiveThumbnail();
            this.updateCounter();
            this.resetZoom();
        }
    }

    /**
     * Переключить зум
     */
    static toggleZoom(): void {
        if (!this.imageElement) return;
        this.isZoomed = !this.isZoomed;
        if (this.isZoomed) {
            this.imageElement.classList.add('zoomed');
        } else {
            this.imageElement.classList.remove('zoomed');
        }
    }

    /**
     * Сбросить зум
     */
    private static resetZoom(): void {
        this.isZoomed = false;
        if (this.imageElement) {
            this.imageElement.classList.remove('zoomed');
        }
    }

    /**
     * Обновить основное фото
     */
    private static updateImage(): void {
        if (!this.imageElement) return;
        this.imageElement.src = this.photos[this.currentIndex];
        this.imageElement.alt = `Фото ${this.currentIndex + 1}`;
    }

    /**
     * Обновить счетчик
     */
    private static updateCounter(): void {
        const currentSpan = document.getElementById('currentIndex');
        const totalSpan = document.getElementById('totalCount');

        if (currentSpan) currentSpan.textContent = String(this.currentIndex + 1);
        if (totalSpan) totalSpan.textContent = String(this.photos.length);
    }

    /**
     * Обновить миниатюры
     */
    private static updateThumbnails(): void {
        const container = document.getElementById('photoViewerThumbnails');
        if (!container) return;

        container.innerHTML = this.photos
            .map(
                (photo, index) => `
            <img 
                src="${photo}" 
                alt="Миниатюра ${index + 1}"
                class="photo-viewer-thumbnail ${index === this.currentIndex ? 'active' : ''}"
                data-index="${index}"
            >
        `,
            )
            .join('');

        // Добавляем обработчики на миниатюры
        container.querySelectorAll('.photo-viewer-thumbnail').forEach((thumb) => {
            thumb.addEventListener('click', (e) => {
                const index = (e.currentTarget as HTMLElement).dataset.index;
                if (index !== undefined) {
                    this.currentIndex = parseInt(index);
                    this.updateImage();
                    this.updateActiveThumbnail();
                    this.updateCounter();
                    this.resetZoom();
                }
            });
        });
    }

    /**
     * Обновить активную миниатюру
     */
    private static updateActiveThumbnail(): void {
        const container = document.getElementById('photoViewerThumbnails');
        if (!container) return;

        const thumbnails = container.querySelectorAll('.photo-viewer-thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === this.currentIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
}
