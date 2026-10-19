# Art audit and hauling upgrade · 0.9.1

19 October 2026. This is a scoped browser review of the current cast and wardrobe, not a guarantee against every future art defect or every physical device.

## Corrections
- The carried basket now shares the player's animated hand anchor, sleeve pivot and opposite walk phases. It renders behind the body when facing away. Reduced motion uses the still hand anchor.
- NPC action rows preserve the idle head source scale, fit the lower body to the common 32-unit height and retain the foot baseline. Starting work or a conversation no longer shrinks the head by scaling a taller source figure as a whole.
- Shirt swaps preserve only the tied-back hairstyle's measured hair overlap. Other hairstyles no longer copy brown skin/sleeve pixels from the old shirt onto a vest.
- The title screen waits for all player layers, three resident world sheets and three portrait atlases. A failed asset shows a retry action instead of silently accepting a partial outfit or starting with temporary character art. Repeated callers wait for the same cast load.
- The cast review supports exact work/talk frame stepping, four directions, held baskets, close-up and gameplay size, and the current wardrobe controls.

No PNG artwork or canonical portrait style was replaced.

## Continuing the build
Orin offers a permanent roomy carry basket after Mara's home and first cooking batch, and Rowan's finished home. Collect it in person, including during Orin's bakery visit. Return his borrowed tool basket first; a late return does not forfeit the gift. It holds four mixed wood/stone bundles instead of one, or two with the loan basket. The fifth item stays on the ground. It persists through reload and later disagreements. No gold or materials are charged, no dialogue-score test is involved, and repeated collection gives nothing extra.

Chopping, mining, new tool tiers and the arrival cutscene remain deferred. Existing finite loose supplies were not changed.

## Actual visual coverage
- All sixteen visible hairstyle × shirt × cap combinations in front, left, right and back views, at both opposite contact poses. Legacy style 2 still aliases the original tousled hair.
- All six skin, six hair and six clothing palettes individually on the bob and twin-puff styles. This is not the full Cartesian product of every palette and outfit.
- Common-baseline cast comparison: player, Mara, Orin and Rowan. Passing and contact views, basket hand attachment and back-facing depth, caps, open/closed eyes, work and dialogue/reaction poses.
- All four authored work frames for all three residents, with their original bowls, tools and plants. Talking, thoughtful and surprised poses checked; happy/reaction frames use the same action normalisation.
- Eighteen dialogue portraits checked together: three residents × six expressions. The new gift lines select authored happy/amused expressions.
- Browser layouts at 1280×720 desktop, 768×1024 tablet and 320×740 phone. The phone canvas backing width matched its 320 CSS pixels at DPR 1; no horizontal overflow in the reviewed phone and tablet views. Text and basket controls remained readable/reachable.
- No browser errors/warnings during the equipment UI playthrough.

## Gameplay verification
A private fixture was imported using the normal backup interface into art-review's isolated save key. Received the basket from Orin, gathered three wood and one stone with normal map interaction, opened the basket to see 4/4 capacity, reloaded and continued, and verified all four materials and the equipment persisted. Production story storage was not replaced.

110 automated checks pass, including failed/retried image loading, shared pending loads, opposing hand geometry, shirt overlap boundaries, capacity, fifth-item conservation, save migration and overflow rejection, local loan return, visiting Orin and persistence through disagreements. All 30 runtime/inline scripts pass syntax checks. Existing tests retain reduced-motion, pause, independent residents, door transitions, farming, construction and economy coverage.

## Evidence and limits
Screenshots are in outputs/art-audit in the task workspace: wardrobe-tousled/tied/bob/puffs, palette-bob/puffs-skin/hair/shirt, cast-basket-contact, work-pose-1 through 4, portraits, orin-basket-gift, four-materials-reloaded, world-phone, world-tablet and basket-phone. Some early captures show the gift's neutral portrait before its final authored happy/amused assignment; the expression mapping is covered by a regression check.

The current animation remains a textured prototype rig rather than purpose-built animation layers. Cap artwork covers the puff buns. Physical iOS/Android testing, high-DPR hardware and an exhaustive palette Cartesian product have not been checked here. Continue to apply the sprite quality standard whenever new assets or tools are added.
