# Playable village scenery · 25 October 2026

This pass fits the existing cottage/outdoor kit to the actual production chapter. Original character PNGs, identities, proportions, animation rig and dialogue portraits are unchanged. It preserves the 56x40 world, building choices, free placement, collision rules, automatic thresholds, inventory, economy and save schema. No new prebuilt neighbourhood or starter rewards are added.

The exterior rendering adds textured quiet meadow and paths, garden soil and carrot stages, individually measured trees and loose material pieces, matching three-style finished homes, foundation/frame stages and feet-sorted building/decor layers. Building doors are anchored to the rules' actual home/Mara/Rowan thresholds, including the original home offset. Nearby players can pass behind the roof; their feet in front draw above the building. Tall existing doorways/interiors remain the production rooms; this pass does not silently swap in the smaller art-review cottage room.

New asset: assets/environment/village-buildings-v1.png, generated with the built-in image-generation tool from view-proof/cottage-front.png. Exact prompt: docs/village-buildings-prompt.txt. Actual atlas is 1254x1254 RGBA; measured bounds are in village-art.js. It contains timber and stone cottages plus foundation and frame. Meadow keeps the original cottage image. The terrain/props reuse the existing outdoor kit. No source images were filtered or modified.

This is a bounded outdoor integration, not final certification of the whole game. Fence joins/vertical runs, rotated benches, market/workshop props, production interiors, native world text and the broader UI still need separate matching art/polish. Existing fallback graphics preserve unsupported decoration orientations. The original free placement and saved progress take precedence over enlarging houses to fit an art demonstration.

The first deployment exposes the assembled build using ?review=bridge&scenery=village for isolated browser QA; main-game art remains unchanged until that check is complete. Browser tests use the isolated review slot and earned rules-journey backups, never the player's production save.
