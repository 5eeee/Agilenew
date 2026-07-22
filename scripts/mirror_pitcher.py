#!/usr/bin/env python3
"""Mirror pitcher.agency static assets and pages for local clone."""
import hashlib
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import deque
from pathlib import Path

BASE_URL = "https://pitcher.agency"
ROOT = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"
USER_AGENT = "PitcherCloneMirror/1.0"
CACHE_BUST = "v20260722"

# Seed routes discovered from live site navigation + common paths
SEED_PATHS = [
    "/",
    "/works/",
    "/services/",
    "/about/",
    "/awards/",
    "/reviews/",
    "/blog/",
    "/contacts/",
    "/policy/",
    "/approval/",
    "/services/website/",
    "/services/online/",
    "/services/branding/",
    "/services/website/developers/",
    "/services/website/industry/",
    "/services/website/b2b/",
    "/services/online/services/",
    "/services/online/cabinet/",
    "/services/online/erp/",
    "/services/online/crm/",
    "/services/branding/naming/",
    "/services/branding/identity/",
    "/services/branding/brandbook/",
]

ASSET_PREFIXES = (
    "/assets/",
    "/uploads/",
)

INTERNAL_LINK_RE = re.compile(
    r'(?:href|src|srcset|content|data-envmap-src|data-model-src|data-model-left-src|data-model-right-src)\s*=\s*["\']([^"\']+)["\']',
    re.I,
)
CSS_URL_RE = re.compile(r'url\(\s*["\']?([^"\')\s]+)["\']?\s*\)', re.I)
SRCSET_RE = re.compile(r'([^\s,]+\.(?:webp|jpg|jpeg|png|svg|gif|woff2?|ttf|otf|hdr|glb|gltf)(?:\?[^\s,]*)?)', re.I)

visited_pages: set[str] = set()
visited_assets: set[str] = set()
downloaded_count = 0
failed: list[tuple[str, str]] = []


def fetch(url: str, retries: int = 3) -> bytes | None:
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.read()
        except Exception as e:
            if attempt == retries - 1:
                failed.append((url, str(e)))
                return None
            time.sleep(0.5 * (attempt + 1))
    return None


def normalize_path(path: str) -> str | None:
    if not path or path.startswith(("#", "mailto:", "tel:", "javascript:")):
        return None
    if path.startswith("//"):
        path = "https:" + path
    if path.startswith("http"):
        parsed = urllib.parse.urlparse(path)
        if parsed.netloc and parsed.netloc not in ("pitcher.agency", "www.pitcher.agency"):
            return None
        path = parsed.path
        if parsed.query:
            path += "?" + parsed.query
    if "?" in path:
        path = path.split("?", 1)[0]
    if not path.startswith("/"):
        return None
    # Skip backend endpoints
    if path.startswith("/feedback/"):
        return None
    return path


def local_path(url_path: str) -> Path:
    if url_path == "/" or url_path == "":
        return ROOT / "index.html"
    clean = url_path.strip("/")
    p = ROOT / clean
    if url_path.endswith("/") or "." not in Path(clean).name:
        return p / "index.html"
    return p


def save_file(url_path: str, data: bytes) -> Path:
    global downloaded_count
    dest = local_path(url_path)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    downloaded_count += 1
    return dest


def is_asset(path: str) -> bool:
    return any(path.startswith(p) for p in ASSET_PREFIXES)


def is_html_page(path: str) -> bool:
    if is_asset(path):
        return False
    if path.startswith("/feedback"):
        return False
    ext = Path(path.rstrip("/")).suffix.lower()
    return ext in ("", ".html", ".htm") or path.endswith("/")


def extract_paths_from_html(html: str) -> set[str]:
    paths: set[str] = set()
    for m in INTERNAL_LINK_RE.finditer(html):
        p = normalize_path(m.group(1))
        if p:
            paths.add(p)
    for m in SRCSET_RE.finditer(html):
        p = normalize_path(m.group(1))
        if p:
            paths.add(p)
    return paths


