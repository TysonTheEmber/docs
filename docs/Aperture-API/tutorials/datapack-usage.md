# Datapack function triggers

Create `data/intro/functions/scene.mcfunction`:
```
camera import intro from data/intro/paths/intro.json replace:true
camera play intro target:@a speed:1.0
```
Trigger via advancement or schedule for cutscenes.
