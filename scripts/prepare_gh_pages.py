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

# Do not rewrite these files' internal path logic (they resolve base at runtime)
SKIP_REWRITE_NAMES = {
    "agile-perf.js",
    "agile-global.js",
    "agile-hero.js",
}


def rewrite(text: str) -> str:
    for attr in ATTRS:
        text = re.sub(rf'({attr}=")(/)(?!/)', rf"\1{BASE}/", text, flags=re.I)
        text = re.sub(rf"({attr}=')(/)(?!/)", rf"\1{BASE}/", text, flags=re.I)
    text = re.sub(r'url\((["\']?)/', rf"url(\1{BASE}/", text)
    # Common absolute roots in bundled CSS/JS (not our runtime loaders)
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
        return size <= 6_000_000

    if rel.startswith("assets/"):
        return size <= 4_000_000

    return size <= 1_000_000


def patch_html(path: Path) -> None:
    text = path.read_text(encoding="utf-8", errors="replace")
    if "is-agile-pages" not in text:
        if re.search(r"<html[^>]*class=\"", text):
            text = re.sub(
                r'(<html[^>]*class=")',
                r"\1is-agile-pages ",
                text,
                count=1,
            )
        else:
            text = text.replace("<html ", '<html class="is-agile-pages" ', 1)
    text = (
        text.replace("agile-perf.js?v20260722q", "agile-perf.js?v20260722r")
        .replace("agile-perf.js?v20260722p", "agile-perf.js?v20260722r")
        .replace("agile-overrides.css?v20260722q", "agile-overrides.css?v20260722r")
        .replace("agile-overrides.css?v20260722p", "agile-overrides.css?v20260722r")
        .replace("agile-global.js?v20260722q", "agile-global.js?v20260722r")
        .replace("agile-global.js?v20260722p", "agile-global.js?v20260722r")
    )
    path.write_text(text, encoding="utf-8")


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

    for path in out.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".html", ".css", ".js", ".json"}:
            continue
        if path.name in SKIP_REWRITE_NAMES:
            if path.suffix.lower() == ".html":
                continue
            # still allow html-adjacent? skip js loaders entirely
            continue
        original = path.read_text(encoding="utf-8", errors="replace")
        updated = rewrite(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")

    for path in out.rglob("*.html"):
        # rewrite html paths
        original = path.read_text(encoding="utf-8", errors="replace")
        updated = rewrite(original)
        path.write_text(updated, encoding="utf-8")
        patch_html(path)

    (out / ".nojekyll").write_text("", encoding="utf-8")
    # Ensure pages marker on homepage even if class merge failed
    index = out / "index.html"
    if index.exists():
        t = index.read_text(encoding="utf-8")
        if "is-agile-pages" not in t:
            t = t.replace("<html", '<html class="is-agile-pages"', 1)
            index.write_text(t, encoding="utf-8")

    total = sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
    print(
        f"Prepared {out} base={BASE} size_mb={total/1024/1024:.1f} "
        f"removed_files={removed} removed_mb={bytes_removed/1024/1024:.1f}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
