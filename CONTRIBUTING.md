# Разработка и Git-процесс

## Ветки

- `main` — только проверенный production-код.
- `codex/account-*` — аккаунт и identity.
- `codex/orders-*` — корзина, заказ, этапы и отзывы.
- `codex/content-*` — услуги, кейсы, переводы и SEO.
- `codex/notifications-*` — почта, webhook и интеграции.
- `codex/infrastructure-*` — CI, Vercel, gateway и безопасность.

Одна ветка — одна цель. Не создавайте отдельную долгоживущую ветку на каждую страницу: общий header, локализация и дизайн-система тогда расходятся. Для параллельной работы используйте короткие feature branches и pull request в `main`.

## Перед pull request

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

Изменение Prisma-схемы обязательно сопровождается новой миграцией. Секреты, `.env`, базы, логи, скриншоты QA и build cache не коммитятся.

## Релиз

1. Проверить preview deployment на desktop и mobile.
2. Проверить регистрацию, вход, восстановление доступа и создание заказа.
3. Проверить миграции через `prisma migrate deploy`.
4. Выпустить production и проверить `/api/health` и логи функций.

