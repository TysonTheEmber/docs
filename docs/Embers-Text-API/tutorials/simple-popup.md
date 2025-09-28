---
title: "1) Simple popup above hotbar"
description: "Build and send a basic ImmersiveMessage above the hotbar via Java API or the /emberstextapi send command."
image: "/assets/emberstextapi.png"
---

# 1) Simple popup above hotbar
```java
ImmersiveMessage msg = ImmersiveMessage.builder(80f, "Hello world")
    .anchor(TextAnchor.CENTER_CENTER)
    .offset(0f, -24f)
    .background(true);
EmbersTextAPI.sendMessage(player, msg);
```

**Command equivalent**
```
/emberstextapi send @p 80 "Hello world"
```
