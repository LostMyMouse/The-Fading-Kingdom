# Regression run · 0.11.1

The 0.11.0 baseline passed 142 checks. This deeper pass added a fresh-story journey, four seeded 20-day stress runs, and regressions for three reproduced bugs. The corrected suite passes 147 tests; 35 runtime and inline scripts pass syntax checks.

## What the automation actually does
The journey starts with fresh(), earns every material and coin through game actions, and uses production pathfinding and automatic doorway triggers. It reaches two completed homes, cooking, flowers and the seed sower, earned gathering tools and their upgrade, crafting, the restored square, and two markets. It performs 224 actions, walks 3551 tiles and reloads after all 224 actions. No story flags, coins or supplies are seeded into that journey.

The separate stress checks reuse the earned continuation and run four reproducible seeds through 80 further game days and 2068 actions. They refill starter seeds, grow food, host markets, attempt duplicate openings, create and repair actual flour/seed shortages, store and re-place furniture, repeat conversations, and compare daily gold and furniture totals. These tests exercise rules and save migration; they do not drive browser pixels or reproduce every walk in the stress phase.

## Bugs reproduced before fixing
- Market residents lost their outdoor locations when the player entered a building. The UI could fall back to indoor speaker locations. Their actual market locations now remain available to guides and interactions across rooms.
- A batch could be started or advanced while Mara was at the market. Cooking now waits safely and directs the player to her actual location, without consuming ingredients or discarding an unfinished batch.
- The game allowed a 201st placed decoration although the loader accepted at most 200. Placement now stops at the same limit, explains how to make room, and preserves stock. Storing an item permits placement again.

All three regressions failed against 0.11.0 and pass with these fixes. Character artwork and portraits are unchanged.

## Running again
Run npm run check for syntax and every regression test. Run npm run test:journey for the detailed trace; append an output-folder argument to write the report and earned checkpoints. The normal test command includes both the journey and stress checks.

GitHub Actions is configured to run on main pushes and pull requests, using Node 22 and Node 24, read-only repository permissions and pinned checkout/setup actions. Its run result is recorded separately in the release evidence; configuration alone is not a passing CI run.

Browser checks use the isolated qa-review save slot and earned checkpoint files through the game's restore UI. The production save is preserved. Browser evidence and the exact automated trace are in outputs/qa-0.11.1 in the task workspace. Phone/tablet viewport verification from 0.11.0 remains applicable to unchanged layout; this patch includes a focused narrow-screen review. Physical touch hardware, timing on low-powered devices, readability for individual children and enjoyment still require real playtesting.
