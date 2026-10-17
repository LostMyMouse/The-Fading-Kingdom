# Chapter One implementation · 17 October 2026

This is an expanded playable prototype, not a finished commercial-quality release. It replaces the original garden opening in the website launcher. The earlier runtime and save slot remain in source for reference; the new entry point is chapter.js.

## Playable scope

- Guided first carrot: tools, planting, watering, sleeping, harvest, and a traveller's arrival.
- Three equally functional cottage exteriors and freely chosen sites within buildable village land. Plans protect the road, resources, doors, herbs, and reachable paths. Unfinished buildings can move without losing deposited materials.
- Loose wood and stone, visible carrying, cottage/site deposits, and Orin's optional basket that doubles carrying capacity.
- Foundations, frame, and finishing stages. A supplied herb planter and a choice of door trim complete Mara's home.
- Separate walkable cottage and bakery rooms with collision, exits, usable bed, mirror, storage, and kitchen. Decoration works inside and outside; essential work areas remain clear.
- Independent borrowing and deliberately taking owned timber, contextual frame-building boundaries, free restitution, and a distinct record of an unprompted basket return. No instantaneous Trusted friend stage.
- Cooking uses a harvested carrot and Mara's flour, then mixing, shaping, and baking actions. Each step persists across reloads. Three buns enter inventory once; sharing consumes two and is optional. Eating or keeping food does not gate the next quest.
- A nursery discovery provides the next destination. Restoring that nursery is future content, identified as such in the game.
- Touch/pointer tap-to-walk, on-screen movement, keyboard controls and placement, uncluttered placement confirmation, wardrobe, journal, inventory, decoration movement/storage/undo, optional original synthesized music and sound effects.
- Dedicated version-two save key, validation, save after actions/on background, downloadable backup, and backup restoration. Version-one prototype data is not overwritten or silently migrated.

## Release boundaries

Artwork is original procedural pixel drawing, reusing the established character and icon vocabulary. This remains a production-art prototype, not finished sprite-sheet animation or a claim of Stardew Valley/Grimshire parity. Movement has basic directional animation. NPC positions vary with the room and day; full schedules, live errands, construction/move-in choreography, weather, seasons, a shop economy, advanced crafting, occupied-home relocation, additional residents, magical progression, and further chapters remain future work.

Flour is supplied freely by Mara during this chapter. There is no money economy, crop sale, or carrot eating/gifting, so the introductory cooking ingredient cannot be accidentally spent elsewhere. Gatherable supplies exceed the one house's cost. Crops do not deteriorate when absent. Story time advances only at the bed.

The world canvas is not a screen-reader representation. Menus and controls use semantic HTML, but that alone is not full accessibility. Read-aloud and real-device performance/accessibility testing remain open.

## Checks

Twenty Node tests pass: ten retained prototype/hosting regressions and ten Chapter One tests covering farming, house styles/sites and routing, carrying, independent ownership repair, construction and relocation, enterable rooms, cooking transactions and reloads, seed recovery, decoration conservation, and invalid-save rejection. Syntax checks pass for the new runtime modules.

Local HTTP serving works, but the in-app browser could not reach loopback and the bundled local browser could not launch. The owner previously authorised testing through live publication; the website deployment completed successfully. Browser verification and any fixes are recorded below as they are completed. Phone/tablet viewport checks do not establish physical iOS/Android compatibility.


### Live browser verification

Verified through normal UI interactions: new character creation; tool collection; planting, watering, cottage entry, walking to the bed, sleeping, exiting, and harvesting; Mara's introduction and practical needs; three house-style choices and keyboard-adjusted placement; Orin's introduction; borrowing the useful basket; collecting a free wood bundle; delivering it at the building sign; the missing-stone explanation; journal and save/reload continuity. Navigation help reaches a building outside the current view.

Inspected layouts at 320×740 phone portrait, 844×390 phone landscape, 1024×768 tablet, and 1280×900 desktop. The narrow website launcher initially overflowed; a game-specific launcher layout fixed it. At 320 pixels the document's scroll width/height match the viewport and placement remains visible above the edge confirmation tray. The revised runtime produced no captured browser errors during this pass.

The complete house/cooking/ownership-repair paths are exercised by automated rule tests. A complete manual browser playthrough through every construction and cooking step is still required; this pass does not claim it occurred. Native touch hardware, alternate browser engines, fullscreen behaviour, audio output, backup import/download, and child playtesting remain unverified.
