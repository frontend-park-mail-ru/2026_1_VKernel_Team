# AGENTS.md — Проект «Клевер» (VKernel_Team)

## Общая информация

Маркетплейс объявлений (classifieds). SPA без фреймворка, роутинг и состояние написаны вручную.

- **Тестовые аккаунты:** `test-accounts.json` (в gitignore)
- **Прод:** https://clover-go.ru/
- **Бэкенд:** https://github.com/go-park-mail-ru/2026_1_VKernelTeam
- **Фронтенд:** https://github.com/frontend-park-mail-ru/2026_1_VKernel_Team

## Команды

| Команда | Описание |
|---|---|
| `npm start` | Dev-режим (webpack watch + сервер) |
| `npm run build` | Production-сборка |
| `npm run server` | Запуск сервера |
| `npm run dev` | Сервер с --watch |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint + автофикс |
| `npm test` | Playwright тесты |
| `npm run test:local` | Тесты против localhost:80 |
| `npm run test:prod` | Тесты против clover-go.ru |
| `npx tsc --noEmit` | Проверка типов |

## Стек

- TypeScript 5.9 (target ES2020, module ESNext)
- Webpack 5 + ts-loader + sass-loader + handlebars-loader
- Handlebars 4.7 — шаблонизация (прекомпиляция через webpack)
- SASS/SCSS — стили
- Node.js HTTP — сервер (без Express)
- Playwright 1.60 — E2E-тесты
- Husky + lint-staged — pre-commit hooks
- dependency-cruiser — графы зависимостей (автогенерация при коммите)

## Архитектура

Паттерн: **MVC + Flux-подобный Store**

```
main.ts → AppController.init() → роутинг → контроллеры модулей
```

### Уровни

- **Core** (`src/js/core/`): store.ts, eventBus.ts, config.ts
- **Controllers** (`src/js/controllers/`): AppController, AuthController, AdsController
- **Actions** (`src/js/actions/`): adsActions, authActions, uiActions
- **Services** (`src/js/services/`): authService, adsServices, categoryService и др.
- **API** (`src/js/api/`): apiClient.ts — HTTP-клиент (fetch wrapper)
- **Validators** (`src/js/validators/`): authValidator, adValidator
- **Utils** (`src/js/utils/`): storage, icons, deviceId, yandexMaps и др.
- **Modules** (`src/modules/`): фичевые модули

### Структура модуля (`src/modules/<name>/`)

```
controller.ts      — контроллер модуля
service.ts         — API-вызовы
actions.ts         — экшены (если нужны)
store.ts           — локальный store (если нужен)
types.ts           — типы
config.ts          — API endpoints
pages/             — страницы (.hbs + .ts + .scss)
components/        — подкомпоненты (папка = .hbs + .ts + .scss)
```

### Модули

- `announcements/` — объявления (деталь, создание, превью)
- `cart/` — корзина
- `chat/` — чат
- `common/` — общие (header, search, categories-modal, offline, notifications)
- `product_search/` — поиск товаров
- `profile/` — профиль
- `seller-page/` — страница продавца
- `support/` — виджет техподдержки
- `support-admin/` — админка техподдержки

### Роуты

Определены в `AppController.router()`: `/`, `/login`, `/register`, `/profile`, `/cart`, `/chats`, `/chats/:id`, `/ad/:id`, `/place-ad`, `/edit-ad/:id`, `/ad-preview`, `/seller/:id`, `/search`, `/support/stats`. SPA fallback → index.html. Навигация через `data-nav` + `history.pushState`.

### Store

Глобальный `src/js/core/store.ts` с состоянием: isAuthenticated, user, ads, currentPage, error, isLoading, favoriteIds. Подписка через `store.subscribe()`. Модули cart, chat, unread имеют локальные stores.

## Алиасы путей

| Алиас | Путь |
|---|---|
| `@` | `src/js` |
| `@css` / `@styles` | `src/styles` |
| `@core` | `src/js/core` |
| `@api` | `src/js/api` |
| `@services` | `src/js/services` |
| `@controllers` | `src/js/controllers` |
| `@validators` | `src/js/validators` |
| `@utils` | `src/js/utils` |
| `@types` | `src/js/types` |
| `@templates` | `src/templates` |
| `@modules` | `src/modules` |
| `@assets` | `src/assets` |

## Env-переменные

| Переменная | Default | Описание |
|---|---|---|
| `PORT` | `80` | Порт сервера |
| `BASE_URL` | `http://clover-go.ru` | URL бэкенда для прокси |
| `PUBLIC_DIR` | `dist` | Папка статики |
| `YANDEX_JSAPI_KEY` | `''` | Ключ Яндекс.Карт |
| `YANDEX_SUGGEST_KEY` | `''` | Ключ подсказок адресов |
| `YANDEX_GEOCODER_KEY` | `''` | Ключ геокодера |

Webpack читает `.env` вручную (без dotenv). DefinePlugin внедряет BASE_URL и YANDEX_* в клиентский код.

## Код-стайл

### Prettier

```json
{
  "tabWidth": 4,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "endOfLine": "lf",
  "printWidth": 100
}
```

### ESLint

