# Village and interface direction · 22 October 2026

Status: proposed visual standard and interactive design study. This is not a new playable chapter, approved production environment, tile atlas or replacement for the current world. Review this before extending the map or commissioning more environment assets. The canonical Mara and Orin dialogue portraits remain unchanged.

## The place

A forgotten storybook village slowly becoming somebody's home. One continuous village and neighbouring countryside; paths lead into separate woodland, hills/mines and later kingdom areas. Buildings have actual walkable interiors. Doors enter and exit automatically. No travel menu is required to cross the village.

The opening is still almost empty: one cottage, its small garden, a well, a river crossing and traces of an old gateway. The design study shows a later moment, just after Mara has moved in, to demonstrate how another home fits the landscape. It must not imply a prebuilt town at the start.

## Layout proposal

Treat the following dimensions as a design proposal, not a silent resize of the existing 56×40 save world. Test walking time and camera comfort before choosing final dimensions.

- Village planning envelope: approximately 80×64 ground tiles, with a generous connected buildable interior. Most of the land starts unoccupied. Nearby countryside belongs to the same outdoor space.
- Fixed landmarks: a modest player cottage initially, old well, river/bridge and ruined arrival gateway. A permanent route joins arrival, cottage, well and area exits. Avoid an imposed symmetrical town plan.
- Flexible neighbourhoods: homes, farms, shared spaces and decoration grow around these landmarks. Suggested sites are optional; residents do not punish a player's aesthetic choices.
- Three-tile main routes; at least two clear tiles at every usable front door. Building previews show the whole collision footprint, roof overhang and entrance clearance separately. The final exact footprints must follow measured art.
- Player paths and a market square are player projects, not mandatory visual stamps at predetermined coordinates. Villager work and social routes update when homes move.
- Woodland exit at the upper edge; hills route beyond the river; gateway towards the rest of the kingdom. Each exit has a visible landmark and readable destination when approached.
- Near the first cottage: tools/storage, a 3×4 illustrative garden and a clear first-home building area. Starting crop quantities remain a game-balance decision; this study does not change the nine existing plots.

The overview diagram is a spatial relationship sketch, not a minimap, tile-accurate plan or committed compass orientation. Maintain the player's freedom to build the actual village differently.

## Environment art contract

Original chunky storybook pixel art. Warm dark-brown edges, earthy cream plaster, tactile timber, moss/terracotta roof variants, sage meadow, muted teal water. Shadows fall consistently down-right. Ground is quiet enough that crops, dropped objects, doors and people remain readable. Reserve bright accents for flowers, useful objects and interaction feedback.

Use 16×16 logical ground tiles and the existing shared 32-world-unit character height as the first production trial, not as proof the generated concept is already on that grid. Inspect an assembled scene before locking density. Maintain integer camera placement and nearest-neighbour art scaling; render text as native HTML at display resolution. The environment image is a visual reference only: it has not been sliced into valid tiles, collision shapes or occlusion layers.

Production assets must be separate ground transitions, grass details, water edges, trees with trunk/canopy occlusion, foundation/wall/roof/door/window layers, furniture and work props. No monolithic concept-image background in the full game. Each building needs aligned exterior/interior entrances, three construction stages plus finished art, palette variants, and consistent light direction. Trees need readable bases, and canopies must not hide essential interactable objects.

Do not replace the approved portrait style or introduce new world-character art in this study. Their actual assembled size, animation, palette, accessories and cast consistency require the existing sprite quality gate.

## Interface contract

- World first. Compact date and two clearly named balances; journal is optional and collapsible. No kindness meter, red moral verdict or currency burst for saying a polite phrase.
- Personal purse purchases personal items. Village fund pays shared projects. Different labels and icons, never an unexplained pair of gold numbers. The study uses sample balances only; it creates no economy/save fields.
- Five visible quick slots on a narrow screen, with more tools in the bag. Selected slot has a border, mark and text label. Unearned tools do not appear usable. No tiny unlabeled mystery icons.
- Crisp native text: 18px body target, 16px compact labels, generous spacing, minimum 44×44 controls (48px preferred). No pixel-font treatment that compromises reading.
- Desktop: keyboard/mouse, contextual action near the lower edge, tool shortcuts. Touch: tap to travel, tap a reachable object to act; large optional movement controls. No compulsory joystick over a dialogue choice.
- Dialogue: existing expression atlas, name, short conversational lines and large choices. Expression changes follow the line being spoken; do not attach an exaggerated reaction to every sentence. No scrolling text animation that blocks immediate reading. Dialogue UI fits phones without covering its own choices.
- Build mode alone displays placement guides. Show valid/blocked in text and outline shape as well as colour. Confirm is disabled when blocked; escape/cancel always works. Keep routes, doors, storage and essential stations reachable. Offer undo and explain any move cost before spending.
- Journal has one gentle next step and a separate village story. Inventory displays item names and quantities. Avoid a permanent checklist covering the scenery.
- Reduced-motion support; no information conveyed by colour alone; visible keyboard focus; modal focus containment and return. Contrast must be measured against actual panel fills.

The design study demonstrates native UI, an original environment reference, dialogue expression changes, a bag, a relationship map and a deliberately restricted placement preview. It is not walking, automatic doorway, NPC-routine, inventory-conservation or economy implementation. Its controls never read or write a game save. A static full-scene image cannot establish sprite animation quality or production performance.

## Representative corner acceptance gate

1. Review the scene's feel and the UI together with James. Record accepted palette, roof scale, terrain density and panel treatment. A generated picture alone is not art approval.
2. Convert only this corner to reusable layered assets in a separate playable review scene. Test player/NPC proportions against both approved portraits and the actual rig. Add cottage and bakery interiors with matched door anchors.
3. Walk from garden to bakery and through both doors. Place and move a home and furniture; try blocking every entrance. Check tree/roof occlusion, all four movement directions, accessory anchors and every quick-slot state.
4. Check 320px and 390px phones, 768px tablet, 1366px desktop, DPR1/2, portrait/landscape and reduced motion. Measure text/control contrast and ensure no clipped choices or unwanted page overflow. Observe a real touch device before claiming touch performance.
5. Run existing full rules/journey/soak suite after integration; add meaningful map reachability and save migration tests before changing world dimensions. Existing player construction, crops, interiors and decorations must survive migration.
6. Only then expand the environment kit and rest of the map. Sound, seasons, further regions, character wardrobe and arrival cutscene follow the accepted standard.

## Files and provenance

Interactive study: `../design-review/index.html`. Environment reference: `../design-review/village-corner.png`. Generation prompt: `village-environment-prompt.txt`. Generated with the built-in image-generation tool using the canonical portraits as palette/mood references; no portrait pixels were replaced. The image is an environment proposal, not a production sprite sheet. Review evidence and exact checks belong alongside the study, not as claims inferred from unit tests.
