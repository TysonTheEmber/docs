---
title: "⚙️ Installation"
description: "Install for Forge 1.20.1 (Java 17). Client/server layout, dev Gradle tasks, and quick verification using /aperture and /camera."
image: "/assets/apertureapi.png"
---

# ⚙️ Installation
## Requirements
- Minecraft **Forge 1.20.1**
- Java **17**

## Client/Server layout
The camera path **plays on clients** but can be commanded from the **server**. For multiplayer, install on **both server and clients**.

## Build & Run (dev)
```bash
./gradlew assemble
./gradlew runClient
```
To add from source, include the project as a module or publish locally and depend on it as a normal Forge mod.

## Quick verification
Launch a world and run:
```
/aperture
/camera list
```
You should see the editor or command help respond.
