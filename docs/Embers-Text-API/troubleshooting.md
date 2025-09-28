---
title: "🛠 Troubleshooting"
description: "Resolve missing messages, texture sizing, font loading, and off‑screen text with anchor, offset, wrap, and size guidance."
image: "/assets/emberstextapi.png"
---

# 🛠 Troubleshooting
### No messages appear
- Ensure the mod is installed on **both** client and server in multiplayer.
- Try `/emberstextapi test 1` to verify base rendering.
- Check `latest.log` for missing resources or network warnings.

### Textures not visible / incorrect size
- Verify `textureBackground.texture` path and that the PNG is in your assets.
- For pixel-art look, use `mode:"CROP"`; for scalable panels use `STRETCH` with padding.

### Fonts not loading
- Font `.json` and font file must be under `assets/emberstextapi/font/`.
- Check the `font` ID you pass in NBT exactly matches the resource location.

### Text is off-screen
- Revisit `anchor`, `offsetX/offsetY`, and `wrap` width.
- Large `size` values combined with small screen res can push text off-screen.
