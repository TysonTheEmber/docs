# 🧱 JSON / NBT Schema

Aperture paths can be imported/exported as **JSON** (and possibly NBT for tighter integration). The canonical JSON form is:

```json
{
  "name": "intro_flyover",
  "interpolation": "catmullrom",
  "constantSpeed": true,
  "follow": {
    "type": "entity|block|null",
    "selector": "@p",
    "pos": [0, 64, 0]
  },
  "keyframes": [
    {
      "pos": [x, y, z],
      "rot": {"yaw": 0.0, "pitch": 0.0, "roll": 0.0},
      "fov": 70.0,
      "time": 40,
      "ease": "none|in|out|inout",
      "bezier": {
        "handleIn":  [dx, dy, dz],
        "handleOut": [dx, dy, dz],
        "type": "AUTO|ALIGNED|FREE|VECTOR"
      }
    }
  ]
}
```

## Tags (Top Level)
- `name` *(string)* — Path ID
- `interpolation` *(enum)* — `catmullrom|bezier|linear|cosine|step`
- `constantSpeed` *(bool)* — Retimes segments for uniform motion
- `follow` *(object|null)* — Attach camera to entity/block

## `follow` object
- `type` — `entity` or `block`
- `selector` — entity selector when `type=entity`
- `pos` — block position `[x,y,z]` when `type=block`

## Keyframe
- `pos` — world coordinates `[x,y,z]`
- `rot` — `{yaw, pitch, roll}` (roll optional; default 0)
- `fov` — field of view (optional)
- `time` — ticks to next keyframe (or absolute timestamp depending on editor mode)
- `ease` — `none|in|out|inout`
- `bezier` — handles (only used for `interpolation=bezier`)

### Bézier handle types
- `AUTO` — auto smooth tangents
- `ALIGNED` — in/out share a direction; lengths vary
- `FREE` — fully independent
- `VECTOR` — straight lines keeping direction to neighbor
