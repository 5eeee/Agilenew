"""Beautify minified HTML under apps/web/public for readable editing."""
from __future__ import annotations

from pathlib import Path

from bs4 import BeautifulSoup
from bs4.formatter import HTMLFormatter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public"

# Keep UTF-8 text as-is (do not turn Cyrillic into &Bcy; entities)
FORMATTER = HTMLFormatter(entity_substitution=None)


def beautify_file(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8", errors="replace")
    soup = BeautifulSoup(raw, "html.parser")
    pretty = soup.prettify(formatter=FORMATTER)
    if not pretty.endswith("\n"):
        pretty += "\n"
    if pretty == raw:
        return False
    path.write_text(pretty, encoding="utf-8")
    return True


def main() -> None:
    files = sorted(PUBLIC.rglob("*.html"))
    changed = 0
    for path in files:
        if beautify_file(path):
            changed += 1
            print(f"formatted: {path.relative_to(ROOT)}")
    print(f"Done. Formatted {changed}/{len(files)} HTML files.")


if __name__ == "__main__":
    main()
