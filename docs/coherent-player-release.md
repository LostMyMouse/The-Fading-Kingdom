# Coherent player template · version 0.6.1

## Why this replaces the previous player
The 0.6.0 player was assembled from separately proportioned parts. Its narrow body, longer legs, detailed hands and different shading did not match Mara and Orin. The previous internal contact-sheet review did not adequately enforce cast consistency; James identified the mismatch. The old release checklist is superseded for visual consistency.

## Implementation
A complete character atlas was generated with both NPC world sheets as references. Two hairstyles and two outfits are assembled against measured whole-body landmarks. Player and NPCs now use character-rig.js for the same 32-unit height, foot baseline, four-beat opposing gait and textured limb drawing. Asset-specific sleeve bounds fit each silhouette without changing the shared movement timeline. Five-step warm material ramps replace multiplicative tinting. Eyes, dark outlines, boots and cream sleeves are protected by material/region rules.

Existing appearance IDs and story saves are preserved, including the legacy hairstyle alias. The current cap remains a fitted overlay from the earlier parts atlas. No portrait art or NPC routines are redesigned.

## Review surfaces
cast-review.html compares the player between Mara and Orin in all four directions, with palette/wardrobe controls, passing/contact stepping and close-up mode. It never reads or writes story progress. player-quality.html covers eight wardrobe combinations and each of the six skin, hair and shirt palettes separately in four directions and two contacts (208 player renders). The production and review player renderers must be identical.

## Limits
This remains a cutout walking rig, not hand-authored frame-by-frame animation. Full tool-use layers and further wardrobe options need their own art and pose review. Material selection is constrained by authored colour/region rules rather than artist-painted external mask files. Do not describe every possible cross-product of palette combinations as visually reviewed. Future characters must be compared against the whole cast, rather than treating this new player as a replacement art authority.

## Validation for this pass
54 automated checks passed, including legacy appearance migration, independent NPC routines, measured source material samples, rectangle bounds and opposing gait. All eight wardrobe combinations were inspected in four directions and both contact poses. Six skin, six hair and six clothing palettes were inspected separately; a dark-skin/light-hair/blue-vest/cap combination was also stepped beside both NPCs. This is not exhaustive inspection of every palette cross-product. The review caught and corrected sleeve detachment, harsh colour banding and incomplete fabric recolouring. The atlas was never accepted on generation alone.

Live creator checks: 320×740 phone and 768×1024 tablet, with document scroll widths matching the viewport. Hairstyle, outfit, cap and skin draft changes repainted correctly; sticky preview and final control remained reachable. Draft was cancelled before Begin my story, so testing did not replace the existing story. Desktop cast comparison reviewed at 1280×720. No physical touch-device test is claimed.
