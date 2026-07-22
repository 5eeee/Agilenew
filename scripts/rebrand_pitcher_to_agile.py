#!/usr/bin/env python3
"""Rebrand Pitcher clone HTML to Agile Business content."""
from __future__ import annotations

import re
from pathlib import Path

PUBLIC = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"

# Order matters: longer / more specific patterns first
GLOBAL_REPLACEMENTS: list[tuple[str, str]] = [
    ("Pitcher\u00a0Pitcher", "Agile Business"),
    ("Pitcher Pitcher", "Agile Business"),
    ("Pitcher.agency", "Agile Business"),
    ("Pitcher agancy", "Agile Business"),
    ("Pitcher agency", "Agile Business"),
    ("в Pitcher,", "в Agile Business,"),
    ("у Pitcher,", "у Agile Business,"),
    (" Pitcher ", " Agile Business "),
    ("Pitcher.", "Agile Business."),
    ("Pitcher,", "Agile Business,"),
    ("Pitcher!", "Agile Business!"),
    ("Pitcher</", "Agile Business</"),
    (">Pitcher<", ">Agile Business<"),
    ("digital-агентства Pitcher.", "Agile Business."),
    ("digital-агентства Pitcher", "Agile Business"),
    ("https://pitcher.agency/", "https://agile-business-pro.com/"),
    ("http://pitcher.agency/", "https://agile-business-pro.com/"),
    ("pitcher.agency", "agile-business-pro.com"),
    ("love@pitcher.agency", "info@agile-business-pro.com"),
    ("mailto:love@pitcher.agency", "mailto:info@agile-business-pro.com"),
    ("love@agile-business-pro.com", "info@agile-business-pro.com"),
    ("mailto:love@agile-business-pro.com", "mailto:info@agile-business-pro.com"),
    ("tel:88007773541", "tel:+79636177373"),
    ("8 800 777-35-41", "+7 (963) 617-73-73"),
    ("88007773541", "+79636177373"),
    ('"name":"Pitcher"', '"name":"Agile Business"'),
    ('content="pitcher.agency"', 'content="Agile Business"'),
    ('content="Pitcher agency — создаем сайты и сервисы"', 'content="Agile Business — бизнес-консалтинг"'),
    ("Pitcher agency — создаем сайты и сервисы", "Agile Business — бизнес-консалтинг"),
    ("Pitcher. Разработка сайтов и сервисов.", "Agile Business — бизнес-консалтинг."),
    ("Pitcher. Создаем сайты и онлайн-сервисы с впечатляющим дизайном.", "Agile Business — бизнес-консалтинг нового поколения."),
    ("Pitcher. Разработка сайтов и сервисов", "Agile Business — бизнес-консалтинг"),
    ('<div class="about__heading-text js-heading-text">Pitcher</div>', '<div class="about__heading-text js-heading-text">Agile Business</div>'),
    ("agency-pitcher-agency", "agile-business"),
    ("Pitcher. Создаем сайты и онлайн-сервисы", "Agile Business — бизнес-консалтинг"),
    ('<span class="toast-title messages-toast__title">Pitcher</span>', '<span class="toast-title messages-toast__title">Agile Business</span>'),
    ('<div itemprop="name" class="d-none">Pitcher</div>', '<div itemprop="name" class="d-none">Agile Business</div>'),
    ("Наши работы получают награды на самых престижных конкурсах.", "Проект Agile Business — комплексный консалтинг с измеримым результатом."),
    ("https://dprofile.ru/pitcher", "https://t.me/agilebusiness"),
    ("https://vk.com/pitcher", "https://t.me/agilebusiness"),
    ("https://behance.net/pitcher", "https://t.me/agilebusiness"),
    ("Dprofile", "Telegram"),
    ("Vkontakte", "Telegram"),
    ("Behance", "Telegram"),
    ('application-name" content="pitcher.agency"', 'application-name" content="Agile Business"'),
    ("© 2001 — 2026", "© 2026 Agile Business"),
    ("© 2001 — 2026", "© 2026 Agile Business"),
    (
        "В разделе представлено более 67 работ для разных отраслей — промышленность, строительство, производство, энергетика, госсектор, недвижимость. ",
        "Кейсы Agile Business: консалтинг, аналитика, ИТ и креатив. ",
    ),
    (
        'value="Свяжитесь с нами"',
        'value="Заявка с сайта Agile Business"',
    ),
]

