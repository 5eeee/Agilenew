"""Content microservice — works, services, blog, company stats."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "packages"))

from shared import settings  # noqa: E402

DATA_DIR = Path(__file__).resolve().parent / "data"

app = FastAPI(title="Agile Content Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _load(name: str):
    path = DATA_DIR / name
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/health")
def health():
    return {"status": "ok", "service": "content"}


@app.get("/api/v1/company")
def company():
    data = _load("company.json")
    if not data:
        raise HTTPException(404, "company data missing")
    return data


@app.get("/api/v1/services")
def services():
    return _load("services.json") or []


@app.get("/api/v1/works")
def works():
    return _load("works.json") or []


@app.get("/api/v1/works/{slug}")
def work_by_slug(slug: str):
    items = _load("works.json") or []
    for item in items:
        if item.get("slug") == slug:
            return item
    raise HTTPException(404, f"work '{slug}' not found")


@app.get("/api/v1/blog")
def blog():
    return _load("blog.json") or []


@app.get("/api/v1/blog/{slug}")
def blog_by_slug(slug: str):
    items = _load("blog.json") or []
    for item in items:
        if item.get("slug") == slug:
            return item
    raise HTTPException(404, f"post '{slug}' not found")


@app.get("/api/v1/reviews")
def reviews():
    return _load("reviews.json") or []


def main():
    import uvicorn

    uvicorn.run(app, host=settings.content_host, port=settings.content_port)


if __name__ == "__main__":
    main()
