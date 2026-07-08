#!/usr/bin/env bash
# Apple iPhone App Store screenshots — 6.9" (1290x2796) + 6.5" (1284x2778) — from a rendered phone set.
# Usage: screenshots-apple-iphone.sh <rendered_phone_dir> [out_dir]
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
python3 "$DIR/resize-to-store-dims.py" --in "${1:?usage: $0 <rendered_phone_dir> [out_dir]}" --out "${2:-out}" --platform apple-iphone
