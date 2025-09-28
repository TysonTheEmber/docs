# Constant-speed timelapse

Enable `constantSpeed` on the path or set per‑segment `time` evenly. Catmull‑Rom with constant speed is ideal for long flyovers.

```
/camera interpolation long_fly catmullrom
/camera play long_fly speed:1.5 loop:true target:@a
```
