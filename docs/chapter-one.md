# Chapter One: Room for One More

Story and quest draft · 17 October 2026 · Not implemented

This replaces the village-garden opening as the intended next version. The live prototype remains unchanged. The agreed foundations are an almost empty plot, player-designed village building, staged construction, a first baker resident, and cooking as their first unlock. Names, quantities, dialogue, and pacing below are authored proposals for review and playtesting.

## The chapter in one sentence

Turn a quiet patch of land into the beginning of a village by growing something, welcoming a traveller, building their home together, and cooking your first meal.

## Cast and place

**The player:** an age-neutral newcomer with a modest cottage, a few tools, and room to build. They choose their appearance and the village layout. No title, gender, or personality is imposed through dialogue.

**Mara, the baker — working name:** practical, warm, and a little uncertain about settling somewhere new. She has travelled with her oven equipment, flour, and sourdough starter. She likes making useful things and notices small details. Her humour is understated. She offers knowledge and materials of her own; she is not a passive person waiting to be rescued.

**Orin, the travelling carpenter:** temporarily camped beside the public road with a work cart. Direct, patient, and quietly amused by grand plans. He can help turn gathered wood into a sound building. His own supplies belong to him. He is a visitor at this stage, not a resident in a prebuilt village house.

**Starting area:** one cottage, a small area suitable for crops, free building land, a road, a water source, fallen wood, loose stones, and a few signs of older settlement. Mara and Orin visit from the road. There is no finished village square or row of occupied homes. The reason the wider kingdom declined stays open.

## Writing and presentation rules

- Dialogue cards normally contain one or two short sentences, one thought at a time. Longer scenes advance through several cards.
- Show at most three responses at once. Several respectful phrasings can work; “please” is not a password.
- Essential instructions appear separately as short journal objectives with an optional destination marker. Repeat them whenever needed.
- Keep farming and building feedback visible in the world. Do not explain an action in a paragraph and pretend the player performed it.
- No timed replies, reading deadlines, forced day endings, or automatic friendship loss through absence. Read-aloud is an intended accessibility feature to scope, not something this draft claims exists.
- Players may decline optional tasks without a relationship penalty. No NPC comments negatively on a player's colours or aesthetic choices.
- Branches below are a script specification. Internal IDs and state notes never appear in player-facing text.

## Quest overview

| ID | Quest | Player activity | Completion / new possibility |
| --- | --- | --- | --- |
| Q01 | A Little Ground | Plant, water, sleep, and harvest | First complete farming cycle; Mara visits |
| Q02 | Room for One More | Meet Mara and hear what she needs | House planning unlocked |
| Q03 | A Place to Call Home | Choose a style and position the footprint | Agreed building site with room for herbs and access |
| Q04 | Gather and Lend a Hand | Gather loose materials; meet Orin; optionally borrow a carry basket | Materials ready; cooperation and ownership encounters |
| Q05 | From the Ground Up | Deliver materials and help through three visible stages | Finished house and usable kitchen |
| Q06 | Something in the Oven | Learn a recipe and cook with a harvested carrot | Cooking unlocked; first food produced |
| Q07 | A Village Begins | Finish the welcome and choose a next interest | Nursery project and continuing friendship possibilities introduced |

Q01 gives one instruction at a time. Q04 gathering can start before accepting the house project; collected materials still count. The player can farm, explore, and decorate between quests. No fixed calendar day is required for a visit or move-in.

## Q01 — A Little Ground

**Start:** the player appears outside their cottage. No NPC delivers an opening lecture. The cottage contains a bed, storage, and a mirror; the tool basket outside supplies the basic farming kit.

Show only this first objective:

> Pick up your gardening tools by the cottage door.

After collecting the kit, show the seed icon and highlight one valid patch:

> Choose carrot seeds. Plant one in the marked patch.

After planting:

> Give your carrot some water.

After watering:

> It will grow while you sleep. Your bed is inside the cottage.

The journal can offer “Show me” for the current step. The child is free to dismiss it. Other tools become available progressively rather than six unexplained icons arriving together.

**Draft starting resources:** a basic watering can, soil-preparing tool, six carrot seeds, and a small decoration selection. One watered night produces a carrot for this introductory crop. More than one carrot may be planted, but a single successful crop is enough to continue.

