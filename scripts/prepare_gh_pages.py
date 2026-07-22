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

SKIP_REWRITE_NAMES = {
    "agile-perf.js",
    "agile-global.js",
    "agile-hero.js",
}

# Pitcher runtime that paints black / breaks under project-pages base
STRIP_SCRIPT_RE = re.compile(
    r"<script\b[^>]*\bsrc=[\"'][^\"']*("
    r"vendor\.gsap|"
    r"vendor\.barba|"
    r"vendor\.three|"
    r"vendor\.splide|"
    r"vendor\.polyfills|"
    r"vendor\.imask|"
    r"vendor\.bootstrap|"
    r"vendor\.popper|"
    r"app\.min\.js|"
    r"agile-global\.js"
    r")[^\"']*[\"'][^>]*>\s*</script>\s*",
    re.I,
)

HEAD_BOOT = """
<script>
document.documentElement.classList.add('is-agile-pages','is-agile-ready','is-agile-static');
</script>
<style>
html,body{background:#f7f3ee!important;color:#030206!important;opacity:1!important;visibility:visible!important;overflow:auto!important;height:auto!important;transform:none!important}
.hero{color:#fff!important;opacity:1!important;visibility:visible!important}
.hero-canvas canvas,canvas{display:none!important}
.header,.hero,.hero-title,.hero-intro,.section,.heading,.manner,.works-grid,.posts,.footer,.logo,img,.agile-slide-clip,.agile-slide-clip>*{opacity:1!important;visibility:visible!important;transform:none!important;clip-path:none!important}
.hero-title__link{color:#fff!important}
#messages-cookie,.messages-toast--light{display:none!important}
</style>
"""


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
        return size <= 6_000_000
    if rel.startswith("assets/"):
        return size <= 4_000_000
    return size <= 1_000_000


def patch_html(path: Path) -> None:
    text = path.read_text(encoding="utf-8", errors="replace")
    text = STRIP_SCRIPT_RE.sub("", text)

    if "is-agile-pages" not in text:
        if re.search(r"<html[^>]*class=\"", text):
            text = re.sub(r'(<html[^>]*class=")', r"\1is-agile-pages ", text, count=1)
        else:
            text = text.replace("<html ", '<html class="is-agile-pages" ', 1)

    # cache bust
    for old in ("v20260722r", "v20260722q", "v20260722p"):
        text = text.replace(f"agile-perf.js?{old}", "agile-perf.js?v20260722s")
        text = text.replace(f"agile-overrides.css?{old}", "agile-overrides.css?v20260722s")

    # keep only agile-perf at end (static pages mode)
    if "agile-perf.js" not in text:
        text = text.replace(
            "</body>",
            '<script src="/Agilenew/js/agile-perf.js?v20260722s"></script>\n</body>',
            1,
        )

    if "is-agile-static" not in text:
        text = text.replace("</head>", HEAD_BOOT + "</head>", 1)

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
            continue
        original = path.read_text(encoding="utf-8", errors="replace")
        updated = rewrite(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")

    for path in out.rglob("*.html"):
        original = path.read_text(encoding="utf-8", errors="replace")
        path.write_text(rewrite(original), encoding="utf-8")
        patch_html(path)

    (out / ".nojekyll").write_text("", encoding="utf-8")
    total = sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
    print(
        f"Prepared {out} base={BASE} size_mb={total/1024/1024:.1f} "
        f"removed_files={removed} removed_mb={bytes_removed/1024/1024:.1f}"
    )
    # sanity: homepage must not include app.min.js
    index = (out / "index.html").read_text(encoding="utf-8")
    print("has_app", "app.min.js" in index)
    print("has_gsap", "vendor.gsap" in index)
    print("has_boot", "is-agile-static" in index)
    print("has_perf", "agile-perf.js" in index)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
