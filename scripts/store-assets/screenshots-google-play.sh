#!/usr/bin/env bash
# Google Play phone screenshots — 1080x1920 — from a rendered phone set.
# For the optional 10" tablet slot: add --preset google-play-tablet-10 via resize-to-store-dims.py.
# Usage: screenshots-google-play.sh <rendered_phone_dir> [out_dir]
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
python3 "$DIR/resize-to-store-dims.py" --in "${1:?usage: $0 <rendered_phone_dir> [out_dir]}" --out "${2:-out}" --platform google-play