Sleeping shows a brief growth transition. Missing watering delays growth and never kills the plant. Returning after a real-world absence does not advance the clock.

On harvest, the crop moves visibly into the basket; the player stands beside the plot so the character does not cover the result. Keep the carrot until cooking is introduced. No sale, eating, or gift mechanic silently consumes this first required ingredient.

**Arrival event:** Mara walks along the road after the first harvest and stops where the player can see her. If the player is busy, she waits near her cart. The event and journal remain available; she does not leave because the child takes too long.

Journal:

> Someone has stopped by the road. Say hello when you're ready.

## Q02 — Room for One More

### M01 — First meeting

**Mara:** “Hello. Is this your place? I followed the road until it ran out.”

| Player response | Mara's response | Result |
| --- | --- | --- |
| “I've just moved in. I'm still finding my way around.” | “Then we're both new. I'm Mara. I bake, mostly. At the moment, I travel.” | Continue to M02 |
| “Are you looking for somewhere to stay?” | “Somewhere to stay, and somewhere to put an oven. I'm Mara.” | Continue to M02 |
| “I'm in the middle of something. Can we talk later?” | “Of course. I'll be by the cart.” | Pause; no penalty; repeat invitation remains |

### M02 — An invitation

**Mara:** “I'd like to settle somewhere. There seems to be room here, if you'd like a neighbour.”

Player options:

- “What would you need?” → M03.
- “I'd like that. Let's have a look.” → M03; asking the exact first phrase is not required.
- “I'd like to think about it.” → Mara: “Take your time. It's a big decision.” Pause with a clear return objective.

### M03 — Listening to practical needs

**Mara:** “A kitchen for my oven, and a little space for herbs. That's most of it.”

**Mara:** “You choose the style. I'm much better with bread than roof colours.”

Player options:

- “Let's find a place.” → Open the planning view.
- “Could you show me what you mean?” → Show a simple picture of an oven space and an outdoor herb planter, then offer planning again.
- “Not just yet.” → Resume later without losing the invitation.

Journal:

> Plan Mara's home. Leave room for a kitchen, herbs, and a clear way to the road.

## Q03 — A Place to Call Home

Choose from three equally valid exterior designs: **Meadow Cottage**, **Timber Cottage**, and **Stone Cottage**. These are working labels, not different power levels. Use the same introductory material cost and interior function so a favourite style does not become the wrong choice.

The player moves a whole building footprint freely across valid village land. They can also mark a short path and place the herb space. Keep the game world clear during placement: use a small edge tray for Place, Rotate when supported, and Cancel. Do not open a central confirmation dialog over the preview.

Proposed introductory footprint: five by four ground tiles, plus a clear entrance and at least one adjacent herb-planting space. The exact art scale and footprint need a visual trial. Do not impose a fixed distance from the player's cottage or require one preset location. Protect water, the public road, exits, and reachable entrances. Validate an actual walkable route, not a particular path design.

### M04 — Discuss the proposed site

When the player selects a valid site, Mara walks to its entrance:

**Mara:** “I can picture it. The oven inside, herbs just out here.”

Player options:

- “Shall we build here?” → Mara: “Yes. Let's make a start.” Agree the site.
- “I'd like to try somewhere else.” → Mara: “All right. I'll come with you.” Return to placement without consuming resources.

If the entrance is blocked, give factual feedback:

**Mara:** “We'd have trouble reaching the door here. Could we turn it, or leave a little more room?”

This is a solvable placement problem, not a drop in friendship. If the player later wants to move an occupied home, discuss that with the resident and offer a practical way to agree a new site. This chapter does not introduce penalties for rearranging an unoccupied blueprint.

Journal:

> Gather 8 wood and 6 stone for Mara's home. Orin's cart is by the road.

## Q04 — Gather and Lend a Hand

**Draft cost:** eight wood bundles and six stone. Orin prepares the gathered wood as part of helping; do not add an unexplained crafting tier to the first project. Mara brings her own oven equipment and finishing supplies.

Guarantee at least twelve gatherable wood bundles and ten loose stones within the reachable starting area. Clearly mark them as free resources. They must not share the exact appearance or interaction label of owned stacks. No tree cutting, mining, money, or real-time respawn is necessary for the opening project.

