# scripts/store-assets

Reusable store-screenshot tooling for any app forked from this boilerplate. **Separated per platform.**

## Three per-platform generators (input = a rendered PHONE screenshot set)

```bash
# needs Pillow:  pip install Pillow
scripts/store-assets/screenshots-apple-iphone.sh <rendered_phone_dir> out   # 6.9" 1290x2796 + 6.5" 1284x2778
scripts/store-assets/screenshots-apple-ipad.sh   <rendered_phone_dir> out   # 13" 2048x2732 (fit + pad)
scripts/store-assets/screenshots-google-play.sh  <rendered_phone_dir> out   # Play phone 1080x1920
```
Each writes one folder per store slot under `out/`.

## Why it exists
App Store Connect rejects a mismatched slot and demands **6.5" iPhone** and **13" iPad**
*separately* — a 6.9" set does not cover them. iPad is wider than a phone, so it can't be a
stretched phone shot: the tool scales-to-fit and pads on the screenshot's own sampled
background (seam invisible on a flat bg).

## Shared engine
All three wrap `resize-to-store-dims.py` (use directly for one target):
```bash
python3 scripts/store-assets/resize-to-store-dims.py --in <dir> --out out --platform apple-ipad --margin 66
python3 scripts/store-assets/resize-to-store-dims.py --in <dir> --out out --preset apple-iphone-6.5
python3 scripts/store-assets/resize-to-store-dims.py --in <dir> --out out --size 1080x2400
```
Presets: `apple-iphone-6.9` `apple-iphone-6.5` `apple-ipad-13`(`-alt`) `google-play-phone`(`-tall`)
`google-play-tablet-10`. `--bg RRGGBB` overrides the auto-sampled pad colour.

**Phone-only app?** Set `ios.supportsTablet:false` and skip the iPad generator — the 13" iPad
requirement disappears in the next build (not via a metadata upload).

Full submission-blocker checklist: vault `03-Resources/skills/app-store-assets/reference/appstore-submission-gotchas.md`.
