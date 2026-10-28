# Village life responds to shared work · 28 October 2026

This pass extends existing breakfast visits, daily business income and remembered jobs. It adds no friendship score, currency grant, reward repetition or save field.

Mara’s working bakery gets warm window light and a readable bakery sign. Counter bread follows the actual settled morning batch: five loaves for normal trade, two for a small batch. Picking up flour does not immediately change stock or announce wrongdoing. Returning it after a small batch lets Mara prepare tomorrow’s dough; the two-loaf display remains until the next full morning. Her work remark and greeting acknowledge that timing. Existing purchased porch work remains separate.

Orin visibly stops hammering once missing mill boards are noticed, or once his overdue tool basket is needed. He sorts other supplies, occasionally mentions the delayed delivery, and resumes ordinary work when the item returns. Detection still occurs through existing conversations/work actions, not by magically reacting to the pickup. Routines do not teleport on repair. Remembered help leads to warmer greetings and a bakery-break invitation; conversation creates no free items.

After Rowan’s own home is complete, Rowan now has a physical cycle: seed counter -> own doorway -> nursery -> breakfast stall if built -> Mara’s doorway -> counter and table -> back to the seed shop. Orin retains his existing workshop/bakery cycle. They use different counter and table approaches and remain single people across rooms. Looking away does not restart a visit. Menus, explicit conversations and reduced motion preserve existing pause behavior. The NPC guide now routes to the correct resident’s home instead of treating every indoor neighbour as living in Mara’s house.

Original portrait/cast PNGs, animation rig, house footprints, free placement and automatic doors are unchanged. Window light reuses existing native render details; no new character/environment atlas or new art style is introduced. Automated tests cover nightly state timing, work pause/recovery without resetting position, Rowan’s full three-room route, independent visitors, pure derived state and reward conservation. Browser evidence and test results belong in outputs/village-life in the workspace; no physical device certification is implied.

Mara’s initial indoor anchor now matches the actual oven work stop on every day. The former odd/even standing positions could show a kneading pose in the middle of the room before the first errand.
