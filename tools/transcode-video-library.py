import json
import subprocess
import urllib.parse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FFMPEG = Path(r"C:\Program Files\Red Giant\Trapcode Suite\Tools\ffmpeg.exe")
WORKS_LIBRARY = ROOT / "assets" / "works-library.js"
GRAPHIC_LIBRARY = ROOT / "assets" / "graphic-library.js"
OUTPUT_ROOT = ROOT / "assets" / "video-library"
SOURCE_ROOT = Path(r"F:\作品集整理")


def read_assignment(path):
    text = path.read_text(encoding="utf-8")
    return json.loads(text.split("=", 1)[1].strip().rstrip(";"))


def source_from_uri(uri):
    parsed = urllib.parse.urlparse(uri)
    if parsed.scheme != "file":
        return None
    decoded = urllib.parse.unquote(parsed.path).lstrip("/")
    return Path(decoded.replace("/", "\\"))


def collect_items():
    items = []
    libraries = [read_assignment(WORKS_LIBRARY)]
    graphic = read_assignment(GRAPHIC_LIBRARY)
    if isinstance(graphic, dict):
        libraries.append([graphic])
    for library in libraries:
        for group in library:
            for subgroup in group["groups"]:
                for item in subgroup["items"]:
                    if item["type"] != "video":
                        continue
                    source = source_from_uri(item["src"])
                    if source and source.exists():
                        items.append(source)
    return sorted(set(items))


def output_for(source):
    relative = source.relative_to(SOURCE_ROOT)
    return OUTPUT_ROOT / relative.with_suffix(".mp4")


def transcode(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".partial.mp4")
    if destination.exists() and destination.stat().st_size > 0:
        return "exists"

    command = [
        str(FFMPEG),
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        str(source),
        "-vf",
        "scale=-2:720:force_original_aspect_ratio=decrease",
        "-c:v",
        "mpeg4",
        "-q:v",
        "6",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
        str(temporary),
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        temporary.unlink(missing_ok=True)
        raise RuntimeError(result.stderr[-1200:])
    temporary.replace(destination)
    return "created"


def main():
    if not FFMPEG.exists():
        raise FileNotFoundError(FFMPEG)
    sources = collect_items()
    print(f"videos={len(sources)}")
    for index, source in enumerate(sources, 1):
        destination = output_for(source)
        status = transcode(source, destination)
        print(f"[{index}/{len(sources)}] {status} {source.name} -> {destination.relative_to(ROOT)}", flush=True)


if __name__ == "__main__":
    main()
