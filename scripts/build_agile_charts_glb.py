#!/usr/bin/env python3
"""Build Agile charts GLB compatible with Pitcher ModelSticky (GeneralRoots + m* meshes)."""
from __future__ import annotations

import json
import math
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).resolve().parents[1] / "apps" / "web" / "public" / "assets" / "front" / "build" / "upload" / "models"
RED = [0.784, 0.118, 0.118, 1.0]  # ~#c81e1e
RED_DEEP = [0.620, 0.082, 0.082, 1.0]
RED_LIGHT = [0.878, 0.220, 0.220, 1.0]


def box_mesh(cx, cy, cz, sx, sy, sz):
    """Axis-aligned box centered at (cx,cy,cz). Returns positions, normals, indices."""
    hx, hy, hz = sx / 2, sy / 2, sz / 2
    # 6 faces * 4 verts
    faces = [
        # +z
        ([(-hx, -hy, hz), (hx, -hy, hz), (hx, hy, hz), (-hx, hy, hz)], (0, 0, 1)),
        # -z
        ([(hx, -hy, -hz), (-hx, -hy, -hz), (-hx, hy, -hz), (hx, hy, -hz)], (0, 0, -1)),
        # +x
        ([(hx, -hy, hz), (hx, -hy, -hz), (hx, hy, -hz), (hx, hy, hz)], (1, 0, 0)),
        # -x
        ([(-hx, -hy, -hz), (-hx, -hy, hz), (-hx, hy, hz), (-hx, hy, -hz)], (-1, 0, 0)),
        # +y
        ([(-hx, hy, hz), (hx, hy, hz), (hx, hy, -hz), (-hx, hy, -hz)], (0, 1, 0)),
        # -y
        ([(-hx, -hy, -hz), (hx, -hy, -hz), (hx, -hy, hz), (-hx, -hy, hz)], (0, -1, 0)),
    ]
    pos, nrm, idx = [], [], []
    for verts, normal in faces:
        base = len(pos)
        for v in verts:
            pos.append((v[0] + cx, v[1] + cy, v[2] + cz))
            nrm.append(normal)
        idx.extend([base, base + 1, base + 2, base, base + 2, base + 3])
    return np.array(pos, np.float32), np.array(nrm, np.float32), np.array(idx, np.uint32)


def wedge_mesh(cx, cy, cz, r_inner, r_outer, a0, a1, height, steps=6):
    """Pie wedge extruded in Y."""
    hy = height / 2
    pos, nrm, idx = [], [], []

    def add_tri(p0, p1, p2):
        base = len(pos)
        v0, v1, v2 = np.array(p0), np.array(p1), np.array(p2)
        n = np.cross(v1 - v0, v2 - v0)
        ln = np.linalg.norm(n) or 1.0
        n = n / ln
        for p in (p0, p1, p2):
            pos.append(p)
            nrm.append(tuple(n))
        idx.extend([base, base + 1, base + 2])

    angles = np.linspace(a0, a1, steps + 1)
    # top / bottom fan
    for y, flip in ((cy + hy, False), (cy - hy, True)):
        for i in range(steps):
            a, b = angles[i], angles[i + 1]
            p0 = (cx + r_inner * math.cos(a), y, cz + r_inner * math.sin(a))
            p1 = (cx + r_outer * math.cos(a), y, cz + r_outer * math.sin(a))
            p2 = (cx + r_outer * math.cos(b), y, cz + r_outer * math.sin(b))
            p3 = (cx + r_inner * math.cos(b), y, cz + r_inner * math.sin(b))
            if flip:
                add_tri(p0, p3, p2)
                add_tri(p0, p2, p1)
            else:
                add_tri(p0, p1, p2)
                add_tri(p0, p2, p3)
    # outer rim
    for i in range(steps):
        a, b = angles[i], angles[i + 1]
        t0 = (cx + r_outer * math.cos(a), cy + hy, cz + r_outer * math.sin(a))
        t1 = (cx + r_outer * math.cos(b), cy + hy, cz + r_outer * math.sin(b))
        b0 = (cx + r_outer * math.cos(a), cy - hy, cz + r_outer * math.sin(a))
        b1 = (cx + r_outer * math.cos(b), cy - hy, cz + r_outer * math.sin(b))
        add_tri(t0, b0, b1)
        add_tri(t0, b1, t1)
    return np.array(pos, np.float32), np.array(nrm, np.float32), np.array(idx, np.uint32)


