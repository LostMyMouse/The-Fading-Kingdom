# Camera and cast proof · 22 October 2026

24 October follow-up: the review page now adds a new standing-pose pixel candidate and a Current game cast comparison toggle. See [pixel cast study](pixel-cast-study.md) for actual scope, source limitations and the remaining animation/customisation gates. The initial camera study below describes the unchanged current-cast mode.

James's feedback on the first village concept: the view does not make sense beside the sprites and does not fit the farming-game style he wants. Treat that environment image as an earlier concept under revision, not accepted production direction. Retain the desired warmth, open land and original identity. The canonical dialogue portraits remain approved and unchanged.

## What the new proof establishes

`../view-proof/index.html` shows one isolated front-facing cottage candidate, a small axis-aligned 16-unit ground tile trial, and Mara / the actual player / Orin at the same 32-unit height and 168-unit foot baseline. The cottage uses a rectangle-facing facade and roof with horizontal eaves, with no exposed angled side wall. The ground and camera do not converge towards a vanishing point. This corrects the earlier concept's conflicting building view without claiming that orthographic RPG art can never show building sides.

The source cottage remains a generated transparent PNG. Runtime alpha bounds remove empty margins for display only; the original alpha and pixels are preserved. Its drawing width is 128 world units, eight ground tiles. This is a visual scale trial, not a committed building collision footprint or finished tileset. Roof, foundation, door and interior anchor layers are not yet separated.

The cast uses the existing `drawPlayer`, `drawCharacter`, shared rig and animation frame functions directly. No walking sprite sheets, character proportions, colour ramps, accessories or portraits change. It renders source artwork at display resolution with smoothing off and whole-number 2×, 3× or 4× world zoom. Text is native HTML. Front, left, right and back views plus paused contact/passing poses make the existing assets assessable in context. These controls inspect walking in place, not navigation or NPC routines.

Start at 3× on a wide screen and 2× on a narrow screen. Narrow screens reveal less ground rather than shrinking every character to fit an entire world overview. Higher zoom on a narrow screen intentionally crops more of the cottage. This is a fixed comparison camera, not production movement/follow-camera implementation.

## What it does not establish

The current characters still use high-resolution, softly shaded, large-headed artwork. Moving the camera or disabling smoothing does not create a purpose-authored low-resolution pixel sprite set. Do not describe this proof as a completed Stardew-like character redesign, a final pixel grid approval or final walking animation approval. A future sprite candidate needs the complete cast/direction/wardrobe/pose quality gate; no existing character sheet has been replaced here.

The simple code-drawn ground is a quiet tiling trial, not a full environment kit. There are no playable interiors, doorway triggers, save migration, new furniture, player steering or art-based collision in this proof. It imports no game bootstrap and accesses no storage. Existing production runtime and saves are preserved.

## Next visual decision

Review the actual assembled scene at gameplay size before extending the map. Judge the facade/roof view, character-to-door scale, camera distance, all four cast directions and apparent pixel density together. Record explicit acceptance or remaining mismatches. If the sprite treatment remains too soft, author a small true-pixel cast candidate on a shared grid rather than repeatedly filtering or shrinking the old artwork. Preserve identity and wardrobe feasibility, and keep the approved detailed portraits separate from the world sprite resolution.

## Provenance and verification

Cottage generated with the built-in image-generation tool. Exact prompt: `camera-proof-cottage-prompt.txt`; asset: `../view-proof/cottage-front.png`. It is not a cropped portion of the earlier scene. Ground trial and controls are repo-native canvas/HTML. Browser screenshots and exact tested limits are recorded in the workspace's `outputs/camera-proof` directory. Passing rule tests does not establish visual approval.
