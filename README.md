# Agile Business — multilingual website

Мультиязычная платформа Agile Business: Next.js 16.2, PostgreSQL/Prisma и FastAPI-сервисы за единым API Gateway.

Языки: русский (`/ru`), английский (`/en`), грузинский (`/ka`), армянский (`/hy`) и болгарский (`/bg`).

## Архитектура

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ :8091
┌──────▼──────┐
│   Gateway   │  apps/gateway
└────┬────┬───┘
     │    │
┌────▼──┐ └───────────────┐
│  Web  │         ┌───────▼──────┐
│ :8081 │         │   Content    │
│Next.js│         │    :8082     │
└───┬───┘         │   FastAPI    │
    │             └──────────────┘
┌───▼────────┐
│ PostgreSQL │
│ users/leads│
└────────────┘
```

| Сервис | Порт | Назначение |
|--------|------|------------|
| **gateway** | 8091 | Единая точка входа, прокси на остальные сервисы |
| **web** | 8081 | Next.js App Router, SEO, аккаунты, заявки, админка и SMTP |
| **content** | 8082 | API контента: компания, услуги, кейсы, блог |
| **leads** | 8083 | Совместимый FastAPI-контур прежних локальных заявок; основной сайт хранит заявки в PostgreSQL |

## Быстрый старт

```bash
npm install
pip install -r requirements.txt
npm run dev
```

Или `start.bat` на Windows.

Откройте **http://localhost:8091/ru**

### Docker

```bash
docker compose up --build
```

## API через gateway

- `GET /health` — статус всех сервисов
- `GET /api/content/company`
- `GET /api/content/services`
- `GET /api/content/works`
- `GET /api/content/blog`
- `POST /api/leads` — авторизованная отправка заявки через Next.js API

Прямые URL сервисов (для отладки): `8081` / `8082` / `8083`.

## Структура

```
apps/
  gateway/          # API Gateway (FastAPI + httpx)
  frontend/         # Новый Next.js-фронтенд
  web/              # Архив старого шаблона, не публикуется
  content/
    main.py         # Content API
    data/*.json     # Данные
  leads/
    main.py         # Leads API
packages/
  shared/           # Общие настройки
scripts/
  dev_up.py         # Запуск всех сервисов
  beautify_html.py  # Форматирование HTML
  build_content_data.py
docker/
  Dockerfile
docker-compose.yml
package.json        # npm workspace и единые dev/build/check команды
```

## Почта

Скопируйте `.env.example` в `.env` и заполните `DATABASE_URL`, параметры `AGILE_SMTP_*`, `AGILE_EMAIL_FROM` и `AGILE_EMAIL_TO`. Команда `npm run dev` передаёт эти параметры всем локальным сервисам. Заявка сначала сохраняется в PostgreSQL и затем отправляется на корпоративную почту; ошибка SMTP не уничтожает заявку.

## Админка заявок

Задайте длинный случайный `AGILE_LEADS_READ_TOKEN`, затем откройте `/ru/admin`. Без токена API списка заявок закрыт. Токен вводится при открытии админки и не сохраняется в localStorage или cookie. В админке также виден статус SMTP и доступна подтверждаемая тестовая отправка.

## Клиентские аккаунты

Регистрация и вход доступны на `/ru/account`. Пароли хранятся в PostgreSQL только как хэши bcrypt, а браузер получает случайную `HttpOnly`-сессию, хэш которой записывается в базе. Анонимная отправка заявки запрещена на уровне API. В личном кабинете клиент видит свои заявки и их статусы; статус меняется администратором на `/ru/admin`.

Перед публикацией задайте production-переменные окружения отдельно от репозитория; файлы `.env*` исключены из Git.

## Проверка фронтенда

```bash
npm run check
npm audit --omit=dev
```
