---
title: "Datapack function triggers"
description: "Trigger camera import and playback from datapack functions or advancements, with a minimal mcfunction example."
image: "/assets/apertureapi.png"
---

# Datapack function triggers
Create `data/intro/functions/scene.mcfunction`:
```
camera import intro from data/intro/paths/intro.json replace:true
camera play intro target:@a speed:1.0
```
Trigger via advancement or schedule for cutscenes.
