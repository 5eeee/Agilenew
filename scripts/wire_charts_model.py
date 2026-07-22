#!/usr/bin/env python3
from pathlib import Path

idx = Path(__file__).resolve().parents[1] / "apps/web/public/index.html"
t = idx.read_text(encoding="utf-8")
t = t.replace(
    "/assets/front/build/upload/models/head.gltfpack.glb",
    "/assets/front/build/upload/models/charts.glb",
    1,
)
t = t.replace("/models/head-poster.png", "/models/charts-poster.png")
t = t.replace("head-poster@resize", "charts-poster@resize")
idx.write_text(t, encoding="utf-8")
print("wired charts model into index.html")
print("charts.glb", "charts.glb" in t)
print("head.gltfpack left", "head.gltfpack.glb" in t)
