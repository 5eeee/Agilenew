#!/usr/bin/env python3
"""Final Agile Business cleanup: content, assets injection, Pitcher removal."""
from __future__ import annotations

import re
from pathlib import Path

PUBLIC = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"
CSS_TAG = '<link href="/css/agile-overrides.css?v20260722m" rel="stylesheet">'
JS_TAG = '<script src="/js/agile-global.js?v20260722m" defer></script>'
# Remove hash that disables ModelSticky WebGL
CLEAR_NOWEBGL = (
    '<script>if(location.hash==="#nowebgl")'
    'history.replaceState(null,"",location.pathname+location.search);</script>'
)
NOWEBGL_SCRIPT_OLD = (
    '<script>if(location.hash!=="#nowebgl")'
    'history.replaceState(null,"",location.pathname+location.search+"#nowebgl");</script>'
)

# Remove Pitcher rating stat block entirely
RATING_STAT_RE = re.compile(
    r'<div class="clients-content__item">\s*'
    r'<div class="clients-content__number">\s*11\s*</div>\s*'
    r'в\s*рейтинге<br>«Креатив в<br>Цифровых продуктах»\s*'
    r'</div>\s*',
    re.DOTALL,
)

# Remove Agile Call / Agile KPI from industries marquee
INDUSTRY_AGILE_CALL = re.compile(
    r'<li class="industries__item">\s*'
    r'<a href="/products" class="text-decoration-none d-inline-block">\s*'
    r'Agile Call\s*</a>\s*</li>\s*',
    re.DOTALL,
)
INDUSTRY_AGILE_KPI = re.compile(
    r'<li class="industries__item">\s*'
    r'<a href="/products" class="text-decoration-none d-inline-block">\s*'
    r'Agile KPI\s*</a>\s*</li>\s*',
    re.DOTALL,
)

CONTENT_REPLACEMENTS: list[tuple[str, str]] = [
    ("Давайте обсудим<br> ваш проект!", "Обсудим задачу<br> вашего бизнеса"),
    ("Давайте обсудим<br>ваш проект!", "Обсудим задачу<br>вашего бизнеса"),
    ("Расскажите кратко о вашем проекте", "Опишите задачу или цель"),
    ("Расскажите о вашем проекте", "Опишите задачу или цель"),
    ("О проекте", "О задаче"),
    ("О проекте", "О задаче"),
    ("Свяжитесь с нами", "Заявка с сайта Agile Business"),
    ("Наши работы получают награды на самых престижных конкурсах.", "Проект Agile Business — комплексный консалтинг с измеримым результатом."),
    ("В разделе представлено более 67 работ для разных отраслей — промышленность, строительство, производство, энергетика, госсектор, недвижимость. ", "Кейсы Agile Business: консалтинг, аналитика, ИТ и креатив. "),
    ('value="Комплекс работ"', 'value="Комплексный консалтинг"'),
    ('value="Корп. сайт"', 'value="Бизнес-аналитика"'),
    ('value="Онлайн-сервис"', 'value="ИТ и разработка"'),
    ('value="Брендинг"', 'value="Креатив"'),
    ('value="Поддержка"', 'value="Управление и стратегия"'),
    ("Комплекс работ", "Комплексный консалтинг"),
    ("Корп. сайт", "Бизнес-аналитика"),
    ("Онлайн-сервис", "ИТ и разработка"),
    ("Поддержка", "Управление и стратегия"),
    (
        "Agile Call и Agile KPI<br> для команд и руководителей",
        "Собственные продукты<br> для команд и руководителей",
    ),
    (
        "Agile Call и Agile KPI<br> для бизнеса и руководителей",
        "Собственные продукты<br> для команд и руководителей",
    ),
    (
        " Готовые продукты<br> Agile Call и Agile KPI<br> ",
        " Собственные продукты<br> для роста эффективности<br> ",
    ),
    (
        '<div class="clients-content__number">11</div> в рейтинге<br>«Креатив в<br>Цифровых продуктах» ',
        "",
    ),
    (
        '<div class="clients-content__number"> 11 </div> в рейтинге<br>«Креатив в<br>Цифровых продуктах» ',
        "",
    ),
    ('"name":"Pitcher"', '"name":"Agile Business"'),
    ("digital-агентства Pitcher.", "Agile Business."),
    ("digital-агентства Pitcher", "Agile Business"),
    ("Pitcher Pitcher", "Agile Business"),
    ("Pitcher\u00a0Pitcher", "Agile Business"),
    (">Pitcher<", ">Agile Business<"),
    (" Pitcher ", " Agile Business "),
    ("Pitcher.", "Agile Business."),
    ("https://pitcher.agency/", "https://agile-business-pro.com/"),
    ("pitcher.agency", "agile-business-pro.com"),
]

