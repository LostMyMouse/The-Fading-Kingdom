# First playable implementation

17 October 2026. Early prototype, not a finished game or validated educational intervention.

## Delivered systems

- Static HTML/CSS/ES modules; Canvas 2D world with original procedural pixel tiles and character drawings. No runtime dependencies, external requests, account system, or build step.
- Character skin, hair colour, three hairstyle silhouettes, rustic clothing colours, and a later cosmetic cape. Clothing colours are not yet separate top/bottom/shoe systems.
- Twelve prepared plots; carrots, daisies, and moonflowers; watering, overnight growth, harvesting, and low-supply starter seeds.
- Rowan's borrowing, late return, and stealing situations, with separate states and repair actions. The seed packet is tracked as a story object, never a usable stolen inventory reward.
- Orin's cooperation and Pip's turn-taking encounters. These are short introductory interactions rather than full friendship story arcs.
- Resource- and relationship-gated garden restoration, a changed garden scene, and usable magical seeds after opening the greenhouse.
- Free placement in the cottage's outdoor garden and shared village garden, with previews, confirmation, rotation, move, storage, and single-change undo. Furniture is visual in this prototype; NPC schedules, furniture use, interiors, and collision with furniture are not yet implemented.
- Responsive menus, tap-to-walk with pathfinding, touch direction buttons, keyboard/mouse input, interruption handling, and local save validation. The canvas is not a screen-reader-accessible world; semantic menus do not constitute full accessibility support.

## Website integration

The website's root AGENTS.md requires static files, relative asset paths, slug-prefixed storage, no browser alert/prompt/confirm, and `content/projects.json` as the only registry. This build follows those requirements. No website framework, CMS fields, existing game files, or homepage structure need changes.

Add the five runtime files to `games/the-fading-kingdom/`. Registry slug: `the-fading-kingdom`; path: `games/the-fading-kingdom/index.html`; status: `prototype`. The existing `play.html?game=the-fading-kingdom` launcher will load it. The approved generated concept illustration is a cover image, not a screenshot of the implemented prototype.

The game repository is the source of truth. The website contains a matching static snapshot. Update both runtime copies together until an automated release process is introduced. The game source package.json only provides development shortcuts; the website gains no package file or build step.

## Verification

Ten Node tests cover crop timing, two-night magical crops, independent repair in either order and across reload, reward deduplication, complete restoration/unlock, protected placement, landmark reachability, invalid-save rejection, seed recovery, and relative asset resolution for clean URLs. JavaScript syntax checks pass.

The local preview could not be reached through the browser in this session. After the owner authorised production publication, testing continued on the live website. A Vercel clean-URL issue found there was corrected by anchoring relative asset URLs to the game directory, with an added regression test.

Verified in the desktop browser: character creation, tap/click-to-walk, keyboard interaction, planting, watering, sleeping, harvesting three daisies, borrowing, deliberate stealing confirmation, the explained consequence, journal repair guidance, separate return of the seeds and can, cooperation with Orin, garden restoration, greenhouse seed/cape unlock, rotated bench placement, and save/reload retaining progression. Phone-sized standalone and embedded website layouts were inspected at 390 × 844, phone landscape at 844 × 390, and the journal at a 1024 × 768 tablet-sized viewport. The narrow-layout on-screen movement and action controls were exercised with browser pointer input. Layout testing found and corrected overlapping context controls, icon-only journal labelling, and focus following dialogue changes.

Actual touch hardware, save restrictions in private browsing, and performance across iOS/Android and different desktop engines remain unverified. Viewport emulation and automated rules testing are not physical-device validation.

## Next acceptance pass

1. In desktop Chrome/Safari/Edge/Firefox as available, complete the first story, reload, and continue.
2. On iOS Safari and Android Chrome, repeat movement, all farming actions, dialogue, decorating, saving, rotation, and background/resume in both orientations.
3. Test portrait phone, landscape phone, tablet, and desktop layouts. Check touch targets, safe areas, readable text, and modal scrolling.
4. Playtest borrowing and stealing repair with children across the target age range; observe comprehension without assuming a correct choice proves learning.
5. Replace/extend prototype art from the approved direction and add NPC garden gathering, fuller character animation, and richer farming variety.