def extract_paths_from_css(css: str) -> set[str]:
    paths: set[str] = set()
    for m in CSS_URL_RE.finditer(css):
        raw = m.group(1)
        p = normalize_path(raw)
        if p:
            paths.add(p)
    return paths


def download_asset(path: str) -> None:
    if path in visited_assets:
        return
    visited_assets.add(path)
    url = BASE_URL + path
    data = fetch(url)
    if data is None:
        return
    save_file(path, data)
    if path.endswith(".css"):
        try:
            css_text = data.decode("utf-8", errors="replace")
            for sub in extract_paths_from_css(css_text):
                if is_asset(sub):
                    download_asset(sub)
        except Exception:
            pass


def download_page(path: str) -> str | None:
    if path in visited_pages:
        return None
    visited_pages.add(path)
    url = BASE_URL + (path if path != "/" else "/")
    data = fetch(url)
    if data is None:
        return None
    try:
        html = data.decode("utf-8")
    except UnicodeDecodeError:
        html = data.decode("latin-1")
    # Bump cache versions in HTML
    html = re.sub(
        r'(\?)(sha256-[^"\']+|1783504045|\d+)',
        lambda m: f"?{CACHE_BUST}",
        html,
    )
    save_file(path, html.encode("utf-8"))
    return html


def crawl():
    queue: deque[str] = deque()
    for p in SEED_PATHS:
        np = normalize_path(p)
        if np and is_html_page(np):
            queue.append(np)

    pages_found: set[str] = set(queue)
    max_pages = 500
    iteration = 0

    while queue and iteration < max_pages:
        path = queue.popleft()
        iteration += 1
        html = download_page(path)
        if not html:
            continue
        for sub in extract_paths_from_html(html):
            if is_asset(sub):
                download_asset(sub)
            elif is_html_page(sub) and sub not in pages_found:
                pages_found.add(sub)
                queue.append(sub)
        if iteration % 10 == 0:
            print(f"  pages={len(visited_pages)} assets={len(visited_assets)} queue={len(queue)}")

    # Always fetch core build assets
    core_assets = [
        "/assets/front/build/css/app.min.css",
        "/assets/front/build/js/app.min.js",
        "/assets/front/build/js/vendor.polyfills.min.js",
        "/assets/front/build/js/vendor.three-addons.min.js",
        "/assets/front/build/js/vendor.three.min.js",
        "/assets/front/build/js/vendor.popperjs-core.min.js",
        "/assets/front/build/js/vendor.imask.min.js",
        "/assets/front/build/js/vendor.bootstrap.min.js",
        "/assets/front/build/js/vendor.gsap.min.js",
        "/assets/front/build/js/vendor.splidejs-splide.min.js",
        "/assets/front/build/js/vendor.barba-core.min.js",
        "/assets/front/build/img/svg-sprite.svg",
        "/assets/front/build/img/og-image.png",
        "/assets/front/build/fonts/Manrope-VariableFont_wght.woff2",
        "/assets/front/build/fonts/OpenSans-VariableFont_wdth,wght.woff2",
    ]
    for a in core_assets:
        download_asset(a)


def main():
    ROOT.mkdir(parents=True, exist_ok=True)
    print(f"Mirroring {BASE_URL} -> {ROOT}")
    crawl()
    print(f"\nDone: {len(visited_pages)} pages, {len(visited_assets)} assets, {downloaded_count} files saved")
    if failed:
        print(f"Failed ({len(failed)}):")
        for url, err in failed[:20]:
            print(f"  {url}: {err}")
    # Write manifest
    manifest = ROOT / "_mirror_manifest.txt"
    manifest.write_text(
        f"pages={len(visited_pages)}\nassets={len(visited_assets)}\ntotal_files={downloaded_count}\ncache={CACHE_BUST}\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
