import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "works"
GRAPHIC_JS = ROOT / "assets" / "graphic-library.js"


def load_data():
    text = GRAPHIC_JS.read_text(encoding="utf-8")
    return json.loads(text.split("=", 1)[1].strip().rstrip(";"))


def by_group(data, title):
    for group in data["groups"]:
        if group["title"] == title:
            return [ROOT / item["src"] for item in group["items"] if item["type"] == "image"]
    return []


def crop(path, size):
    image = Image.open(path).convert("RGB")
    return ImageOps.fit(image, size, Image.Resampling.LANCZOS, centering=(0.5, 0.45))


data = load_data()
images = []
images += [OUT / "pdf-pages" / "page-11.webp", OUT / "pdf-pages" / "page-12.webp", OUT / "pdf-pages" / "page-13.webp"]
images += by_group(data, "海报 / 漫剧海报")[:2]
images += by_group(data, "海报 / 字体设计")[:2]
images += by_group(data, "海报 / 美食餐饮海报")[:2]
images += by_group(data, "西安文旅")[:1]

canvas = Image.new("RGB", (1200, 780), "#08090c")
cells = [
    (0, 0, 390, 780),
    (410, 0, 380, 382),
    (810, 0, 390, 382),
    (410, 402, 240, 378),
    (670, 402, 250, 378),
    (940, 402, 260, 378),
]

for cell, path in zip(cells, images):
    x, y, w, h = cell
    canvas.paste(crop(path, (w - 18, h - 18)), (x + 9, y + 9))

overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)
draw.rectangle((0, 0, 1200, 780), fill=(0, 0, 0, 48))
draw.rectangle((0, 560, 1200, 780), fill=(0, 0, 0, 88))
canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)
ImageDraw.Draw(canvas).text((44, 696), "POSTER COLLECTION", fill=(244, 241, 234, 230))
canvas.convert("RGB").save(OUT / "featured-poster-mosaic.webp", "WEBP", quality=86, method=6)
