"""Prepare apps/web/public for GitHub Pages under /Agilenew/."""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

BASE = "/Agilenew"
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
    # JS string literals used by loaders (agile-perf etc.)
    text = re.sub(r'(["\'])/(assets/)', rf"\1{BASE}/\2", text)
    text = re.sub(r'(["\'])/(css/)', rf"\1{BASE}/\2", text)
    text = re.sub(r'(["\'])/(js/)', rf"\1{BASE}/\2", text)
    text = re.sub(r'(["\'])/(uploads/)', rf"\1{BASE}/\2", text)
    text = text.replace(BASE + BASE + "/", BASE + "/")
    text = text.replace(f"{BASE}/https://", "https://")
    text = text.replace(f"{BASE}/http://", "http://")
    return text


def should_keep(path: Path, root: Path) -> bool:
    rel = path.relative_to(root).as_posix().lower()
    size = path.stat().st_size

    if rel.endswith((".html", ".css", ".js", ".json", ".svg", ".ico", ".txt", ".xml", ".map", ".nojekyll")):
        return True
    if "/fonts/" in f"/{rel}/" or rel.endswith((".woff", ".woff2", ".ttf", ".otf", ".eot")):
        return True

    # Drop PDFs and full-size originals from Pages
    if rel.endswith(".pdf"):
        return False
    if rel.startswith("uploads/") and "/thumbs/" not in f"/{rel}/":
        # keep only tiny leftovers if any
        return size <= 200_000 and rel.endswith((".webp", ".jpg", ".jpeg", ".png"))

    if "/thumbs/" in f"/{rel}/":
        # Keep responsive mid thumbs used by homepage; drop huge full webp/xxl
        name = path.name.lower()
        if "@resize-x-webp" in name or "1400x" in name or "xxl" in name:
            return False
        if any(x in name for x in ("768x", "992x", "375x", "480x", "-md", "-ss", "-lg")):
            return size <= 1_200_000
        return size <= 400_000

    if "/upload/models/" in f"/{rel}/":
        return size <= 6_000_000

    if rel.startswith("assets/"):
        return size <= 4_000_000

    return size <= 1_000_000


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
    if total > 900 * 1024 * 1024:
        print("WARNING: artifact still large for GitHub Pages", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
