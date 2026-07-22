"""Web frontend microservice — static Agile Business site."""
from __future__ import annotations

import sys
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "packages"))

from shared import settings  # noqa: E402

PUBLIC = Path(__file__).resolve().parent / "public"

app = FastAPI(title="Agile Web Service", version="1.0.0")
app.add_middleware(GZipMiddleware, minimum_size=500)


class CacheHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        path = request.url.path.lower()
        if path.endswith((".html", "/")) or path == "":
            response.headers["Cache-Control"] = "public, max-age=60, must-revalidate"
        elif path.endswith(
            (
                ".js",
                ".css",
                ".woff2",
                ".woff",
                ".ttf",
                ".png",
                ".jpg",
                ".jpeg",
                ".webp",
                ".svg",
                ".gif",
                ".glb",
                ".hdr",
                ".ico",
            )
        ):
            # Query-string version busting (?v=...) → long cache is safe
            response.headers["Cache-Control"] = "public, max-age=604800, immutable"
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        return response


app.add_middleware(CacheHeadersMiddleware)


@app.get("/health")
def health():
    return {"status": "ok", "service": "web"}


app.mount("/", StaticFiles(directory=str(PUBLIC), html=True), name="site")


def main():
    import uvicorn

    uvicorn.run(app, host=settings.web_host, port=settings.web_port)


if __name__ == "__main__":
    main()
