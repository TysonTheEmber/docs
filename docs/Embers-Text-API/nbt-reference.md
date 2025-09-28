# 🧱 NBT Reference (sendcustom)

Use these tags inside the `<nbt:compound>` of `/emberstextapi sendcustom`.  
Types are JSON-like for readability (the command uses Brigadier CompoundTag under the hood).

## Text Content & Styling
| Tag | Type | Description | Example |
|---|---|---|---|
| `font` | `string` (ResourceLocation) | Use a custom font resource | `{font:"modid:my_font"}` |
| `bold` / `italic` / `underlined` / `strikethrough` / `obfuscated` | `boolean` | Vanilla text styles | `{bold:true,italic:true}` |
| `color` | `string` | Named (`"red"`) or hex (`"#FFA500"`) | `{color:"#FFAA00"}` |
| `gradient` | `string[]` or `{start,end}` | Multi‑stop gradient across glyphs | `{gradient:["#FF0000","#00FF00","#0000FF"]}` |

## Background & Border
| Tag | Type | Description | Example |
|---|---|---|---|
| `background` | `boolean` | Toggle tooltip-style frame | `{background:true}` |
| `bgColor` | `string` | Solid background color (implies `background:true`) | `{bgColor:"#333333CC"}` |
| `borderColor` | `string` | Solid border color (implies `background:true`) | `{borderColor:"#FFFFFF"}` |
| `bgGradient` | `string[]` or `{start,end}` | Gradient fill for background | `{bgGradient:{start:"#FF000080",end:"#0000FF80"}}` |
| `borderGradient` | `string[]` | Gradient for border | `{borderGradient:["#FF0000","#00FF00"]}` |
| `bgAlpha` | `float 0..1` | Background opacity | `{bgAlpha:0.65}` |

## Texture Background (Sprite)
`textureBackground` supports either a single `string` (sprite id) or an **object** with advanced controls.

**String form**
```nbt
{textureBackground:"modid:textures/gui/panel.png"}
```

**Object form**
```nbt
{textureBackground:{
  texture:"modid:textures/gui/panel.png",
  u:0, v:0, width:256, height:256,      # sprite sampling rect
  textureWidth:256, textureHeight:256,   # atlas size (if needed)
  paddingX:6, paddingY:4,                # extra frame padding
  scaleX:1.0, scaleY:1.0,                # UV tiling density
  sizeX:120, sizeY:40,                   # draw size override (aka drawWidth/Height)
  mode:"STRETCH"                         # STRETCH | CROP | TILE
}}
```

## Layout & Positioning
| Tag | Type | Description | Example |
|---|---|---|---|
| `anchor` | `string enum` | Screen anchor (see `TextAnchor`) | `{anchor:"CENTER_CENTER"}` |
| `align` | `string enum` | Text alignment relative to anchor | `{align:"TOP_CENTER"}` |
| `offsetX`, `offsetY` | `int` (pixels) | Offset from anchor | `{offsetX:10,offsetY:-20}` |
| `wrap` | `int` (px) | Line wrap width | `{wrap:140}` |
| `size` | `float` | Uniform scale multiplier | `{size:1.25}` |
| `shadow` | `boolean` | Drop shadow toggle | `{shadow:true}` |

## Effects & Animation
| Tag | Type | Description | Example |
|---|---|---|---|
| `typewriter` | `float` | Characters-per-tick reveal speed | `{typewriter:2.0}` |
| `center` | `boolean` | Keep centered while typewriter animates | `{center:true}` |
| `obfuscate` | `string enum` | Reveal from `"LEFT"|"RIGHT"|"CENTER"|"RANDOM"` | `{obfuscate:"LEFT"}` |
| `obfuscateSpeed` | `float` | Reveal speed for obfuscated text | `{obfuscateSpeed:0.1}` |
| `shakeWave` / `shakeCircle` / `shakeRandom` | `float` | Whole-message shake amplitude | `{shakeWave:1.2}` |
| `charShakeWave` / `charShakeCircle` / `charShakeRandom` | `float` | Per-character shake amplitude | `{charShakeRandom:0.8}` |

!!! note "Deprecated tags"
    Legacy synonyms (e.g., `wave`, `circle`, `random`, `waveChar`, `circleChar`, `randomChar`) may still work but log a warning.

## Enums

### `TextAnchor`
```
TOP_LEFT, TOP_CENTER, TOP_RIGHT,
CENTER_LEFT, CENTER_CENTER, CENTER_RIGHT,
BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT
```

### `ShakeType` (for the Java API)
```
WAVE, CIRCLE, RANDOM
```
