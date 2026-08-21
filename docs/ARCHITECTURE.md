# Архитектура Agile Business

## Принцип разделения

Проект организован как модульный монорепозиторий. Граница сервиса проходит по бизнес-домену, а не по URL или странице. Страницы `/services`, `/projects` и `/about` остаются в одном фронтенде: их разнесение по отдельным сервисам усложнило бы навигацию, локализацию и выпуск без повышения отказоустойчивости.

```text
Browser
  └─ gateway (единый локальный вход и health checks)
      ├─ frontend (Next.js: UI, BFF, auth, orders)
      ├─ content  (публичные справочники контента)
      └─ leads    (совместимый контур приёма старых заявок)

frontend
  ├─ identity     /api/auth, sessions, profile, password recovery
  ├─ commerce     service catalog, cart, /api/orders
  ├─ delivery     order stages, approvals, reviews
  ├─ notification SMTP adapter and optional platform webhook
  └─ content UI   localized pages, projects and services
```

## Отказоустойчивость

- Заказ сначала записывается в PostgreSQL, затем запускаются уведомления.
- Сбой SMTP или будущей корпоративной платформы не откатывает созданный заказ.
- Внешняя платформа подключается через `AGILE_ORDER_WEBHOOK_URL`; секрет подписи хранится только в окружении.
- Публичный контент и клиентский кабинет не зависят от доступности FastAPI-сервиса старых заявок.
- Миграции базы только аддитивные; удаление столбцов выполняется отдельным согласованным релизом после периода совместимости.

## Владение данными

| Домен | Источник данных | Публичная поверхность |
|---|---|---|
| Identity | PostgreSQL / Prisma | `/api/auth/*` |
| Orders | PostgreSQL / Prisma | `/api/orders/*` |
| Notifications | SMTP + optional webhook | только серверные адаптеры |
| Catalog / projects | versioned TypeScript data | локализованные страницы |
| Legacy leads | `apps/leads` | через gateway, не из кабинета |

## Когда выделять отдельный сервис

Домен выделяется только если у него появился независимый владелец, отдельное масштабирование или SLA. Следующий естественный кандидат — обработчик уведомлений/outbox. Identity и orders нельзя разделять до появления общего протокола авторизации, idempotency keys и наблюдаемой очереди событий.

