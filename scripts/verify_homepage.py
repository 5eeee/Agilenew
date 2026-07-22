#!/usr/bin/env python3
from pathlib import Path
import re

html = Path(__file__).resolve().parents[1] / "apps" / "web" / "public" / "index.html"
text = html.read_text(encoding="utf-8")

print("stat 11:", bool(re.search(r"clients-content__number\">\s*11\s*<", text)))
print("rating text:", "Креатив в" in text and "Цифровых продуктах" in text)
print("/products links:", text.count("/products"))
m = re.search(r"js-hero-footer-products[^>]*>(.*?)</div>", text, re.S)
print("hero footer products:", re.sub(r"\s+", " ", m.group(1)).strip() if m else "none")
print("industries:")
for m in re.finditer(r"industries__item.*?>(.*?)</a>", text, re.S):
    print(" -", re.sub(r"\s+", " ", m.group(1)).strip())
print("stats:")
for m in re.finditer(
    r"clients-content__number[^>]*>([^<]*)</div>\s*([^<]+(?:<br>[^<]+)*)", text, re.S
):
    print(" ", m.group(1).strip(), "|", re.sub(r"\s+", " ", m.group(2))[:60])
print(
    "assets:",
    "agile-global.js?v20260722c" in text,
    "agile-overrides.css?v20260722c" in text,
)
