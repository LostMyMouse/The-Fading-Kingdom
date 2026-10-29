# Authored left-walk proof · 29 October 2026

This is an isolated experiment, not a live character replacement. The game continues to use the original renderer, wardrobe, character images and saved progress. The proof is at walk-frame-proof/index.html and imports existing cast art for comparison. No production module imports the proof.

The selected sheet supplies four connected full-body poses, drawn as continuous shapes rather than split boots. The first generation repeated the lead leg in both contact poses and was rejected. A targeted correction reverses the near/far legs and opposing arms in the final cell. Face drift in the generated sheet was also rejected: the assembled proof discards its head region and retains the exact original head/hair rectangle from coherent-template.png. Shared scale is fixed at32/545 for the body; measured per-frame foot/head-centre registration compensates for the sheet's uneven cell placement without resizing each pose. The original head uses its existing367px source height at32 world units, identically in every frame.

## Checks
The sheet is1254×1254 RGBA, in four627×627 cells. At alpha128 each cell has one substantial connected component. This is a topology check only, not proof of correct anatomy. Measured grip landmarks lie on opaque pixels. Canvas-transform tests verify full-cell drawing, one fixed scale, foot registration, looping/reduced-motion behavior and exact original-head rectangles.

Browser review compares the original player, Mara and Orin beside the body-frame proof at4× close-up and2× gameplay scale. Step controls inspect passing and both opposite contact poses. A basket toggle tests the measured per-frame hand positions. The original source colours are compared directly; current creator recolouring is not applied to this proof.

## Limits
Only left-facing walking, one body/outfit and the original tousled head are represented. Right/front/back movement, all hair/clothing/hat layers, palettes, held-tool poses, smooth intermediate poses, start/stop/turn transitions, physical-device review and final identity/art approval remain unfinished. The passing frames still need a more balanced arm progression; the new knees/boot silhouettes and larger stride need assessment before production. This is evidence of a new frame approach, not a claim that recurring animation problems are fully solved. Do not integrate it into gameplay or clone the experiment to NPCs until those gates pass.

## Provenance
Built-in imagegen edit mode, using assets/player/coherent-template.png as the reference. Exact initial and correction prompts are in walk-frame-proof/generation-prompts.md. The generated source is preserved unmodified as walk-frame-proof/left-walk-v1.png; head retention is done by the isolated canvas assembly. No API-key workflow or external artist communication was used.
