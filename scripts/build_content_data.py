"""Build content JSON from the static site tree."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public"
OUT = ROOT / "apps" / "content" / "data"

TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.I | re.S)
TAG_RE = re.compile(r"<[^>]+>")


def clean(text: str) -> str:
    text = TAG_RE.sub(" ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def page_title(index: Path) -> str:
    raw = index.read_text(encoding="utf-8", errors="replace")
    m = H1_RE.search(raw) or TITLE_RE.search(raw)
    if not m:
        return index.parent.name
    return clean(m.group(1)) or index.parent.name


def collect(folder: str, prefix: str) -> list[dict]:
    base = PUBLIC / folder
    items = []
    if not base.exists():
        return items
    for child in sorted(base.iterdir()):
        index = child / "index.html"
        if child.is_dir() and index.exists():
            slug = child.name
            items.append(
                {
                    "slug": slug,
                    "title": page_title(index),
                    "path": f"/{prefix}/{slug}/",
                    "url": f"/{prefix}/{slug}/",
                }
            )
    return items


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    company = {
        "name": "Agile Business",
        "email": "info@agile-business-pro.com",
        "phone": "+7 (963) 617-73-73",
        "tagline": "Комплексный консалтинг с измеримым результатом",
        "stats": {
            "directions": 3,
            "projects": "20+",
            "recommend_percent": 98,
        },
    }
    services = [
        {
            "slug": "website",
            "title": "Бизнес-аналитика",
            "path": "/services/website/",
            "description": "Диагностика процессов, метрики и управленческие решения.",
        },
        {
            "slug": "online",
            "title": "ИТ и разработка",
            "path": "/services/online/",
            "description": "Цифровые продукты, интеграции и автоматизация.",
        },
        {
            "slug": "branding",
            "title": "Стратегия и рост",
            "path": "/services/branding/",
            "description": "Позиционирование, go-to-market и масштабирование.",
        },
    ]

    works = collect("works", "works")
    blog = collect("blog", "blog")
    reviews = [
        {
            "id": "vicolor",
            "client": "Vicolor",
            "quote": "Комплексный маркетинг и brand-стратегия с измеримым результатом.",
            "work_slug": "vicolor",
        }
    ]

    (OUT / "company.json").write_text(
        json.dumps(company, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT / "services.json").write_text(
        json.dumps(services, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT / "works.json").write_text(
        json.dumps(works, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT / "blog.json").write_text(
        json.dumps(blog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT / "reviews.json").write_text(
        json.dumps(reviews, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote content data: {len(works)} works, {len(blog)} posts, {len(services)} services")


if __name__ == "__main__":
    main()