def tet_mesh(cx, cy, cz, s):
    """Small tetrahedron shard."""
    h = s * 0.866
    verts = np.array(
        [
            (cx, cy + h * 0.6, cz),
            (cx - s * 0.5, cy - h * 0.3, cz + s * 0.3),
            (cx + s * 0.5, cy - h * 0.3, cz + s * 0.3),
            (cx, cy - h * 0.3, cz - s * 0.55),
        ],
        np.float32,
    )
    faces = [(0, 1, 2), (0, 2, 3), (0, 3, 1), (1, 3, 2)]
    pos, nrm, idx = [], [], []
    for a, b, c in faces:
        base = len(pos)
        v0, v1, v2 = verts[a], verts[b], verts[c]
        n = np.cross(v1 - v0, v2 - v0)
        ln = np.linalg.norm(n) or 1.0
        n = n / ln
        for v in (v0, v1, v2):
            pos.append(tuple(v))
            nrm.append(tuple(n))
        idx.extend([base, base + 1, base + 2])
    return np.array(pos, np.float32), np.array(nrm, np.float32), np.array(idx, np.uint32)


def build_pieces():
    pieces = []  # list of (name, pos, nrm, idx, color)

    # --- Bar chart (left) ---
    heights = [1.1, 1.8, 1.35, 2.3, 1.6, 2.05, 1.45]
    bar_w, bar_d, gap = 0.32, 0.32, 0.12
    base_x = -2.35
    for i, h in enumerate(heights):
        x = base_x + i * (bar_w + gap)
        # split each bar into stacked blocks for shatter
        layers = max(2, int(h / 0.35))
        layer_h = h / layers
        for li in range(layers):
            cy = -0.9 + layer_h * (li + 0.5)
            color = RED if (i + li) % 2 == 0 else RED_DEEP
            pos, nrm, idx = box_mesh(x, cy, 0.0, bar_w, layer_h * 0.96, bar_d)
            pieces.append((f"m{len(pieces)+1}", pos, nrm, idx, color))

    # axis base under bars
    pos, nrm, idx = box_mesh(-1.15, -1.05, 0.0, 2.7, 0.06, 0.5)
    pieces.append((f"m{len(pieces)+1}", pos, nrm, idx, RED_DEEP))

    # --- Pie / donut (right) ---
    pie_x, pie_y = 1.55, 0.15
    slices = [
        (0.0, 0.9, RED),
        (0.9, 1.7, RED_LIGHT),
        (1.7, 2.35, RED_DEEP),
        (2.35, math.tau, RED),
    ]
    for a0, a1, color in slices:
        # split each slice radially into 2 for more shatter pieces
        mid = (a0 + a1) / 2
        for aa, bb in ((a0, mid), (mid, a1)):
            pos, nrm, idx = wedge_mesh(pie_x, pie_y, 0.0, 0.35, 1.05, aa, bb, 0.28, steps=5)
            pieces.append((f"m{len(pieces)+1}", pos, nrm, idx, color))

    # --- Rising line markers (dots + connectors as thin boxes) ---
    pts = [(-2.2, -0.2), (-1.5, 0.35), (-0.7, 0.1), (0.1, 0.85), (0.85, 0.55)]
    for i, (x, y) in enumerate(pts):
        pos, nrm, idx = box_mesh(x, y + 1.35, 0.35, 0.14, 0.14, 0.14)
        pieces.append((f"m{len(pieces)+1}", pos, nrm, idx, RED_LIGHT))
        if i > 0:
            x0, y0 = pts[i - 1]
            mx, my = (x0 + x) / 2, (y0 + y) / 2 + 1.35
            dx, dy = x - x0, y - y0
            length = math.hypot(dx, dy) or 0.01
            # approximate connector as small box (no rotation for simplicity)
            pos, nrm, idx = box_mesh(mx, my, 0.35, length * 0.7, 0.05, 0.05)
            pieces.append((f"m{len(pieces)+1}", pos, nrm, idx, RED_DEEP))

    # --- Falling shards under composition ---
    rng = np.random.default_rng(42)
    for _ in range(48):
        sx = float(rng.uniform(-2.6, 2.6))
        sy = float(rng.uniform(-2.4, -1.15))
        sz = float(rng.uniform(-0.8, 0.8))
        s = float(rng.uniform(0.08, 0.22))
        color = RED if rng.random() > 0.4 else RED_DEEP
        pos, nrm, idx = tet_mesh(sx, sy, sz, s)
        pieces.append((f"m{len(pieces)+1}", pos, nrm, idx, color))

    return pieces