WORK_PAGE_TITLE = re.compile(
    r"<title>Проект ([^<]+) — портфолио работ Agile Business\.</title>"
)

WORK_PAGE_TITLE_FALLBACK = re.compile(
    r"<title>Проект ([^<]+) — портфолио работ digital-агентства Pitcher\.</title>"
)

CITIES_OLD = (
    '<div class="menu-overlay__cities"> <div class="nav-cities"> '
    '<span class="nav-cities__item">Москва,</span> '
    '<span class="nav-cities__item">Санкт-Петербург,</span> '
    '<span class="nav-cities__item">Краснодар,</span> '
    '<span class="nav-cities__item"> Красноярск <span class="nav-cities__note">+4 МСК</span></span> '
    "</div> </div>"
)
CITIES_NEW = (
    '<div class="menu-overlay__cities"> <div class="nav-cities"> '
    '<span class="nav-cities__item">Москва</span> '
    "</div> </div>"
)

FOOTER_CITIES_OLD = (
    '<div class="footer__cities"> <div class="nav-cities"> '
    '<span class="nav-cities__item">Москва,</span> '
    '<span class="nav-cities__item">Санкт-Петербург,</span> '
    "<br> "
    '<span class="nav-cities__item">Краснодар,</span> '
    '<span class="nav-cities__item">Красноярск,</span> '
    "<br> "
    '<span class="nav-cities__item">Крым и Севастополь</span> '
    "</div> </div>"
)
FOOTER_CITIES_NEW = (
    '<div class="footer__cities"> <div class="nav-cities"> '
    '<span class="nav-cities__item">Москва</span> '
    "</div> </div>"
)

LOGO_OLD = re.compile(
    r'<div class="logo__text">PITCHER</div>\s*<svg[^>]*>.*?</svg>',
    re.DOTALL,
)
LOGO_NEW = (
    '<img src="/assets/logo.png" alt="Agile Business" '
    'width="200" height="52" style="height:48px;width:auto;display:block">'
)

PAGE_TITLES: dict[str, tuple[str, str]] = {
    "index.html": (
        "Agile Business — Бизнес-консалтинг нового поколения",
        "Профессиональный бизнес-консалтинг в 3 направлениях: бизнес-аналитика, ИТ-разработка, креатив.",
    ),
    "about/index.html": (
        "О нас — Agile Business",
        "Agile Business — команда экспертов в стратегии, аналитике и технологиях. Agile подход к решению сложных бизнес-задач.",
    ),
    "works/index.html": (
        "Наши работы — Agile Business",
        "Проекты и кейсы Agile Business: продукты, консалтинг, аналитика, ИТ и креатив.",
    ),
    "services/index.html": (
        "Наши услуги — Agile Business",
        "Три направления экспертизы с прозрачными ценами: аналитика, ИТ, креатив.",
    ),
    "services/website/index.html": (
        "Бизнес-аналитика — Agile Business",
        "BI-системы, прогнозирование, data-driven управление от Agile Business.",
    ),
    "services/online/index.html": (
        "ИТ и разработка — Agile Business",
        "ИТ-стратегия, веб- и мобильная разработка, кибербезопасность от Agile Business.",
    ),
    "services/branding/index.html": (
        "Креатив — Agile Business",
        "Комплексный маркетинг, продажи и дизайн от Agile Business.",
    ),
    "awards/index.html": (
        "Наш подход — Agile Business",
        "Методология Agile Business: диагностика, стратегия, реализация и масштабирование.",
    ),
    "reviews/index.html": (
        "Отзывы — Agile Business",
        "98% клиентов рекомендуют Agile Business. Отзывы о консалтинге и внедрении.",
    ),
    "blog/index.html": (
        "Статьи — Agile Business",
        "Экспертные статьи по бизнес-консалтингу, аналитике, ИТ и маркетингу от Agile Business.",
    ),
    "contacts/index.html": (
        "Контакты — Agile Business",
        "Свяжитесь с Agile Business: info@agile-business-pro.com, +7 (963) 617-73-73.",
    ),
    "policy/index.html": (
        "Политика конфиденциальности — Agile Business",
        "Политика конфиденциальности сайта Agile Business.",
    ),
    "approval/index.html": (
        "Согласие на обработку данных — Agile Business",
        "Согласие на обработку персональных данных Agile Business.",
    ),
}

