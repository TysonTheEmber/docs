# 📚 Java API Reference

Packages follow `net.tysontheember.apertureapi` with subpackages like `api`, `client`, `command`, `commands`, `path`, `util` (see repo README).

## Entry Points (typical)
```java
// Play a path for a player
CameraController.play(ServerPlayer player, CameraPath path, PlayOptions opts);

// Stop/reset
CameraController.stop(ServerPlayer player);
CameraController.reset(ServerPlayer player);

// Export/import
CameraIO.exportToJson(CameraPath path, Path file);
CameraPath loaded = CameraIO.importFromJson(Path file);
```

## Core Types (representative)
```java
class CameraPath {
  String name;
  Interpolation interpolation; // CATMULL_ROM, BEZIER, LINEAR, COSINE, STEP
  boolean constantSpeed;
  List<Keyframe> keyframes;
}

class Keyframe {
  Vec3 pos;
  float yaw, pitch, roll;
  Float fov;       // optional
  int time;        // ticks to next (or absolute)
  Ease ease;       // NONE, IN, OUT, IN_OUT
  BezierHandles bezier; // optional
}

class BezierHandles {
  Vec3 in, out;
  HandleType type; // AUTO, ALIGNED, FREE, VECTOR
}

enum Interpolation { CATMULL_ROM, BEZIER, LINEAR, COSINE, STEP }
enum Ease { NONE, IN, OUT, IN_OUT }
enum HandleType { AUTO, ALIGNED, FREE, VECTOR }
```
> Exact names may differ slightly pending current revision; consult your `api/` package when in doubt.
