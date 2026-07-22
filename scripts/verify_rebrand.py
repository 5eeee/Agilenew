#!/usr/bin/env python3
import re
from pathlib import Path

PUBLIC = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"
index = (PUBLIC / "index.html").read_text(encoding="utf-8")

print("=== Homepage ===")
for pat in ["Pitcher", "pitcher.agency", "love@pitcher", "88007773541", "Agile Call", "Agile KPI", "info@agile", "617-73-73", "logo.png", "98%"]:
    print(f"  {pat}: {index.count(pat)}")

print("  Works grid titles:")
for title in re.findall(r'works-grid-item__title">\s*([^<]+)', index):
    print(f"    - {title.strip()}")

remaining = []
for html in PUBLIC.rglob("*.html"):
    text = html.read_text(encoding="utf-8")
    clean = text.replace("pitcher-sign", "").replace("icon-pitcher-sign", "")
    for pat in ["Pitcher", "pitcher.agency", "love@pitcher", "88007773541", "8 800 777"]:
        if pat in clean:
            remaining.append((str(html.relative_to(PUBLIC)), pat))

print(f"\n=== Remaining user-visible Pitcher strings ({len(remaining)}) ===")
for path, pat in sorted(set(remaining))[:20]:
    print(f"  {path}: {pat}")

css_only = sum(1 for html in PUBLIC.rglob("*.html") if "pitcher-sign" in html.read_text(encoding="utf-8"))
print(f"\npitcher-sign CSS refs in {css_only} files (internal, OK)")
