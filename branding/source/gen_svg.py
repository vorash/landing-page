"""Generates every SVG in ../svg. Run: python3 branding/source/gen_svg.py

The wordmark is Switzer at weight 600, pre-outlined into
switzer-600-vora.json (glyph paths, advances, kerning for "vo" and "ra"),
so the SVGs render identically without the font installed.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "svg")
os.makedirs(OUT, exist_ok=True)
g = json.load(open(os.path.join(HERE, "switzer-600-vora.json")))

LIGHT = ("#2B59FF", "#9A6BFF")
NIGHT = ("#7D98FF", "#B99CFF")
INK, INK_NIGHT, BLACK, WHITE = "#0D0E12", "#ECEEF3", "#0D0E12", "#FFFFFF"

# Nav proportions: mark 26px, text 22px, gap 9px, tracking -0.05em.
SCALE = 64 / 26
FS = 22 * SCALE
K = FS / g["upm"]
# Visible gap of 20 units between the mark's right stroke edge (57.65) and the v.
GAP = 57.65 + 20 - 64 - 3.1 * (22 * SCALE / 1000)
TRACK = -50


def glyph_layout():
    x, parts = 0, []
    text = "vora"
    for i, ch in enumerate(text):
        parts.append((x, g["glyphs"][ch]["d"]))
        if i + 1 < len(text):
            x += g["glyphs"][ch]["adv"] + TRACK + g["kern"].get(ch + text[i + 1], 0)
    right = x + g["glyphs"]["a"]["bounds"][2]
    left = g["glyphs"]["v"]["bounds"][0]
    return parts, left, right


PARTS, LEFT, RIGHT = glyph_layout()


def word_group(x0, baseline, fill):
    paths = "".join(f'<path transform="translate({x:.2f} 0)" d="{d}"/>' for x, d in PARTS)
    return f'<g fill="{fill}" transform="translate({x0:.3f} {baseline:.3f}) scale({K:.5f} {-K:.5f})">{paths}</g>'


def mark_body(paint, sw=4.5, sv=6):
    return (
        f'<path d="M8.6 18.5 L32 5 L55.4 18.5 L32 32 Z" fill="{paint}" opacity="0.16"/>'
        f'<g fill="none" stroke="{paint}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round">'
        '<path d="M32 5 L55.4 18.5 V45.5 L32 59 L8.6 45.5 V18.5 Z"/>'
        f'<path d="M8.6 18.5 L32 32 L55.4 18.5" stroke-width="{sv}"/></g>'
    )


def grad(gid, a, b, x1=8, y1=8, x2=56, y2=56):
    return (
        f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" gradientUnits="userSpaceOnUse">'
        f'<stop stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>'
    )


def paint_for(colors):
    if isinstance(colors, tuple):
        return grad("vora-g", *colors), "url(#vora-g)"
    return "", colors


def svg(viewbox, body, w=None, h=None, defs=""):
    size = f' width="{w}" height="{h}"' if w else ""
    d = f"<defs>{defs}</defs>" if defs else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{size} fill="none">{d}{body}</svg>\n'


def write(name, content):
    open(os.path.join(OUT, name), "w").write(content)


# Marks: square 64 grid, same as the site.
for name, colors in [("vora-mark", LIGHT), ("vora-mark-night", NIGHT), ("vora-mark-black", BLACK), ("vora-mark-white", WHITE)]:
    defs, paint = paint_for(colors)
    write(f"{name}.svg", svg("0 0 64 64", mark_body(paint), 64, 64, defs))
    # Heavier strokes for 16-32px, where the regular weight goes soft.
    write(f"{name}-small.svg", svg("0 0 64 64", mark_body(paint, 6.5, 8), 64, 64, defs))

# Horizontal lockups, cropped to the ink.
baseline = 32 + g["xHeight"] * K / 2
x0 = 64 + GAP
vb_x, vb_y, vb_h = 6, 2, 60
vb_w = round(x0 + RIGHT * K + 0.8 - vb_x, 2)
for name, colors, text in [
    ("vora-logo", LIGHT, INK),
    ("vora-logo-night", NIGHT, INK_NIGHT),
    ("vora-logo-black", BLACK, BLACK),
    ("vora-logo-white", WHITE, WHITE),
]:
    defs, paint = paint_for(colors)
    body = mark_body(paint) + word_group(x0, baseline, text)
    write(f"{name}.svg", svg(f"{vb_x} {vb_y} {vb_w} {vb_h}", body, round(vb_w * 2, 2), vb_h * 2, defs))

# Wordmark only.
xh = g["xHeight"] * K
wx = -LEFT * K
ww = round((RIGHT - LEFT) * K, 2)
for name, fill in [("vora-wordmark-black", BLACK), ("vora-wordmark-white", WHITE)]:
    over = 15 * K
    body = word_group(wx, xh + over, fill)
    write(f"{name}.svg", svg(f"0 0 {ww} {round(xh + 2 * over, 2)}", body, round(ww * 2, 2), round((xh + 2 * over) * 2, 2)))


# App icons: 1024 rounded square, mark at 9x.
def app_icon(night):
    bg = ("#15171F", "#0A0B0F") if night else ("#FFFFFF", "#EEEEEA")
    glow_a, glow_b = ("#7D98FF", "#B99CFF") if night else ("#C5B8FF", "#9EE7FF")
    colors = NIGHT if night else LIGHT
    defs = (
        grad("bg", bg[0], bg[1], 0, 0, 0, 1024)
        + f'<radialGradient id="glow" cx="512" cy="540" r="420" gradientUnits="userSpaceOnUse">'
        f'<stop stop-color="{glow_a}" stop-opacity="{0.32 if night else 0.38}"/>'
        f'<stop offset="0.55" stop-color="{glow_b}" stop-opacity="{0.12 if night else 0.16}"/>'
        f'<stop offset="1" stop-color="{glow_b}" stop-opacity="0"/></radialGradient>'
        + grad("vora-g", *colors)
    )
    edge = "rgba(255,255,255,0.08)" if night else "rgba(13,14,18,0.06)"
    body = (
        '<rect width="1024" height="1024" rx="230" fill="url(#bg)"/>'
        '<rect width="1024" height="1024" rx="230" fill="url(#glow)"/>'
        f'<rect x="2" y="2" width="1020" height="1020" rx="228" stroke="{edge}" stroke-width="4"/>'
        f'<g transform="translate(224 224) scale(9)">{mark_body("url(#vora-g)")}</g>'
    )
    return svg("0 0 1024 1024", body, 1024, 1024, defs)


write("vora-app-icon.svg", app_icon(False))
write("vora-app-icon-night.svg", app_icon(True))
print("wrote", len(os.listdir(OUT)), "SVGs to", os.path.normpath(OUT))
