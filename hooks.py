# hooks.py
from __future__ import annotations
import os, re, pathlib
from mkdocs.structure.pages import Page

# Strip Markdown formatting → plain text
_md_inline = re.compile(r"(`[^`]+`|\*\*?|__?|~~|</?[^>]+>)")
_link_ref = re.compile(r"\[([^\]]+)\]\([^)]+\)")
_ws = re.compile(r"\s+")

def _to_plain(text: str) -> str:
    text = _link_ref.sub(r"\1", text)
    text = _md_inline.sub(lambda m: "" if m.group(0).startswith("<") else m.group(0).strip("`*_%~"), text)
    text = _ws.sub(" ", text).strip()
    return text

def _first_para(markdown: str) -> str:
    # grab first non-empty paragraph that's not a heading/list/code/admonition
    for raw in markdown.split("\n\n"):
        para = raw.strip()
        if not para:
            continue
        if para.startswith(("#", "-", "*", ">")) or para.startswith("```"):
            continue
        return _to_plain(para)
    return ""

def _slug_from_src(page: Page) -> str:
    # docs/foo/bar.md -> foo-bar
    src = page.file.src_uri  # e.g. "foo/bar.md"
    p = pathlib.PurePosixPath(src)
    stem = p.stem if p.stem != "index" else p.parent.name or "index"
    # make a simple slug
    return re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")

def on_page_markdown(markdown, page: Page, config, files):
    # Respect anything the author explicitly set
    meta = page.meta or {}
    changed = False

    # 1) Ensure title
    if "title" not in meta or not str(meta["title"]).strip():
        # Use H1 if present, else derive from file name
        h1 = None
        for line in markdown.splitlines():
            if line.startswith("# "):
                h1 = line[2:].strip()
                break
        page.meta["title"] = h1 or page.title or page.file.name.split(".")[0].replace("-", " ").title()
        changed = True

    # 2) Ensure description (110–160 chars ideal)
    if "description" not in meta or not str(meta["description"]).strip():
        desc = _first_para(markdown) or f"{page.meta['title']} — Documentation page."
        if len(desc) > 160:
            desc = desc[:157].rstrip() + "..."
        page.meta["description"] = desc
        changed = True

    # 3) Optional page-specific image if present: docs/assets/social/<slug>.png|jpg|webp
    if "image" not in meta or not str(meta["image"]).strip():
        slug = _slug_from_src(page)
        for ext in (".png", ".jpg", ".jpeg", ".webp"):
            candidate = f"/assets/social/{slug}{ext}"
            # Check file exists in docs/ so we don't emit broken links
            abs_path = os.path.join(config["docs_dir"], candidate.lstrip("/"))
            if os.path.exists(abs_path):
                page.meta["image"] = candidate
                changed = True
                break

    return markdown  # markdown stays the same; only meta is enriched
