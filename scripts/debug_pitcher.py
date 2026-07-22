#!/usr/bin/env python3
from pathlib import Path
PUBLIC = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"
for rel in ["about/index.html", "index.html"]:
    t = (PUBLIC / rel).read_text(encoding="utf-8")
    t2 = t.replace("pitcher-sign","").replace("icon-pitcher-sign","")
    idx = 0
    print(f"=== {rel} ===")
    while True:
        i = t2.lower().find("pitcher", idx)
        if i < 0:
            break
        print(repr(t2[max(0,i-40):i+50]))
        idx = i + 1
    for s in ["info@agile", "love@", "mailto:"]:
        if s in t:
            j = t.find(s)
            print("CONTACT:", t[j:j+60])