WORKS_GRID: list[tuple[str, str, str, str]] = [
    ("НТО", "Agile Call", "ИТ", "Продукт видеоконференций для команд"),
    ("ЖК Дом Кино", "Agile KPI", "ИТ", "Система KPI для сотрудников и руководителей"),
    ("Rouge Bunny Rouge", "Корпоративный сайт", "Креатив", "Корпоративный сайт под задачи бизнеса"),
    ("Небо над Енисеем", "Лендинг", "Креатив", "Лендинг с фокусом на конверсию"),
    ("DataРу", "BI-аналитика", "Аналитика", "BI-системы и визуализация данных"),
    ("DEPO", "Стратегический консалтинг", "Аналитика", "Стратегия и оптимизация процессов"),
    ("Full View", "Веб-сервис", "ИТ", "Цифровой продукт и системная интеграция"),
    ("НПЦ Магнитной гидродинамики", "CRM-интеграция", "ИТ", "ИТ-стратегия и интеграция систем"),
    ("Виколор", "Маркетинговая кампания", "Креатив", "Комплексный маркетинг и brand-стратегия"),
]

BLOG_ARTICLES: dict[str, tuple[str, str, str]] = {
    "3d-industry": (
        "Data-driven управление: зачем бизнесу BI-системы",
        "Аналитика",
        "Бизнес-аналитика и BI-системы помогают принимать решения на данных, а не на интуиции. Разбираем, когда компании пора переходить к data-driven управлению.",
    ),
    "solve-business-problem": (
        "Как выбрать бизнес-консультанта, который решает задачи, а не продаёт отчёты",
        "Гайд",
        "Вы ставите задачу, выделяете бюджет — и получаете красивый отчёт без изменений в P&L. Как отличить консультанта, который доводит до результата.",
    ),
    "storytelling": (
        "Agile-подход к трансформации бизнеса: от диагностики до масштабирования",
        "Методология",
        "Методология Agile Business: диагностика, стратегия с KPI, внедрение спринтами и закрепление результатов.",
    ),
    "top-realtors": (
        "KPI сотрудников: как внедрить систему оценки эффективности",
        "Продукты",
        "Прозрачные KPI по срокам, качеству и ответственности — как Agile KPI помогает командам и руководителям.",
    ),
}

