# Character blinking and movement · 0.7.0

The player previously discarded the remaining frame time at every 135 ms tile boundary. Walking frames also followed absolute browser time, and sprites/camera snapped separately to whole world pixels. This could produce a regular hitch and visible jitter.

chapter-motion.js preserves the remaining frame time and ties the gait clock to actual movement. The shared character rig interpolates between the same opposing contact poses; pose zero/one/two/three still keep left arm opposite left leg. Camera and sprite anchors align in display pixels instead of whole world pixels. NPC routes remain independent of player movement.

Player, Mara and Orin blink on staggered short cycles. The runtime caches closed-eye variants using the existing face texture and a small eyelid stroke; it does not swap a differently sized full-body frame. The old NPC idle blink-frame substitution is removed to avoid body-size changes. Back views have no eye overlay. Reduced-motion settings suppress the blink and walking motion as before. No portrait artwork or wardrobe content is regenerated.

cast-review.html now has Close eyes / Open eyes controls for exact before-and-after comparisons alongside both NPCs, plus smoothly animated walking and contact stepping.

Automated motion checks cover 30/60/120 Hz travel invariance, tile remainder, blocked/completed travel, continuous opposing gait and brief/staggered/reduced-motion blink timing. Hardware frame rates and real touch devices still require device testing; these logic checks are not a promise of zero frame drops on every device.

Walking into the cottage or a completed bakery threshold enters automatically. Walking onto the interior exit leaves automatically. Touch destinations and guided errands route through those doors too. Triggers occur on arrival, so spawning on an outdoor threshold does not bounce back inside. Existing saves standing on a doorway can walk towards it to transition. Unfinished building signs and other object interactions keep their existing controls.


## Art audit and hauling · 0.9.1
The previously deferred basket attachment issue is corrected using the shared hand pivot. NPC action head scale and shirt/hair overlap are corrected, and all required artwork loads before play. Orin now makes a permanent four-material carry basket after the two homes and first bakery batch. See art-audit-and-hauling.md for the exact visual checks, gameplay verification and remaining device limits. Chopping/mining and the arrival cutscene remain future work.


## Gathering tool motion · 0.10.0
A 420 ms eased swing uses the existing textured arm and a shared shoulder/hand pivot. Axe and pickaxe render behind the body in the back view and ahead in the other views; the basket is temporarily stowed. Movement or menus cancel presentation without repeating a committed strike. Reduced motion holds the strike pose. See gathering-and-workshop.md for the visual matrix and remaining production-animation limits.