- Flat config (ESLint 10)
- `@typescript-eslint/no-explicit-any`: off
- `no-unused-vars` / `@typescript-eslint/no-unused-vars`: off
- `no-console`: off
- `max-depth`: 4
- `max-nested-callbacks`: 3
- Prettier обязателен (ошибка при нарушении)

### Шаблоны и HTML

- HTML-разметка **только** в `.hbs`-файлах. Не писать HTML-строки (шаблонные литералы, innerHTML) в `.ts`-файлах
- TS-файлы компонентов импортируют HBS-шаблон, а обёртку модалки получают через `{{#> common/components/modal/modal}}`

### Конвенция коммитов

- Русский язык, строчные буквы
- Глаголы в прошедшем времени: `реализовал X`, `убрал X`, `исправил X`
- Багфиксы: просто `fix`
- Новая фича без глагола: `корзина`, `графы`, `профиль`
- Неформально можно: `все готово`, `сырой вариант`
- Без conventional commits (`feat:`, `fix:` не используются)

## Pre-commit hook

1. `npm run dep` — генерация SVG-графов зависимостей
2. `git add graphs/` — автодобавление графов
3. `npx tsc --noEmit` — проверка типов
4. `npx lint-staged` — ESLint + Prettier для `*.{ts,tsx}`

## Сервер

`server/server.js` — чистый Node.js HTTP:
- Раздача статики из `dist/`
- Проксирование `/api/v1/*` → бэкенд
- SPA fallback (index.html)
- `/support-widget` → support-widget.html
- Path traversal защита

## Деплой

Через Makefile: `make deploy` = git pull + npm ci + build + rsync в `/var/www/clover` + nginx reload.

## Особенности

- **Offline-first**: IndexedDB для корзины, черновиков, профиля; SyncManager для реплея
- **CSRF**: автоматический warm-up cookie + retry
- **Token refresh**: автообновление JWT при 401, дедупликация параллельных refresh
- **Оптимистичный UI**: избранное переключается мгновенно, откат при ошибке
- **Service Worker**: cache-first для статики, network-first для навигации
- **Кастомные Handlebars-хелперы**: formatPrice, icon, ifAuthenticated, avatarUrl, eq, gt, concat, array, labelForTab, formatDate
- **Виджет техподдержки**: отдельный webpack entry, iframe + postMessage

## E2e-тесты (Playwright)

- Каждый тест отражает конкретный кейс поведения, а не отдельную проверку
- Проверки отображения объединяются с тестами на взаимодействие: сначала проверяем корректность UI, затем с ним взаимодействуем
- Не писать отдельный тест «X отображается», если есть тест «взаимодействие с X работает» — совмещать в одном
- Авторизация: `beforeAll` через UI, `storageState` в файл, далее fixture `authedPage` с этим состоянием
- Не логиниться через UI в каждом тесте — использовать сохранённую сессию
- Аккаунты для автотестов: email с префиксом `clover-tester` (например `clover-tester-wallet@test.com`)
- После тестов вызывать `POST /api/v1/test/reset` для очистки тестового аккаунта

## Верстка модалок

### BaseModal — общий компонент (`@modules/common/components/modal/`)

Состоит из:
- **modal.hbs** — обёртка (overlay + content + кнопка ✕), принимает `id`, `modifier`, рендерит `{{> @partial-block }}`
- **modal.ts** — `createBaseModal({ id })` — логика: open/close, закрытие по ✕/overlay/Escape, `_bound` guard
- **modal.scss** — базовые стили: overlay, content, close, actions, input

### Наследование

Каждая конкретная модалка «наследует» BaseModal через HBS partial-block:

```hbs
{{#> common/components/modal/modal id="myModal" modifier="my-modal"}}
    <h3>Заголовок</h3>
    <!-- контент -->
    <div class="modal-actions">
        <button class="btn btn-primary" data-action="confirm">OK</button>
    </div>
{{/common/components/modal/modal}}
```

В TS: `const base = createBaseModal({ id: 'myModal' })`, затем `base.bindBaseEvents(() => this.close())`, `base.open()`, `base.close()`.

### Правила

- **HTML только в .hbs** — не писать HTML-строки (шаблонные литералы, innerHTML) в .ts-файлах
- **Overlay + ✕** — всегда через BaseModal, не дублировать в конкретных модалках
- **Закрытие по Escape/overlay** — обеспечивает `base.bindBaseEvents()`, конкретная модалка не реализует это сама
- **data-action="close-modal"** — стандартный action для ✕, обрабатывается в BaseModal
- **Свой класс-модификатор**: `modifier="topup-modal-content"` для кастомных стилей
- **Конкретная модалка конфигурирует**: заголовок, контент тела, кнопки действий — всё внутри partial-block
- **Многошаговые модалки**: каждый шаг со своим `<h3>` и `modal-actions` внутри `div.topup-step`
- **_boundElement guard**: `init()` проверяет `modal === this._boundElement`
- **Ошибки**: `p.topup-error` (красный текст 13px), скрыт по умолчанию

## Важно

- Перед коммитом всегда проходит `tsc --noEmit` + lint-staged — не коммитишь с ошибками типов
- Графы зависимостей пересоздаются автоматически при каждом коммите
- `.env` в gitignore — ключи не утекают
- `cache/` в gitignore — для локальных файлов агентов
- Тестовый аккаунт для локальных проверок: креды в `.env` (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD=TestDev1234!`)
