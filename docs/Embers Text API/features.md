# ✨ Features (Deep Dive)

## Anchoring & Alignment
- **`anchor(TextAnchor)`** chooses a screen origin; **`align(TextAnchor)`** aligns text box relative to that origin.
- Use `offset(x,y)` in **pixels** from the anchor to fine-tune.

## Colors & Gradients
- `color(...)` supports ARGB ints, hex strings, or `ChatFormatting` names.
- `gradient(...)` can take multiple stops (e.g., sunrise text).

## Backgrounds
- Tooltip-style: `background(true)` with `bgColor`, `bgGradient`, `borderColor`, `borderGradient`, `bgAlpha`.
- Textured: `textureBackground(...)` with UV rect, padding, size overrides, and `ResizeMode` (`STRETCH|CROP|TILE`).

## Effects
- **Typewriter** reveal via `typewriter(speed[,center])`.
- **Obfuscation reveal** with `obfuscate`, `obfuscateSpeed` (NBT).
- **Shakes**:
  - Whole text: `shake(ShakeType, amp)` or NBT `shakeWave/circle/random`.
  - Per-character: `charShake(ShakeType, amp)` or NBT `charShakeWave/circle/random`.

## Wrapping & Scaling
- `wrap(px)` wraps the message box; combine with `size` for readability.

## Fonts
- Data-driven JSON fonts like vanilla; place under `assets/emberstextapi/font/` and reference via `font:"modid:id"`.
