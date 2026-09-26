# Vora brand kit

The **Prism** mark is an isometric box whose top face draws the V: the sandbox
itself. The wordmark is Switzer SemiBold, outlined, so every SVG renders
identically without the font installed.

## Which file do I need?

| I need… | Use |
| --- | --- |
| The logo on a light background | `svg/vora-logo.svg` |
| The logo on a dark background | `svg/vora-logo-night.svg` |
| One-colour logo (print, embossing, overlays) | `svg/vora-logo-black.svg` · `svg/vora-logo-white.svg` |
| Just the mark (avatars, small spaces) | `svg/vora-mark.svg` · `-night` · `-black` · `-white` |
| The mark at 16–32 px | `svg/vora-mark-small.svg` (heavier strokes) and its colourways |
| Just the word | `svg/vora-wordmark-black.svg` · `-white` |
| An app / PWA / avatar icon | `svg/vora-app-icon.svg` · `svg/vora-app-icon-night.svg` |
| A raster file | `png/` (see below) |
| A favicon | `favicon.ico` (16, 32, 48) or `svg/vora-mark-small.svg` |
| A link preview / social card | `social/vora-og.png` · `social/vora-og-night.png` (1200×630) |

### PNG sizes

All PNGs have transparent backgrounds except app icons and social cards.

| Folder | Files | Sizes |
| --- | --- | --- |
| `png/mark/` | `vora-mark`, `-night`, `-black`, `-white` | 16, 32, 48, 64, 128, 256, 512, 1024 px square |
| `png/logo/` | `vora-logo`, `-night`, `-black`, `-white` | 64, 128, 256, 512 px tall |
| `png/wordmark/` | `vora-wordmark-black`, `-white` | 64, 128, 256 px tall |
| `png/app-icon/` | `vora-app-icon`, `-night` | 180 (Apple touch), 192 (Android), 512 (PWA), 1024 (stores) |

## Colour

| Role | Day | Night |
| --- | --- | --- |
| Mark gradient | `#2B59FF` → `#9A6BFF` | `#7D98FF` → `#B99CFF` |
| Wordmark / ink | `#0D0E12` | `#ECEEF3` |
| Background | `#F6F6F3` | `#0A0B0F` |
| Accent (links, buttons) | `#2B59FF` | `#7D98FF` |
| Iridescent film (glass edges only, never text) | `#9EE7FF` `#C5B8FF` `#FFC4E6` `#FFF0B3` `#B8FFE0` | same |

The gradient runs top-left to bottom-right. Use the night versions on
anything darker than mid-grey.

## Type

- **Switzer** (headings and text): [fontshare.com/fonts/switzer](https://www.fontshare.com/fonts/switzer), ITF Free Font License
- **Fragment Mono** (labels and code): [Google Fonts](https://fonts.google.com/specimen/Fragment+Mono), SIL OFL 1.1

The wordmark is Switzer 600 at −0.05em tracking.

## Usage

- **Clear space:** keep at least the height of the mark's top face (¼ of the mark's height) empty on every side.
- **Minimum size:** mark 16 px (use the `-small` files below 32 px); full logo 80 px wide.
- **Don't** recolour the gradient, stretch or rotate the mark, rearrange the lockup, add effects (shadows, outlines), or set the wordmark in another font.
- **Don't** put the day logo on dark backgrounds or the night logo on light ones — use the matching version, or the one-colour files.

## Regenerating

`source/render.sh` rebuilds `svg/`, `png/` and `favicon.ico` from
`source/gen_svg.py` (needs `python3`, `rsvg-convert`, ImageMagick). The social
cards come from `source/og.html` (`?night` for the dark card), screenshotted
at 1200×630.
