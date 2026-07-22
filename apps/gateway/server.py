"""API Gateway — single entrypoint for Agile Business microservices."""
from __future__ import annotations

import sys
from pathlib import Path

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "packages"))

from shared import settings  # noqa: E402

app = FastAPI(title="Agile Gateway", version="1.0.0")
app.add_middleware(GZipMiddleware, minimum_size=500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

HOP_BY_HOP = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "content-encoding",
    "content-length",
    "host",
}


def _filter_headers(headers) -> dict:
    return {k: v for k, v in headers.items() if k.lower() not in HOP_BY_HOP}


async def _proxy(request: Request, base_url: str, path: str) -> Response:
    url = f"{base_url.rstrip('/')}/{path.lstrip('/')}"
    if request.url.query:
        url = f"{url}?{request.url.query}"

    body = await request.body()
    async with httpx.AsyncClient(timeout=60.0, follow_redirects=False) as client:
        upstream = await client.request(
            request.method,
            url,
            content=body if body else None,
            headers=_filter_headers(request.headers),
        )

    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=_filter_headers(upstream.headers),
        media_type=upstream.headers.get("content-type"),
    )


@app.get("/health")
async def health():
    checks = {}
    async with httpx.AsyncClient(timeout=3.0) as client:
        for name, url in {
            "web": settings.web_url,
            "content": settings.content_url,
            "leads": settings.leads_url,
        }.items():
            try:
                r = await client.get(f"{url.rstrip('/')}/health")
                checks[name] = r.json() if r.status_code == 200 else {"status": "down"}
            except Exception as exc:  # noqa: BLE001
                checks[name] = {"status": "down", "error": str(exc)}

    ok = all(v.get("status") == "ok" for v in checks.values())
    return JSONResponse(
        {"status": "ok" if ok else "degraded", "services": checks},
        status_code=200 if ok else 503,
    )


@app.api_route(
    "/api/content/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)
async def content_proxy(path: str, request: Request):
    return await _proxy(request, settings.content_url, f"/api/v1/{path}")


@app.api_route("/api/leads", methods=["GET", "POST", "OPTIONS"])
async def leads_root(request: Request):
    return await _proxy(request, settings.leads_url, "/api/v1/leads")


@app.api_route(
    "/api/leads/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)
async def leads_proxy(path: str, request: Request):
    return await _proxy(request, settings.leads_url, f"/api/v1/{path}")


@app.api_route("/", methods=["GET", "HEAD"])
async def web_home(request: Request):
    return await _proxy(request, settings.web_url, "/")


@app.api_route(
    "/{path:path}",
    methods=["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)
async def web_proxy(path: str, request: Request):
    return await _proxy(request, settings.web_url, path or "/")


def main():
    import uvicorn

    uvicorn.run(app, host=settings.gateway_host, port=settings.gateway_port)


if __name__ == "__main__":
    main()
