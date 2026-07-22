# Agilenew

# Agile Business — microservices

Маркетинговый сайт Agile Business, собранный как набор микросервисов с единым API Gateway.

## GitHub Pages

Сайт: **https://5eeee.github.io/Agilenew/**

Деплой идёт из `apps/web/public` через Actions (`.github/workflows/deploy-pages.yml`).

> Локально по-прежнему: `python scripts/dev_up.py` → http://localhost:8080/

## Архитектура

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ :8080
┌──────▼──────┐
│   Gateway   │  apps/gateway
└──┬───┬───┬──┘
   │   │   │
   │   │   └──────────────┐
   │   │                  │
┌──▼───▼──┐   ┌───────────▼──┐   ┌────────────┐
│   Web   │   │   Content    │   │   Leads    │
│  :8081  │   │    :8082     │   │   :8083    │
│ HTML/JS │   │ works/blog/  │   │ forms API  │
└─────────┘   │ services JSON│   └────────────┘
              └──────────────┘
```

| Сервис | Порт | Назначение |
|--------|------|------------|
| **gateway** | 8080 | Единая точка входа, прокси на остальные сервисы |
| **web** | 8081 | Статический фронтенд (HTML/CSS/JS/assets) |
| **content** | 8082 | API контента: компания, услуги, кейсы, блог |
| **leads** | 8083 | API заявок с формы обратной связи |

## Быстрый старт

```bash
pip install -r requirements.txt
python scripts/build_content_data.py
python scripts/beautify_html.py
python scripts/dev_up.py
```

Или `start.bat` на Windows.

Откройте **http://localhost:8080/**

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
- `POST /api/leads` — тело JSON: `name`, `email`, `message`, опционально `phone`, `company`

Прямые URL сервисов (для отладки): `8081` / `8082` / `8083`.

## Структура

```
apps/
  gateway/          # API Gateway (FastAPI + httpx)
  web/
    main.py         # Frontend service
    public/         # Сайт (читаемый HTML)
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
```

## Производительность

- HTML очищен от дублей CSS/JS и пустых тегов
- Three.js (~630KB) грузится отложенно и только на страницах с ModelSticky
- Аналитика — после idle
- WebP thumbs для сетки кейсов
- Gzip + Cache-Control на web/gateway
- Скрипт: `python scripts/optimize_perf.py`

