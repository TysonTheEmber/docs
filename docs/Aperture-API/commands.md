---
title: "🧭 Commands"
description: "Command reference for /aperture and /camera with usage, notes, and examples for list, play/reset, import/export, interpolation, and keyframes."
image: "/assets/apertureapi.png"
---

# 🧭 Commands
Aperture ships two roots (as described in the repo README):

- **`/aperture`** — core info & UI
- **`/camera`** — path management & playback

## `/aperture`
```
/aperture help
/aperture version
/aperture api
/aperture editor [open|close|toggle]
```
- **help** — shows usage
- **version** — prints mod & API versions
- **api** — prints minimal API surface entry points for devs
- **editor** — toggle the in‑game editor UI

## `/camera`
```
/camera list [namespace]
/camera play <path> [speed:<float>] [loop:<bool>] [autoreset:<bool>] [target:<selector>] [follow:<entity|block>]
/camera stop [target:<selector>]
/camera reset [target:<selector>]
/camera export <path> [as:<json|nbt>] [to:<file>]
/camera import <name> from <file> [replace:<bool>]
/camera interpolation <path> <catmullrom|bezier|linear|cosine|step>
/camera keyframe add [pos] [rot] [time:<ticks>] [ease:<none|in|out|inout>]
/camera keyframe set <index> [pos|rot|fov|time|ease|handleIn|handleOut]=<...>
/camera keyframe remove <index>
```
> Notes  
> - `path` refers to a stored path by name (e.g., `"intro_flyover"`).  
> - `target` accepts selectors (`@p`, `@a`, names).  
> - `follow` accepts an entity selector or a block position (`x y z`).  
> - Import/export paths resolve to a per‑world or server path folder.

### Examples
```
/camera list
/camera interpolation intro_flyover catmullrom
/camera play intro_flyover speed:1.2 loop:true autoreset:false target:@a
/camera stop target:@a
```
