---
title: "2) Toast with texture background"
description: "Create a textured toast with sendcustom and learn when to use STRETCH, CROP, or TILE for clean scaling."
image: "/assets/emberstextapi.png"
---

# 2) Toast with texture background
```
/emberstextapi sendcustom @a {textureBackground:{texture:"modid:textures/gui/panel.png",mode:"STRETCH",paddingX:6,paddingY:4},wrap:160} 120 "Updates available"
```
Tips:
- Use `mode:"CROP"` to keep pixel density when resizing.
- Tiling panels? Set `mode:"TILE"` and tweak `scaleX/scaleY`.
