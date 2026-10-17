# Portrait and expression release · 17 October 2026

Dedicated Mara and Orin bust portraits replace enlarged walking sprites in NPC dialogue. Each has six expressions in a consistent atlas: neutral, happy, amused, thoughtful, surprised, concerned. Expression choices are explicitly authored for lines, with a neutral fallback. No sentiment guessing, relationship colour code, or early ownership warning. Static portraits work without animation.

The dialogue panel uses 160px portrait space on desktop/tablet, a 96px portrait with full-width dialogue below on narrow portrait phones, and 88px portraits on short landscape screens. Name, words and choices remain HTML; the portrait has a descriptive accessible label. Choices remain at least 44px high. Short landscape displays scroll vertically within the dialogue.

James approved this exact portrait style as canonical. See portrait-art-direction.md and root AGENTS.md: future dialogue portraits must use the Mara and Orin atlases as visual references without stylistic deviation. Built-in imagegen produced the art; the direction document records the prompt set and atlas contract.

## Validation
- 40 automated checks pass (37 existing, 3 added for expression geometry, conversation mapping and delayed ownership reaction).
- Live browser: Mara first greeting (surprised), story joke (amused), invitation (happy); Orin ordinary chat (amused), tool explanation (thoughtful), board discovery, request (concerned), return (happy).
- Actual board pickup showed only the ordinary pickup toast; no NPC portrait or premature verdict.
- Desktop 1280×900, tablet 768×1024, phone 320×740, landscape 740×390 checked.
- At 320px, dialogue client width and scroll width both 280px; no horizontal overflow. Every phone dialogue button was at least 44px high.
- Landscape has intentional vertical dialogue scrolling; the third response remained usable.
- Fresh backup taken before fixtures; original story restored through the UI and compared after testing.
- Generated atlases inspected visually in game. Their native geometry is 1536×1024; no re-cropping or destructive artwork edits.

## Scope
This is a prototype presentation pass. World sprites remain procedural and need a matching production-art pass. Full NPC emotional animations and the skippable arrival cutscene are recorded for later. Touch hardware, other browser engines and child playtesting have not been verified in this pass.
