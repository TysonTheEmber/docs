# hooks.py
from __future__ import annotations
import os
import re
import unicodedata
from pathlib import PurePosixPath
from mkdocs.structure.pages import Page

# ---------- small utils ----------

_WS = re.compile(r"\s+")
_LINK = re.compile(r"\[([^\]]+)\]\([^)]+\)")
_IMG = re.compile(r"!\[([^\]]*)\]\([^)]+\)")
_INLINE_MD = re.compile(r"[*_`~]+")  # strip simple inline marks
_HTML_TAG = re.compile(r"</?[^>]+?>")
_HTML_COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)

BADGE_HINTS = (
    "shields.io", "badge", "md-button", "{.md-button", "img.shields.io",
    ":material-", ":octicons-", ":fontawesome-",
)

# Lines we treat as "structure", not real content
def _is_structural(line: str) -> bool:
    s = line.strip()
    if not s:
        return True
    # headings / setext underline / hr
    if s.startswith("#") or s in ("---", "***", "___"):
        return True
    if set(s) <= {"=", "-"} and len(s) >= 3:
        return True
    # lists / blockquotes / admonitions / callouts
    if s.startswith(("- ", "* ", "+ ", ">")) or s.startswith("!!!") or s.startswith(":::"):
        return True
    # tables
    if s.startswith("|") or s.startswith(":---"):
        return True
    # TOC markers sometimes used
    if s.lower() in ("[toc]", "{:toc}", "[[_toc_]]"):
        return True
    # buttons/badges
    if any(h in s for h in BADGE_HINTS):
        return True
    return False

def _strip_inline_md(text: str) -> str:
    # remove images first (keep alt text), then links (keep text)
    text = _IMG.sub(lambda m: m.group(1) or "", text)
    text = _LINK.sub(r"\1", text)
    text = _HTML_TAG.sub("", text)
    text = _INLINE_MD.sub("", text)
    text = _WS.sub(" ", text).strip()
    return text

def _symbol_ratio(text: str) -> float:
    if not text:
        return 1.0
    letters = sum(ch.isalnum() for ch in text)
    return 1.0 - (letters / max(1, len(text)))

def _looks_meaningful(para: str) -> bool:
    # basic heuristics to avoid nonsense
    if len(para) < 25:  # too short
        return False
    words = para.split()
    if len(words) < 5:
        return False
    if _symbol_ratio(para) > 0.35:
        return False
    # avoid paragraphs that are mostly URLs or pathy strings
    urlish = sum(1 for w in words if "://" in w or w.startswith("www.") or w.count("/") >= 2)
    if urlish / len(words) > 0.3:
        return False
    return True

def _normalize(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = _HTML_COMMENT.sub("", text)
    return text

def _extract_h1(markdown: str) -> str | None:
    # ATX: # Heading
    for line in markdown.splitlines():
        if line.startswith("# "):
            return _strip_inline_md(line[2:].strip())
        if line.strip():  # stop at first non-empty non-ATX line
            break
    # Setext: Heading\n==== or ----
    lines = markdown.splitlines()
    for i in range(len(lines) - 1):
        a = lines[i].rstrip()
        b = lines[i + 1].strip()
        if a and (set(b) <= {"="} or set(b) <= {"-"}) and len(b) >= 3:
            return _strip_inline_md(a)
    return None

def _iter_paragraphs(markdown: str):
    """
    Yield candidate paragraphs while skipping:
    - YAML front-matter
    - fenced code blocks ``` ``` and indented code
    - structural lines, badges, tables, lists, headings, admonitions
    """
    md = _normalize(markdown)

    # Strip leading front-matter if present
    if md.startswith("---"):
        end = md.find("\n---", 3)
        if end != -1:
            md = md[end + 4 :]  # after closing ---\n

    lines = md.splitlines()
    paras = []
    buf: list[str] = []
    in_fence = False
    fence_tick = ""

    def flush():
        if not buf:
            return
        block = "\n".join(buf).strip()
        buf.clear()
        if block:
            paras.append(block)

    for raw in lines:
        line = raw.rstrip("\n")

        # fenced code handling (``` or ~~~)
        if not in_fence:
            if line.strip().startswith("```") or line.strip().startswith("~~~"):
                in_fence = True
                fence_tick = line.strip()[:3]
                flush()
                continue
        else:
            if line.strip().startswith(fence_tick):
                in_fence = False
            continue  # skip lines inside fences entirely

        # indented code block (>=4 spaces)
        if len(line) - len(line.lstrip(" ")) >= 4:
            flush()
            continue

        # paragraph separation
        if not line.strip():
            flush()
            continue

        # skip structural “lines” entirely
        if _is_structural(line):
            flush()
            continue

        buf.append(line)

    flush()

    # yield cleaned paras
    for p in paras:
        clean = _strip_inline_md(p)
        if clean:
            yield clean

def _first_meaningful_paragraph(markdown: str) -> str:
    for para in _iter_paragraphs(markdown):
        if _looks_meaningful(para):
            return para
    # fallback: take the first non-empty cleaned paragraph if heuristics reject all
    for para in _iter_paragraphs(markdown):
        if para:
            return para
    return ""

def _slug_from_src(page: Page) -> str:
    # docs/foo/bar.md -> foo-bar ; docs/foo/index.md -> foo
    uri = page.file.src_uri  # "foo/bar.md"
    p = PurePosixPath(uri)
    stem = p.stem if p.stem != "index" else (p.parent.name or "index")
    slug = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    return slug or "index"

# ---------- mkdocs hook ----------

def on_page_markdown(markdown, page: Page, config, files):
    # Only set fields that aren't already explicitly provided
    meta = page.meta or {}

    # Title: prefer explicit `title`, else H1, else filename
    if not meta.get("title"):
        h1 = _extract_h1(markdown)
        fallback = page.title or page.file.name.split(".")[0].replace("-", " ").title()
        page.meta["title"] = h1 or fallback

    # Description: first meaningful paragraph, trimmed to ~160 chars
    if not meta.get("description"):
        desc = _first_meaningful_paragraph(markdown)
        if not desc:
            desc = f"{page.meta['title']} — Documentation page."
        if len(desc) > 160:
            desc = desc[:157].rstrip() + "..."
        page.meta["description"] = desc

    # Image: pick docs/assets/social/<slug>.(png|jpg|jpeg|webp) if present
    if not meta.get("image"):
        slug = _slug_from_src(page)
        docs_dir = config["docs_dir"]
        for ext in (".png", ".jpg", ".jpeg", ".webp"):
            rel = f"/assets/social/{slug}{ext}"
            if os.path.exists(os.path.join(docs_dir, rel.lstrip("/"))):
                page.meta["image"] = rel
                break

    return markdown  # never mutate content; only enrich meta
