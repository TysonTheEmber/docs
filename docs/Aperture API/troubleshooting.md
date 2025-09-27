# 🛠 Troubleshooting

**Editor not opening**  
- Ensure mod is installed on client. Try `/aperture editor toggle`.

**Path plays but camera snaps**  
- Check interpolation; switch to Catmull‑Rom or Bézier and retime keyframes.  
- Remove extremely short segments or set `constantSpeed:true`.

**Follow target drifts**  
- Prefer entity follow for moving targets; for blocks, ensure coordinates are chunk‑loaded.

**JSON import fails**  
- Validate JSON schema (see [JSON / NBT Schema](nbt-json.md)).  
- Confirm file path and permissions; use `replace:true` if overwriting.
