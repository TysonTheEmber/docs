---
title: "4) Using commands from datapacks/functions"
description: "Embed /emberstextapi commands in datapack functions and trigger them via schedule or advancements; example included."
image: "/assets/emberstextapi.png"
---

# 4) Using commands from datapacks/functions
You can embed commands inside `data/<namespace>/functions/*.mcfunction` files and schedule them with advancements, timers, or custom triggers.

Example function `data/example/functions/announce.mcfunction`:
```
execute as @a at @s run emberstextapi sendcustom @s {anchor:"BOTTOM_RIGHT",offsetX:-8,offsetY:-8,background:true,wrap:160} 100 "Daily reward available!"
```
