"""Prepare apps/web/public for GitHub Pages under /Agilenew/."""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

BASE = "/Agilenew"
# GitHub Pages soft limit ~1GB; keep deploy lean
MAX_UPLOAD_BYTES = 1_500_000  # 1.5 MB
ATTRS = (
    "href",
    "src",
    "action",
    "poster",
    "data-model-src",
    "data-envmap-src",
    "data-public-path",
    "content",
)


def rewrite(text: str) -> str:
    for attr in ATTRS:
        text = re.sub(rf'({attr}=")(/)(?!/)', rf"\1{BASE}/", text, flags=re.I)
        text = re.sub(rf"({attr}=')(/)(?!/)", rf"\1{BASE}/", text, flags=re.I)
    text = re.sub(r'url\((["\']?)/', rf"url(\1{BASE}/", text)
    text = text.replace(BASE + BASE + "/", BASE + "/")
    text = text.replace(f"{BASE}/https://", "https://")
    text = text.replace(f"{BASE}/http://", "http://")
    return text


def should_keep(path: Path, root: Path) -> bool:
    rel = path.relative_to(root).as_posix().lower()
    size = path.stat().st_size

    # Always keep site code and small assets
    if rel.endswith((".html", ".css", ".js", ".json", ".svg", ".ico", ".txt", ".xml", ".map")):
        return True
    if "/fonts/" in f"/{rel}/" or rel.endswith((".woff", ".woff2", ".ttf", ".otf", ".eot")):
        return True

    # Prefer thumbs / webp over huge originals
    if "/thumbs/" in f"/{rel}/":
        return size <= 3_000_000
    if rel.endswith((".webp", ".avif")):
        return size <= 2_500_000

    # Models needed for Approach section
    if "/upload/models/" in f"/{rel}/":
        return size <= 8_000_000

    # Drop oversized raster uploads (case galleries)
    if rel.startswith("uploads/") and rel.endswith((".png", ".jpg", ".jpeg", ".gif")):
        return size <= MAX_UPLOAD_BYTES

    return size <= 4_000_000


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    src = root / "apps" / "web" / "public"
    out = root / "_site"
    if not src.is_dir():
        print(f"missing {src}", file=sys.stderr)
        return 1
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(src, out)

    removed = 0
    bytes_removed = 0
    for path in sorted(out.rglob("*"), reverse=True):
        if not path.is_file():
            continue
        if should_keep(path, out):
            continue
        bytes_removed += path.stat().st_size
        path.unlink()
        removed += 1

    for path in sorted(out.rglob("*"), reverse=True):
        if path.is_dir() and not any(path.iterdir()):
            path.rmdir()

    for path in list(out.rglob("*.html")) + list(out.rglob("*.css")) + list(out.rglob("*.js")) + list(
        out.rglob("*.json")
    ):
        original = path.read_text(encoding="utf-8", errors="replace")
        updated = rewrite(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")

    (out / ".nojekyll").write_text("", encoding="utf-8")
    total = sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
    print(
        f"Prepared {out} base={BASE} size_mb={total/1024/1024:.1f} "
        f"removed_files={removed} removed_mb={bytes_removed/1024/1024:.1f}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
