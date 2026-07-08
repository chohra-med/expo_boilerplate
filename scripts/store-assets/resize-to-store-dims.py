#!/usr/bin/env python3
"""
resize-to-store-dims.py — shared engine: convert a designed phone screenshot set into any
store dimension without distortion. Platform-separated: drive it with --platform
apple-iphone | apple-ipad | google-play (or the three wrapper scripts next to this file),
or target a single --preset / --size.

Companion to generate-screenshots.mjs (which renders the branded phone set); this fans a
rendered set out to the extra slots each store demands.

Two modes, auto-selected per target:
  • same aspect (phone→phone, e.g. 6.9"→6.5"): scale to fill exactly.
  • different aspect (phone→iPad/tablet): scale to FIT, then pad onto the sampled solid
    background colour → nothing stretched, seam invisible when the bg is a flat colour.

Usage (per platform — this is the separation):
  python3 resize-to-store-dims.py --in <dir> --out out --platform apple-iphone   # 6.9" + 6.5"
  python3 resize-to-store-dims.py --in <dir> --out out --platform apple-ipad --margin 66  # 13"
  python3 resize-to-store-dims.py --in <dir> --out out --platform google-play    # phone
  # or one exact target:
  python3 resize-to-store-dims.py --in <dir> --out out --preset apple-ipad-13
  python3 resize-to-store-dims.py --in <dir> --out out --size 1284x2778
Options:
  --bg RRGGBB   override the pad colour (default: auto-sampled from the corners)
  --margin PX   inner margin for the pad (letterbox cases only; default 0)

Requires Pillow (pip install Pillow).

Accepted store dimensions (portrait):
  Apple iPhone 6.9"/6.7" : 1290x2796      Apple iPhone 6.5" : 1284x2778 (or 1242x2688)
  Apple iPad 13"/12.9"   : 2048x2732 (or 2064x2752; only if supportsTablet=true)
  Google Play phone      : 1080x1920 (or 1080x2400)   Google Play tablet 10" : 1600x2560
"""
import argparse, glob, os, sys
from collections import Counter
try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow required: pip install Pillow")

PRESETS = {
    "apple-iphone-6.9": (1290, 2796),
    "apple-iphone-6.5": (1284, 2778),
    "apple-ipad-13": (2048, 2732),
    "apple-ipad-13-alt": (2064, 2752),
    "google-play-phone": (1080, 1920),
    "google-play-phone-tall": (1080, 2400),
    "google-play-tablet-10": (1600, 2560),
}
# The per-platform separation: each platform = the slots that store demands by default.
PLATFORMS = {
    "apple-iphone": ["apple-iphone-6.9", "apple-iphone-6.5"],
    "apple-ipad": ["apple-ipad-13"],
    "google-play": ["google-play-phone"],
}


def sample_bg(im):
    w, h = im.size
    corners = [im.getpixel(p) for p in ((2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3))]
    return Counter(corners).most_common(1)[0][0]


def convert(im, tw, th, bg, margin):
    sw, sh = im.size
    if abs((sw / sh) - (tw / th)) < 0.02:            # same aspect → fill, no pad
        return im.resize((tw, th), Image.LANCZOS)
    scale = min((tw - 2 * margin) / sw, (th - 2 * margin) / sh)   # fit inside margin
    nw, nh = round(sw * scale), round(sh * scale)
    fitted = im.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGB", (tw, th), bg)
    canvas.paste(fitted, ((tw - nw) // 2, (th - nh) // 2))
    return canvas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="indir", required=True)
    ap.add_argument("--out", dest="outdir", required=True)
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--platform", choices=list(PLATFORMS), help="apple-iphone | apple-ipad | google-play")
    g.add_argument("--preset", choices=list(PRESETS))
    g.add_argument("--size", help="WxH e.g. 1284x2778")
    ap.add_argument("--bg", help="override pad colour RRGGBB")
    ap.add_argument("--margin", type=int, default=0)
    a = ap.parse_args()

    if a.platform:
        targets = [(p, PRESETS[p]) for p in PLATFORMS[a.platform]]
    elif a.preset:
        targets = [(a.preset, PRESETS[a.preset])]
    else:
        w, h = (int(x) for x in a.size.lower().split("x"))
        targets = [(f"{w}x{h}", (w, h))]

    bg_override = tuple(int(a.bg[i:i + 2], 16) for i in (0, 2, 4)) if a.bg else None
    files = sorted(glob.glob(os.path.join(os.path.expanduser(a.indir), "*.png")))
    if not files:
        sys.exit(f"no PNGs in {a.indir}")

    for name, (tw, th) in targets:
        outdir = os.path.join(os.path.expanduser(a.outdir), name)
        os.makedirs(outdir, exist_ok=True)
        for f in files:
            im = Image.open(f).convert("RGB")
            bg = bg_override or sample_bg(im)
            convert(im, tw, th, bg, a.margin).save(
                os.path.join(outdir, os.path.basename(f)), "PNG")
        print(f"✓ {name} ({tw}x{th}) → {len(files)} files → {outdir}")


if __name__ == "__main__":
    main()
