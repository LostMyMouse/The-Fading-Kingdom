# First-hour guidance · 0.12.0

This pass connects the existing playable chapter with clearer optional guidance. It does not claim that a child has completed it in a measured hour.

## What changed
The objective card now names the next action: collect tools, plant, water, sleep, harvest, meet a neighbour, plan a home, gather supplies, make a delivery or visit a kitchen. Selecting it uses the existing pathfinder, doorways, tools and interactions. It never teleports the player, grants materials, spends village funds without the normal confirmation, or chooses a dialogue response. The player can keep walking, farming and decorating normally.

The same suggestion appears in the journal. A new Our village story page remembers seven milestones derived from existing saved events: first harvest, Mara’s home, first cooking batch, gathering tools, village businesses, Rowan’s home and the first square gathering. Completed chapters are readable without claiming another reward. After the first market it becomes a gentle chapter reflection, with continued access to the square and free play.

Guidance covers empty starter seeds, full carried materials, returning a loan basket after dropping supplies, the accepted workbench job, scarce materials and regrowth, village gold earned overnight, the next funded home stage, an accepted flower favour, and square materials/food/furnishing requirements. Owned-item guidance does not announce a moral verdict on an ordinary pickup. Speaking to the character remains necessary.

The guide brings players to Orin before asking them to gather house supplies. It promotes opening the market before financing Rowan’s home, explaining how daily work supports village growth. House style/location and furniture placement remain freely chosen. The arrival letter and approved character artwork are unchanged; the cutscene and bespoke sitting animation remain deferred.

## Verification and limits
Ten new guidance tests cover the farming sequence, seeds, carpenter introduction, materials, loan returns, contextual ownership, earned chapter milestones, marigolds, square preparation and imported-save edge cases. The complete local suite passes 157 tests, including the fresh-story journey and 80-day seeded stress coverage. All 36 runtime/inline scripts pass syntax checks. Automatic Node 22 and 24 checks run on pushes and pull requests; their actual run outcome is recorded in release evidence.

Browser review uses first-hour-review with its own save key. It covers a fresh arrival, guided tool collection, planting/watering, automatic cottage entry, sleeping, harvest, meeting/inviting Mara and free house planning; it also checks the journal story page and narrow/tablet layouts. The production save is preserved. Screenshots and verification details are in outputs/first-hour in the task workspace.

Real first-hour timing, comprehension for individual children, enjoyment and physical touchscreen performance still need observed playtests. Stronger relationship episodes, new work/sitting animations, sound polish and further kingdom areas remain later stages of the roadmap.
