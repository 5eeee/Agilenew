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
        text = re.sub(
            rf'({attr}=")(/)(?!/)',
            rf"\1{BASE}/",
            text,
            flags=re.I,
        )
        text = re.sub(
            rf"({attr}=')(/)(?!/)",
            rf"\1{BASE}/",
            text,
            flags=re.I,
        )
    text = re.sub(r'url\((["\']?)/', rf"url(\1{BASE}/", text)
    text = text.replace(BASE + BASE + "/", BASE + "/")
    # Don't rewrite absolute external urls that accidentally got prefixed
    text = text.replace(f'{BASE}/https://', "https://")
    text = text.replace(f"{BASE}/http://", "http://")
    return text


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

    for path in list(out.rglob("*.html")) + list(out.rglob("*.css")) + list(out.rglob("*.js")) + list(
        out.rglob("*.json")
    ):
        original = path.read_text(encoding="utf-8", errors="replace")
        updated = rewrite(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")

    (out / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Prepared {out} with base {BASE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
