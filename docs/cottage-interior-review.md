# Cottage interior review · 24 October 2026

Status: cottage/garden art walkthrough at `../outdoor-review/`. This extends the outdoor kit with an actual walkable cottage room and a limited furniture-placement trial. It does not replace the production chapter's map, houses, interiors, story, economy or saves. Original character source art, portraits and the shared sprite rig are unchanged in this pass.

## Playable scope

Walk into the cottage's front door using keys, movement buttons or tap-to-route. Arrival at the exterior threshold transfers to the indoor entrance; walking through either half of the bottom opening transfers back to the outdoor approach. Doors trigger only at completed movement, never while stationary at a spawn. Transition clears the old route/input and uses a short fade, omitted for reduced motion. Residents continue their independent outdoor routes while the player is inside, unless paused or reduced motion is selected.

The room has timber flooring, cream plaster, curtains, wall lamps, a bed, bookcase, hearth, cupboard, table, chair and rug. Furniture is separate art with measured source bounds and feet-based draw order; it is not one background image. The hearth is a static image, not an animated fire. No sleep, cooking, storage or story rewards are attached to this trial.

Arrange furniture moves the table, chair or rug on the 16-unit floor grid. Tap a square or use the scene's keyboard arrows / movement buttons, confirm Place here, or Cancel/Escape. Invalid previews show a crossed outline, text reason and disabled confirmation. Solid pieces cannot overlap other solid furniture or the player, leave the floor, block the two-tile entrance clearance or disconnect any remaining open floor. The rug is walkable and can sit under furniture. Undo keeps up to ten moves during the visit and refuses to restore furniture onto the player's feet. The bed, bookcase, hearth and cupboard are fixed in this trial.

Only committed preview furniture is stored, under `the-fading-kingdom:art-cottage:v1`. Cancel never saves. Reload starts outside with the last valid arrangement; position, NPC timing and undo history are not saved. Malformed/outdated/blocked layouts fall back to the safe starting layout. If browser storage fails, movement and placement still work for the visit and the status says saving was unavailable. The production key is not accessed.

## Art and provenance

Generated using the built-in image-generation tool, with `../view-proof/cottage-front.png` as the style reference. Project copies: `../assets/environment/cottage-furniture-v1.png` (transparent nine-piece atlas) and `../assets/environment/cottage-materials-v1.png` (floor, plaster, beams and hearth stone). Exact prompts: `cottage-interior-prompts.json`. Original generated files remain in the Codex generated-images folder. No character images were generated or edited.

Actual outputs are 1254×1254, not the requested nominal dimensions. Furniture cells are not assumed equal: `../cottage-art.js` records measured individual alpha bounds, including independent bottom-row cuts to avoid rug/window bleed. Furniture footprints use the common 16-unit ground grid and existing 32-unit character height. Floor/wall materials are assembled at runtime with independent furniture and a low front cutaway wall.

## Validation

The full local suite passes 166 tests; 38 root/inline scripts and nested review modules pass syntax checks. New tests exercise real threshold travel at 30/60/120 Hz, idle spawn stability, return routes, both halves of the indoor exit, blocked furniture destinations, all legal table/chair/rug moves against whole-room reachability, safe serialization/reload and continuous held-key timing across tile boundaries.

CI passed on Node 22 and 24 for the initial implementation (source `a4f5cc9285a69090fa4f89c5f60b2ab0a7fef8da`, run `39960926808`) and the final control refinement (`ffa5b06d68cd76d9c1faf92b37eb1688c8196329`, run `39962067770`). Website deployment `da53e8ac8df7e5d22201f5034f2812b7a97805a6` completed successfully.

Browser checks covered 1366×1100 desktop, 768×1024 tablet, 390×844 and 320×740 phones, and 844×390 landscape. No horizontal page overflow or warning/error logs were observed. Visible phone controls measured at least 48px tall. Actual UI journeys exercised tapping the exterior door to walk inside, automatic walking exit and re-entry, invalid doorway placement with disabled confirmation, invalid placement on the player's feet, valid chair movement, save/reload with that moved chair visibly retained, undo, Cancel, Escape, and tap-to-place a rug. The furniture trial was returned to its starting arrangement after those changes. Indoor controls now hide garden controls and the resident-pause action; placement mode also hides the inactive undo button.

Evidence lives outside the game package in the workspace's `outputs/cottage-interior/`. Screenshots show the original player against the assembled furniture, not just the source atlas. These are browser viewport checks, not physical touch hardware tests; DPR2 and browser-emulated reduced motion were not independently exercised. Existing reduced-motion rules remain covered by the game's tests. No production map migration or full game integration was performed.

This remains a bounded art review. Physical touch hardware, complete DPR coverage, main-game map migration and full furniture rotation/catalogue are not claimed. Main-game integration and a complete kindness/economy loop remain separate work after the visual direction is accepted.