Materials gathered before accepting the quest count. Building materials are reserved explicitly when deposited, not removed because the player previews a location. Declining to help an NPC does not remove the ability to gather free resources.

### O01 — Meet the carpenter

**Orin:** “Mara says you're planning a house. I've built a few. Most of them are still standing.”

**Orin:** “You find the wood and stone. I'll help with the frame. Mara's bringing the kitchen.”

Options:

- “Could you show me what to collect?” → Orin points out one fallen wood bundle and one loose stone; journal marker becomes available.
- “I'll get started.” → Begin gathering.
- “I'll come back later.” → Orin: “I'll be at the cart.” No penalty.

### O02 — A useful borrowing choice

Orin has a large carry basket. The player's own carry bag always works. The large basket lets them carry two nearby wood bundles per collection trip instead of one, with a short visible carry-and-deliver action. Exact carrying limits should be tuned for convenience, not a long walking grind.

The basket has its own visible equipment icon and appearance while held. This makes borrowing change play instead of adding an invisible obligation.

**Orin:** “That basket would make carrying the wood easier. You can borrow it. Bring it back before we start the frame; I'll need it for my tools.”

Options:

- “Could I borrow it, please?” → Permission granted; show the basket icon and return reminder.
- “I'll use my own bag, thanks.” → Orin: “That'll do the job too.” Same building opportunity; no penalty.
- “I'm taking the basket.” → Orin: “Ask me first. I need to know where my tools are.” No item taken by this dialogue alone; offer a chance to ask or leave.

If Orin has not offered yet, “Can I borrow your basket?” is equally valid. Short, ordinary requests work.

Journal while borrowed:

> Return Orin's basket before building the frame.

### O03 — Clear ownership and taking without asking

An optional timber stack by Orin's cart is labelled **Orin's wood — set aside for another job**. It is visually distinct from fallen wood. The default interaction opens choices; touching or walking beside it never takes it.

Options:

- “Ask Orin about the wood.” → Orin: “That stack's for another job. There's fallen wood by the path you can use.” Offer a marker; no reward or penalty for asking.
- “Leave it here.” → Close and continue playing.
- “Take the bundle without asking.” → A short confirmation: “This wood belongs to Orin. Take it anyway?” Choices: **Leave it** / **Take it**.

If taken, show an identifiable returnable bundle in the carried-items list. In this first encounter it cannot be sold, crafted, or deposited into the house; the ownership marker stays attached. This keeps the repair route simple and prevents a reward exploit. More complex consumed-item stories belong in later chapters.

**Orin:** “I set that wood aside for another job. Please bring it back before we build together.”

**Consequence:** Orin pauses his own contribution to the frame until the wood is returned. Gathering, farming, house planning, other conversations, and unrelated decoration remain available. He continues to speak to the player normally.

Repair responses at Orin or the stack:

- “I took your wood. I'll put it back.”
- “Here it is. I should have asked.”

Both return the complete bundle and resolve the immediate boundary.

**Orin:** “Thanks for bringing it back. The fallen wood is yours to use. We can work with that.”

Returning it does not also return a separately borrowed basket. An apology without returning it does not clear the material boundary. No permanent label, village-wide rejection, fine, or inaccessible replacement resource is introduced.

### O04 — Return and follow-through

Before frame assembly, offer an explicit **Return the basket** action if it is held.

Timely return:

**Orin:** “Right where I need it. Thanks for remembering.”

If the player tries to start the frame first:

**Orin:** “I need the basket back for my tools. Bring it over, then we can lift the frame.”

Player options: **Bring the basket back** / **I'll do that in a moment**. The first is an actual carry-and-return action with visible handover, not a silent inventory change. The second leaves the return objective active without stacking punishment.

If the player acknowledges forgetting:

**Player:** “I forgot. Here it is.”

**Orin:** “Thanks. Let's get the tools out.”

Keeping the promise supplies a distinct dependable interaction in the journal. Forgetting and repairing resolve the task but do not retroactively record an on-time return. One incident does not decide the whole friendship.

The agreement is tied to the next shared activity, not an undisclosed overnight deadline. Sleeping or taking a break alone does not make the player rude.

