"""Normalize frontend asset tags so animations always load in the right order.

Order:
  polyfills → three-addons → three → popper → imask → bootstrap →
  gsap → splide → barba → app → agile-global
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public"
VERSION = "v20260722u"
AGILE_CSS = f"/css/agile-overrides.css?{VERSION}"
AGILE_JS = f"/js/agile-global.js?{VERSION}"

# Block hero WebGL before Pitcher app boots (so poster/toggle path stays usable)
HERO_BOOT = (
    "<script>"
    "(function(){if(window.__agileHeroWebGLBlocked)return;window.__agileHeroWebGLBlocked=1;"
    "var o=HTMLCanvasElement.prototype.getContext;"
    "HTMLCanvasElement.prototype.getContext=function(t){"
    "if((t==='webgl'||t==='webgl2'||t==='experimental-webgl')&&this.closest&&this.closest('.hero-canvas'))return null;"
    "return o.apply(this,arguments);};})();"
    "</script>\n"
)

SCRIPT_STACK = [
    ("js-vendorpolyfills", f"/assets/front/build/js/vendor.polyfills.min.js?{VERSION}"),
    ("js-vendorthree-addons", f"/assets/front/build/js/vendor.three-addons.min.js?{VERSION}"),
    ("js-vendorthree", f"/assets/front/build/js/vendor.three.min.js?{VERSION}"),
    ("js-vendorpopperjs-core", f"/assets/front/build/js/vendor.popperjs-core.min.js?{VERSION}"),
    ("js-vendorimask", f"/assets/front/build/js/vendor.imask.min.js?{VERSION}"),
    ("js-vendorbootstrap", f"/assets/front/build/js/vendor.bootstrap.min.js?{VERSION}"),
    ("js-vendorgsap", f"/assets/front/build/js/vendor.gsap.min.js?{VERSION}"),
    ("js-vendorsplidejs-splide", f"/assets/front/build/js/vendor.splidejs-splide.min.js?{VERSION}"),
    ("js-vendorbarba-core", f"/assets/front/build/js/vendor.barba-core.min.js?{VERSION}"),
    ("js-app", f"/assets/front/build/js/app.min.js?{VERSION}"),
]

DROP_SRC_RE = re.compile(
    r"<script\b[^>]*\bsrc=[\"'][^\"']*("
    r"vendor\.(?:polyfills|three|three-addons|popperjs-core|imask|bootstrap|gsap|splidejs-splide|barba-core)\.min\.js|"
    r"app\.min\.js|"
    r"agile-(?:perf|global|hero)\.js"
    r")[^\"']*[\"'][^>]*>\s*</script>\s*",
    re.I,
)

DROP_EMPTY_SCRIPT_RE = re.compile(
    r"<script\b[^>]*\bsrc=[\"']\?[^\"']*[\"'][^>]*>\s*</script>\s*"
    r"|<script\b(?=[^>]*\bdefer)(?![^>]*\bsrc=[\"'][^\"']+)[^>]*>\s*</script>\s*",
    re.I,
)

DROP_OVERRIDE_LINK_RE = re.compile(
    r"<link\b[^>]*href=[\"']/css/agile-overrides\.css[^\"']*[\"'][^>]*/?>\s*",
    re.I,
)


def build_scripts(prefix: str = "") -> str:
    lines = []
    for sid, src in SCRIPT_STACK:
        lines.append(
            f'<script defer fetchpriority="auto" id="{sid}" src="{prefix}{src}"></script>'
        )
    lines.append(f'<script defer src="{prefix}{AGILE_JS}"></script>')
    return "\n".join(lines) + "\n"


def wire_html(path: Path, prefix: str = "") -> bool:
    raw = path.read_text(encoding="utf-8", errors="replace")
    text = DROP_SRC_RE.sub("", raw)
    text = DROP_EMPTY_SCRIPT_RE.sub("", text)
    text = DROP_OVERRIDE_LINK_RE.sub("", text)

    # single overrides css before </head>
    css = f'<link href="{prefix}{AGILE_CSS}" rel="stylesheet"/>\n'
    if "</head>" in text:
        if "agileHeroWebGLBlocked" not in text:
            text = text.replace("</head>", HERO_BOOT + css + "</head>", 1)
        else:
            text = text.replace("</head>", css + "</head>", 1)

    # ensure webpack public path attribute stays absolute for current host root/prefix
    if prefix and 'data-public-path="' in text:
        text = re.sub(
            r'data-public-path="[^"]*"',
            f'data-public-path="{prefix}/assets/front/build/"',
            text,
            count=1,
        )

    scripts = build_scripts(prefix)
    if "</body>" not in text:
        return False
    text = text.replace("</body>", scripts + "</body>", 1)

    if text == raw:
        return False
    path.write_text(text, encoding="utf-8")
    return True


def main() -> int:
    prefix = ""
    if len(sys.argv) > 1:
        prefix = sys.argv[1].rstrip("/")
    files = sorted(PUBLIC.rglob("*.html"))
    changed = 0
    for path in files:
        if wire_html(path, prefix=prefix):
            changed += 1
            print(f"wired: {path.relative_to(ROOT)}")
    print(f"Done. Wired {changed}/{len(files)} HTML files. prefix={prefix or '/'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
