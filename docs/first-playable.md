# First playable prototype

Status: proposed scope, 17 October 2026. This is a build brief, not an implemented feature list.

## Purpose

Test whether farming, free decoration, NPC relationships, and kingdom restoration form one enjoyable loop. The prototype should show a small complete experience rather than the beginning of many unfinished systems.

Target a first visit of approximately 15–25 minutes, with no enforced session timer. This is a playtest target, not a researched optimum for every child.

## Playable area and content budget

- One compact area containing a cottage exterior, farm plots, village paths, a shared garden, and a greenhouse entrance.
- One player with a small set of skin, hair, and rustic clothing choices. Exact counts follow an art and animation trial.
- Three NPCs, provisionally a gardener, carpenter, and apprentice. Final identities are open.
- Three crops, provisionally carrots, ordinary flowers, and one magical flower.
- A small decoration set: bench, planter, lantern, path, and fence.
- One complete borrowing relationship situation, one owned-item stealing encounter, one restoration project, and one playable unlock.
- One local save slot, proposed for the first build. No account system.

## The complete experience

1. **Arrive and choose an appearance.** A friendly introduction points to the farm and journal.
2. **Plant and harvest.** Clear prompts teach tools and the overnight growth cycle.
3. **Borrow a watering can.** The gardener responds to the request. The player can accept a boundary, borrow with permission, or act inconsiderately.
4. **Follow through or repair.** Returning the can and the conversation both matter. A missed promise creates a clear, reversible setback.
5. **Restore the garden together.** Supply flowers and simple materials; the gardener and carpenter contribute their skills. Numbers are tuned after the farming loop works.
6. **Decorate freely.** Place a bench and flowers wherever valid, with movement, removal, and undo.
7. **See the village respond.** NPCs begin using the garden and acknowledge the work.
8. **Enter the reopened greenhouse.** Obtain and plant a new magical seed. The unlock must be usable, not just a message about future content.

The apprentice supplies a small optional encounter about sharing or taking turns. Their full friendship story is outside this prototype.

### Taking without asking

The gardener's seed packet is clearly labelled as owned. The player can ask, leave it alone, or explicitly take it without asking. Taking it pauses the gardener's contribution to the garden and creates a journal entry explaining why. Returning the packet and acknowledging what happened resolves the immediate dispute; subsequent dependable actions rebuild trust. Asking can lead to permission or a respectful refusal, both clearly communicated.

The packet is not sellable, consumable, giftable, or plantable until permission is granted or the dispute is resolved; it cannot create duplicate rewards. A normal interaction or accidental touch cannot silently steal it. Borrowed-tool and stolen-packet states must remain separate; repairing one must not erase the other. Resolve both through accessible actions before the shared project finishes. Basic farming and unrelated decorating remain available.

## Website and device requirements

The game will be accessible through the existing JamesCube games collection on James's website, following the project-page and play-link pattern used for Volt and The Lamplighter. Final loading and deployment details depend on inspection of that website's source; its integration has not been implemented.

Mobile, tablet, and PC are all part of the first playable scope. Deliver keyboard/mouse and touch controls together. Use responsive interface layouts and test portrait and landscape, with landscape as a suggested view rather than a hard requirement. No action may require hover, right-click, orientation lock, or fullscreen.

## Social situation specification

| Player behaviour | Immediate response | Follow-up |
| --- | --- | --- |
| Ask respectfully | Gardener explains the borrowing agreement | Trust grows when the can is returned |
| Demand the tool | Gardener sets a boundary and explains how to ask | Player can retry without a permanent penalty |
| Take without permission | Gardener explains the problem; further borrowing pauses | Return it, acknowledge the mistake, and restore access |
| Keep it past the agreed day | Journal and gardener explain that it is needed | Return it and make amends; core farming remains playable |
| Decline the request to help | Gardener accepts a respectful refusal | Player can return later |

The farm has a basic watering option so a borrowing disagreement cannot trap the player. Repair must not require money, rare resources, or access locked by that same disagreement. The greenhouse opens through completing the shared project, including resolving any active tool dispute; a single mistake never permanently closes it.

Relationship progress should use distinct story events, not repeated clicking on the same courteous option. The prototype needs understandable state changes more than a complex hidden simulation.

## Acceptance criteria

### Farming and days

- A new player can plant, water, advance a day, and harvest using in-game guidance.
- Sleeping advances growth without real-time waiting.
- Closing the game does not advance time or damage crops.
- No ticking deadline, stamina depletion, crop death, or compulsory real-time wait.

### Relationships

- Dialogue and actions can independently change the borrowing situation.
- NPC feedback and the journal explain the current situation and next repair step.
- Every inconsiderate branch reaches a working repair route and the same core restoration opportunity.
- Repeating a completed dialogue cannot repeatedly award progress or items.
- Declining respectfully is not treated as rude.
- Owned, shared, and freely gatherable items are distinguishable before interaction.
- The stealing branch has a specific consequence, a reachable repair route, and no retained or duplicate stolen reward.
- Repairing borrowing and stealing in either order yields a consistent journal, inventory, relationship, and restoration state, including after reload.

### Decorating and restoration

- Items have clear valid/invalid placement previews and cannot block essential access.
- The player can create at least two materially different garden layouts.
- Placed objects can be moved and stored; the most recent change can be undone.
- Restoration persists, changes the scene, and opens the greenhouse activity.

### Saving and usability

- Reloading restores crops, inventory, placements, appearance, relationships, and restoration state.
- An unavailable or failed save is explained without claiming success.
- Destructive save reset requires confirmation.
- Text is readable at the selected device size; interaction guidance matches the supported controls.
- Important feedback is understandable without sound or colour alone.
- On mobile, tablet, and PC, movement, farming, dialogue, inventory, decorating, and saving work without inaccessible controls.
- Touch targets, text, and placement previews remain usable at small screen sizes and around device safe areas.
- Rotation, resizing, backgrounding, and touch interruption do not cause stuck movement, accidental item-taking, or state loss.
- Verify the full loop in iOS Safari, Android Chrome, and desktop browsers; record any platforms not yet tested.
- The website entry opens the correct game and provides a clear way back to the games collection once integration is available.

## Build order

1. Trial touch and keyboard/mouse controls, tile scale, player animation, and responsive UI readability on mobile, tablet, and PC.
2. Implement movement, interaction, farming, and player-controlled days in a small map.
3. Add the borrowing and stealing encounters, journal feedback, and all repair branches.
4. Connect restoration to resources, relationships, and the greenhouse unlock.
5. Add decoration placement, protected navigation, and undo.
6. Integrate save/load and the agreed production art slice.
7. Playtest the full loop; fix comprehension and navigation problems before expanding content.

## Outside this prototype

The full kingdom, seasons, weather simulation, combat, multiplayer, monetisation, online chat, accounts, cross-device saves, a large clothing catalogue, and a full crafting economy. Later magical outfits remain part of the overall design but do not need a complete wardrobe system here.

## Decisions required before implementation

Inspect the existing website's source to determine game loading and deployment. Select the implementation stack after testing touch and keyboard/mouse controls and performance on mobile, tablet, and PC. Finalise the first art budget and save behaviour. The prototype should remain portable; the final play URL and hosting configuration are still to be established.
