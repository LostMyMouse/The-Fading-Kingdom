# The Fading Kingdom — game design

Status: initial design, 17 October 2026.

This document preserves the direction agreed during concept development. Sections labelled “proposed” are starting points for discussion, not confirmed decisions. The reason the kingdom declined remains open.

## Core concept

A cosy fantasy adventure for children ages 7–11. The player makes a home, farms, decorates freely, and helps revitalise a kingdom. Kindness and manners influence relationships with recurring NPCs; stronger relationships open up skills, shared projects, places, and stories.

The experience should be enjoyable as a farming and decorating game in its own right. Social learning happens through the adventure, rather than a sequence of manners quizzes.

## Agreed direction

| Area | Decision |
| --- | --- |
| Platform | Browser game supporting mobile, tablet, and PC; connected to the existing personal website |
| Audience | Designed for ages 7–11, welcoming across genders and accessible to players of any age |
| Setting | Magical fantasy kingdom; begin on an almost empty plot and build a home village with recurring NPCs |
| Main activities | Farming, decorating, relationships, and restoration |
| Restoration | Gradually revitalise the kingdom through farming and cooperation |
| Decorating and village building | Free placement and meaningful control over the village layout, including buildings, paths, gardens, and shared spaces |
| Social choices | Both dialogue and practical actions affect relationships |
| Ownership | Stealing (taking without asking) is an explicit concept with consequences and repair |
| Consequences | Gentle, understandable, repairable setbacks |
| Relationships | A journal with descriptive stages and clues about NPC feelings |
| Pace | Player-controlled days; no ticking deadline |
| Dialogue | Clear, warm, natural language suitable for ages 7–11 without patronising older players |
| Art | Chunky, simple pixel art; warm, cosy fantasy direction |
| Player | Customisable, age-neutral storybook appearance |
| Clothing | Rustic everyday clothes initially; magical clothing obtained through progress |

Stardew Valley is a reference for the broad farming and village relationship experience. Characters, maps, artwork, interface, and narrative will be original.

## Village-building direction — 17 October 2026

The user emphasised that the world should feel like Stardew Valley and that being able to build the village their own way is important. Treat a coherent, explorable farming-and-village world and meaningful player control of its layout as core design goals. Small decorative patches alone do not fulfil that ambition.

The intended scope of freedom includes buildings, paths, farm and garden areas, and shared village spaces. Restoration and relationships should open construction possibilities while leaving meaningful spatial decisions to the player. The exact building-placement, relocation, ownership, terrain-editing, and village-growth rules still need discussion; these are not implemented features or permission to start a new build pass.

The current prototype is an initial systems demonstration. Its procedural artwork and limited decorating zones are not the final world target. Existing character, map, and artwork originality requirements remain in place.

The opening and construction decisions below now define the first chapter's design direction. The chapter script makes that direction reviewable; it does not itself implement or deploy a new version.

## Agreed opening and construction direction — 17 October 2026

Start with an almost empty plot, a small cottage, overgrown ground, and basic tools. The player grows their first crops, meets a travelling baker, listens to what they need, and helps create their home. Building the house begins an ongoing relationship; it does not purchase friendship. The resident contributes skills and help to village life in return.

Opening sequence: settle in → grow first crops → meet the baker → understand their needs → choose a house style and agree on a location → gather materials → build together → welcome them into the village.

Place a complete building footprint and supply materials; construction visibly proceeds through a few stages, including foundations and the finished home. The player chooses placement and decorates inside and outside afterwards. The initial house can offer three equally valid exterior styles. Practical needs such as a kitchen and herb space leave creative choices open. Residents do not judge the child for choosing an unfavoured colour or decoration.

Begin material gathering with fallen branches and loose stones. Farming, crafting, and friendships open further materials. Visually distinguish freely gatherable resources from owned supplies: a fallen branch can be collected, while a carpenter's stacked timber requires permission. The exact resource economy, gathering tools, costs, construction timing, and baker's identity remain to be designed.

These decisions describe the next design direction. The live prototype still uses the earlier village-garden opening; this document does not claim the new opening has been implemented.

Cooking is the baker's first gameplay unlock. After moving in, they teach a vegetable-bun recipe using the player's carrots and their flour. Food can support future shared village projects. Cooking should be a usable activity, and neither the home nor friendship is bought through food gifts.

