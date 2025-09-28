---
title: "🔥 Embers Text API"
description: "Lightweight Forge 1.20.1 library for polished, animated text overlays using a fluent Builder API and simple commands or NBT."
image: "/assets/emberstextapi.png"
---

# 🔥 Embers Text API
Embers Text API is a lightweight Forge **1.20.1** library for creating polished, animated text overlays (toasts, popups, hotbar banners, etc.).
It replaces Immersive Messages with a clean, Forge‑only stack and a fluent **Builder** API.

This documentation covers: Overview, Installation, **Commands**, **NBT schema**, **Builder API**, Tutorials, and Troubleshooting.

!!! tip "At a glance"
    * **Mod ID:** `emberstextapi`
    * **Primary Class:** `net.tysontheember.emberstextapi.EmbersTextAPI`
    * **Core Type:** `ImmersiveMessage` (builder pattern)
    * **Command root:** `/emberstextapi`

## ✨ Feature Highlights
- Fluent **Builder API** (anchors, alignment, scaling, gradients, background frames, texture backgrounds)
- **Effects:** typewriter, obfuscation reveal, whole-text & per-character shakes
- **Fonts:** JSON + TTF/OTF under `assets/emberstextapi/font/`
- **Networking:** `EmbersTextAPI.sendMessage(ServerPlayer, ImmersiveMessage)`
- **Commands:** `/emberstextapi test|send|sendcustom`

## When to use it
- You want immersive quest toasts, boss callouts, or tutorial banners without custom GUI code.
- You need programmatic control *or* a simple command + NBT for datapacks/ops.
