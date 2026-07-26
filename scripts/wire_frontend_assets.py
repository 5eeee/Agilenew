"""Normalize frontend asset tags so animations load in the right order.

app.min.js always depends on Three webpack chunks (605/623), so Three
must load on EVERY page — not only ModelSticky.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public"
VERSION = "v20260727a"
AGILE_CSS = f"/css/agile-overrides.css?{VERSION}"
AGILE_JS = f"/js/agile-global.js?{VERSION}"

HEAD_BOOT = (
    "<script>"
    "(function(){"
    "if(window.__agileHeroWebGLBlocked)return;window.__agileHeroWebGLBlocked=1;"
    "var o=HTMLCanvasElement.prototype.getContext;"
    "HTMLCanvasElement.prototype.getContext=function(t){"
    "if((t==='webgl'||t==='webgl2'||t==='experimental-webgl')&&this.closest&&this.closest('.hero-canvas'))return null;"
    "return o.apply(this,arguments);};"
    "function killIntro(){"
    "var b=document.body;if(!b)return;"
    "b.classList.remove('is-header-intro-show','is-header-intro-init');"
    "document.querySelectorAll('[data-component=\"HeaderIntro\"]').forEach(function(el){el.removeAttribute('data-component');});"
    "document.querySelectorAll('.header-backdrop').forEach(function(el){el.classList.add('fade');el.style.display='none';});"
    "}"
    "if(document.body)killIntro();"
    "document.addEventListener('DOMContentLoaded',killIntro);"
    "})();"
    "</script>\n"
)

CORE_SCRIPTS = [
    ("js-vendorpolyfills", f"/assets/front/build/js/vendor.polyfills.min.js?{VERSION}"),
    ("js-vendorpopperjs-core", f"/assets/front/build/js/vendor.popperjs-core.min.js?{VERSION}"),
    ("js-vendorimask", f"/assets/front/build/js/vendor.imask.min.js?{VERSION}"),
    ("js-vendorbootstrap", f"/assets/front/build/js/vendor.bootstrap.min.js?{VERSION}"),
    ("js-vendorgsap", f"/assets/front/build/js/vendor.gsap.min.js?{VERSION}"),
    ("js-vendorsplidejs-splide", f"/assets/front/build/js/vendor.splidejs-splide.min.js?{VERSION}"),
    ("js-vendorbarba-core", f"/assets/front/build/js/vendor.barba-core.min.js?{VERSION}"),
    ("js-app", f"/assets/front/build/js/app.min.js?{VERSION}"),
]

THREE_SCRIPTS = [
    ("js-vendorthree-addons", f"/assets/front/build/js/vendor.three-addons.min.js?{VERSION}"),
    ("js-vendorthree", f"/assets/front/build/js/vendor.three.min.js?{VERSION}"),
]

DROP_SRC_RE = re.compile(
    r"<script\b[^>]*\bsrc=[\"'][^\"']*("
    r"vendor\.(?:polyfills|three|three-addons|popperjs-core|imask|bootstrap|gsap|splidejs-splide|barba-core)\.min\.js|"
    r"app\.min\.js|"
    r"agile-(?:perf|global|hero|topo)\.js"
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

HEADER_INTRO_RE = re.compile(
    r'\sdata-component=(["\'])HeaderIntro\1',
    re.I,
)

LOGO_LG_RE = re.compile(r'class="logo logo--lg js-header-logo"')
LOGO_STYLE_RE = re.compile(
    r'(src="/assets/logo.png")([^>]*?)\sstyle="height:48px;width:auto;display:block"'
)

HEADER_NAV = """
    <nav class="header__nav" aria-label="Основное меню">
     <a class="header__nav-link" href="{base}/services">Услуги</a>
     <a class="header__nav-link" href="{base}/works">Проекты</a>
     <a class="header__nav-link" href="{base}/about">О нас</a>
     <a class="header__nav-link" href="{base}/awards">Подход</a>
     <a class="header__nav-link" href="{base}/contacts">Контакты</a>
    </nav>
"""

HEADER_NAV_RE = re.compile(
    r'<nav class="header__nav"[^>]*>.*?</nav>\s*',
    re.I | re.S,
)


def build_scripts(prefix: str = "") -> str:
    # polyfills → three chunks → rest → app → agile-global
    stack = [CORE_SCRIPTS[0]] + THREE_SCRIPTS + CORE_SCRIPTS[1:]

    lines = []
    for sid, src in stack:
        prio = "low" if "three" in sid else "auto"
        lines.append(
            f'<script defer fetchpriority="{prio}" id="{sid}" src="{prefix}{src}"></script>'
        )
    lines.append(f'<script defer src="{prefix}{AGILE_JS}"></script>')
    return "\n".join(lines) + "\n"


def inject_header_nav(text: str, prefix: str = "") -> str:
    text = HEADER_NAV_RE.sub("", text)
    nav = HEADER_NAV.format(base=prefix or "")
    marker = '<div class="header__feedback">'
    if marker in text:
        text = text.replace(marker, nav + marker, 1)
    return text


def wire_html(path: Path, prefix: str = "") -> bool:
    raw = path.read_text(encoding="utf-8", errors="replace")

    text = DROP_SRC_RE.sub("", raw)
    text = DROP_EMPTY_SCRIPT_RE.sub("", text)
    text = DROP_OVERRIDE_LINK_RE.sub("", text)
    text = HEADER_INTRO_RE.sub("", text)
    text = LOGO_LG_RE.sub('class="logo js-header-logo"', text)
    text = LOGO_STYLE_RE.sub(r"\1\2", text)
    text = inject_header_nav(text, prefix=prefix)

    text = text.replace('class="clients agile-about"', 'class="clients"')

    css = f'<link href="{prefix}{AGILE_CSS}" rel="stylesheet"/>\n'
    if "</head>" in text:
        text = re.sub(
            r"<script>\s*\(function\(\)\{if\(window\.__agileHeroWebGLBlocked\).*?</script>\s*",
            "",
            text,
            count=1,
            flags=re.S,
        )
        text = text.replace("</head>", HEAD_BOOT + css + "</head>", 1)

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
    print(f"Done. Wired {changed}/{len(files)}. Three.js: all pages.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
