# 📚 Java API Reference

The core of Embers Text API is the **`ImmersiveMessage`** builder and the entry-point **`EmbersTextAPI`** network helper.

## Entry Points

### `EmbersTextAPI.sendMessage(ServerPlayer, ImmersiveMessage)`
Sends a built message to a specific player over the mod's SimpleChannel.

```java
import net.minecraft.server.level.ServerPlayer;
import net.tysontheember.emberstextapi.EmbersTextAPI;
import net.tysontheember.emberstextapi.immersivemessages.api.ImmersiveMessage;

public void onJoin(ServerPlayer player) {
    var msg = ImmersiveMessage.builder(80f, "Welcome!")
        .anchor(TextAnchor.TOP_CENTER)
        .background(true);
    EmbersTextAPI.sendMessage(player, msg);
}
```

---

## `ImmersiveMessage` Builder

### Construction
```java
ImmersiveMessage builder = ImmersiveMessage.builder(float duration, String text);
```

### Common Methods
| Method | Signature | Notes |
|---|---|---|
| `anchor` | `anchor(TextAnchor value)` | Screen anchor position |
| `align` | `align(TextAnchor value)` | Text alignment relative to anchor |
| `offset` | `offset(float x, float y)` | Pixel offset from anchor |
| `scale` | `scale(float size)` | Uniform text scale |
| `color` | `color(int argb)` / `color(String)` / `color(ChatFormatting)` | Solid color |
| `gradient` | `gradient(int... colors)` / `gradient(String... colors)` | Multi-stop gradient |
| `background` | `background(boolean enable)` | Tooltip-style frame |
| `bgColor` | `bgColor(int/string)` | Background fill (enables background) |
| `borderGradient` | `borderGradient(int start, int end)` | Gradient border |
| `textureBackground` | `textureBackground(ResourceLocation tex)` / `textureBackground(TextureSpec spec)` | Textured panel |
| `textureBackgroundScale` | `textureBackgroundScale(float x, float y)` | UV scaling (tiling density) |
| `textureBackgroundPadding` | `textureBackgroundPadding(int x, int y)` | Extra padding |
| `textureBackgroundSize` | `textureBackgroundSize(int x, int y)` | Draw size override |
| `textureBackgroundWidth/Height` | `textureBackgroundWidth(int)` / `textureBackgroundHeight(int)` | Axis-specific override |
| `textureBackgroundMode` | `textureBackgroundMode(ResizeMode mode)` | STRETCH/CROP/TILE |
| `wrap` | `wrap(int width)` | Line wrap in pixels |
| `typewriter` | `typewriter(float cps)` / `typewriter(float cps, boolean center)` | Char-by-char reveal |
| `shake` | `shake(ShakeType type, float amplitude)` | Whole-message shake |
| `charShake` | `charShake(ShakeType type, float amplitude)` | Per-character shake |
| `shadow` | `shadow(boolean on)` | Drop shadow toggle |

> Names reflect the public API as exposed by the repository; some overloads or helper setters may differ slightly between revisions.

### Enums
```java
enum TextAnchor {
    TOP_LEFT, TOP_CENTER, TOP_RIGHT,
    CENTER_LEFT, CENTER_CENTER, CENTER_RIGHT,
    BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT
}

enum ShakeType { WAVE, CIRCLE, RANDOM }

enum ResizeMode { STRETCH, CROP, TILE }
```

---

## Data-driven fonts

Place a `.json` and font file under:
```
assets/emberstextapi/font/
```
Then reference by `font:"modid:your_font"` in NBT or builder helpers.
