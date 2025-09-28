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