INDEX_REPLACEMENTS: list[tuple[str, str]] = [
    (
        '<a href="/services/website" class="hero-title__link js-hero-title-linkleft active">Сайты</a>',
        '<a href="/services/website" class="hero-title__link js-hero-title-linkleft active">Аналитика</a>',
    ),
    (
        '<a href="/services/online" class="hero-title__link js-hero-title-linkright">Сервисы</a>',
        '<a href="/services/online" class="hero-title__link js-hero-title-linkright">ИТ</a>',
    ),
    (
        "Сайты и веб-сервисы<br> с впечатляющим дизайном",
        "3 направления экспертизы<br> для роста вашего бизнеса",
    ),
    (
        "Не бросаем проекты,<br> умеем работать вдолгую",
        "Бизнес-консалтинг<br> нового поколения",
    ),
    (
        " Pitcher. Сфокусированы на разработке корпоративных сайтов и веб-сервисов с впечатляющим дизайном. ",
        " Agile Business. Решения под задачи бизнеса — аналитика, ИТ и креатив для трансформации и масштабирования. ",
    ),
    (
        " Умеем работать с различными отраслями, но максимальный опыт у нас в следующих ",
        " Три направления экспертизы Agile Business для трансформации и масштабирования ",
    ),
    (
        '<a href="/works/industry/industry" class="text-decoration-none d-inline-block"> Промышленность </a>',
        '<a href="/services/website" class="text-decoration-none d-inline-block"> Бизнес-аналитика </a>',
    ),
    (
        '<a href="/works/industry/construction" class="text-decoration-none d-inline-block"> Строительство </a>',
        '<a href="/services/online" class="text-decoration-none d-inline-block"> ИТ и разработка </a>',
    ),
    (
        '<a href="/works/industry/services" class="text-decoration-none d-inline-block"> B2B-услуги </a>',
        '<a href="/services/branding" class="text-decoration-none d-inline-block"> Креатив </a>',
    ),
    (
        '<a href="/works/industry/itadv" class="text-decoration-none d-inline-block"> ИТ </a>',
        '<a href="/services" class="text-decoration-none d-inline-block"> Управление и стратегия </a>',
    ),
    (
        '<a href="/works/industry/trade" class="text-decoration-none d-inline-block"> Торговля </a>',
        '<a href="/services" class="text-decoration-none d-inline-block"> Инвестиции и оценка </a>',
    ),
    (
        '<a href="/works/industry/energy" class="text-decoration-none d-inline-block"> Энергетика </a>',
        '<a href="/services/branding" class="text-decoration-none d-inline-block"> Маркетинг </a>',
    ),
    (
        '<a href="/works/industry/gos" class="text-decoration-none d-inline-block"> Госструктуры </a>',
        '<a href="/contacts" class="text-decoration-none d-inline-block"> Консалтинг </a>',
    ),
    (
        " Мы сторонники разумного креатива, <strong class=\"manner__content-highlight\">производящего впечатление и эффективно</strong> решающего задачи бизнеса. ",
        " Методология <strong class=\"manner__content-highlight\">Agile Business</strong>: диагностика, стратегия с KPI, внедрение и масштабирование результатов. ",
    ),
    (
        '<div class="heading__text js-heading-text">Клиенты</div>',
        '<div class="heading__text js-heading-text">О компании</div>',
    ),
    (
        " Клиенты ценят нас за оперативные решения, доступность консультирования, вовлеченность, поддержку проекта, компетентность и работу на результат ",
        " Мы — команда экспертов, объединяющая аналитику, стратегию и технологии для решения сложных бизнес-задач. Наш подход основан на гибкости, данных и глубоком понимании рынка. ",
    ),
    (
        '<div class="clients-content__number"> 56 </div>\n награды в конкурсах ',
        '<div class="clients-content__number"> 3 </div>\n направлений<br>экспертизы ',
    ),
    (
        '<div class="clients-content__number">22</div>\n года опыта работы ',
        '<div class="clients-content__number">20+</div>\n успешных<br>проектов ',
    ),
    (
        '<div class="clients-content__number">800+</div>\n проектов ',
        '<div class="clients-content__number">98%</div>\n клиентов<br>рекомендуют ',
    ),
    (
        '<div class="clients-content__number">11</div>\n в рейтинге<br>«Креатив в<br>Цифровых продуктах» ',
        "",
    ),
    (
        '<div class="clients-logos__title">Наши клиенты</div>',
        '<div class="clients-logos__title">Нам доверяют</div>',
    ),
    (
        "Мы хороши в следующем",
        "3 направления для вашего роста",
    ),
    (
        '<a href="/services/website" class="specialization-services__item-link js-specialization-services-item"> Корпоративные сайты </a>',
        '<a href="/services/website" class="specialization-services__item-link js-specialization-services-item"> Бизнес-аналитика </a>',
    ),
    (
        '<a href="/services/online" class="specialization-services__item-link js-specialization-services-item"> Веб-сервисы и порталы </a>',
        '<a href="/services/online" class="specialization-services__item-link js-specialization-services-item"> ИТ и разработка </a>',
    ),
    (
        '<span class="specialization-services__item-link specialization-services__item-link--no-link js-specialization-services-item"> UI/UX-дизайн </span>',
        '<a href="/services/branding" class="specialization-services__item-link js-specialization-services-item"> Креатив и маркетинг </a>',
    ),
    (
        '<span class="specialization-services__item-link specialization-services__item-link--no-link js-specialization-services-item"> Поддержка проектов </span>',
        '<a href="/services" class="specialization-services__item-link js-specialization-services-item"> Управление и стратегия </a>',
    ),
    (
        " В топ-100 лучших<br> дизайн-студий России<br> ",
        " Собственные продукты<br> для роста эффективности<br> ",
    ),
    (
        " Рассказываем невыдуманные истории по теме разработки сайтов и продвижения в Интернет. Делимся опытом, раскрываем карты. Читайте! ",
        " Экспертные материалы по бизнес-консалтингу, аналитике, ИТ и маркетингу. Делимся опытом трансформации и масштабирования бизнеса. ",
    ),
    (
        '<div itemprop="name" class="header-link__inner js-header-link">Компания</div>',
        '<div itemprop="name" class="header-link__inner js-header-link">О нас</div>',
    ),
    (
        '<div itemprop="name" class="header-link__inner js-header-link">Награды</div>',
        '<div itemprop="name" class="header-link__inner js-header-link">Подход</div>',
    ),
    (
        'alt="Сайты"',
        'alt="Аналитика"',
    ),
    (
        'alt="Сервисы"',
        'alt="ИТ"',
    ),
    (
        'alt="Разумный креатив"',
        'alt="Методология Agile Business"',
    ),
    (
        'value="Свяжитесь с нами"',
        'value="Заявка с сайта Agile Business"',
    ),
    (
        'placeholder="Расскажите кратко о вашем проекте"',
        'placeholder="Расскажите о вашем проекте"',
    ),
    (
        '<label for="callback-footer-message"> Расскажите кратко о вашем проекте </label>',
        '<label for="callback-footer-message"> Расскажите о вашем проекте </label>',
    ),
    (
        '<label for="brief-offcanvas-message"> Расскажите кратко о вашем проекте </label>',
        '<label for="brief-offcanvas-message"> Расскажите о вашем проекте </label>',
    ),
    (
        '<div class="brief__section-title"> О проекте </div>',
        '<div class="brief__section-title"> О проекте </div>',
    ),
    (
        'value="Комплекс работ"',
        'value="Комплексный консалтинг"',
    ),
    (
        '<label class="btn form-check-label" for="brief-offcanvas-type-Kompleks-rabot"> Комплекс работ </label>',
        '<label class="btn form-check-label" for="brief-offcanvas-type-Kompleks-rabot"> Комплексный консалтинг </label>',
    ),
    (
        'value="Корп. сайт"',
        'value="Бизнес-аналитика"',
    ),
    (
        '<label class="btn form-check-label" for="brief-offcanvas-type-Korp-sajt"> Корп. сайт </label>',
        '<label class="btn form-check-label" for="brief-offcanvas-type-Korp-sajt"> Бизнес-аналитика </label>',
    ),
    (
        'value="Онлайн-сервис"',
        'value="ИТ и разработка"',
    ),
    (
        '<label class="btn form-check-label" for="brief-offcanvas-type-Onlajn-servis"> Онлайн-сервис </label>',
        '<label class="btn form-check-label" for="brief-offcanvas-type-Onlajn-servis"> ИТ и разработка </label>',
    ),
    (
        'value="Брендинг"',
        'value="Креатив"',
    ),
    (
        '<label class="btn form-check-label" for="brief-offcanvas-type-Brending"> Брендинг </label>',
        '<label class="btn form-check-label" for="brief-offcanvas-type-Brending"> Креатив </label>',
    ),
]


