#!/usr/bin/env bash
# Regenerates branding/svg, branding/png and branding/favicon.ico.
# Needs python3, rsvg-convert (librsvg) and ImageMagick.
set -euo pipefail
cd "$(dirname "$0")/.."

python3 source/gen_svg.py
mkdir -p png/mark png/logo png/wordmark png/app-icon

for v in vora-mark vora-mark-night vora-mark-black vora-mark-white; do
  for s in 16 32; do rsvg-convert -w $s -h $s svg/$v-small.svg -o png/mark/$v-$s.png; done
  for s in 48 64 128 256 512 1024; do rsvg-convert -w $s -h $s svg/$v.svg -o png/mark/$v-$s.png; done
done
for v in vora-logo vora-logo-night vora-logo-black vora-logo-white; do
  for h in 64 128 256 512; do rsvg-convert -h $h svg/$v.svg -o png/logo/$v-$h.png; done
done
for v in vora-wordmark-black vora-wordmark-white; do
  for h in 64 128 256; do rsvg-convert -h $h svg/$v.svg -o png/wordmark/$v-$h.png; done
done
for v in vora-app-icon vora-app-icon-night; do
  for s in 180 192 512 1024; do rsvg-convert -w $s -h $s svg/$v.svg -o png/app-icon/$v-$s.png; done
done
magick png/mark/vora-mark-16.png png/mark/vora-mark-32.png png/mark/vora-mark-48.png favicon.ico

echo "Social cards: open source/og.html (or og.html?night) at 1200x630 and screenshot"
echo "it into social/vora-og.png / vora-og-night.png."
