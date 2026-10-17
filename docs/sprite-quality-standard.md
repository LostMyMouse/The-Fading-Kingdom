# Sprite quality standard

James requested explicit quality checks to prevent loss of detail and inconsistent artwork. Quality is part of completion, not a later optional task.

## Art authority
Mara and Orin's dialogue portraits remain the explicitly approved canonical style. See portrait-art-direction.md. Player parts are working prototype artwork, not an additional user-approved style reference. Preserve the canonical warm storybook faces, earthy palette and dark brown outlines. Do not infer approval of a new style merely because a generated sheet exists.

## Required checks for sprite changes
1. Inspect the actual assembled character at gameplay size and in close-up, against existing characters.
2. Check every offered hairstyle × outfit × hat combination in all four directions. Include front, both side profiles and back; never accept only a good front view.
3. Compare both opposite foot-contact poses and the passing poses. Arms must swing opposite their corresponding legs. Check shoulder/hip joins, boots, sleeves and hair overlap.
4. Check all offered skin, hair and clothing palettes. Recolour only the intended material, preserve outlines and shading, and ensure eyes and skin do not change with clothing.
5. Verify head/torso proportions, consistent foot anchors and hat alignment. Reject disconnected components, cropped limbs, stray pieces and pose-to-pose size changes.
6. Render directly at display resolution. Keep text sharp. Review desktop, tablet and narrow phone layouts with reachable controls and no horizontal overflow.
7. Test wardrobe persistence, migration of existing saves, reduced motion and pause behaviour.
8. Save screenshots and a truthful checklist stating tested combinations, actual sizes and remaining limits. Passing logic tests does not establish visual quality.
9. Keep unreviewed art in an isolated review page until assembly checks pass. Do not replace established artwork with a less detailed procedural shortcut to fix animation.
10. If a quality issue remains, correct it or state the specific limit. Do not label the art production-ready solely because it works.

## Review surfaces
player-preview.html allows switching appearance, pausing, stepping and comparing directions.
player-quality.html shows all eight wardrobe combinations and six representative palette checks; each view compares the two opposite contact poses.
Both use the same player renderer as the game and do not write story progress.

## NPC behaviour
Residents follow their own authored work, errand and rest routines. Player proximity or movement must not change their route, work state or facing. Only explicit conversation makes its speaker face the player and pause. A blocked path may wait for space; it must not become following behaviour.

## Mandatory cast comparison (added after the 0.6.0 mismatch)
A player-only matrix is insufficient. For every sprite change, render the player between Mara and Orin at exactly the same height, foot baseline and camera zoom in front, left, right and back views. Inspect passing and both contact poses. Compare head/body ratios, shoulder width, hand shape, outlines, shading contrast and apparent pixel density. Review close-up AND gameplay size. If any direction has detached or cropped limbs, the candidate fails even if the front view looks good. Record the actual result; automated tests and successful generation are not visual approval.

Shared world contract: character-rig.js. Cast comparison: cast-review.html. Both existing NPCs remain references, and portrait approval remains separately governed by portrait-art-direction.md.
