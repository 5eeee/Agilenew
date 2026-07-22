#!/usr/bin/env python3
from pathlib import Path
PUBLIC = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"
for rel in ["works/fi/index.html", "works/samges/index.html", "works/watwell/index.html", "blog/index.html"]:
    p = PUBLIC / rel
    if not p.exists():
        continue
    t = p.read_text(encoding="utf-8").replace("pitcher-sign","").replace("icon-pitcher-sign","")
    idx = 0
    print(f"=== {rel} ===")
    while True:
        i = t.find("Pitcher", idx)
        if i < 0:
            i2 = t.find("pitcher", idx)
            if i2 < 0:
                break
            i = i2
        print(repr(t[max(0,i-50):i+60]))
        idx = i + 1
