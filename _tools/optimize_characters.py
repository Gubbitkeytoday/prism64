#!/usr/bin/env python3
"""PRISM64 — character asset pipeline.

Turns the raw AI-generated character renders (each on a flat light backdrop
with a soft contact shadow) into production web assets:

  1. estimates the backdrop level *per image* from its border ring, because the
     renders are not all the same white (one comes back at ~233, others ~253)
  2. keys out the backdrop and its soft grey contact shadow as a graded matte,
     using connected components so the whole shadow goes in one step instead of
     creeping outward one pixel at a time
  3. protects saturated / dark subject pixels so white shirts, silver hair and
     grey trousers survive the key
  4. fills interior holes, drops specks, trims to the silhouette, normalises
     height, and exports optimised WebP + PNG + a blur-up placeholder

Usage:  python3 optimize_characters.py <src_dir> <out_dir>
"""

import os
import sys

import cv2
import numpy as np
from PIL import Image

TARGET_H = 1000          # exported height in px
PAD = 16                 # transparent padding kept around the silhouette
HARD_MARGIN = 10         # how far below the backdrop level still counts as backdrop
HARD_SAT = 16            # max channel spread for the hard backdrop
SOFT_DEPTH = 70          # how far below the backdrop the shadow is allowed to reach
SOFT_SAT = 30            # max channel spread for the shadow
RAMP = 46                # width of the graded alpha ramp, in luma levels
EDGE_FEATHER = 0.9       # gaussian sigma applied to the alpha edge
MIN_BLOB_FRAC = 0.004    # subject blobs smaller than this fraction get dropped


def _components_touching(mask: np.ndarray, seed: np.ndarray) -> np.ndarray:
    """Keep whole connected components of `mask` that overlap `seed`."""
    n, labels, _, _ = cv2.connectedComponentsWithStats(
        mask.astype(np.uint8), connectivity=8
    )
    if n <= 1:
        return np.zeros_like(mask, bool)
    hit = np.unique(labels[seed & mask])
    hit = hit[hit != 0]
    if hit.size == 0:
        return np.zeros_like(mask, bool)
    return np.isin(labels, hit)


def _border_seed(shape) -> np.ndarray:
    """A 1px ring around the image, used to seed the backdrop."""
    seed = np.zeros(shape, bool)
    seed[0, :] = seed[-1, :] = True
    seed[:, 0] = seed[:, -1] = True
    return seed


def _backdrop_level(lo: np.ndarray) -> int:
    """Estimate the backdrop luma from the border ring of the image."""
    ring = np.concatenate([lo[:6, :].ravel(), lo[-6:, :].ravel(),
                           lo[:, :6].ravel(), lo[:, -6:].ravel()])
    return int(np.percentile(ring, 75))


def key_out_background(bgr: np.ndarray) -> tuple:
    """Return (alpha, diagnostics). alpha: 255 = subject, 0 = backdrop.

    Deliberately not cv2.floodFill on raw pixel deltas: floodFill compares each
    pixel to its neighbour, so the anti-aliased rim and the smooth contact
    shadow form a continuous gradient the fill walks straight into the body.
    Classifying pixels by colour *class* first and then taking border-connected
    components cannot leak into saturated or dark subject pixels.
    """
    img = bgr.astype(np.int16)
    lo = img.min(axis=2)
    spread = img.max(axis=2) - lo

    bg_lo = _backdrop_level(lo)
    seed = _border_seed(lo.shape)

    # 1) the unambiguous backdrop
    hard = (lo >= bg_lo - HARD_MARGIN) & (spread <= HARD_SAT)
    background = _components_touching(hard, seed)

    # 2) absorb the soft grey contact shadow in one connected-component pass
    soft = (lo >= bg_lo - SOFT_DEPTH) & (spread <= SOFT_SAT)
    soft_zone = _components_touching(soft, cv2.dilate(
        background.astype(np.uint8),
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))).astype(bool))

    # 3) graded matte: fully clear at the backdrop level, opaque RAMP below it
    ramp = np.clip(((bg_lo - HARD_MARGIN) - lo) * (255.0 / RAMP), 0, 255)
    alpha = np.full(lo.shape, 255.0)
    alpha[soft_zone] = ramp[soft_zone]
    alpha[background] = 0.0
    alpha = alpha.astype(np.uint8)

    # 4) fill interior holes — only backdrop reachable from outside is cleared
    solid = alpha > 24
    outside = _components_touching(~solid, seed)
    alpha[~solid & ~outside] = 255

    # 5) drop stray specks, keep every real body part
    solid = alpha > 24
    n, labels, stats, _ = cv2.connectedComponentsWithStats(
        solid.astype(np.uint8), connectivity=8
    )
    if n > 1:
        min_area = MIN_BLOB_FRAC * solid.size
        keep = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] >= min_area]
        if keep:
            alpha[~np.isin(labels, keep)] = 0

    alpha = cv2.GaussianBlur(alpha, (0, 0), EDGE_FEATHER)
    return alpha, {"bg_lo": bg_lo}


def process(src_path: str, out_dir: str, name: str) -> dict:
    bgr = cv2.imread(src_path, cv2.IMREAD_COLOR)
    if bgr is None:
        raise RuntimeError(f"cannot read {src_path}")

    alpha, diag = key_out_background(bgr)

    ys, xs = np.where(alpha > 24)
    if len(xs) == 0:                       # keying failed — keep the full frame
        y0, y1, x0, x1 = 0, bgr.shape[0], 0, bgr.shape[1]
    else:
        y0, y1 = max(0, ys.min() - PAD), min(bgr.shape[0], ys.max() + PAD)
        x0, x1 = max(0, xs.min() - PAD), min(bgr.shape[1], xs.max() + PAD)

    crop_bgr = bgr[y0:y1, x0:x1]
    crop_a = alpha[y0:y1, x0:x1]

    rgba = np.dstack([cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2RGB), crop_a])
    im = Image.fromarray(rgba, "RGBA")

    scale = TARGET_H / im.height
    im = im.resize((max(1, round(im.width * scale)), TARGET_H), Image.LANCZOS)

    os.makedirs(out_dir, exist_ok=True)
    webp = os.path.join(out_dir, f"{name}.webp")
    png = os.path.join(out_dir, f"{name}.png")
    im.save(webp, "WEBP", quality=88, method=6)
    im.save(png, "PNG", optimize=True)

    thumb = im.resize((max(1, im.width // 24), max(1, im.height // 24)), Image.LANCZOS)
    thumb.save(os.path.join(out_dir, f"{name}.thumb.webp"), "WEBP", quality=55, method=6)

    return {
        "name": name,
        "size": im.size,
        "webp_kb": round(os.path.getsize(webp) / 1024, 1),
        "bg_lo": diag["bg_lo"],
        "fill": round(float((crop_a > 24).mean()), 3),
    }


def main() -> None:
    src_dir, out_dir = sys.argv[1], sys.argv[2]
    files = sorted(f for f in os.listdir(src_dir) if f.lower().endswith(".png"))
    for f in files:
        info = process(os.path.join(src_dir, f), out_dir, os.path.splitext(f)[0])
        flag = "  <-- CHECK" if not 0.10 <= info["fill"] <= 0.85 else ""
        print(f"{info['name']:6s} {str(info['size']):12s} "
              f"webp={info['webp_kb']:7.1f}kB bg={info['bg_lo']:3d} "
              f"fill={info['fill']:.3f}{flag}")


if __name__ == "__main__":
    main()
