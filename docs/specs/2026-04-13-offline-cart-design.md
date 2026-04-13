# Офлайн-режим: корзина

Спецификация офлайн-режима для модуля корзины приложения Клевер.

## Требования

- Полный офлайн для корзины: чтение, добавление, удаление товаров без сети
- Checkout офлайн запрещён — показывается уведомление
- Кеширование app shell (HTML/JS/CSS) через Service Worker
- Данные корзины персистируются в IndexedDB
- Очередь офлайн-операций с синхронизацией при возврате в онлайн
- Конфликты: сервер побеждает, пользователь получает уведомление
- Минимальный UI: иконка в хедере + уведомления при критичных действиях
- Компонент уведомлений — общий, не привязан к офлайн-модулю

## Архитектура

### Новые файлы

```
src/modules/common/
├── notifications/                  — общий компонент уведомлений
│   ├── notification.ts
│   ├── notification.hbs
│   └── notification.css
├── offline/
│   ├── service-worker/
│   │   ├── sw.ts                   — Service Worker (Cache API)
│   │   └── sw-register.ts         — регистрация SW
│   ├── db/
│   │   └── indexedDB.ts           — Promise-обёртка над IndexedDB
│   ├── network/
│   │   └── networkStatus.ts      — детекция online/offline
│   └── sync/
│       ├── syncQueue.ts           — очередь офлайн-операций
│       └── syncManager.ts        — синхронизация при возврате online
```

### Модифицируемые файлы

- `src/js/main.ts` — инициализация SW, CloverDB, SyncManager
- `src/modules/cart/actions.ts` — офлайн-ветвление в каждом action
- `src/modules/cart/store.ts` — персистентность в IndexedDB
- `src/modules/cart/init.ts` — загрузка из кеша перед запросом к серверу
- `src/modules/common/header/` — иконка офлайн-статуса
- `webpack.config.js` — отдельный entry для sw.ts
- `public/index.html` — контейнер для уведомлений

### Не меняются

- `src/js/api/apiClient.ts`
- `src/modules/cart/service.ts`
- `src/modules/cart/types.ts`
- `src/modules/cart/components/`
- `src/modules/cart/controller.ts`

## Поток данных

### Общий flow

```
Пользователь действует офлайн
  → Action проверяет networkStatus.isOnline
  → Если offline:
      1. Применяет изменение локально в cartStore
      2. Сохраняет в IndexedDB
      3. Добавляет операцию в syncQueue
  → Если online:
      1. Обычный flow через apiClient → сервер

Возврат в online (событие 'online')
  → syncManager.sync()
      → Проигрывает очередь операций
      → Загружает актуальную корзину с сервера
      → Уведомляет о конфликтах
```

### Старт приложения

```
Онлайн:
  IndexedDB.cart → cartStore → UI (мгновенно)
  → apiClient.getCart() → cartStore → IndexedDB → UI обновляется

Офлайн:
  IndexedDB.cart → cartStore → UI
  → apiClient.getCart() → ошибка → данные из IndexedDB остаются
```

## Service Worker

### Стратегии кеширования

| Ресурс | Стратегия | Причина |
|--------|-----------|---------|
| `index.html` | Network First | Свежий HTML, офлайн — из кеша |
| JS/CSS (`*.[hash].*`) | Cache First | Иммутабельны (contenthash) |
| Изображения (`/images/*`) | Cache First | Статичны |
| API (`/api/v1/*`) | Network Only | Данные кешируются в IndexedDB |

### Жизненный цикл

**Install:** precache app shell (index.html, JS-бандл, CSS, иконки). Список ресурсов генерируется webpack при сборке.

**Activate:** удаляет старые кеши по имени версии (`clover-static-v{N}`), вызывает `clients.claim()`.

**Fetch:** перехватывает запросы, применяет стратегию по URL-паттерну. Navigation requests — всегда `index.html` из кеша (SPA fallback).

### Webpack

- `sw.ts` — отдельный entry point, output: `dist/sw.js` (без contenthash)
- Кастомный плагин/скрипт для генерации precache manifest

## IndexedDB

### Обёртка CloverDB

```ts
class CloverDB {
  open(dbName: string, version: number, stores: StoreSchema[]): Promise<void>
  get<T>(storeName: string, key: string | number): Promise<T | undefined>
  getAll<T>(storeName: string): Promise<T[]>
  put<T>(storeName: string, value: T, key?: string | number): Promise<void>
  delete(storeName: string, key: string | number): Promise<void>
  clear(storeName: string): Promise<void>
  close(): void
}

interface StoreSchema {
  name: string
  keyPath?: string
  autoIncrement?: boolean
  indexes?: { name: string, keyPath: string, unique?: boolean }[]
}
```

