# Rear tool alignment and visual audit — 0.18.2

The rear-facing axe/pickaxe used the sleeve angle plus a half-turn. During the backswing this pointed the shaft inward toward the shoulder, hiding most of the tool behind the head. The rear tool now uses the opposite angular sign with the same hand anchor. Front and profile transforms, all sprite/portrait images, body proportions and saved progress are unchanged.

## Completed review
- All 24 skin-tone rows, 24 hair-colour rows and 24 shirt-colour rows were inspected in the real assembled renderer, across four hairstyles, four directions and four walking key poses. These are separate material sweeps, not the Cartesian product of every colour and outfit. No unintended face/clothing changes were observed at the inspected scale.
- All 16 current hairstyle × outfit × hat combinations were inspected with baskets and material bundles, in four directions and four walking key poses. No detached carried items were observed in those poses.
- Both corrected tools were reviewed over all 16 wardrobe combinations, four directions, and start/backswing/strike/recovery at progress 0/.28/.62/1. The rear backswing now extends outside the character silhouette; head occlusion remains appropriate when the hand/tool actually passes behind the body.
- Original player and Mara/Orin/Rowan were compared at close-up and gameplay size. Identities and scale remain unchanged.
- Browser layout review used a separate review save at 320×740, 390×844, 768×1024 and 844×390; none reported horizontal overflow. This is not a physical touch-device performance test. The visible scene and controls were inspected; tall tablet/phone views require scrolling the outer review page.
- A regression test first failed against the previous tool transform and passed after the repair. A second test checks the rendered shaft grip in all directions at 101 progress samples for both tools. The full local suite passes 215 tests; syntax validates 57 runtime/inline scripts and four JSON import maps.

## Evidence and limits
Workspace screenshots are in outputs/movement-foundation, including palette-reviewed.jpg and the rear-tool proof. The tool-alignment review pages are isolated frozen candidates and do not access story saves. Production sprite-audit.html always uses the active game renderer.

The current cutout rig is still a prototype. Purpose-built walking/work articulation, continuous playback assessment, physical devices and full colour-by-outfit action coverage remain unfinished. This audit clears specified static combinations, not final indie-game animation quality. Priority 1 stays active; village construction remains queued next.
