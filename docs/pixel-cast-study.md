# Pixel cast study · 24 October 2026

Status: an isolated standing-pose candidate, not production character replacement. James asked us to continue towards crisper world sprites after the camera proof exposed the mismatch between the soft, large-headed existing cast and the desired pixel farming-game style.

## Artwork and source authority

The Mara and Orin dialogue portraits remain the approved canonical identity references and are unchanged. The player remains a customisable age-neutral traveller. Candidate identities retain Mara's dark tied-back hair, brown skin, mustard blouse and cream apron; Orin's deeper brown skin, beard, moss cap, rust shirt and work apron; and the player's chestnut hair, sage shirt, brown trousers and boots.

The first generated candidate used the portrait and player images as references. It repeated too much of their soft rendering and oversized head proportions and was rejected. It was not installed as a game asset. The second pass used identity descriptions without image references, requesting a coarse pixel atlas, smaller heads, longer legs and simpler faces. Its source is `../view-proof/pixel-cast-v1.png` (first usable candidate, despite being generation attempt two). Prompt: `pixel-cast-generation-prompt.txt`. Built-in image generation was used. This is new generated artwork, not a filter applied to the old character sheets.

The generator did not deliver an exact hand-authored 16×32 source grid or exact requested palette. The review renderer normalises its source bounds into **24×32 transparent display cells**, preserves aspect ratio, samples with nearest-neighbour, thresholds alpha and matches colours against one shared **48-colour candidate palette**. Thus the displayed candidate has a real logical pixel grid and limited colours; it is not honest to call the generated source itself a pixel-perfect production sprite sheet. Original generated pixels and alpha remain intact in the source PNG.

## Inspected layout

Source atlas: 1024×1536, four 256×512 cells per row. Rows: Mara, player, Orin. The requested left/right column order was reversed by generation. The actual source order is **front, right, left, back**; the renderer explicitly maps that inspected order. Alpha bounds for every cell have nonzero margins; no sprite touches the source-cell boundary. No mirrored identity or haircut substitutions are used to hide a missing profile.

All twelve display frames share the 32-unit height and foot anchor from `character-rig.js`. Candidate rendering uses its shared `pixelAnchor` and the same nominal foot offset as the existing rig; it does not borrow the old rig's .53-height head cut, which would be wrong for these new proportions. Generated standing bodies are drawn whole rather than cut into unmeasured moving regions.

## Review surface

`../view-proof/index.html` defaults to the new candidate. The existing cast stays available through **Current game cast**. Switching cast resets motion, preserving the selected direction and zoom. Candidate walking/stepping controls are disabled and a visible explanation names the missing work. The current cast retains its existing walking controls. Space on the focused canvas obeys that same disabled state; direction shortcuts remain available.

The same cottage, ground, 2×/3×/4× camera, labels and foot line make comparison meaningful. A separate four-panel contact sheet shows Mara / player / Orin together in every direction at 2×. Its visible audit table reports per-frame colour count, foot row and opaque pixel groups. These are geometry diagnostics, not a claim that silhouettes, identity or animation are artistically approved. Small diagonal pixel groups must be reviewed visually rather than silently erased.

The source and display candidate offer one fixed appearance per character. **No candidate hair, shirt, hat or skin choices are advertised.** The current game wardrobe, saved appearance IDs, portraits, NPC routines, attachments and story saves are unchanged. The candidate is not imported by the production game bootstrap.

## Required work before integration

Review the complete cast at actual size and close-up, including profiles, back hair, cap, skirt and apron silhouette. Record remaining mismatches. Author pixel-clean layers with common landmarks for body, back/front hair, shirts, outerwear, legs, boots, hats and held items. Retain shared identity and pixel density rather than deriving new clothes through whole-image recolouring.

Then create actual opposite walking contacts and passing poses in all four directions, idle/blink frames and work/tool poses. Arms must oppose legs, and carried objects must follow measured hands. Check every offered wardrobe and palette combination in the existing quality matrix and a cast comparison. No candidate walking animation is implied by a successful standing-sheet review.

Only after those checks should production save/appearance migration and NPC renderer integration be implemented and tested. The detailed dialogue portraits remain a separate approved rendering resolution. The cottage/terrain kit still needs a matching pixel-grid and layering pass; this sprite study does not finish the environment.

## Evidence

Source geometry analysis, browser screenshots, actual audit results and regression/deployment outcomes are recorded in the workspace `outputs/pixel-cast-study` directory. Do not infer visual approval from successful CI or from this generated file's existence.
