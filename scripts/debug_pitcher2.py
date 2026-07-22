#!/usr/bin/env python3
from pathlib import Path
PUBLIC = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"
for rel in ["awards/index.html", "blog/index.html", "works/arban/index.html"]:
    t = (PUBLIC / rel).read_text(encoding="utf-8").replace("pitcher-sign","").replace("icon-pitcher-sign","")
    idx = 0
    print(f"=== {rel} ===")
    while True:
        i = t.find("Pitcher", idx)
        if i < 0:
            break
        print(repr(t[max(0,i-50):i+60]))
        idx = i + 1
