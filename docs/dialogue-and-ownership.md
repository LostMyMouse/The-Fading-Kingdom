# Dialogue and everyday ownership · 17 October 2026

This revision supersedes the earlier explicit “take without asking” warning and formal dialogue examples. Animal Crossing is a reference for approachable character writing, not a source of copied dialogue or characters. All lines here and in the runtime are original.

## Voice

Short, conversational exchanges with a little everyday humour. Characters have interests, work and annoyances beyond the player's quest. Mara is warm, distracted and often thinking about food; Orin is dry, practical and fond of a small complaint. Use contractions and familiar words without baby talk. Essential quantities, controls and next steps belong in interface labels and the journal, leaving NPC speech room to sound natural.

Mara on arrival: “Oh, hello! Is this your place? I’ve got flour in my boots and a wheel that squeaks.”

Mara on moving in: “The oven fits! The table… nearly fits. We’ll eat sideways. It’s fine.”

Orin chatting: “Measure twice, cut once. I measured three times this morning. Couldn’t find my pencil.”

Optional chats rotate and depend on chapter progress. References to yesterday require a recorded event on the previous in-game day. Talking repeatedly grants no supplies or friendship points. Counts and event dates persist in the existing chapter save; older chapter saves gain defaults without losing progress.

## Timber encounter

1. The stack is beside Orin's tools, with a note reading “Mill roof”. Its action label is “Boards by the cart”. Ownership comes from that context, without an “owned/stolen” warning label.
2. Inspecting opens ordinary choices: “Pick up a bundle”, “Ask Orin about the boards”, “Leave it”. Walking near it or one stray map tap only inspects; taking still requires choosing the pickup action.
3. Pickup succeeds with “Picked up a bundle of boards.” No confirmation, warning colour, negative music or immediate remote NPC response. The carried bundle is visible in the basket list. The journal does not announce a dispute before Orin notices.
4. Talking to Orin while carrying it opens: “Ah. There’s my wood. I was starting to blame the squirrels.” He then explains: “Those boards are for the mill roof. Can you pop them back?”
5. Replies include “Oh, I thought it was spare”, “Can I use a bit?” and “Yeah, I’ll put it back”. The player can explain, ask, return it, or leave the conversation. An exact apology is not required. Orin declines use of the cut boards and points out loose branches instead.
6. Orin needs the bundle back before lending or joining the frame lift. His explanation connects the boundary to a real job. Existing farming, loose gathering, decorating and cooking continue. Attempting the frame can also prompt him to notice; it never consumes the house's wood on a blocked attempt.
7. The whole bundle remains a separate returnable story object. It cannot silently become ordinary building stock or produce extra rewards. Returning it does not return a borrowed basket too. Putting it back before Orin notices stays a plain world action; returning it after the conversation lets him acknowledge it naturally.

The aim is an understandable social situation whose meaning emerges through play. Avoid hidden ownership traps, dialogue that pre-labels good/bad answers, compulsory praise, global rejection, or escalating unrelated punishments.

## Validation

The revised rules suite adds tests for delayed discovery, repair before and after noticing, old-save compatibility, persistent reward-free chatter, honest yesterday references and invalid chat history. The full source suite has 29 passing tests. Browser observations are added after publication; automated rule checks alone are not child-comprehension testing.

## Live browser checks

Verified through the game UI using a valid test backup with materials already gathered: Mara’s first meeting and optional conversation, invitation, rotating everyday chatter, house-style choice, Orin’s introduction and borrowing, ordinary board inspection/pickup without a second confirmation, a journal with no premature dispute, Orin noticing during conversation, asking to use the boards, explaining the mix-up, separate return of the boards and basket, foundations, frame, herb planter, trim selection, and Mara’s move-in response. Later cooking and original-save restoration are recorded after their checks complete.

Backup export via a downloadable blob did not produce a usable browser-tool download event in this embedded test. A visible text-export alternative was added and exercised. Backup-file import initially exposed a detached-input issue; the input is now attached through selection and a fixture import succeeded through the normal UI.

The remaining browser scenes were then completed: entering the finished bakery, starting a batch with the harvested carrot, mixing, shaping and baking, keeping the buns, and asking about the old nursery afterwards. Keeping food did not block the next story thread. This used the test backup with previously gathered materials, rather than a fresh manual farming/gathering endurance run.

The pre-test browser story was restored through the fixed file-import UI. Re-exporting its visible backup text and comparing the parsed save confirmed an exact match with the original pre-test backup. The current source suite remains 29 passing tests; physical-device and child playtests remain open.