def apply_replacements(text: str, pairs: list[tuple[str, str]]) -> str:
    for old, new in pairs:
        text = text.replace(old, new)
    return text


def set_meta(text: str, title: str, description: str) -> str:
    text = re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", text, count=1)
    text = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{description}">',
        text,
        count=1,
    )
    text = re.sub(
        r'<meta property="og:title" content="[^"]*">',
        f'<meta property="og:title" content="{title}">',
        text,
        count=1,
    )
    text = re.sub(
        r'<meta property="og:description" content="[^"]*">',
        f'<meta property="og:description" content="{description}">',
        text,
        count=1,
    )
    text = re.sub(
        r'<meta property="og:image" content="[^"]*">',
        '<meta property="og:image" content="https://agile-business-pro.com/assets/logo.png">',
        text,
        count=1,
    )
    return text


def rebrand_works_grid(text: str) -> str:
    for old_name, new_name, category, desc in WORKS_GRID:
        text = text.replace(f">{old_name} <", f">{new_name} <")
        text = text.replace(f">{old_name}</", f">{new_name}</")
        text = text.replace(f'alt="{old_name}"', f'alt="{new_name}"')
        text = text.replace(f'title="Сайт для компании', f'title="Проект Agile Business —')
        text = text.replace(
            f'"name":"{old_name}"',
            f'"name":"{new_name}"',
        )
        text = text.replace(
            f'Проект {old_name} в нашем портфолио',
            desc,
        )
        # category in works-grid-item__type
        text = re.sub(
            rf'(works-grid-item__title">\s*{re.escape(new_name)}.*?</div>\s*<div class=" works-grid-item__type">)\s*[^<]+\s*(</div>)',
            rf"\1 {category} \2",
            text,
            count=1,
            flags=re.DOTALL,
        )
    return text


