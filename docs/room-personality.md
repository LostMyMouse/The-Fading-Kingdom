# Resident room personality · 26 October 2026

Mara's kitchen gains a plate/jar shelf with hanging cookware, a wooden clock, drying herbs, a gingham towel/rolling pin, an open recipe book and a tea tray. Her existing woven rug is enlarged under the table. The cloth is omitted while mixing, and tea gives way to the existing breakfast plate during that resident activity.

Rowan's room gains a plant shelf, gardening-tool rail, pressed-flower frames, seedlings, terracotta herb pots and a larger floral green rug. These plants are decorative, not seed stock or collectible produce. Existing parcel/seed displays continue to reflect the actual supply state.

Props attach to existing walls, table, counters and cupboard. They add no floor obstacles or rewards, move no player decoration, and alter no saved layouts, NPC routines, character sprites, portraits or movement. The player's cottage keeps its existing starting arrangement. No new tools, furniture catalogue or dialogue requirements are introduced.

Built-in image generation used the existing cottage-furniture-v1.png as the style reference. New atlases: assets/environment/mara-room-details-v1.png and rowan-room-details-v1.png. Exact prompts: room-personality-prompts.json. Actual outputs are 1536x1024 RGBA. Objects were measured individually; their generated geometry is not an equal-cell grid. Transparent RGB background colour is ignored by the renderer; generated alpha is preserved.

The first assembled release uses ?review=bridge&details=personal for browser quality checks before default activation. The review slot never reads or replaces production story storage. Tests cover real image dimensions/crop bounds, wall framing, rug/exit separation, complete load and retry, save-pure rendering and the cooking/breakfast surface exceptions. The existing rules/journey/movement/save suite remains applicable.

## Assembled review

The local full suite passes 189 tests, including the existing multi-day journeys and save/route checks; 45 runtime/inline scripts pass syntax checks. Browser review inspected both actual rooms at gameplay scale in the separate review slot, with the original cast. Matching alpha, wall framing, table surfaces and rug/door separation were checked. Wall shelves were lowered slightly to leave header clearance; small bookcases fit existing solid counter/cupboard cells. Rowan's seedlings sit on the cupboard, while a pot and seed packets occupy separate parts of the counter. Supply notice flags/counts still govern the stock display.

Final activation loads the details by default, without a details query. No new floor obstacles or save fields are added. The previous phone/tablet override limitation remains unresolved; these assembled captures are desktop browser checks, not a new physical-device certification.
