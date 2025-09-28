`
# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project overview
- This repo is an MkDocs site using the Material theme. It hosts documentation for multiple Minecraft projects, notably “Embers Text API” and “Aperture API”.
- Primary config: mkdocs.yml
- Content lives under docs/, with per-project sections:
  - docs/Embers Text API/
  - docs/Aperture API/
- Assets used by the docs are in docs/assets/ (including the favicon referenced by mkdocs.yml).
- Site is deployed to GitHub Pages via a GitHub Actions workflow (.github/workflows/gh-pages.yml).

Commands (PowerShell on Windows)
Prerequisites
- Python 3.8+ in PATH (python --version)

Setup (recommended virtual environment)
- Create and activate venv
  - py -m venv .venv
  - .\.venv\Scripts\Activate.ps1
- Upgrade pip and install dependencies
  - python -m pip install --upgrade pip
  - pip install mkdocs mkdocs-material

Develop (live reload server)
- mkdocs serve
- Open http://127.0.0.1:8000 in your browser

Build (static site output)
- mkdocs build
- Strict mode (treat warnings as errors):
  - mkdocs build --strict

Deploy (manually from local)
- mkdocs gh-deploy --force

CI/CD
- On push to main, the workflow “Deploy MkDocs (gh-pages)” builds and deploys via mkdocs gh-deploy using Python 3.x.

High-level architecture and structure
- Site generator: MkDocs
  - Theme: material
  - Palette: light/dark schemes defined in mkdocs.yml
  - Features enabled: navigation.footer, navigation.tabs, content.code.copy
  - Markdown extensions: md_in_html, tables, attr_list, admonition, details, pymdownx (emoji, highlight, inlinehilite, snippets, superfences, tabbed), with a custom fence for mermaid diagrams
- Content organization (filesystem-driven nav)
  - Root landing page at docs/index.md links to featured projects
  - Each project has its own subfolder with an index.md and topical pages (installation, commands, API reference, tutorials, troubleshooting)
- Assets
  - docs/assets/logo.svg is used as the favicon (referenced in mkdocs.yml)
  - Additional images for pages live under docs/assets/
- Deployment
  - .github/workflows/gh-pages.yml checks out the repo, installs mkdocs and mkdocs-material, then runs mkdocs gh-deploy --force to publish to gh-pages

Notes on testing and linting
- There is no dedicated test suite in this repository. Use mkdocs build --strict to catch docs issues during builds.

Agent rules and conventions
- Use the API name “apetureapi”, not “apeture”.
- Prefer PowerShell-friendly commands in examples on Windows; adjust for other shells if needed.