def pack_glb(pieces):
    # materials by unique color
    color_keys = []
    color_to_mat = {}
    for _, _, _, _, color in pieces:
        key = tuple(round(c, 5) for c in color)
        if key not in color_to_mat:
            color_to_mat[key] = len(color_keys)
            color_keys.append(color)

    materials = []
    for color in color_keys:
        materials.append(
            {
                "name": "AgileRed",
                "pbrMetallicRoughness": {
                    "baseColorFactor": list(color),
                    "metallicFactor": 0.9,
                    "roughnessFactor": 0.0,
                },
                "doubleSided": True,
            }
        )

    bin_parts = []
    buffer_views = []
    accessors = []
    meshes = []
    nodes = []

    def add_buffer(data: bytes, target=None):
        # pad to 4
        if len(data) % 4:
            data = data + b"\x00" * (4 - len(data) % 4)
        bv = {"buffer": 0, "byteOffset": sum(len(p) for p in bin_parts), "byteLength": len(data)}
        if target is not None:
            bv["target"] = target
        buffer_views.append(bv)
        bin_parts.append(data)
        return len(buffer_views) - 1

    mesh_node_indices = []

    for name, pos, nrm, idx, color in pieces:
        mat = color_to_mat[tuple(round(c, 5) for c in color)]
        # position accessor
        pos_bytes = pos.tobytes()
        pos_view = add_buffer(pos_bytes, 34962)
        pos_min = pos.min(axis=0).tolist()
        pos_max = pos.max(axis=0).tolist()
        pos_acc = len(accessors)
        accessors.append(
            {
                "bufferView": pos_view,
                "componentType": 5126,
                "count": len(pos),
                "type": "VEC3",
                "max": pos_max,
                "min": pos_min,
            }
        )
        nrm_view = add_buffer(nrm.tobytes(), 34962)
        nrm_acc = len(accessors)
        accessors.append(
            {
                "bufferView": nrm_view,
                "componentType": 5126,
                "count": len(nrm),
                "type": "VEC3",
            }
        )
        idx_bytes = idx.astype(np.uint32).tobytes()
        idx_view = add_buffer(idx_bytes, 34963)
        idx_acc = len(accessors)
        accessors.append(
            {
                "bufferView": idx_view,
                "componentType": 5125,
                "count": len(idx),
                "type": "SCALAR",
            }
        )
        mesh_index = len(meshes)
        meshes.append(
            {
                "primitives": [
                    {
                        "attributes": {"POSITION": pos_acc, "NORMAL": nrm_acc},
                        "indices": idx_acc,
                        "material": mat,
                        "mode": 4,
                    }
                ]
            }
        )
        node_index = len(nodes)
        nodes.append({"name": name, "mesh": mesh_index})
        mesh_node_indices.append(node_index)

    # Camera hierarchy (match Pitcher / Blender orientation)
    cam_leaf = len(nodes)
    nodes.append(
        {
            "name": "Camera_Orientation_Orientation_Orientation",
            "camera": 0,
            "rotation": [-0.707106769, 0, 0, 0.707106769],
        }
    )
    cam_mid2 = len(nodes)
    nodes.append({"name": "Camera_Orientation_Orientation", "children": [cam_leaf]})
    cam_mid1 = len(nodes)
    nodes.append({"name": "Camera_Orientation", "children": [cam_mid2]})
    cam_root = len(nodes)
    nodes.append(
        {
            "name": "Camera",
            "translation": [0.0, 0.2, 8.0],
            "rotation": [0.707106829, 0, 0, 0.707106709],
            "children": [cam_mid1],
        }
    )

    # Lights (KHR_lights_punctual)
    lights = [
        {"type": "directional", "intensity": 2.2, "color": [1, 1, 1]},
        {"type": "directional", "intensity": 1.1, "color": [1, 0.85, 0.85]},
        {"type": "directional", "intensity": 0.8, "color": [1, 0.7, 0.7]},
    ]
    light_roots = []
    light_defs = [
        ("TriLamp-Key.001", [-1.5, 5.0, 4.0], 0),
        ("TriLamp-Fill.001", [4.0, 5.0, 4.0], 1),
        ("TriLamp-Back.001", [-2.2, 5.0, -3.2], 2),
    ]
    for name, translation, light_i in light_defs:
        leaf = len(nodes)
        nodes.append(
            {
                "name": f"{name}_Orientation_Orientation_Orientation",
                "extensions": {"KHR_lights_punctual": {"light": light_i}},
                "rotation": [-0.707106769, 0, 0, 0.707106769],
            }
        )
        mid2 = len(nodes)
        nodes.append({"name": f"{name}_Orientation_Orientation", "children": [leaf]})
        mid1 = len(nodes)
        nodes.append({"name": f"{name}_Orientation", "children": [mid2]})
        root = len(nodes)
        nodes.append({"name": name, "translation": list(translation), "children": [mid1]})
        light_roots.append(root)

    general_roots = len(nodes)
    nodes.append({"name": "GeneralRoots", "children": mesh_node_indices})

    blob = b"".join(bin_parts)
    if len(blob) % 4:
        blob += b"\x00" * (4 - len(blob) % 4)

    gltf = {
        "asset": {"version": "2.0", "generator": "agile-charts-builder"},
        "extensionsUsed": ["KHR_lights_punctual"],
        "extensions": {"KHR_lights_punctual": {"lights": lights}},
        "scene": 0,
        "scenes": [
            {
                "name": "Scene",
                "nodes": [cam_root, *light_roots, general_roots],
            }
        ],
        "nodes": nodes,
        "cameras": [
            {
                "type": "perspective",
                "perspective": {
                    "yfov": 0.44262889,
                    "znear": 0.1,
                    "zfar": 100,
                    "aspectRatio": 1.77777779,
                },
            }
        ],
        "materials": materials,
        "meshes": meshes,
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [{"byteLength": len(blob)}],
    }

    json_bytes = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
    if len(json_bytes) % 4:
        json_bytes += b" " * (4 - len(json_bytes) % 4)

    total = 12 + 8 + len(json_bytes) + 8 + len(blob)
    out = bytearray()
    out += struct.pack("<4sII", b"glTF", 2, total)
    out += struct.pack("<I4s", len(json_bytes), b"JSON")
    out += json_bytes
    out += struct.pack("<I4s", len(blob), b"BIN\x00")
    out += blob
    return bytes(out)


