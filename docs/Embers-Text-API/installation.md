# ⚙️ Installation

## Requirements
- Minecraft **Forge 1.20.1**
- Java **17+**

## Client/Server
Embers Text API is a **client-side renderer** with **server-triggered** networking.
For multiplayer servers, put the mod on **both server and clients** so `/emberstextapi` messages can be sent to players.

## Steps
1. Place the JAR in the `mods/` folder (client and, if applicable, server).
2. Launch Minecraft with Forge.
3. In game, run:  
   ```
   /emberstextapi test 1
   ```
   to verify rendering + networking.

## Dev Setup (Gradle)
Add the library to your mod’s Gradle setup like any other Forge dependency (jitpack/flatDir/etc. depending on how you publish it). Then import and call:
```java
EmbersTextAPI.sendMessage(player, ImmersiveMessage.builder(80f, "Hello"));
```
