# Playable interiors and quality review · 26 October 2026

This integrates matching timber/plaster interiors into the real 18x15 cottage, bakery and seed-shop rooms. It keeps the production room dimensions, original blocking, automatic exits, fixed interaction points, village layouts, inventory and save schema. The canonical cast/portrait source files and shared rig are unchanged.

The original cottage furniture/material atlases provide bed, table, cupboard, windows, lamps, rug, floor, plaster and beams. The new kitchen-furniture-v1.png atlas supplies oven, modular counter, flour sack and standing mirror, generated with the built-in image-generation tool using cottage-furniture-v1.png as style reference. Exact prompt: kitchen-furniture-prompt.txt. Actual atlas: 1254x1254 RGBA. interior-art.js records measured individual bounds; no equal-cell assumption is made.

Large furniture bases align with the existing blocked cells; tall images rise behind their bases. Furniture and characters share feet-based depth sorting. The low front cutaway wall leaves the existing single-tile exit open. Kitchen flour/bread/order/cooking displays and Rowan's parcel/stock reflect actual state; drawing does not grant items or notice missing supplies. Existing furniture decorations retain orientation and can be moved/stored normally. The home chest/mirror now also respond when tapping their fixed art tiles, routing to the real approach square.

Legacy small floor storage in the bakery and seed shop remains walkable, as before; this pass does not insert new obstacles into an old decorated room. The floor rug and doormat are also walkable. Static painted oven fire is not a new flame animation. No new furniture catalogue, rigid-body physics, wardrobe, limb artwork, story rewards or arrival cutscene is introduced.

Initial assembled review is gated by ?review=bridge&interiors=cozy; the review save is separate from the production story. Final activation follows browser checks. Quality coverage and any limits are recorded after actual review, not inferred from passing unit tests.

## Quality review and verification

The full initial local suite passed 185 tests. Adding the camera containment regression brings the suite to 186; targeted interior checks pass. All 44 runtime/inline scripts pass syntax checks. Camera-refinement CI run 40187564675 passed. New tests cover original solid/walkable furniture bases, reachable work points, 30/60/120 Hz doorway travel, source atlas bounds, complete loading/failure/retry, save-pure rendering, missing-sack visibility, visible upper-art hit zones and indoor camera containment.

Browser review caught and corrected cropped kitchen framing. The camera contains the whole indoor character walking range when at least 176 world units fit; short landscape views continue following the player. Sampling at the actual 1280x720 browser with DPR1.5 checked the common-baseline original cast from front, both sides and back, both opposite walk contacts, a passing pose, basket front/back depth, open/closed eyes, first/last authored work poses and a sampled axe swing. The reviewed poses showed no recurrence of the reported shoulder/hip separation. This is sampled visual QA, not certification of every fractional pose or palette combination. No character/portrait PNG or shared rig changed.

Actual chapter actions tested: physical entry into Mara's kitchen; walking around the table; starting, mixing, shaping and baking a batch; one carrot spent and three buns gained (five to four carrots, one to four buns); cottage mirror opened through the art, twin-puff/vest appearance saved; invalid work-row placement disabled confirmation; valid indoor planter placement; reload retained the outfit and planter. The test slot remains separate from production. Fixture files derive from the earned rules journey with ordinary room-entry actions, rather than gifted progress.

The requested phone/tablet viewport override did not apply in this browser session: read-only DOM checks still returned 1280x720/DPR1.5 after requests for 390x844 and 320x740, including a fresh-tab attempt. Those are NOT counted as phone passes. The override was reset. Earlier unchanged interface/device checks remain historical; actual phone/tablet checks of these interiors and physical touch hardware remain open.

Remaining limits: the existing cutout rig is still a prototype rather than purpose-painted limb layers; basket/tool graphics are earlier simplified assets; painted fire is static; large room surfaces and dynamic bread/seed icons can receive further art polish. The entire wardrobe/palette Cartesian product, every tool progress fraction, DPR2 hardware and every device are not certified by this pass.

Final activation loads the new interiors by default in the actual chapter; no interiors query is needed. The strictly selected review save remains available for testing.
