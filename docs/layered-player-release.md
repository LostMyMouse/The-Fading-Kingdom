# Layered player and independent residents · version 0.6.0

## Implemented
- The player now uses separate head/skin, hairstyle, shirt, arm, leg/boot and hat layers. Both new-story appearance and cottage mirror use the same renderer as the world.
- Six skin tones, six hair colours and six clothing colours; two hairstyles, two shirts, and no hat/work cap. Rustic everyday styling follows the approved portrait direction.
- Opposing arm/leg contact phases work in all four directions. Texture-bearing parts keep the artwork's shading. Rendering goes directly to the display-resolution canvas.
- Wardrobe choices save and reload. Existing saves gain default outfit/hat fields without losing story, materials or existing appearance indices. Legacy hairstyle index 2 is preserved and displayed as an earlier tousled look; a dedicated curls layer is not part of this two-style prototype.
- A sticky live preview and save button remain available while scrolling the wardrobe. The preview has an accessible image label.
- NPC proximity no longer changes routes, work state or facing. Orin has carpentry/supplies/rest stops. Mara has cart, herb or kitchen activities based on the current situation. Explicit conversation pauses its speaker, who acknowledges the player; the other resident can continue.
- Touch approach and equipment guidance use the resident's current position. The watering-can upgrade can be fitted beside Orin when he is away from his cart.

## Visual quality checks
The approved Mara and Orin dialogue portraits remain unchanged. The new player is working prototype artwork; it is not an additional user-approved style anchor.
- Inspected all 8 hairstyle × shirt × hat combinations in front, left, right and back views.
- Each view compared the two opposite contact poses: 64 wardrobe pose images.
- Checked all 6 available skin/hair/clothing palette values through 6 representative palette combinations, in all 4 directions and both contact phases: 48 further images. This does not mean every possible cross-product of colours was manually inspected.
- Reviewed default and tied/vest/cap appearances in close-up and at gameplay size. Checked head/torso proportions, hat placement, neck/shoulder/hip overlap, boot anchors and material colour separation.
- Corrected measured source regions rather than assuming the generated image followed the requested grid exactly. Actual atlas size is 887 × 1774.
- Corrected light-hair shadow recolouring and direction-specific shoulder layering during the review.
- The same draw function is used in preview, quality matrix, wardrobe and game.

## Functional and browser checks
52 automated checks pass, covering the existing game plus wardrobe migration/validation, all layer bounds, opposing limb travel, NPC independence, room visibility, collision paths, moving-NPC upgrades and save immutability. Syntax checks pass.
- Desktop review and gameplay: 1280 × 720.
- Tablet wardrobe/gameplay: 768 × 1024. Dialogue width 560; client and scroll width both 556.
- Narrow phone wardrobe/gameplay: 320 × 740. Dialogue width 284; client and scroll width both 265. No horizontal overflow. Save button height 44px.
- Changed skin, hair colour, clothing colour, hairstyle, shirt and hat through the cottage mirror; saved and reloaded. Hairstyle, outfit and hat values were retained.
- Scrolled the phone wardrobe; the character preview and save action stayed visible. Applied the no-hat choice and inspected the matching player in the world.
- Moved the player in four directions. Observed Orin leave his cart for an errand while the player was nearby, approached him through Find Orin, and received the watering-can upgrade away from the original station.
- Test fixtures were separate from the user's story. Captured the latest Day 3 story from the other game tab, retained the 2 carried wood and all other progress, restored it, and compared exported JSON exactly after normal wardrobe migration. Temporary review/test tab closed; viewport override reset.
- The source and website runtime are synchronised. Review pages do not read or write story storage.

## Review surfaces
- player-preview.html: interactive appearance controls, pause and frame stepping, four directions, gameplay/close-up sizes.
- player-quality.html: 8 wardrobe rows plus 6 palette rows, each with opposite contacts in four directions.
- docs/sprite-quality-standard.md: persistent requirements for future sprite work.
- outputs/player-prototype/: screenshots, parts atlas, generation prompt and this report.

## Practical limits
This is a layered-character prototype, not a complete production wardrobe or full life simulation. NPC routines are local to the loaded scene and restart when its actors are recreated; persistent all-day schedules, autonomous building-to-building travel and offscreen simulation remain a later NPC pass. Clothes and hair still need authoring and visual review for each new asset. Material recolouring is based on these reviewed parts; new artwork needs its own palette checks. The original environment art remains procedural.
Reduced motion is covered by stable-pose logic tests; actual touch hardware, other browser engines and child playtesting have not been performed in this pass. Chopping/mining, tools from characters or shops, and the arrival cutscene remain deferred.
