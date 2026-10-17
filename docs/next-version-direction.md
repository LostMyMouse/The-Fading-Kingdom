# Next version: arrival, useful equipment and expressive characters

Recorded from the user’s direction · 17 October 2026. Update: the opening invitation and first permanent wide-spout can are now implemented; see arrival-and-equipment-release.md. Dedicated expressive portraits, a layered player wardrobe prototype and initial independent resident routines are now implemented. Further tool tiers, full daily NPC schedules and the arrival cutscene remain future work; see layered-player-release.md.

## An early reason to arrive

The opening needs to establish why the player came to Bramblewick and chose to help the kingdom. It should do that before the farming instructions, in a few short, skippable exchanges the player can read at their own pace.

**Implemented opening premise:** the player answers an invitation offering an unused cottage and a patch of land in Bramblewick. The settlement has grown quiet: homes are empty, paths are overgrown and the wider kingdom is losing its magic. The invitation asks whether the player would like to settle there and help get things growing again. The player arrives with a small bag, meets people, and gradually chooses what sort of village to build.

Working letter:

> There’s a cottage going spare in Bramblewick. Needs a bit of work. So does the rest of the place.
>
> Fancy helping us get things growing again?

Arrival beat:

> One long road, a slightly squashed lunch, and here you are. Your cottage is just up the path.

The sender's identity and the reason the kingdom is fading remain open. Do not imply the kingdom declined because its people were rude, burden a child with saving everybody alone, or make the player a predestined hero. People contribute skills and effort alongside the newcomer. Preserve this premise in the journal so returning players can find their bearings.

## Equipment that makes farming easier

Useful equipment progression is a requirement. Upgrades must change what the player can do or how much effort routine work takes; cosmetic reskins alone do not count. Stardew Valley is a reference for practical improvement, with original tool designs and a forgiving pace here.

Proposed progression, with quantities to tune:

| Equipment | Practical improvement | Possible acquisition |
| --- | --- | --- |
| Wide-spout watering can | Water up to three planted plots in one action | Restore a workshop or craft an upgrade with a resident |
| Larger watering can / irrigation | Cover a larger patch or automate a chosen garden area | Later crafting, exploration and restoration |
| Better soil tool | Prepare a short row instead of one square | Materials and workshop skill progression |
| Permanent carry basket | Carry more gathered materials without a loan | A shared project or a crafted basket |
| Improved harvesting tool | Gather several ready crops with one action | A later farming milestone |

Keep basic tools permanently usable. Show the upgraded area before acting, with the same result on touch and keyboard. Avoid precision charge timing as the only way to use an upgrade; a plain area-size control can offer an accessible alternative. Equipment can come from crafting, discovery and community projects, with relationships opening additional routes. Do not make fundamental tool access depend on guessing one exact polite response. Never remove an earned farming upgrade as an unrelated punishment for a social mistake.

The first permanent wide-spout can is now earned from Orin after completing Mara’s home and first cooking batch, without an extra material cost. Later equipment tiers, economy, costs and order remain to be designed. The borrowed carry basket remains a separate useful loan.

## Portraits and emotions

The user's attached Stardew Valley dialogue image establishes the desired role of a prominent character portrait beside the text, with a visible name and an expression appropriate to what is being said. Use an original interface and original portraits. Dedicated Mara and Orin bust portraits now have six expressions each: neutral, happy, amused, thoughtful, surprised and concerned. Walking sprites remain procedural and will receive a matching production art pass later.

Create dedicated head-and-shoulders portraits with stable silhouettes, clothing, skin tones and palettes that match the world characters. Proposed shared expression set: neutral, pleased, amused, thoughtful, surprised, worried, frustrated/disappointed, and relieved. Exact counts can vary when a character needs a particular expression.

Each dialogue beat should specify its speaker, portrait expression and optional world gesture. Expressions change with the meaning of the line, not just a global friendship number. Example sequence:

- Orin notices the bundle: amused, with a small head scratch.
- He explains that the boards are needed for the mill roof: concerned or matter-of-fact.
- They are returned: relieved, with a relaxed stance.

No portrait or animation should warn about a future wrong choice while the character is still unaware of it. Expressions communicate character and situation; they are not red/green answer indicators. An NPC can be tired, shy or distracted for ordinary reasons, and the player can disagree respectfully.

**Later world animation:** restrained body-language changes such as laughing, hesitating, tilting the head, folding arms or relaxing. Talking, reacting, walking and working should share a consistent character design. Keep gestures brief and allow interruption; never gate progression on waiting through a long performance.

## Presentation and accessibility

- Desktop/tablet can place a bust portrait beside a bottom dialogue panel. Phone portrait may stack the portrait and name above the text when needed.
- Preserve readable text and reachable choices. A large portrait must not push essential dialogue or controls off the screen.
- Dialogue advances on the player's action. Any text reveal effect must support immediate reveal and an instant-text setting; no timed replies.
- Respect reduced motion with still expressive portraits and static poses. The emotional meaning must remain understandable through the words, not colour or animation alone.
- Separate portrait assets, expression metadata, gesture playback and dialogue text so writing can be revised without recutting animation.

## Acceptance for the upcoming passes

1. A new player can explain why they arrived and what they might do next.
2. At least one earned equipment upgrade visibly reduces repeated farming actions and survives save/reload.
3. The same upgrade is practical with touch, mouse and keyboard.
4. Portrait identity and emotion remain consistent across the dialogue scene and world sprite.
5. A misunderstanding, an ordinary chat and a happy scene each have appropriate distinct expressions, without pre-labelling moral outcomes.
6. Narrow phone and reduced-motion modes preserve both the conversation and its meaning.

## Arrival cutscene · deferred

James requested an arrival cutscene for a later version. Show the journey into the kingdom, quiet signs of decline, and arrival at the cottage. Keep the replayable letter until that pass. The cutscene should be skippable, replayable, and support reduced motion; no timed choices. Sender identity and cause of fading remain open.

## Approved portrait style

The current Mara and Orin portrait atlases are approved by James and anchor all future dialogue portrait generation. Follow docs/portrait-art-direction.md and use both canonical images as visual references. Do not deviate from this style.

## Gathering by chopping and mining · later version

James requested active gathering: chop wood and mine stone, ore and other materials. Players must first obtain the appropriate tools, such as an axe or pickaxe, from characters, a shop, crafting or another believable route. Early loose branches and stones remain useful before tools are acquired. Distinguish loose supplies from owned timber and planted trees; preserve contextual ownership and repairable consequences. Design tool availability, animations, regeneration, effort and upgrade order before implementation. Do not silently grant all tools at the start. This mechanic is deferred until the visual foundation is settled.

## Layered player prototype and independent residents

Version 0.6.0 implements two hair styles, two shirts, one optional cap and saved skin/hair/clothing colours. Follow sprite-quality-standard.md before extending the parts. Residents now follow local work/errand/rest routines independent of player proximity. Full persistent daily schedules and autonomous movement between buildings remain a later pass.
