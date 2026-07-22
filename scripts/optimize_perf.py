"""Optimize site HTML for faster load: clean duplicates, defer heavy JS, webp thumbs."""
from __future__ import annotations

import re
from pathlib import Path

from bs4 import BeautifulSoup, Comment
from bs4.formatter import HTMLFormatter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public"
FORMATTER = HTMLFormatter(entity_substitution=None)

CSS_HREF = "/css/agile-overrides.css?v20260722p"
JS_PERF = "/js/agile-perf.js?v20260722p"
JS_GLOBAL = "/js/agile-global.js?v20260722p"
APP_CSS = "/assets/front/build/css/app.min.css"

HEAVY_JS = {
    "vendor.three.min.js",
    "vendor.three-addons.min.js",
    "app.min.js",
}


def webp_thumb(kind: str, slug: str, filename: str) -> str | None:
    stem = Path(filename).stem
    candidates = [
        PUBLIC / "uploads" / kind / slug / "thumbs" / f"{stem}@resize-768x-md.webp",
        PUBLIC / "uploads" / kind / slug / "thumbs" / f"{stem}@resize-768x.webp",
        PUBLIC / "uploads" / kind / slug / "thumbs" / f"{stem}.webp",
        PUBLIC / "uploads" / kind / slug / f"{stem}.webp",
    ]
    for path in candidates:
        if path.is_file():
            return "/" + path.relative_to(PUBLIC).as_posix()
    return None


def swap_image_src(img, kind: str) -> None:
    src = img.get("src") or ""
    m = re.match(rf"/uploads/{kind}/([^/]+)/([^/]+\.(?:jpg|jpeg|png|webp))$", src, re.I)
    if not m:
        return
    thumb = webp_thumb(kind, m.group(1), m.group(2))
    if thumb:
        img["src"] = thumb
        img["loading"] = "lazy"
        img["decoding"] = "async"


def optimize_file(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(raw, "html.parser")
    head = soup.head
    body = soup.body
    if not head or not body:
        return False

    # Remove empty stylesheets / broken scripts
    for link in list(head.find_all("link", rel="stylesheet")):
        href = (link.get("href") or "").strip()
        if not href or href.startswith("?"):
            link.decompose()

    for script in list(soup.find_all("script")):
        src = (script.get("src") or "").strip()
        text = script.string or ""
        if src.startswith("?") or src == "":
            # keep inline scripts with code
            if src == "" and text.strip():
                # Drop duplicate nowebgl clearers later
                continue
            if src.startswith("?") or (src == "" and not text.strip() and script.get("defer") is not None):
                script.decompose()
                continue
        # Defer heavy Three/app — loaded by agile-perf.js
        if any(name in src for name in HEAVY_JS):
            script.decompose()
            continue
        if "/js/agile-global.js" in src or "/js/agile-perf.js" in src:
            script.decompose()
            continue
        if "/css/agile-overrides" in src:
            script.decompose()

    for link in list(head.find_all("link", href=True)):
        if "/css/agile-overrides" in link["href"]:
            link.decompose()

    # Strip analytics blocks (re-added deferred by agile-perf)
    for comment in soup.find_all(string=lambda s: isinstance(s, Comment)):
        c = str(comment)
        if "VK" in c or "Yandex" in c or "Metrika" in c or "counters" in c.lower():
            comment.extract()

    for script in list(body.find_all("script")):
        text = script.string or ""
        src = script.get("src") or ""
        if "mc.yandex.ru" in text or "ym(" in text or "VK.Retargeting" in text:
            script.decompose()
        if "vk.ru/js/api/openapi" in src or "mc.yandex.ru" in src:
            script.decompose()

    for noscript in list(body.find_all("noscript")):
        if noscript.find("img", src=re.compile(r"mc\.yandex")):
            noscript.decompose()

    # Collapse apple-touch icons to one
    apple = head.find_all("link", rel="apple-touch-icon")
    for link in apple[1:]:
        link.decompose()

    # Remove duplicate nowebgl inline scripts
    for script in list(head.find_all("script")):
        text = (script.string or "").strip()
        if "#nowebgl" in text:
            script.decompose()

    # Critical CSS priority
    app_css = head.find("link", id="css-app") or head.find(
        "link", href=re.compile(r"app\.min\.css")
    )
    if app_css:
        app_css["fetchpriority"] = "high"

    # Single nowebgl + overrides
    clearer = soup.new_tag("script")
    clearer.string = (
        'if(location.hash==="#nowebgl")'
        "history.replaceState(null,\"\",location.pathname+location.search);"
    )
    override = soup.new_tag("link", href=CSS_HREF, rel="stylesheet")
    if app_css:
        app_css.insert_after(clearer)
        clearer.insert_after(override)
    else:
        head.append(clearer)
        head.append(override)

    # Perf + global at end of body
    perf = soup.new_tag("script", src=JS_PERF, defer="")
    glob = soup.new_tag("script", src=JS_GLOBAL, defer="")
    body.append(perf)
    body.append(glob)

    # Prefer webp thumbs
    for img in soup.select("img.js-works-grid-image"):
        swap_image_src(img, "works")
    for img in soup.select("img.js-posts-item-image"):
        swap_image_src(img, "blog")

    # Lazy below-fold images default
    for img in soup.find_all("img"):
        if not img.get("loading"):
            img["loading"] = "lazy"
        if not img.get("decoding"):
            img["decoding"] = "async"

    pretty = soup.prettify(formatter=FORMATTER)
    if not pretty.endswith("\n"):
        pretty += "\n"
    if pretty == raw:
        return False
    path.write_text(pretty, encoding="utf-8")
    return True


def main() -> None:
    files = sorted(PUBLIC.rglob("*.html"))
    changed = 0
    for path in files:
        if optimize_file(path):
            changed += 1
            print(f"optimized: {path.relative_to(ROOT)}")
    print(f"Done. Optimized {changed}/{len(files)} HTML files.")


if __name__ == "__main__":
    main()