See [Chapter One: Room for One More](chapter-one.md) for the proposed quest sequence, dialogue branches, construction stages, ownership consequences, and recovery rules. The chapter marks unconfirmed names, quantities, and the proposed second project explicitly.

## Enterable buildings and playable interiors — agreed requirement

The full game must include playable building interiors alongside the outdoor village. The player walks to a door, enters, moves around inside, interacts with furnishings and people, and leaves through a clear exit. Homes and shared buildings must be usable spaces rather than exterior markers that only open dialogue.

- The player's cottage has a walkable interior with a bed, storage, mirror, and freely placed furnishings.
- Residents' homes, including the baker's, have explorable interiors. NPCs use those rooms as part of their routines.
- Cooking happens at the baker's kitchen inside the house: the player enters, approaches the preparation area, and performs the activity. Dialogue supports these actions.
- Shared buildings introduced through restoration need interiors appropriate to their activity. Their contents and layout should give the player a reason to visit.
- Interior decoration and rearrangement must preserve reachable doors, essential furniture, workstations, and NPC interactions. Ownership and permission apply inside buildings too.
- Entry, exit, movement, and interaction must work with touch and keyboard. Save the current room and a valid player position; provide safe recovery if a layout changes.

Separate room scenes with a brief transition are acceptable; seamless indoor/outdoor rendering is not required. Exact room sizes, camera behaviour, and the set of shared buildings remain to be designed. This is a full-game requirement, not a claim about the current prototype.

## Dialogue and writing standard

**Write so a seven-year-old can follow the conversation and an adult can enjoy it.** Ages 7–11 guide comprehension and interaction design; the game is accessible to any age. Avoid talking down to the player.

- Use natural, concise speech, familiar words, and short dialogue turns. Introduce unfamiliar fantasy or craft terms through context. Clarity does not require baby talk.
- Give each NPC an individual voice, interests, humour, and boundaries. They are people in the story, not constant teachers praising or correcting the player.
- Prefer specific, believable responses over generic praise, moral speeches, or exaggerated enthusiasm. Avoid labels such as “naughty,” “bad child,” or “good little helper.”
- Explain a consequence through the character's situation: what happened, why it matters, and what the player can do next. Keep the response proportionate and respectful.
- Allow ordinary disagreement, mistakes, respectful refusal, and a little understated humour. Adults and children can both misunderstand or apologise.
- Use meaningful, readable response options that communicate the intended action. Do not make educational progress depend on guessing one exact polite phrase.
- Keep essential quest instructions concrete. Longer optional conversations can add personality and depth without obscuring the next action.
- Review the dialogue in the context of each scene, including mistakes and repair. Readability scores alone cannot establish whether it is understandable, enjoyable, or patronising; validate with players across the intended age range.

Example ownership response: “Those boards are mine. Please ask before taking them. Bring them back and we can get started.”

Example welcome: “I could see myself living here. Somewhere for an oven, a few herbs by the door… What do you think?”

## Design pillars

1. **Build your village your way.** Village building is a core pillar. Growing, placing, and arranging the village visibly change the world; the player makes meaningful layout choices.
2. **Relationships open possibilities.** NPCs become collaborators with interests, needs, skills, and boundaries.
3. **Mistakes can be repaired.** Feedback explains the consequence and offers a practical way forward.
4. **Explore at your own pace.** The player has direction without a clock demanding efficiency.

## Website integration and supported devices

