---
title: "📝 Embers Text API — Commands & NBT Reference"
description: "Full documentation for /emberstextapi commands (test, send, sendcustom) plus NBT schema for custom messages, styling, backgrounds, layout, and effects."
image: "/assets/emberstextapi.png"
---

# 📝 Embers Text API — Commands & NBT Reference

This page combines the full command reference and the NBT schema for `/emberstextapi sendcustom` into one place.

---

## 🧭 Command Reference

All commands live under the root: **`/emberstextapi`**.

### Syntax Overview

```text
/emberstextapi test <id:int>
/emberstextapi send <targets:players> <duration:int> <text:quoted_string>
/emberstextapi sendcustom <targets:players> <nbt:compound> <duration:int> <text:quoted_string>
```

**Arguments**
- `targets` — one or more players (`@p`, `@a`, `@s`, `@r`, or names)
- `id` — demo ID. The mod ships with **9** demos (`1..9`).
- `duration` — display time in **ticks** (20 ticks = 1 second unless build uses seconds).
- `text` — the message contents (quote if spaces).
- `nbt` — an **NBT Compound** (see schema below).

!!! example "Quick Start"
    ```
    /emberstextapi send @a 80 "Server reboot in 5 minutes"
    ```

### `/emberstextapi test`

Plays a built-in demo showcasing common styles/effects.

```bash
/emberstextapi test 1
/emberstextapi test 2
...
/emberstextapi test 9
```

### `/emberstextapi send`

Sends a **basic** message to target players.

```bash
/emberstextapi send <targets> <duration> <text>
```

**Example**
```bash
/emberstextapi send @p 100 "Welcome to the server!"
```

### `/emberstextapi sendcustom`

Full-control message using **NBT** to describe visuals/animation/layout.

```bash
/emberstextapi sendcustom <targets> <nbt> <duration> <text>
```

**Examples**
```bash
/emberstextapi sendcustom @a {anchor:"BOTTOM_RIGHT",offsetX:-8,offsetY:-8,wrap:140,background:true} 120 "New quest available!"
```
```bash
/emberstextapi sendcustom @p {gradient:["#FF8C00","#FF4500"],typewriter:2.0,center:true,shakeWave:1.2} 80 "Boss Approaches..."
```
```bash
/emberstextapi sendcustom @a {textureBackground:{texture:"modid:textures/gui/panel.png",mode:"STRETCH",paddingX:6,paddingY:4}} 100 "Daily Reward Unlocked!"
```

---

## 🧱 NBT Schema (for `sendcustom`)

Use these tags inside the `<nbt:compound>` of `/emberstextapi sendcustom`.  
Types are JSON-like for readability (the command uses Brigadier CompoundTag under the hood).

### Text Content & Styling

| Tag | Type | Description | Example |
|-----|------|-------------|---------|
| `font` | `string` (ResourceLocation) | Use a custom font resource | `{font:"modid:my_font"}` |
| `bold` / `italic` / `underlined` / `strikethrough` / `obfuscated` | `boolean` | Vanilla text styles | `{bold:true,italic:true}` |
| `color` | `string` | Named (`"red"`) or hex (`"#FFA500"`) | `{color:"#FFAA00"}` |
| `gradient` | `string[]` or `{start,end}` | Multi-stop gradient across glyphs | `{gradient:["#FF0000","#00FF00","#0000FF"]}` |

### Background & Border

| Tag | Type | Description | Example |
|-----|------|-------------|---------|
| `background` | `boolean` | Toggle tooltip-style frame | `{background:true}` |
| `bgColor` | `string` | Solid background color (implies `background:true`) | `{bgColor:"#333333CC"}` |
| `borderColor` | `string` | Solid border color | `{borderColor:"#FFFFFF"}` |
| `bgGradient` | `string[]` or `{start,end}` | Gradient fill for background | `{bgGradient:{start:"#FF000080",end:"#0000FF80"}}` |
| `borderGradient` | `string[]` | Gradient for border | `{borderGradient:["#FF0000","#00FF00"]}` |
| `bgAlpha` | `float 0..1` | Background opacity | `{bgAlpha:0.65}` |

### Texture Background

**String form**
```nbt
{textureBackground:"modid:textures/gui/panel.png"}
```

**Object form**
```nbt
{textureBackground:{
  texture:"modid:textures/gui/panel.png",
  u:0, v:0, width:256, height:256,
  textureWidth:256, textureHeight:256,
  paddingX:6, paddingY:4,
  scaleX:1.0, scaleY:1.0,
  sizeX:120, sizeY:40,
  mode:"STRETCH"  # STRETCH | CROP | TILE
}}
```

### Layout & Positioning

| Tag | Type | Description | Example |
|-----|------|-------------|---------|
| `anchor` | `string enum` | Screen anchor (see `TextAnchor`) | `{anchor:"CENTER_CENTER"}` |
| `align` | `string enum` | Text alignment relative to anchor | `{align:"TOP_CENTER"}` |
| `offsetX`, `offsetY` | `int` (px) | Offset from anchor | `{offsetX:10,offsetY:-20}` |
| `wrap` | `int` | Line wrap width | `{wrap:140}` |
| `size` | `float` | Uniform scale multiplier | `{size:1.25}` |
| `shadow` | `boolean` | Drop shadow toggle | `{shadow:true}` |

### Effects & Animation

| Tag | Type | Description | Example |
|-----|------|-------------|---------|
| `typewriter` | `float` | Characters-per-tick reveal speed | `{typewriter:2.0}` |
| `center` | `boolean` | Keep centered while typewriter animates | `{center:true}` |
| `obfuscate` | `string enum` | Reveal direction `"LEFT"|"RIGHT"|"CENTER"|"RANDOM"` | `{obfuscate:"LEFT"}` |
| `obfuscateSpeed` | `float` | Reveal speed | `{obfuscateSpeed:0.1}` |
| `shakeWave` / `shakeCircle` / `shakeRandom` | `float` | Whole-message shake amplitude | `{shakeWave:1.2}` |
| `charShakeWave` / `charShakeCircle` / `charShakeRandom` | `float` | Per-character shake amplitude | `{charShakeRandom:0.8}` |

### Enums

#### `TextAnchor`
```
TOP_LEFT, TOP_CENTER, TOP_RIGHT,
CENTER_LEFT, CENTER_CENTER, CENTER_RIGHT,
BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT
```

#### `ShakeType` (Java API)
```
WAVE, CIRCLE, RANDOM
```
