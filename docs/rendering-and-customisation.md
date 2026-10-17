# Sprite rendering and customisation investigation · 17 October 2026

Historical investigation for version 0.5. The layered player proof described here is now implemented in version 0.6; see layered-player-release.md for the current scope and checks.

## Findings
The first world renderer shrank roughly 220–275px-tall sprite regions into a 28px-tall intermediate game canvas, then enlarged that canvas by 2.3 or 3. This discarded details before the browser displayed them. Fractional scaling also made the pixel grid uneven. The name labels were six-pixel canvas text enlarged in the same pass.

The attempted gait fix compounded this by replacing textured arms and legs with simple coloured lines. James correctly identified both the repeated lead-foot frames and the visible quality loss. The generated repair variants did not reliably alternate side/rear limbs, so those variants were rejected.

## Rendering correction
The canvas now has a backing resolution based on its CSS dimensions and device pixel ratio. A 2× or 3× world transform retains the cosy world scale, while sprite source images and text render directly at the display resolution. There is no 28px intermediate sprite bitmap. Character drawing height is 32 world units. Name labels use a seven-unit system font rendered through the native backing scale.
Walking now uses textured head, torso, arm and boot regions from each character's atlas, with separately controlled opposing contact phases. This is a presentation prototype, not a finished production animation rig; skirts, layered sleeves and silhouettes still need purpose-built layers to eliminate overlap and preserve the complete body at every pose.

## Customisation feasibility
Yes: the Canvas2D framework can support modular characters. The present flattened PNG atlases cannot cleanly exchange a hairstyle, shirt or hat. Whole-image hue shifts would also change skin and other unintended areas. Do not offer them as a substitute for separate clothing layers.

The existing player save already stores skin, hair, shirt and hairstyle choices, and the cottage mirror edits them. Those choices currently drive the procedural player; they do not automatically apply to Mara and Orin's painted world sheets.

Recommended production contract:
- Choose the final world sprite grid and displayed size using an in-game approval scene before generating further character art.
- One shared body rig and animation timeline for walking, idle, talking, work and tool use.
- Separate back hair, body/skin, trousers or skirt, boots, shirt, apron/outerwear, front hair, hats and held tools.
- Exact common frame bounds, foot anchors, pivots and action order across every layer.
- Explicit colour masks or palette ramps per material, preserving highlights and shadows; never recolour the entire flattened character.
- Character appearance references stable asset IDs, while migration preserves the existing four appearance fields.
- Clothing unlocks can progress from rustic everyday outfits to magical outfits as already agreed.
- Every outfit must be checked in all four directions and tool poses before adding it to the wardrobe.

## Next quality gate
Review the corrected sprites at actual phone, tablet and desktop sizes. Confirm readable silhouettes, consistent pixel density, no missing limbs or seams, and a convincing alternate stride. Then prepare a small layered player proof: two hair options, two shirts and one hat, with four-direction walking and save/reload. A full wardrobe should follow only after that proof is approved.

## Deferred gathering
Chopping and mining, including axes/pickaxes obtained from characters or shops, are recorded in next-version-direction.md. No gathering tools or economy have been added by this pass.

## Validation and current limits

47 automated checks pass, including opposing limb travel, blocked stroll destinations, room visibility, stable save state and reduced-motion poses. JavaScript syntax checks pass. The production deployment completed. The live bakery was inspected at the existing 663×1052 browser size; its canvas backing and CSS size matched at DPR 1 (663×849 scene), with the 2× world scale rendered inside that backing. Mara’s work sequence was observed at frames 22 and 23. The enlarged walking preview was inspected for both contact phases of the left-facing gait after the resolution correction. This is not a complete four-direction animation approval. An attempted later preview check timed out; it is not counted as a pass.

The latest direction-specific arm overlap refinement is deployed and syntax-checked, but still needs the full visual animation review. No claim of final production animation quality is made. The player and environment remain earlier procedural art; modular character layers are a proposed next proof, not an implemented wardrobe.

Your pre-test story was backed up, restored through the game UI, and compared exactly via exported JSON. The temporary preview tab was closed and viewport override reset. Source and website runtime are synchronised.

Final artwork: outputs/world-characters/mara-world.png and orin-world.png. Generation prompts and built-in imagegen provenance: generation-prompts.md.
