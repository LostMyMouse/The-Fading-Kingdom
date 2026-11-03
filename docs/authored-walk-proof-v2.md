# Four-direction walking proof — checks completed 3 November 2026

This extends the isolated walk-frame-proof preview. No gameplay runtime, original character image, portrait, save schema or NPC routine is replaced. Movement/art remains roadmap priority 1 and is not finished.

## Implemented
- Front and rear authored body frames, plus a shorter left-facing walk and a mirrored right-facing body. The right head is the original right-facing source, not a mirrored face. Each direction has two passing and two opposing contact poses.
- The side passing arm returns toward the hip. At the same lower-boot source band, contact silhouette widths fell from280 to199 pixels and304 to214 pixels compared with v1. This supports a narrower stride; it is not a foot-sliding or continuous-motion measurement.
- Original head/hair sources from coherent-template.png and hairstyles.png are fitted at the existing32-unit character height. The existing cap source and bounds are reused. A constrained original-pixel overlay retains the tied ponytail below the neck. Generated heads are discarded during assembly.
- All four existing hairstyles with/without the cap are exposed in a separate eight-combination matrix. Original source colours and one linen body only; this does not offer the whole character creator.
- Measured frame-specific grip landmarks drive basket position, with the basket drawn behind the rear-facing body. The key-pose panel now shows baskets when the grip test is enabled.
- Pause, step, stand/walk, reduced motion and focused-panel arrow keys are available. Canvas backing size is changed only on an actual size change; paused previews are not repeatedly repainted.

## Completed verification
The original player, Mara and Orin were compared beside the proof in front, left, right and back at close-up scale. The eight hairstyle/cap combinations were inspected in four directions and four poses (128 assembled poses) at the matrix display size. No new detached head or hair pieces were observed. The shared sleeve, hip and boot silhouettes were inspected; final artistic approval is not inferred from those checks.

The interrupted basket check was resumed on3November using a fresh browser connection. All four basket poses were visually inspected in each direction at4×. Handles remained at the hands, including rear occlusion. These checks use the default tousled head and one linen body; they are not every colour/outfit/attachment combination.

Arrow-key presses in each direction selected the correct orientation and returned to passing/standing on release. The stand/walk control worked, and reduced motion held frame1 while playback was enabled. These are in-place preview controls, not walking across the village or final transition blending. Browser screenshots are saved in outputs/authored-walk-proof in the task workspace.

The latest full local suite passes221 tests. Six focused authored-frame tests cover whole-cell drawing, fixed directional scales, foot registration, measured grip transforms, right-profile mirroring, rear layering metadata, loop/reduced-motion selection and retention of the original head crop in v1. New browser checks do not substitute for these tests or for physical-device playtests. Syntax checks cover the new proof modules separately from the root runtime checker.

## Remaining before integration
The second shirt/vest, explicit material masks, all skin/hair/shirt palettes, tool-action frames, NPC authored movement, continuous travel/footplant assessment, transition blending and physical phone/tablet performance remain unfinished. Do not enable the proof in gameplay or claim all reported leg-splitting problems solved based on this isolated scene. Village construction follows the movement/art quality gate.

## Assets and provenance
Built-in imagegen edited body art using the existing original player as the reference. Exact prompts and the rejected over-wide intermediate side attempt are recorded in walk-frame-proof/generation-prompts-v2.md. Selected unmodified source sheets: left-walk-v2.png, down-walk-v2.png and up-walk-v2.png. Geometry and grip landmarks: cycle-v2-data.json and cycle-v2.js. Original-head assembly: original-heads.js. No image-generation CLI/API-key fallback was used.
