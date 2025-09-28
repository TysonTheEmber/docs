---
title: "Create a path in-game"
description: "Open the editor, add keyframes, adjust rotation and Bézier handles, preview on the timeline, then save and play the path."
image: "/assets/apertureapi.png"
---

# Create a path in-game
1. `/aperture editor open`  
2. Add keyframes where you stand. Adjust rotation (hover the rotation gizmo).  
3. Switch interpolation to **Bézier** for fine control; drag **in/out** handles.  
4. Use the scrubber to preview.  
5. Save as `intro_flyover`.

```
/camera interpolation intro_flyover bezier
/camera play intro_flyover speed:1.0 loop:false target:@p
```
