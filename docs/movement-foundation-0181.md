# Movement foundation pass — 0.18.1

Priority 1 remains ACTIVE in development-roadmap.md. This is an incremental repair to the existing rig, not a finished authored animation sheet.

## Runtime change
The gait now moves continuously through the two passing poses and slows at the opposite foot contacts. Previously each quarter-cycle eased to a stop at its boundary, including the passing poses. Player and NPC opposing arms/legs retain the shared four-phase contract.

The visible sleeve and basket/tool grip now use one joint calculation. Player side-view sleeve bounds are exported once, with NPC-specific bounds retained. Material bundles begin at the grip rather than using the handled-basket offset. No character image, portrait, palette mapping, wardrobe mask, save schema or NPC schedule changed.

## Verification completed
- 213 automated tests passed locally. Added continuous-passing timing and actual canvas-transform/sleeve-endpoint checks over all four directions, walking phases and tool progress. Existing migration, wardrobe, pause and reduced-motion tests remain passing.
- Syntax validation passed for 55 runtime/inline scripts and two import maps. Import maps are validated as JSON rather than executed as JavaScript.
- Isolated browser review used the real assembled player and Mara/Orin/Rowan in four directions at close-up and gameplay size, including basket poses and opposite walking contacts/passing poses.
- All 16 visible hairstyle/outfit/hat combinations were inspected in all four directions with four walking poses. No new clipping was observed in that review.
- Axe and pickaxe grips were spot-checked in the cast review. Bundles were spot-checked across wardrobe rows.

## Remaining quality gate
Palette/action/attachment combinations have not all received a complete visual sign-off. The sprite-audit pages expose those matrices for continued inspection; the existence of a matrix does not mean every row has passed. Physical phone/tablet checks and sustained real-time movement review remain outstanding for this pass. The existing cutout rig still has limited anatomical articulation, especially work poses viewed from behind. Purpose-built movement frames must preserve the original cast identities and pass assembly review before priority 1 can close. Do not describe this release as production-ready sprite animation or begin the next roadmap phase on that basis.

The original artwork remains the reference. No replacement cast was generated. Review pages do not read or modify saved story progress.