def rebrand_blog(text: str, rel_path: str) -> str:
    slug = Path(rel_path).parent.name
    if slug in BLOG_ARTICLES:
        title, category, description = BLOG_ARTICLES[slug]
        text = re.sub(
            r'<title>[^<]*</title>',
            f"<title>{title} — Agile Business</title>",
            text,
            count=1,
        )
        text = re.sub(
            r'itemprop="headline">[^<]+</',
            f'itemprop="headline">{title}</',
            text,
            count=1,
        )
        text = re.sub(
            r'posts-list__item-top" itemprop="headline">[^<]+</',
            f'posts-list__item-top" itemprop="headline">{title}</',
            text,
            count=1,
        )
        text = re.sub(
            r'<meta itemprop="description" content="[^"]*"\s*/>',
            f'<meta itemprop="description" content="{description}" />',
            text,
            count=1,
        )
        text = re.sub(
            r'posts-list__item-type">\s*[^<]+\s*</',
            f'posts-list__item-type"> {category} </',
            text,
            count=1,
        )
    if "blog/index.html" in rel_path.replace("\\", "/"):
        for slug, (title, category, description) in BLOG_ARTICLES.items():
            text = text.replace(f'itemid="https://agile-business-pro.com/blog/{slug}"', f'ITEMID_{slug}')
            # headline in blog listing
            pass
        for slug, (title, category, _desc) in BLOG_ARTICLES.items():
            text = re.sub(
                rf'(itemid="https://agile-business-pro.com/blog/{re.escape(slug)}".*?itemprop="headline">)[^<]+(</)',
                rf"\1{title}\2",
                text,
                count=1,
                flags=re.DOTALL,
            )
            text = re.sub(
                rf'(itemid="https://agile-business-pro.com/blog/{re.escape(slug)}".*?posts-list__item-type">)\s*[^<]+\s*(</)',
                rf"\1 {category} \2",
                text,
                count=1,
                flags=re.DOTALL,
            )
    return text


def process_file(path: Path) -> bool:
    rel = str(path.relative_to(PUBLIC)).replace("\\", "/")
    original = path.read_text(encoding="utf-8")
    text = original

    text = apply_replacements(text, GLOBAL_REPLACEMENTS)
    text = text.replace(CITIES_OLD, CITIES_NEW)
    text = text.replace(FOOTER_CITIES_OLD, FOOTER_CITIES_NEW)
    text = LOGO_OLD.sub(LOGO_NEW, text)

    if rel in PAGE_TITLES:
        title, desc = PAGE_TITLES[rel]
        text = set_meta(text, title, desc)

    if rel == "index.html":
        text = apply_replacements(text, INDEX_REPLACEMENTS)
        text = rebrand_works_grid(text)
        for slug, (title, category, description) in BLOG_ARTICLES.items():
            text = re.sub(
                rf'(itemid="https://agile-business-pro.com/blog/{re.escape(slug)}".*?itemprop="headline">)[^<]+(</)',
                rf"\1{title}\2",
                text,
                count=1,
                flags=re.DOTALL,
            )
            text = re.sub(
                rf'(itemid="https://agile-business-pro.com/blog/{re.escape(slug)}".*?posts-list__item-type">)\s*[^<]+\s*(</)',
                rf"\1 {category} \2",
                text,
                count=1,
                flags=re.DOTALL,
            )
            text = re.sub(
                rf'(itemid="https://agile-business-pro.com/blog/{re.escape(slug)}".*?<meta itemprop="description" content=")[^"]+(")',
                rf"\1{description}\2",
                text,
                count=1,
                flags=re.DOTALL,
            )

    if rel.startswith("blog/"):
        text = rebrand_blog(text, rel)

    if rel == "awards/index.html":
        text = text.replace("Награды", "Подход")
        text = text.replace("награды", "подход")

    if rel.startswith("works/") and rel.endswith("index.html"):
        m = WORK_PAGE_TITLE_FALLBACK.search(text) or WORK_PAGE_TITLE.search(text)
        if m:
            project = m.group(1)
            text = WORK_PAGE_TITLE_FALLBACK.sub(
                f"<title>Проект {project} — Agile Business</title>", text
            )
            text = WORK_PAGE_TITLE.sub(
                f"<title>Проект {project} — Agile Business</title>", text
            )

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    updated: list[str] = []
    for html in sorted(PUBLIC.rglob("*.html")):
        if process_file(html):
            updated.append(str(html.relative_to(PUBLIC)))
    print(f"Updated {len(updated)} HTML files:")
    for p in updated:
        print(f"  - {p}")


if __name__ == "__main__":
    main()