## Q05 — From the Ground Up

The agreed site shows its full plan and the complete material requirements before anything is spent. Players can change the unoccupied plan's location and style without a fee; committed materials move with it.

| Stage | Player's visible contribution | NPC contribution | World change |
| --- | --- | --- | --- |
| Foundations | Carry and deposit 6 stone at the marked site | Orin checks and sets the base | A foundation footprint replaces the marker |
| Frame | Deposit 8 wood; return belongings if needed; join the lift | Orin assembles while Mara holds and passes pieces | A recognisable frame appears |
| Finish | Help position the herb planter and choose the door/trim variant | Mara installs her kitchen; Orin completes the shell | A finished, enterable home replaces the frame |

The herb planter is supplied with the project. Any valid position with access works. Door and trim choices have equal value and can be changed later. Decorating beyond these practical needs is optional; a sparse or unconventional layout does not fail the home.

Construction uses brief, visible cooperative animations. The player can skip or reduce animation without losing progress. No real-world countdown, rapid-click challenge, or forced overnight wait is required. The child can stop between stages; the materials and appearance persist on reload.

### M05 — Working together

At the foundations:

**Mara:** “There's the first corner. It feels more real now.”

At the frame, once Orin is ready:

**Orin:** “I'll take this end. Mara, could you hold that post? You can help us lift.”

After the frame stands:

**Mara:** “I was only passing through this morning. Now I'm choosing a front door.”

### M06 — Moving in

Mara carries her things inside. Her cart visibly empties. She puts the herb seeds by the planter and opens the door again.

**Mara:** “There. A home, a kitchen, and a neighbour who helped me get here.”

**Mara:** “Would you like to make the first batch with me?”

Options:

- “I'd like that.” → Q06.
- “What are we making?” → Mara: “Vegetable buns. Have you still got a carrot from your garden?” Then offer Q06.
- “Another time, if that's all right.” → Mara: “Of course. The kitchen will be here.” Unlock the kitchen and leave the invitation available.

The house is occupied and functional before the cooking invitation is accepted. Friendship is **Getting to know you** or **Growing friendship**, according to the distinct encounters so far. Building a home does not instantly set **Trusted friend**.

Journal:

> Mara has moved in. Visit her kitchen when you'd like to cook together.

## Q06 — Something in the Oven

**First recipe, proposed:** one harvested carrot + one portion of Mara's flour → three vegetable buns. This is an in-game crafting recipe, not real cooking instructions. Mara contributes the flour for the introduction, recipe knowledge, equipment, and her time.

The first required carrot is protected until this scene. If a later implementation allows it to be spent, keep a free seed-and-grow recovery path and explain that route. Never charge currency or create a rare-resource repair requirement here.

### M07 — Begin cooking

**Mara:** “I'll bring the flour. You bring the carrot. Between us, that's a start.”

If no carrot is available:

**Mara:** “We'll need a carrot first. I can keep the flour here until you're ready.”

Journal switches to a concrete grow/harvest objective, then returns to the kitchen invitation. No friendship penalty and no loss of Mara's ingredient.

At the kitchen, show the two ingredients with their names and counts. The player confirms the recipe, brings the carrot to the preparation surface, and joins a short mixing/shaping action. Mara operates the oven as part of the scene. Actions are simple taps or key presses; there is no precision timer, long hold, speed test, or failure from reading slowly.

**Mara:** “I'll show you this one. Then the next is yours.”

Show her demonstration briefly, with Skip available. The player shapes the next bun. This models turn-taking without adding another compulsory moral quiz to the first chapter.

If the player changes their mind before confirming, return all ingredients. Once the batch begins, reserve the ingredients and persist the batch state. Reloading resumes or completes that batch once; it must not consume twice or produce extra rewards.

### M08 — First batch

Three buns appear on the tray and enter the player's basket.

**Mara:** “A batch from our first harvest. That's worth sitting down for.”

Options:

- “Shall we share them?” → Optional shared-meal scene. Show each portion taken and save the remaining quantity accurately.
- “I'd like to keep these for later.” → Mara: “Of course. You made them too.” No friendship penalty; continue to the chapter ending.
- “Can I make another batch sometime?” → Mara: “Any time you've got the ingredients. I'll leave the recipe by the oven.” Continue.

