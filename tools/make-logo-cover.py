from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "works"
PAGES = [
    OUT / "pdf-pages" / "page-04.webp",
    OUT / "pdf-pages" / "page-06.webp",
    OUT / "pdf-pages" / "page-07.webp",
    OUT / "pdf-pages" / "page-08.webp",
    OUT / "pdf-pages" / "page-18.webp",
]


def crop(path, size):
    image = Image.open(path).convert("RGB")
    return ImageOps.fit(image, size, Image.Resampling.LANCZOS, centering=(0.5, 0.5))


canvas = Image.new("RGB", (1200, 780), "#08090c")
cells = [
    (0, 0, 590, 378),
    (610, 0, 590, 378),
    (0, 398, 386, 382),
    (406, 398, 386, 382),
    (812, 398, 388, 382),
]

for cell, path in zip(cells, PAGES):
    x, y, w, h = cell
    canvas.paste(crop(path, (w - 18, h - 18)), (x + 9, y + 9))

overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)
draw.rectangle((0, 0, 1200, 780), fill=(0, 0, 0, 52))
draw.rectangle((0, 560, 1200, 780), fill=(0, 0, 0, 92))
canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)
ImageDraw.Draw(canvas).text((44, 696), "LOGO / BRAND SYSTEM", fill=(244, 241, 234, 230))
canvas.convert("RGB").save(OUT / "featured-logo-mosaic.webp", "WEBP", quality=86, method=6)
