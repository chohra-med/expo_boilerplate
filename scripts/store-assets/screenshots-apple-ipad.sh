#!/usr/bin/env bash
# Apple iPad App Store screenshots — 13"/12.9" (2048x2732) — from a rendered phone set.
# Scales-to-fit + pads on the sampled bg (iPad is wider than a phone; never stretch).
# Only needed if the build has ios.supportsTablet=true; a phone-only app should drop iPad.
# Usage: screenshots-apple-ipad.sh <rendered_phone_dir> [out_dir] [margin]
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
python3 "$DIR/resize-to-store-dims.py" --in "${1:?usage: $0 <rendered_phone_dir> [out_dir] [margin]}" --out "${2:-out}" --platform apple-ipad --margin "${3:-66}"
