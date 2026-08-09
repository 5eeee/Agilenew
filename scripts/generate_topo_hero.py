"""Generate dense topographic contour SVGs (noise + marching squares)."""
from __future__ import annotations

import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "apps" / "web" / "public" / "assets" / "hero"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1400, 900
COLS, ROWS = 140, 90


def fade(t: float) -> float:
    return t * t * t * (t * (t * 6 - 15) + 10)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def make_perm(seed: int) -> list[int]:
    rng = random.Random(seed)
    p = list(range(256))
    rng.shuffle(p)
    return p + p


def grad(h: int, x: float, y: float) -> float:
    g = h & 3
    if g == 0:
        return x + y
    if g == 1:
        return -x + y
    if g == 2:
        return x - y
    return -x - y


def noise2(perm: list[int], x: float, y: float) -> float:
    xi = int(math.floor(x)) & 255
    yi = int(math.floor(y)) & 255
    xf = x - math.floor(x)
    yf = y - math.floor(y)
    u = fade(xf)
    v = fade(yf)
    aa = perm[perm[xi] + yi]
    ab = perm[perm[xi] + yi + 1]
    ba = perm[perm[xi + 1] + yi]
    bb = perm[perm[xi + 1] + yi + 1]
    x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u)
    x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u)
    return lerp(x1, x2, v)


def fbm(perm: list[int], x: float, y: float, octaves: int = 5) -> float:
    amp = 1.0
    freq = 1.0
    total = 0.0
    norm = 0.0
    for _ in range(octaves):
        total += noise2(perm, x * freq, y * freq) * amp
        norm += amp
        amp *= 0.5
        freq *= 2.0
    return total / norm


def heightmap(seed: int, scale: float = 3.2) -> list[list[float]]:
    perm = make_perm(seed)
    grid: list[list[float]] = []
    for j in range(ROWS + 1):
        row: list[float] = []
        for i in range(COLS + 1):
            x = i / COLS * scale
            y = j / ROWS * scale
            v = fbm(perm, x, y)
            # warp for more organic ridges
            v += 0.35 * fbm(perm, x * 1.7 + 10, y * 1.7 - 4, 3)
            row.append(v)
        grid.append(row)
    # normalize 0..1
    flat = [v for row in grid for v in row]
    lo, hi = min(flat), max(flat)
    span = hi - lo or 1.0
    return [[(v - lo) / span for v in row] for row in grid]


def interp(x1: float, y1: float, x2: float, y2: float, v1: float, v2: float, level: float):
    if abs(v2 - v1) < 1e-9:
        return (x1 + x2) * 0.5, (y1 + y2) * 0.5
    t = (level - v1) / (v2 - v1)
    return x1 + t * (x2 - x1), y1 + t * (y2 - y1)


def marching_segments(grid: list[list[float]], level: float) -> list[tuple[tuple[float, float], tuple[float, float]]]:
    segs: list[tuple[tuple[float, float], tuple[float, float]]] = []
    cell_w = W / COLS
    cell_h = H / ROWS
    for j in range(ROWS):
        for i in range(COLS):
            x = i * cell_w
            y = j * cell_h
            v0 = grid[j][i]
            v1 = grid[j][i + 1]
            v2 = grid[j + 1][i + 1]
            v3 = grid[j + 1][i]
            idx = (
                (1 if v0 >= level else 0)
                | (2 if v1 >= level else 0)
                | (4 if v2 >= level else 0)
                | (8 if v3 >= level else 0)
            )
            if idx in (0, 15):
                continue
            a = interp(x, y, x + cell_w, y, v0, v1, level)
            b = interp(x + cell_w, y, x + cell_w, y + cell_h, v1, v2, level)
            c = interp(x, y + cell_h, x + cell_w, y + cell_h, v3, v2, level)
            d = interp(x, y, x, y + cell_h, v0, v3, level)
            table = {
                1: [(d, a)],
                2: [(a, b)],
                3: [(d, b)],
                4: [(b, c)],
                5: [(d, a), (b, c)],
                6: [(a, c)],
                7: [(d, c)],
                8: [(c, d)],
                9: [(a, c)],
                10: [(a, b), (c, d)],
                11: [(b, c)],
                12: [(b, d)],
                13: [(a, b)],
                14: [(a, d)],
            }
            segs.extend(table.get(idx, []))
    return segs


def segments_to_paths(segs: list[tuple[tuple[float, float], tuple[float, float]]], join_eps: float = 1.6) -> list[str]:
    # greedy chain join for cleaner SVG
    unused = list(segs)
    paths: list[list[tuple[float, float]]] = []

    def close(p, q):
        return abs(p[0] - q[0]) < join_eps and abs(p[1] - q[1]) < join_eps

    while unused:
        (a, b) = unused.pop()
        chain = [a, b]
        extended = True
        while extended:
            extended = False
            for k, (p, q) in enumerate(unused):
                if close(chain[-1], p):
                    chain.append(q)
                    unused.pop(k)
                    extended = True
                    break
                if close(chain[-1], q):
                    chain.append(p)
                    unused.pop(k)
                    extended = True
                    break
                if close(chain[0], q):
                    chain.insert(0, p)
                    unused.pop(k)
                    extended = True
                    break
                if close(chain[0], p):
                    chain.insert(0, q)
                    unused.pop(k)
                    extended = True
                    break
        if len(chain) >= 2:
            paths.append(chain)

    out: list[str] = []
    for chain in paths:
        d = f"M {chain[0][0]:.2f} {chain[0][1]:.2f}" + "".join(
            f" L {x:.2f} {y:.2f}" for x, y in chain[1:]
        )
        out.append(d)
    return out


def write_layer(
    filename: str,
    seed: int,
    levels: int,
    stroke: str,
    sw: float,
    scale: float,
    fill_bg: bool = False,
) -> None:
    grid = heightmap(seed, scale=scale)
    paths: list[str] = []
    for i in range(levels):
        level = (i + 0.5) / levels
        segs = marching_segments(grid, level)
        for d in segments_to_paths(segs):
            paths.append(
                f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}" '
                f'stroke-linecap="round" stroke-linejoin="round"/>'
            )

    bg = '<rect width="100%" height="100%" fill="#ffffff"/>' if fill_bg else ""
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" fill="none">
{bg}
<g class="topo-lines">
{chr(10).join(paths)}
</g>
</svg>
"""
    path = OUT / filename
    path.write_text(svg, encoding="utf-8")
    print(f"{filename}: {path.stat().st_size/1024:.1f} KB, paths={len(paths)}")


def main() -> None:
    for old in OUT.glob("topo-*.svg"):
        old.unlink()
    write_layer("topo-bg.svg", seed=11, levels=28, stroke="rgba(20,18,24,0.18)", sw=1.05, scale=2.8, fill_bg=True)
    write_layer("topo-mid.svg", seed=29, levels=18, stroke="rgba(200,30,30,0.16)", sw=1.1, scale=3.4, fill_bg=False)
    write_layer("topo-fg.svg", seed=47, levels=14, stroke="rgba(20,18,24,0.28)", sw=1.25, scale=3.9, fill_bg=False)
    print("done")


if __name__ == "__main__":
    main()