### Структура БД

БД: `clover-db`, version: `1`

| Object Store | keyPath | Назначение |
|---|---|---|
| `cart` | `product_id` | Товары корзины (CartItem) |
| `syncQueue` | autoIncrement `id` | Очередь отложенных операций |

### Формат SyncOperation

```ts
interface SyncOperation {
  id?: number              // autoIncrement
  type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'CHECKOUT'
  payload: any             // product_id и т.д.
  timestamp: number        // Date.now()
  retries: number          // начинается с 0
}
```

### Отказоустойчивость

Если IndexedDB недоступен (приватный режим) — приложение работает как раньше, без офлайн-персистентности. Ошибка логируется в консоль.

## Network Status

Синглтон `networkStatus`:

```ts
class NetworkStatus {
  get isOnline(): boolean
  subscribe(callback: (isOnline: boolean) => void): () => void
}
```

- Инициализируется из `navigator.onLine`
- Подписывается на window `online`/`offline` события
- Собственный EventBus (не глобальный)

## Sync Manager

### Алгоритм sync()

1. Получить все операции из `syncQueue.getAll()`
2. Если очередь пуста — выход
3. Для каждой операции последовательно:
   - Отправить на сервер через `cartService`
   - Успех → `syncQueue.remove(id)`
   - Ошибка 404/409 (конфликт) → `syncQueue.remove(id)`, запомнить как конфликт
   - Сетевая ошибка → увеличить `retries`, прервать цикл
   - `retries >= 3` → удалить операцию, запомнить как failed
4. `cartActions.loadCart()` — загрузить актуальное состояние с сервера
5. Если были конфликты → `NotificationComponent.show({ type: 'warning', message: 'Некоторые изменения не удалось применить. Корзина обновлена.' })`

### Подписка

`networkStatus.subscribe(isOnline => { if (isOnline) this.sync() })`

## Модификация корзины

### cartActions.ts

**addToCart(product):**
- Online: обычный flow → `cartService.addToCart()` → `cartStore.setState()` → IndexedDB
- Offline: `cartStore.setState()` → IndexedDB → `syncQueue.add({ type: 'ADD_TO_CART', payload })`

**removeFromCart(productId):**
- Online: обычный flow (уже оптимистичный) → IndexedDB
- Offline: `cartStore.setState()` → IndexedDB → `syncQueue.add({ type: 'REMOVE_FROM_CART', payload })`

**checkout():**
- Online: обычный flow
- Offline: `NotificationComponent.show({ type: 'warning', message: 'Оформление заказа недоступно без подключения к интернету' })` — не добавляется в очередь

### cartStore.ts

- При каждом `setState` для `items` — запись в IndexedDB store `cart`
- Новый метод `loadFromCache()` — чтение из IndexedDB при старте

### cart/init.ts

```
eventBus.on('page:adsRendered', async () => {
    if (!store.isAuthenticated) { CartButtonComponent.initAll(); return; }
    await cartActions.loadFromCache();
    CartButtonComponent.initAll();
    if (networkStatus.isOnline) {
        await cartActions.loadCart();
    }
});
```

## UI

### Офлайн-иконка в хедере

- Иконка wifi-off, скрыта по умолчанию
- `networkStatus.subscribe()` — toggle CSS-класса
- Без текста, только иконка

### NotificationComponent (общий)

```ts
interface NotificationOptions {
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  duration?: number    // ms, по умолчанию 4000, 0 = ручное закрытие
}

class NotificationComponent {
  static show(options: NotificationOptions): void
  static hide(id: string): void
}
```

- Рендерит toast в `#notification-container` (фиксированный контейнер в `index.html`)
- Стек уведомлений — несколько одновременно, новые сверху
- Кнопка закрытия (крестик) на каждом
- Автоисчезновение через `duration` ms с CSS fade out
- Цвет по типу: success — зелёный, warning — жёлтый, error — красный, info — синий

## Порядок инициализации в main.ts

```
1. registerServiceWorker()
2. CloverDB.open('clover-db', 1, [cart, syncQueue])
3. NetworkStatus — активен как singleton
4. SyncManager — подписывается на networkStatus
5. AppController.init() — существующая логика
```
