# Gathering and workshop · 0.10.0

After collecting the starter kit, harvesting the first carrot and meeting Orin, ask him about gathering tools. Accept his bench job and bring him two stored wood and two stored stone. He gives a permanent axe and pickaxe; neither starts in the inventory. Existing stories keep their progress and receive no unearned tools.

Tap a fallen log or small rock in the southwest clearing, or stand beside one and interact. The appropriate earned tool is selected automatically. Three separate swings clear a patch for two materials. A full basket never consumes a hit or reward. Leftover drops remain at that location across reloads until collected. Cleared patches renew after two nights; pending drops are preserved. Mature trees remain growing. Each sleep also restores at most one previously collected loose wood and loose stone node so an older, exhausted village can still earn its first tools.

After four patches and Mara’s first cooking batch, Orin fits better handles and edges for four stored wood and four stored stone. Both tools then take two swings. Earned equipment remains yours after disagreements.

## Making the village your own
Use the physical repaired workbench beside Orin’s cart. Costs use cottage/building stock rather than carried materials. The basket menu can guide the player to cottage storage.

| Recipe | Wood | Stone | Output |
|---|---:|---:|---:|
| Garden bench | 4 | 2 | 1 |
| Planter | 2 | 1 | 1 |
| Lanterns | 2 | 2 | 2 |
| Path | 0 | 2 | 4 |
| Fence | 2 | 0 | 4 |

Finished pieces use the existing free-placement system, including supported interiors. Legacy decorations are preserved; the bench job asks for its corner to be cleared before payment if occupied. Covering a gathering patch with furniture preserves its drops and partial progress. Crafting invalidates an older placement undo so newly made stock cannot be lost.

## Art and verification · 21 October 2026
No character or portrait PNGs changed. The existing textured rig supplies the tool arm, with a shared shoulder/hand pivot and correctly layered axe/pickaxe. The carry basket is stowed during a swing. Reduced motion uses a stationary strike pose. NPC routines remain independent.

The browser playthrough used only the isolated gathering-review save: earned tools through Orin, chopped twice, reloaded, completed the log once, mined stone, checked full-basket feedback, deposited materials, crafted a bench and freely placed it. Rule tests cover upgrades, regeneration, pending drops, malformed saves, visiting Orin, stock conservation and seed-shop furniture reloads. All 126 tests and 33 runtime/inline syntax checks pass.

Both tools were inspected across all 16 hairstyle/shirt/hat combinations, all four directions, backswing and strike poses, plus cast comparison. Unchanged palette ramps retain their existing tests; a new exhaustive palette-by-tool visual matrix was not performed. Evidence is stored in outputs/gathering in the task workspace. Two defective full-page browser captures were excluded and replaced with normal viewport captures.

Phone layout was checked at 320×740 and tablet at 768×1024, with no horizontal page overflow; workshop options remain reachable by scrolling. These are browser viewport checks, not physical touchscreen or hardware performance certification.

The tool motion remains a segmented prototype, not a bespoke production animation atlas. Ore, tree felling/replanting, stamina, additional tool tiers and the arrival cutscene remain later work. The chapter save key is unchanged; preview saves are isolated.