The game will connect to [James's existing website](https://james-lost-his-mouse.vercel.app/). Inspection on 17 October 2026 confirmed a JamesCube games collection, individual project pages, and “Play the prototype” links for Volt and The Lamplighter. Those links use `/play.html?game=volt` and `/play.html?game=the-lamplighter`.

The first prototype is integrated into the website's games collection and playable at `/play?game=the-fading-kingdom`. Its static runtime is hosted in `games/the-fading-kingdom/` within `LostMyMouse/james-lost-his-mouse`; the separate game repository holds its source and design documents. See [implementation notes](implementation.md) for the current prototype and verification limits. The revised village-building chapter is not yet implemented.

Mobile, tablet, and PC support are required from the first playable build. Proposed controls:

- PC: keyboard movement, mouse selection, and a keyboard interaction alternative.
- Touch: an on-screen movement control and large contextual action buttons; no required hover or right-click actions.
- Decorating: tap to select, preview, then explicitly place; touch buttons for supported rotation, move, store, and undo. A touch gesture must not accidentally activate a tool or take an owned object.
- Responsive menus: adapt text, inventory, journal, and dialogue to small screens; respect safe areas and keep controls away from browser edges.
- Landscape can provide the preferred gameplay view, but portrait must remain usable without requiring orientation lock or fullscreen.

Proposed touch targets are at least 44 CSS pixels, with spacing checked on real devices. Keep world pixels crisp while scaling interface text independently. Handle resizing, rotation, app switching, and interrupted touch input without lost progress or stuck movement. Test iOS Safari, Android Chrome, and mainstream desktop browsers before claiming device support. Use a lightweight 2D rendering approach; engine choice and minimum device support remain open until a performance trial.

## Everyday play

The repeating loop is: tend crops → collect resources → talk and collaborate → craft or restore → decorate → discover new possibilities.

An example day might include harvesting carrots, asking to borrow a tool, planting flowers for a shared garden, returning the tool, and placing a new bench. The player chooses when to sleep. The next day brings crop growth and relevant changes to the village.

Proposed supporting rules:

- Conversations and decorating never consume timed opportunities.
- Crops and friendships do not deteriorate while the game is closed.
- No energy meter in the first playable version.
- A journal suggests a useful next step without forcing a single activity order.
- Progress saves at meaningful actions and before ending a day.

Exact time-of-day transitions, weather, seasons, crop variety, and economy remain open. An overnight wait means advancing an in-game day, never waiting for real-world hours.

## Farming

Farming supplies food, flowers, and materials for crafting and restoration. Ordinary crops ground the early game; magical plants expand what is possible as the kingdom recovers.

Proposed starting interaction: prepare soil, plant, water, advance the day, harvest. Growth and readiness should be visually clear. The first successful harvest should arrive quickly enough to teach the complete loop.

Crop schedules, watering rules, buying and selling, and long-term farming depth need playtesting. Missed watering should delay growth rather than destroy a child's crop in the first prototype.

## Decorating and restoration

Free placement applies to the home and farm, then designated village spaces unlocked through restoration. Paths, plants, furniture, and decorative objects allow meaningful individual layouts.

Proposed usability rules:

- Grid snapping with an obvious placement preview.
- Rotation for objects whose artwork supports it.
- Move placed items without a fee; return them to storage without destroying them.
- Undo the most recent placement or movement.
- Protect exits, entrances, water, and required walking routes.
- Do not allow essential NPC interactions to become unreachable.

Restoration projects supply a goal and unlock a usable space. They do not dictate its complete layout. Villagers can request functions, such as somewhere to sit, while the player decides where the bench and flowers go.

Restored places should change play: open an activity, enable a skill, provide crops, host encounters, or introduce a new route. Decorative improvement alone is not enough for every major project.

## Relationships and manners

Relationships reflect repeated interactions, not one correct phrase. Thoughtful dialogue and follow-through both matter. A polite promise followed by neglect should not have the same result as keeping that promise.

Initial behaviour themes:

| Theme | Dialogue example | Action example |
| --- | --- | --- |
| Respectful requests | Ask to borrow something and accept the answer | Wait for permission before taking it |
| Listening | Let someone explain what they need | Help with the need they actually described |
| Sharing and turns | Agree on a fair turn | Leave shared supplies for someone else |
| Dependability | Make an achievable promise | Return a borrowed item |
| Repair | Acknowledge what happened | Return, replace, or help fix the affected thing |
| Boundaries | Decline a request respectfully | Respect another character's refusal |

Do not require exact wording, eye contact, or unquestioning agreement as evidence of kindness. A player can be brief, shy, or assertive and still act respectfully. NPCs should model these behaviours too, including making and repairing their own mistakes.

### Consequences

Consequences must relate to the affected interaction. Taking supplies without permission might pause access to those supplies. It should not spoil unrelated crops or make the controls difficult.

One small mistake causes a small response. Repeating a polite line does not generate unlimited relationship progress. No global visible “good child” score. Cooperation is part of friendship, not a currency purchased with compliments.

Core play remains available during a disagreement. Essential progression must have an accessible repair route; optional friendships may provide additional opportunities without requiring every NPC to become a best friend.

### Relationship journal

Use descriptive stages, provisionally: “Getting to know you,” “Growing friendship,” and “Trusted friend.” These names are proposals.

An entry should explain useful context: what the player learned, something the NPC appreciates, and an unresolved situation. Example: “The gardener is waiting for the watering can. You can bring it back and talk with them.” Avoid presenting private feelings as an unexplained numerical judgement.

### Stealing and ownership

Stealing means intentionally taking someone else's belongings without permission. Teach the distinction between owned goods, things offered for sharing, and freely gatherable resources. A relationship does not automatically grant permission to take a friend's possessions.

Make ownership clear before the decision: “These are Rowan's seeds” with choices such as “Ask for some,” “Leave them,” and an explicit “Take without asking.” Names here are illustrative. Walking near an item or mis-tapping must not count as stealing. Borrowing with permission and forgetting to return something is a separate situation, even though both can affect trust.

Consequences should be concrete and proportionate: the owner loses supplies they need, pauses lending, or delays an optional invitation. The NPC explains the connection: “I needed those seeds for the garden. Please return them before we plant together.” Do not shame or label the player as a bad person. Repeated taking can keep the same relevant boundary in place; it does not trigger endless stacked penalties or unrelated village-wide rejection.

Repair requires returning the item or replacing what was used, acknowledging the harm, and rebuilding trust through follow-through. An apology alone does not retain the stolen reward and instantly restore benefits. Returning an item can resolve the immediate dispute; deeper trust can take subsequent dependable actions. Provide a free, reachable replacement path if an item was consumed. Essential farming and repair remain available.

For the first prototype, use one explicit owned seed packet alongside the borrowing story. Taking it creates an immediate, explained story consequence; there is no detection, sneaking, or evasion minigame. Track the packet so it cannot be sold, gifted, crafted, or farmed for profit while the dispute is unresolved. Further copies cannot be generated by repeating the encounter. These containment rules are a proposed implementation for this small test, not a full kingdom crime simulation.

## Player and wardrobe

Age-neutral storybook proportions: slightly oversized head, compact body, expressive face, and readable silhouette. Customisation includes skin tone, hairstyle and colour, and clothes. All styles are available regardless of gender.

The initial wardrobe is rustic and everyday: shirts, dungarees, patched trousers, skirts, and practical boots. Later clothing can include magical embroidery, glowing threads, leaf details, and restrained effects.

Proposed: appearance can be changed at a cottage mirror; new clothing comes from crafting, exploration, restoration, and friendship stories. Clothing remains cosmetic in the first prototype. Counts of customisation options are not yet fixed.

## Visual direction and interface

See [the approved visual concept](art/approved-visual-direction.png). This is AI-generated reference artwork approved during concept development. It is not a tested gameplay screen or a source of automatically usable tiles and animation frames.

Use chunky pixels, simple shapes, warm colours, clear paths, and restrained magical accents. Keep character silhouettes and interactive objects readable against the environment. Establish a consistent tile size and native rendering resolution before making production assets.

Production needs separate terrain tiles, object sprites, character animation layers, portraits where useful, and interface elements. Validate tile seams, consistent scale, sprite alignment, walking directions, and animation continuity in the actual game.

Interface priorities: readable text, large interaction targets, plain prompts, visible tool selection, and forgiving placement. Do not rely on colour alone for important states. Keyboard/touch support, text narration, and specific accessibility features remain to be scoped.

## Engagement and progression

Build anticipation through new crops, relationship stories, creative options, and visible restoration. Offer small satisfying accomplishments within a session and larger projects across several sessions.

Avoid login streaks, offline deterioration, or time-limited rewards that punish absence. Optional challenges can add depth for older players without making the core experience hurried.

## Open decisions

- Exact touch layout, keyboard bindings, supported browser versions, and minimum device performance.
- Names, personalities, and stories for the initial NPCs.
- Why the kingdom declined and the wider restoration story.
- Economy, crafting recipes, crop schedules, and long-term progression.
- Exact map size, camera behaviour, tile resolution, and animation budget.
- Audio direction, reading support, and accessibility scope.
- Local saves versus accounts and cross-device saves.
- Whether the current Canvas 2D prototype should be extended or revised for the larger village-building scope; static website integration already exists.

## How we will judge the concept

Playtest with children across the age range. Observe whether they can understand a social consequence, find a repair action, complete the farming loop, and decorate without getting stuck. Ask what they enjoyed and what they believe happened; do not assume a correct dialogue selection proves learning or that enthusiasm alone proves long-term engagement.
