# Our village square · 0.11.0

## The playable loop
After both neighbours have finished homes, Orin’s gathering tools are earned and the market stall is open, the journal points southwest of the garden. The old square is a fixed common-ground site (x3–14, y22–24), leaving the freely chosen house sites alone. The player chooses the arrangement of every furnishing.

Visit the marker and spend 12 village gold, four stored wood and four stored stone on the ground. Ask each neighbour in person: Orin brings one bench and 12 paths; Rowan brings one planter and two lanterns; Mara turns two player-grown carrots into a shared tray. These contributions are remembered and paid only once. No deadline or exact polite-answer test.

Place at least one reachable bench, planter and lantern on the pale ground, leaving room for people. Open the first market at the marker. The existing cast gathers, browses, chats and rests near the furnishings. Subsequent markets cost two carrots, at most once per day. Each participating villager contributes 2 G to the shared fund when the player next sleeps, for up to 6 G in addition to existing businesses. Chatting, opening menus or reloading do not produce additional income.

## Local, repairable consequences
Orin needs his mill boards and borrowed basket back before helping. Mara needs her order flour on its shelf. Rowan needs the seed delivery returned or replaced. Only the affected contribution pauses; the player's tools, furniture, homes and completed cooperation remain intact. A new gathering waits until the supply problem is repaired. If supplies go missing during an existing gathering, the affected villager returns to ordinary work and that stall contributes no extra gold that night. The other stalls continue. Existing flour/seed income consequences still apply.

## Presentation and compatibility
No portrait, hairstyle, shirt, player or NPC image was regenerated. Authored contribution/setback lines select existing happy/concerned portraits. Added ground repair, a marker, bun tray and bunting extend existing code-drawn scenery. Residents use independent, furniture-aware stops, spaced two tiles apart at rest; routes do not target the player. Stops are cached between layout changes, with different pauses for each resident to avoid moving in unison. Normal routines resume next day, and reduced motion keeps stable poses. Existing saves migrate with an untouched square and no invented gifts or shared memories. Existing decorations remain movable and are preserved.

This remains a prototype: residents join at authored gathering positions rather than commuting from every home; resting uses existing standing poses, not bespoke seated animation. There are no visiting tourist characters or new market-shopping catalogue yet. The square is one fixed public site; home placement and furnishing placement remain free. The arrival cutscene is still deferred.

## Verification
The release adds 16 rule tests (142 total), covering migration, physical/cost gates, single-use contributions, local supply repair, placement, repeat-safe market income, combined 30 G daily settlement, reloads, malformed state, independent routines and spaced/cached destinations. All 35 runtime/inline scripts pass syntax checks.

An isolated square-review save was used for browser testing, preserving the production save. Playthrough: migrate a completed 0.10 story, restore the ground, ask all three neighbours, deliver carrots, freely place the bench/planter/lantern, open the market and reload it. A visual check caught crowded resting labels and a square label behind crops; both were corrected before release. Desktop, 320×740 phone and 768×1024 tablet viewport checks (both with zero horizontal overflow), a second market costing two carrots, and a separate +6 G morning ledger entry are recorded in the task’s outputs/square folder. These viewport checks do not replace physical-device or child playtesting. No new exhaustive wardrobe matrix is claimed because character drawing code and assets were unchanged.