OLD_ASSETS = [
    "/css/agile-overrides.css?v20260722b",
    "/css/agile-overrides.css?v20260722c",
    "/css/agile-overrides.css?v20260722d",
    "/css/agile-overrides.css?v20260722e",
    "/css/agile-overrides.css?v20260722f",
    "/css/agile-overrides.css?v20260722g",
    "/css/agile-overrides.css?v20260722h",
    "/css/agile-overrides.css?v20260722i",
    "/js/agile-hero.js",
    "agile-hero.js?v20260722b",
    "/js/agile-global.js?v20260722c",
    "/js/agile-global.js?v20260722d",
    "/js/agile-global.js?v20260722e",
    "/js/agile-global.js?v20260722f",
    "/js/agile-global.js?v20260722g",
    "/js/agile-global.js?v20260722h",
    "/js/agile-global.js?v20260722i",
]


def inject_assets(text: str) -> str:
    text = text.replace(NOWEBGL_SCRIPT_OLD, "")
    text = text.replace('history.replaceState(null,"",location.pathname+location.search+"#nowebgl");', "")

    if CSS_TAG not in text:
        if "</head>" in text:
            text = text.replace("</head>", CSS_TAG + CLEAR_NOWEBGL + "</head>", 1)
        elif '<link href="/assets/front/build/css/app.min.css"' in text:
            text = text.replace(
                '<link href="/assets/front/build/css/app.min.css"',
                CSS_TAG + '<link href="/assets/front/build/css/app.min.css"',
                1,
            )

    for old in OLD_ASSETS:
        text = text.replace(old, "")

    # replace older agile-global tags
    text = re.sub(
        r'<script src="/js/agile-global\.js\?v[^"]*" defer></script>',
        JS_TAG,
        text,
    )
    text = re.sub(
        r'<link href="/css/agile-overrides\.css\?v[^"]*" rel="stylesheet">',
        CSS_TAG,
        text,
    )

    if JS_TAG not in text:
        if '<script src="/assets/front/build/js/app.min.js"' in text:
            text = text.replace(
                '<script src="/assets/front/build/js/app.min.js"',
                JS_TAG + '<script src="/assets/front/build/js/app.min.js"',
                1,
            )
        elif "</body>" in text:
            text = text.replace("</body>", JS_TAG + "</body>", 1)

    text = text.replace("/js/agile-hero.js?v20260722b", "")
    text = text.replace('<script src="/js/agile-hero.js" defer></script>', JS_TAG)

    if CLEAR_NOWEBGL not in text and "</head>" in text:
        text = text.replace("</head>", CLEAR_NOWEBGL + "</head>", 1)

    return text


def patch_index(text: str) -> str:
    text = RATING_STAT_RE.sub("", text)
    text = INDUSTRY_AGILE_CALL.sub("", text)
    text = INDUSTRY_AGILE_KPI.sub("", text)
    for old, new in CONTENT_REPLACEMENTS:
        text = text.replace(old, new)
    return text


def process_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    text = original

    rel = str(path.relative_to(PUBLIC)).replace("\\", "/")
    if rel == "index.html":
        text = patch_index(text)

    text = inject_assets(text)
    for old, new in CONTENT_REPLACEMENTS:
        if rel != "index.html" or old not in (
            "Agile Call и Agile KPI<br> для команд и руководителей",
            "Agile Call и Agile KPI<br> для бизнеса и руководителей",
            " Готовые продукты<br> Agile Call и Agile KPI<br> ",
        ):
            text = text.replace(old, new)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    updated: list[str] = []
    for html in sorted(PUBLIC.rglob("*.html")):
        if process_file(html):
            updated.append(str(html.relative_to(PUBLIC)))
    print(f"Updated {len(updated)} files")
    for p in updated[:30]:
        print(f"  - {p}")
    if len(updated) > 30:
        print(f"  ... and {len(updated) - 30} more")


if __name__ == "__main__":
    main()
