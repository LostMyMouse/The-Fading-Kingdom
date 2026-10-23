# Outdoor art kit · 24 October 2026

Status: isolated, walkable outdoor art review. Not an approved replacement map. Original player, Mara, Orin, Rowan and canonical dialogue portraits retain their source artwork, identities and proportions. The rejected replacement cast is not imported.

## What this contains

`../outdoor-review/` assembles reusable ground materials, a cottage, separate trees, fences, crops, furniture and garden props. Arrow/WASD and tap-to-route movement use solid object bases. Trees and actors sort by their feet, so people can pass behind canopies. Mara and Orin follow separate timed routes unrelated to the player's position; pause and reduced motion stop their automatic movement. Crop-stage controls are visual comparisons, not harvesting or rewards. The asset shelf shows individual pieces at their intended scales.

This review does not read or write the production save. It has no doors/interiors, placement, economy or story implementation. These requirements remain binding for production integration, including the almost-empty opening and free village layout. The existing chapter is not replaced with this smaller demonstration map.

## Assets and provenance

Generated with the built-in image-generation tool, using `../view-proof/cottage-front.png` as the environment style reference. No characters were generated or modified. Original generated PNGs remain in the Codex generated-images folder; project copies are `../assets/environment/outdoor-props-v1.png` and `../assets/environment/terrain-v1.png`. Full prompts are in `outdoor-kit-prompts.json`.

Both outputs are actually 1254×1254. The props did not follow the requested equal 4×4 cell geometry: `../environment-art.js` therefore records measured alpha bounds for each usable item. Do not slice it into assumed equal cells. The angled gate is excluded from the runtime/shelf because its view does not fit. The narrow fence asset is a post, not a full vertical fence; proper vertical runs, joins, terrain transitions, building layers and matching interiors still need work. Ground patterns use the four square material regions; this is not a complete terrain autotile system.

## Walking seam repair

James reported sprites splitting during walking. The shared rig used butt-joined moving rectangles: vertical arm translation exposed shoulders, and side clothing stopped too high to cover rotating hip sections. The repair uses shoulder-pivot arm swings, extends legs under the fixed clothing and extends the hip cover. The head/hair overlap draws last. The basket's front/rear attachment follows that same shoulder pivot. Original source PNGs, opposing gait phases, character height and baseline are unchanged.

This remains a cutout animation prototype. It is not a newly painted production walk cycle or certification of every tool/accessory pose. Four-direction contact/passing comparisons and gameplay-size browser checks are required; tests alone do not approve the art.

## Validation

Local full suite: 159/159 pass, including multi-day economy journeys and the new review-map reachability checks. All open review-map squares and every independent NPC stop are reachable. Routes reject occupied and off-map destinations. Root syntax checks: 37 pass; nested review scripts checked separately. Original cast was rendered in all four directions at passing and both opposite contact poses in a saved contact sheet.

Browser/deployment results are recorded after the assembled review is inspected. Approval of the visual direction still belongs to James. Real-device touch performance and complete production equipment/wardrobe animation certification are not inferred from desktop viewport checks.
