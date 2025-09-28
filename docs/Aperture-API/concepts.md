# 🧠 Core Concepts

## Paths
A **Path** is an ordered list of **Keyframes**. The path’s **Interpolation** (Catmull‑Rom, Bézier, Linear, Cosine, Step) determines how the camera moves between keyframes.

## Keyframes
Each keyframe stores:
- **Position** (`x y z`, world coords)
- **Rotation** (`yaw pitch`), optional **roll**
- **FOV** (optional)
- **Time** / **duration** to next keyframe (or use path‑level playback speed)
- **Ease** in/out or per‑segment easing (for Linear/Cosine/Step)
- **Handles** for Bézier (`in`, `out`) with handle types: `AUTO | ALIGNED | FREE | VECTOR`

## Playback
- **Speed**: units/sec (converted to ticks) or normalized duration
- **Loop**: repeat, or **auto‑reset** to player view at end
- **Target**: player(s) to play on
- **Follow**: lock camera to an entity/block while still pathing (optional)

## Editor & Gizmo
The in‑game editor shows path lines and Bézier handles. Selecting a keyframe reveals draggable **in/out** handles and a rotation gizmo (yaw/pitch, optional roll). A slider scrubs the timeline and updates the preview path dynamically.
