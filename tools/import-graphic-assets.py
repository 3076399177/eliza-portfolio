import json
import re
import shutil
from pathlib import Path

from PIL import Image


SOURCE_ROOT = Path(r"F:\作品集整理\平面设计")
PROJECT_ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = PROJECT_ROOT / "assets" / "graphic-library"
OUTPUT_FILE = PROJECT_ROOT / "assets" / "graphic-library.js"
LOCAL_PDF = PROJECT_ROOT / "assets" / "works" / "作品集整理2026.3.pdf"

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm"}
PDF_EXTENSIONS = {".pdf"}


def is_meaningless(stem):
    normalized = stem.strip().lower()
    return bool(
        re.fullmatch(r"[0-9a-f]{8}-[0-9a-f-]{20,}", normalized)
        or re.fullmatch(r"\d+", normalized)
        or normalized.startswith("chatgpt image")
        or normalized.startswith("未标题")
        or normalized in {"f1", "f2", "f3", "f4"}
    )


def display_title(path, index):
    stem = path.stem
    return f"作品 {index:02d}" if is_meaningless(stem) else stem


def convert_image(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image.thumbnail((2200, 2200), Image.Resampling.LANCZOS)
        if "A" in image.getbands():
            image.save(destination, "WEBP", quality=84, method=6)
        else:
            image.convert("RGB").save(destination, "WEBP", quality=84, method=6)


def main():
    if not SOURCE_ROOT.exists():
        raise FileNotFoundError(SOURCE_ROOT)

    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    groups = {}
    counters = {}

    files = sorted(path for path in SOURCE_ROOT.rglob("*") if path.is_file())
    for source in files:
        relative = source.relative_to(SOURCE_ROOT)
        group_path = relative.parent
        group_title = " / ".join(group_path.parts) if group_path.parts else "平面设计"
        group = groups.setdefault(group_title, [])
        counters[group_title] = counters.get(group_title, 0) + 1
        item_index = counters[group_title]
        suffix = source.suffix.lower()

        if suffix in IMAGE_EXTENSIONS:
            destination = ASSET_ROOT / relative.with_suffix(".webp")
            convert_image(source, destination)
            src = destination.relative_to(PROJECT_ROOT).as_posix()
            item_type = "image"
        elif suffix in VIDEO_EXTENSIONS:
            src = "file:///" + source.as_posix().replace(" ", "%20")
            item_type = "video"
        elif suffix in PDF_EXTENSIONS:
            if source.name == "作品集整理2026.3.pdf" and LOCAL_PDF.exists():
                src = LOCAL_PDF.relative_to(PROJECT_ROOT).as_posix()
            else:
                destination = ASSET_ROOT / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
                src = destination.relative_to(PROJECT_ROOT).as_posix()
            item_type = "pdf"
        else:
            continue

        group.append(
            {
                "title": source.name if item_type == "pdf" else display_title(source, item_index),
                "type": item_type,
                "src": src,
                "sourceName": source.name,
            }
        )

    payload = {
        "title": "平面设计",
        "groups": [
            {"title": title, "items": items}
            for title, items in sorted(groups.items(), key=lambda entry: entry[0])
        ],
    }

    OUTPUT_FILE.write_text(
        "window.GRAPHIC_LIBRARY = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(json.dumps({"groups": len(payload["groups"]), "items": sum(len(g["items"]) for g in payload["groups"])}, ensure_ascii=False))


if __name__ == "__main__":
    main()
