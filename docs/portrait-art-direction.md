# Dialogue portrait art direction · approved
James explicitly approved the Mara and Orin portraits on 17 October 2026: “Anchor this art style. This is perfect. Do not deviate from this artstyle when generating others for dialogue portraits.”

## Canonical visual references
- assets/portraits/mara-expressions.png
- assets/portraits/orin-expressions.png

These are the approved production style, not disposable concepts. Always inspect both references and provide them as image references when generating another dialogue character. Preserve their style; do not reinterpret it into a different pixel density or medium. Obtain James's explicit direction before a deliberate style change.

## Visual invariants
Warm storybook pixel portraits with visible square clusters and crisp dark brown outlines. Rounded expressive faces, softly modelled warm skin, dark warm outlines, earthy clothing, quiet shading and restrained highlights. Head-and-shoulders framing, slightly turned faces with readable eyes, consistent scale and chest cropping. Friendly adult characters with an age-neutral presentation. Match the actual reference images over any conflicting generic description such as “simpler” or “chunkier”. Do not drift to vector art, smooth painted portraits, anime, photorealism, or tiny enlarged walking sprites.

Characters retain their own face, skin tone, hairstyle, silhouette and clothes. Mara: medium brown skin, dark tied-back hair, mustard blouse, cream apron straps. Orin: deeper warm brown skin, chestnut hair and short beard, moss work cap, rust shirt, dark apron straps.

## Expression and atlas contract
Current production atlas: 1536 × 1024 PNG, 3 columns × 2 rows of 512px square cells.
Top row: neutral, happy, amused. Bottom row: thoughtful, surprised, concerned.
Stable identity, clothes, head placement and framing across cells. Transparent canvas; preserve generated alpha. No text, frames, labels or grid baked into art. UI supplies names and borders.
Use the same expression order for new characters unless the engine metadata is deliberately extended. Inspect every frame at dialogue size for clipping and consistency.

## Generation prompt set · built-in imagegen
Mara: Original travelling baker; warm medium brown skin, dark near-black tied-back hair, mustard everyday blouse, cream apron straps. Six consistent head-and-shoulders portraits in the atlas layout above. Neutral attentive closed mouth; warm happy smile; amused eyes softly closed; thoughtful sideways glance; surprised raised brows and small open mouth; concerned knitted brows. Warm earthy pixel art, dark brown outlines, no blur, text or props. Transparent background.
Orin: Use Mara atlas as style/layout reference. Friendly broad adult face, deeper warm brown skin, short chestnut hair and beard, moss green work cap, rust-orange shirt, dark brown apron straps. Match pixel clustering, outline weight, scale, framing and six expression cells. Concern should be mild, not intimidating. Transparent background.
Future prompt: Use BOTH canonical images as style references. Match their rendering, pixel density, proportions, palette handling and expression restraint exactly. Change only the new character's identity and requested clothing/features; retain the atlas contract.

Generated with the built-in imagegen tool, not the API/CLI fallback.