Do not award a “good child” badge for sharing or withhold the cooking unlock from a player who keeps the buns. The recipe and kitchen are unlocked after cooking, regardless of this optional social response.

## Q07 — A Village Begins

Mara begins an ordinary routine between her home, herb space, and kitchen. She greets the player when they return. Orin tidies his cart. Give the player a chance to see people using the space they built instead of immediately covering it with a long speech.

### M09 — A next possibility

**Mara:** “There used to be a nursery along the old path. Somewhere to grow young plants.”

**Mara:** “I'd like to see it open again. We could grow more than carrots.”

Options:

- “Let's have a look.” → Add **A Place for New Growth**, the next restoration project, with a route to its site.
- “I want to work on the village first.” → Mara: “I'll be here when you're ready.” The next-project note remains available; no loss or deadline.

The nursery is a proposed Chapter Two direction, not an already agreed second resident or implemented feature. It connects farming, cooked supplies, and another kingdom restoration. Food can supply a planned workday without becoming a bribe that purchases friendship. Do not make accepting this next quest depend on sharing the first batch of buns: a player who keeps or eats them can cook another batch, and free ingredient recovery remains available.

Chapter completion message:

> Mara has moved in. You can cook together, keep building, or explore the old path.

After this card, return control. Keep distinct next options in the journal: **Grow something**, **Make the village yours**, and **Visit the old nursery**. Avoid ending on a completed quest that still asks the player to restore a finished place.

## State and recovery requirements

| Situation | Required response |
| --- | --- |
| Player declines a visit, house project, or cooking invitation | Leave it available without friendship decay or a real-time deadline |
| Player gathers before accepting a quest | Count those resources; do not force repeat gathering |
| Chosen site is invalid | Explain the access/space issue; consume nothing; offer movement or supported rotation |
| Player moves an unfinished building | Move the plan, current stage, and reserved materials together |
| Player borrows the basket and takes timber | Track both separately; returning one never clears the other |
| Player refuses restitution for now | Pause Orin's relevant contribution; allow farming, gathering, designing, and later repair |
| Player reloads during construction or cooking | Resume one consistent stage/batch; no duplicate materials, rewards, or ingredient costs |
| Player changes phone orientation or closes the page | Preserve plan, stages, ownership, inventory, relationships, and tutorial progress |
| Player finishes the home before an ownership incident | Use current-stage dialogue; do not claim an already built home cannot be built. Pause a relevant new loan or personal favour rather than undoing the home |
| Player asks politely after an earlier refusal | Respond to the current request and boundary; do not permanently classify the player by the earlier wording |
| Player decorates in an unexpected style | Accept practical requirements without aesthetic criticism |

## Acceptance checks for the next implementation

1. A new player can complete the first farming cycle with one instruction visible at a time and repeatable help.
2. At least two substantially different house positions and three exterior styles can complete the same quest.
3. The occupied house, clear route, herb space, and kitchen remain reachable in every accepted layout.
4. The basket has a visible, useful effect; using the player's own bag is a viable alternative.
5. Both considerate and inconsiderate routes can reach the completed home through understandable actions. No exact polite phrase is required.
6. Owned bundles and free resources are recognisable before the player acts; accidental taps never count as stealing.
7. Foundations, frame, finishing, move-in, and cooking occur visibly in the world, with save continuity at each stage.
8. Mara and Orin contribute; neither friendship jumps directly to Trusted friend from one quest.
9. First-batch sharing is optional. Keeping it never locks cooking, friendship, or the next quest.
10. Crop growth, food, construction costs, replacement supplies, and rewards cannot duplicate or become negative through reloading or repeat interaction.
11. Phone portrait/landscape, tablet, and PC layouts retain readable instructions, reachable controls, and unobscured placement previews.
12. Children across the target age range can explain what a boundary or repair meant in their own words. Record that during playtesting; do not claim it has already been demonstrated.

## Decisions to tune rather than block this draft

Mara's final name and visual design; exact building footprint; construction animation length; resource counts and walking distances; final recipe yield and later flour source; relationship pacing; nursery scope; optional narration and input accessibility. The chapter is written to make those choices reviewable without requiring another round of concept questions first.