def make_poster(path: Path):
    w, h = 1920, 1080
    img = Image.new("RGB", (w, h), (247, 243, 238))
    draw = ImageDraw.Draw(img)
    # soft glow
    for r in range(420, 0, -20):
        a = int(18 * (1 - r / 420))
        color = (200, 30 + a, 30 + a)
        draw.ellipse([w // 2 - r, h // 2 - r - 40, w // 2 + r, h // 2 + r - 40], outline=color)

    # bars
    heights = [110, 180, 135, 230, 160, 205, 145]
    bx0, by0 = 420, 720
    for i, hh in enumerate(heights):
        x = bx0 + i * 70
        draw.rectangle([x, by0 - hh, x + 48, by0], fill=(200, 30, 30) if i % 2 == 0 else (158, 21, 21))
    draw.rectangle([bx0 - 10, by0, bx0 + 500, by0 + 8], fill=(122, 18, 18))

    # pie
    cx, cy, R = 1280, 520, 160
    slices = [(0, 80, (200, 30, 30)), (80, 150, (224, 56, 56)), (150, 220, (158, 21, 21)), (220, 360, (200, 30, 30))]
    for a0, a1, color in slices:
        draw.pieslice([cx - R, cy - R, cx + R, cy + R], a0 - 90, a1 - 90, fill=color)
    draw.ellipse([cx - 55, cy - 55, cx + 55, cy + 55], fill=(247, 243, 238))

    # shards
    rng = np.random.default_rng(7)
    for _ in range(40):
        x = int(rng.integers(350, 1550))
        y = int(rng.integers(760, 980))
        s = int(rng.integers(8, 22))
        color = (200, 30, 30) if rng.random() > 0.4 else (122, 18, 18)
        draw.polygon([(x, y - s), (x - s, y + s // 2), (x + s, y + s // 2)], fill=color)

    img.save(path, "PNG")
    # thumbs
    thumbs = path.parent / "thumbs"
    thumbs.mkdir(exist_ok=True)
    for name, size in [
        ("charts-poster@resize-992x-lg.png", (992, 558)),
        ("charts-poster@resize-1400x-xxl.png", (1400, 788)),
    ]:
        img.resize(size, Image.Resampling.LANCZOS).save(thumbs / name, "PNG")
    try:
        img.save(thumbs / "charts-poster@resize-x-webp.webp", "WEBP", quality=82)
        img.resize((992, 558), Image.Resampling.LANCZOS).save(
            thumbs / "charts-poster@resize-992x-lg.webp", "WEBP", quality=82
        )
        img.resize((1400, 788), Image.Resampling.LANCZOS).save(
            thumbs / "charts-poster@resize-1400x-xxl.webp", "WEBP", quality=82
        )
    except Exception:
        pass


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pieces = build_pieces()
    print(f"pieces: {len(pieces)}")
    glb = pack_glb(pieces)
    out_glb = OUT_DIR / "charts.glb"
    out_glb.write_bytes(glb)
    print(f"wrote {out_glb} ({len(glb)} bytes)")
    poster = OUT_DIR / "charts-poster.png"
    make_poster(poster)
    print(f"wrote {poster}")


if __name__ == "__main__":
    main()
