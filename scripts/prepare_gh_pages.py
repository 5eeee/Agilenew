"""Prepare apps/web/public for GitHub Pages under /Agilenew/ with full animations."""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from wire_frontend_assets import wire_html  # noqa: E402

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

SKIP_REWRITE_NAMES = {"agile-global.js", "agile-hero.js"}


def rewrite(text: str) -> str:
    for attr in ATTRS:
        text = re.sub(rf'({attr}=")(/)(?!/)', rf"\1{BASE}/", text, flags=re.I)
        text = re.sub(rf"({attr}=')(/)(?!/)", rf"\1{BASE}/", text, flags=re.I)
    text = re.sub(r'url\((["\']?)/', rf"url(\1{BASE}/", text)
    text = re.sub(r'(["\'])/(assets/)', rf"\1{BASE}/\2", text)
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
    if rel.endswith(".pdf"):
        return False
    if rel.startswith("uploads/") and "/thumbs/" not in f"/{rel}/":
        return size <= 200_000 and rel.endswith((".webp", ".jpg", ".jpeg", ".png"))
    if "/thumbs/" in f"/{rel}/":
        name = path.name.lower()
        if "@resize-x-webp" in name or "1400x" in name or "xxl" in name:
            return False
        if any(x in name for x in ("768x", "992x", "375x", "480x", "-md", "-ss", "-lg")):
            return size <= 1_200_000
        return size <= 400_000
    if "/upload/models/" in f"/{rel}/":
        return size <= 8_000_000
    if rel.startswith("assets/"):
        return size <= 5_000_000
    return size <= 1_000_000


def main() -> int:
    src = ROOT / "apps" / "web" / "public"
    out = ROOT / "_site"
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

    # Rewrite asset urls inside css/js/json (not agile-global runtime)
    for path in out.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".css", ".js", ".json"}:
            continue
        if path.name in SKIP_REWRITE_NAMES:
            continue
        original = path.read_text(encoding="utf-8", errors="replace")
        updated = rewrite(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")

    # Wire canonical script order with root-absolute paths, then prefix for Pages
    for path in out.rglob("*.html"):
        wire_html(path, prefix="")
        text = rewrite(path.read_text(encoding="utf-8", errors="replace"))
        if "is-agile-pages" not in text:
            text = re.sub(r'(<html[^>]*class=")', r"\1is-agile-pages ", text, count=1)
        boot = (
            "<script>"
            "document.documentElement.classList.add('is-agile-pages');"
            "setTimeout(function(){"
            "if(!document.documentElement.classList.contains('is-agile-ready'))"
            "document.documentElement.classList.add('is-agile-boot-failed');"
            "},4000);"
            "</script>\n"
        )
        if "is-agile-boot-failed');},4000)" not in text.replace(" ", ""):
            text = text.replace("</head>", boot + "</head>", 1)
        path.write_text(text, encoding="utf-8")

    (out / ".nojekyll").write_text("", encoding="utf-8")
    # drop obsolete dynamic loader from published site
    perf = out / "js" / "agile-perf.js"
    if perf.exists():
        perf.unlink()

    index = (out / "index.html").read_text(encoding="utf-8")
    total = sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
    print(
        f"Prepared {out} base={BASE} size_mb={total/1024/1024:.1f} "
        f"removed_files={removed} removed_mb={bytes_removed/1024/1024:.1f}"
    )
    print("has_app", "app.min.js" in index)
    print("has_gsap", "vendor.gsap" in index)
    print("has_three", "vendor.three.min.js" in index)
    print("has_agile_global", "agile-global.js" in index)
    print("has_perf", "agile-perf.js" in index)
    print("public_path", re.search(r'data-public-path="([^"]+)"', index).group(1))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
