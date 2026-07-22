#!/usr/bin/env python3
"""Fix homepage works grid titles and stats."""
import re
from pathlib import Path

PUBLIC = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"
INDEX = PUBLIC / "index.html"

WORKS = [
    ("НТО", "Agile Call", "ИТ"),
    ("ЖК Дом Кино", "Agile KPI", "ИТ"),
    ("Rouge Bunny Rouge", "Корпоративный сайт", "Креатив"),
    ("Небо над Енисеем", "Лендинг", "Креатив"),
    ("DataРу", "BI-аналитика", "Аналитика"),
    ("DEPO", "Стратегический консалтинг", "Аналитика"),
    ("Full View", "Веб-сервис", "ИТ"),
    ("НПЦ Магнитной гидродинамики", "CRM-интеграция", "ИТ"),
    ("Виколор", "Маркетинговая кампания", "Креатив"),
]

text = INDEX.read_text(encoding="utf-8")

for old, new, cat in WORKS:
    text = text.replace(f'works-grid-item__title"> {old} ', f'works-grid-item__title"> {new} ')
    text = text.replace(f'works-grid-item__title">{old} ', f'works-grid-item__title">{new} ')
    text = text.replace(f'works-grid-item__title"> {old}</', f'works-grid-item__title"> {new}</')
    text = text.replace(f'"name":"{old}"', f'"name":"{new}"')
    text = text.replace(f'alt="{old}"', f'alt="{new}"')
    # category after this work item's title block
    text = re.sub(
        rf'(works-grid-item__title">\s*{re.escape(new)}.*?</div>\s*<div class=" works-grid-item__type">)\s*[^<]+\s*(</div>)',
        rf"\1 {cat} \2",
        text,
        count=1,
        flags=re.DOTALL,
    )

# Stats block — flexible whitespace
text = re.sub(
    r'(<div class="clients-content__number">\s*)56(\s*</div>\s*)награды[^<]*',
    r'\g<1>3\g<2>направлений<br>экспертизы',
    text,
    count=1,
)
text = re.sub(
    r'(<div class="clients-content__number">)\s*22(\s*</div>\s*)года опыта работы',
    r'\g<1>20+\g<2>успешных<br>проектов',
    text,
    count=1,
)
text = re.sub(
    r'(<div class="clients-content__number">)\s*800\+(\s*</div>\s*)проектов',
    r'\g<1>98%\g<2>клиентов<br>рекомендуют',
    text,
    count=1,
)
text = re.sub(
    r'(<div class="clients-content__number">)\s*11(\s*</div>\s*)в.reйтинге.*?Цифровых продуктах»',
    r'\g<1>24\g<2>часа — первая<br>реакция на заявку',
    text,
    count=1,
    flags=re.DOTALL,
)

# Footer contacts on homepage if missed
text = text.replace("love@pitcher.agency", "info@agile-business-pro.com")
text = text.replace("88007773541", "+79636177373")
text = text.replace("8 800 777-35-41", "+7 (963) 617-73-73")

INDEX.write_text(text, encoding="utf-8")
print("Fixed index.html works grid and stats")
