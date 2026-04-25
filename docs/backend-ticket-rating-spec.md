# Спецификация: Оценка обращений техподдержки (бэкенд)

**Дата**: 2026-04-25

Фронтенд уже реализован и отправляет запрос `POST /api/v1/support/tickets/{id}/rate`.
Ниже — что необходимо добавить на бэкенде.

---

## 1. Миграция БД

Добавить колонку `rating` в таблицу `support_ticket`.

**`migrations/XXXXXX_add_rating_to_support_ticket.up.sql`**
```sql
ALTER TABLE support_ticket
    ADD COLUMN rating SMALLINT DEFAULT NULL
        CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));
```

**`migrations/XXXXXX_add_rating_to_support_ticket.down.sql`**
```sql
ALTER TABLE support_ticket DROP COLUMN IF EXISTS rating;
```

---

## 2. Модель

Обновить структуру `SupportTicket` в `internal/domain/support_ticket.go`:

```go
type SupportTicket struct {
    ID          int        `json:"id"`
    UserID      int        `json:"user_id"`
    Category    string     `json:"category"`
    Status      string     `json:"status"`
    Title       string     `json:"title"`
    Description string     `json:"description"`
    Rating      *int       `json:"rating"`       // новое поле, nullable
    CreatedAt   time.Time  `json:"created_at"`
    UpdatedAt   time.Time  `json:"updated_at"`
}
```

DTO запроса:

```go
type RateTicketRequest struct {
    Rating int `json:"rating"`
}
```

---

## 3. Репозиторий

Добавить метод в `internal/repository/support_ticket_repo.go`:

```go
SetRating(ctx context.Context, ticketID int, rating int) error
```

Реализация:
```sql
UPDATE support_ticket
SET rating = $1, updated_at = NOW()
WHERE id = $2
```

Также обновить SQL-запросы `Create`, `GetByID`, `GetByUserID`, `Update` — добавить `rating` в `SELECT` и `RETURNING`.

---

## 4. Сервис (usecase)

Добавить метод в `internal/usecase/support_ticket_service.go`:

```go
func (s *SupportTicketService) RateTicket(ctx context.Context, userID int, ticketID int, rating int) (*domain.SupportTicket, error)
```

**Бизнес-правила:**
- `rating` должен быть от 1 до 5 — иначе вернуть `400 Bad Request`
- Тикет должен существовать — иначе `404 Not Found`
- Оценить может только автор тикета (`ticket.UserID == userID`) — иначе `403 Forbidden`
- Тикет должен быть в статусе `closed` — иначе `400 Bad Request` с сообщением «Оценить можно только закрытое обращение»
- Если оценка уже выставлена (`ticket.Rating != nil`) — вернуть `400 Bad Request` с сообщением «Оценка уже выставлена»
- После успешной записи — вернуть обновлённый тикет

---

## 5. HTTP-хендлер

Добавить в `internal/delivery/handlers/support_ticket_handler.go`:

```go
func (h *SupportTicketHandler) RateTicket(w http.ResponseWriter, r *http.Request)
```

---

## 6. Роутинг

Добавить в `setupRoutes()`:

```go
router.HandleFunc("POST /api/v1/support/tickets/{id}/rate", authMiddleware(handler.RateTicket))
```

---

## 7. API-контракт

### `POST /api/v1/support/tickets/{id}/rate`

**Авторизация:** Bearer JWT (user_id из токена)

**Запрос:**
```json
{
  "rating": 4
}
```

**Ответ (200):**
```json
{
  "id": 1,
  "user_id": 42,
  "category": "bug",
  "status": "closed",
  "title": "Не загружаются фото",
  "description": "При загрузке фото появляется ошибка 500",
  "rating": 4,
  "created_at": "2026-04-25T10:30:00Z",
  "updated_at": "2026-04-25T14:00:00Z"
}
```

**Ошибки:**

| Код | Когда |
|-----|-------|
| 400 | `rating` не в диапазоне 1–5 |
| 400 | Тикет не в статусе `closed` |
| 400 | Оценка уже выставлена |
| 401 | Нет токена / невалидный токен |
| 403 | Пользователь не является автором тикета |
| 404 | Тикет не найден |

---

## 8. Фронтенд-контракт (уже реализовано)

Фронтенд вызывает:
```typescript
supportApi.rateTicket(ticketId, rating)
// → POST /api/v1/support/tickets/{id}/rate  body: { rating: N }
```

- Поле `rating` в `SupportTicket` типа `number | null`
- Шаблон `ticket-detail.hbs` показывает звёзды только при `status === "closed"`
- Если `ticket.rating` не null — отображает readonly-звёзды с текстом «Спасибо за обратную связь!»
- Если null — интерактивные звёзды с hover-эффектом, клик отправляет запрос

---

## 9. Чеклист реализации

- [ ] Миграция: добавить колонку `rating SMALLINT` с `CHECK (1..5)` 
- [ ] Модель: добавить поле `Rating *int` в структуру
- [ ] Репозиторий: метод `SetRating`, обновить SELECT-запросы
- [ ] Сервис: метод `RateTicket` с валидацией
- [ ] Хендлер: `RateTicket` — парсинг body, вызов сервиса, формирование ответа
- [ ] Роут: `POST /api/v1/support/tickets/{id}/rate`
- [ ] Формат ошибок: через существующий `responser` из `pkg/responser`
