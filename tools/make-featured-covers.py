import json
import math
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "works"
GRAPHIC_JS = ROOT / "assets" / "graphic-library.js"
PDF = ROOT / "assets" / "works" / "作品集整理2026.3.pdf"


def load_graphic_library():
    text = GRAPHIC_JS.read_text(encoding="utf-8")
    return json.loads(text.split("=", 1)[1].strip().rstrip(";"))


def items_from_groups(data, names, limit=None):
    items = []
    for group in data["groups"]:
        if group["title"] in names:
            items.extend(item for item in group["items"] if item["type"] == "image")
    if limit:
        return items[:limit]
    return items


def cover_crop(path, size):
    image = Image.open(path).convert("RGB")
    return ImageOps.fit(image, size, Image.Resampling.LANCZOS, centering=(0.5, 0.42))


def make_mosaic(items, destination, size=(1200, 780), label=None):
    canvas = Image.new("RGB", size, "#08090c")
    draw = ImageDraw.Draw(canvas)
    gap = 18
    cells = [
        (0, 0, 520, 780),
        (538, 0, 318, 376),
        (874, 0, 326, 376),
        (538, 394, 326, 386),
        (882, 394, 318, 386),
    ]
    for cell, item in zip(cells, items):
        x, y, w, h = cell
        image = cover_crop(ROOT / item["src"], (w - gap, h - gap))
        canvas.paste(image, (x + gap // 2, y + gap // 2))

    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.rectangle((0, 0, size[0], size[1]), fill=(0, 0, 0, 58))
    odraw.rectangle((0, int(size[1] * 0.68), size[0], size[1]), fill=(0, 0, 0, 96))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)
    if label:
        draw = ImageDraw.Draw(canvas)
        draw.text((44, size[1] - 82), label, fill=(244, 241, 234, 230))
    canvas.convert("RGB").save(destination, "WEBP", quality=86, method=6)


def render_pdf_pages():
    pages_dir = OUT / "pdf-pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(PDF)
    rendered = []
    for index in range(len(document)):
        page = document[index]
        bitmap = page.render(scale=0.42)
        image = bitmap.to_pil().convert("RGB")
        destination = pages_dir / f"page-{index + 1:02d}.webp"
        image.save(destination, "WEBP", quality=82, method=6)
        rendered.append(destination)
    return rendered


def make_contact_sheet(images, destination):
    thumbs = []
    for path in images:
        image = Image.open(path).convert("RGB")
        image.thumbnail((220, 300), Image.Resampling.LANCZOS)
        thumbs.append((path, image.copy()))

    cols = 5
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGB", (cols * 250, rows * 340), "#111318")
    draw = ImageDraw.Draw(sheet)
    for idx, (path, image) in enumerate(thumbs):
        x = (idx % cols) * 250 + 15
        y = (idx // cols) * 340 + 15
        sheet.paste(image, (x, y))
        draw.text((x, y + image.height + 8), path.stem.replace("page-", "P"), fill=(244, 241, 234))
    sheet.save(destination, "WEBP", quality=84, method=6)


def main():
    data = load_graphic_library()
    make_mosaic(
        items_from_groups(data, ["海报 / city pop", "电影级海报", "海报 / 漫剧海报", "海报 / 字体设计"], 8),
        OUT / "featured-poster-mosaic.webp",
        label="POSTER COLLECTION",
    )
    make_mosaic(
        items_from_groups(data, ["产品品牌海报", "海报 / 产品品牌海报"], 8),
        OUT / "featured-brand-mosaic.webp",
        label="BRAND POSTERS",
    )
    make_mosaic(
        items_from_groups(data, ["城市风格海报", "海报 / 城市风格海报", "西安文旅"], 8),
        OUT / "featured-city-mosaic.webp",
        label="CITY VISUAL",
    )
    make_mosaic(
        items_from_groups(data, ["海报 / 字体设计", "亚马逊详情页", "小红书封面海报"], 8),
        OUT / "featured-logo-mosaic.webp",
        label="LOGO / TYPE",
    )

    pages = render_pdf_pages()
    make_contact_sheet(pages, OUT / "pdf-contact-sheet.webp")
    print(json.dumps({"pdf_pages": len(pages), "covers": 4}, ensure_ascii=False))


if __name__ == "__main__":
    main()
