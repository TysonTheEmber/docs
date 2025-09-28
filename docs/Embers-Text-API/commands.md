# 🧭 Commands Reference

All commands live under the root: **`/emberstextapi`**.

## Syntax Overview

```text
/emberstextapi test <id:int>
/emberstextapi send <targets:players> <duration:int> <text:quoted_string>
/emberstextapi sendcustom <targets:players> <nbt:compound> <duration:int> <text:quoted_string>
```

### Arguments
- `targets` — one or more players (`@p`, `@a`, `@s`, `@r`, or names)
- `id` — demo ID. The mod ships with **9** demos (`1..9`).
- `duration` — how long to display, in **ticks** (20 ticks = 1 second), unless your build uses seconds; most examples assume **ticks**.
- `text` — the message contents (use quotes for spaces).
- `nbt` — an **NBT Compound** (see full schema in the [NBT Reference](nbt-reference.md)).

!!! example "Quick Start"
    ```
    /emberstextapi send @a 80 "Server reboot in 5 minutes"
    ```

## `/emberstextapi test`
Plays a built-in demo showcasing common styles/effects.

**Usage**
```
/emberstextapi test 1
/emberstextapi test 2
...
/emberstextapi test 9
```

## `/emberstextapi send`
Sends a **basic** message to target players.

**Usage**
```
/emberstextapi send <targets> <duration> <text>
```
**Example**
```
/emberstextapi send @p 100 "Welcome to the server!"
```

## `/emberstextapi sendcustom`
Full-control message using **NBT** to describe visuals/animation/layout.

**Usage**
```
/emberstextapi sendcustom <targets> <nbt> <duration> <text>
```
**Examples**
```
/emberstextapi sendcustom @a {anchor:"BOTTOM_RIGHT",offsetX:-8,offsetY:-8,wrap:140,background:true} 120 "New quest available!"
```
```
/emberstextapi sendcustom @p {gradient:["#FF8C00","#FF4500"],typewriter:2.0,center:true,shakeWave:1.2} 80 "Boss Approaches..."
```
```
/emberstextapi sendcustom @a {textureBackground:{texture:"modid:textures/gui/panel.png",mode:"STRETCH",paddingX:6,paddingY:4}} 100 "Daily Reward Unlocked!"
```
