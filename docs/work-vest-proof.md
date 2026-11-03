# Work-vest and garment-mask proof · 3 November 2026

Status: isolated review candidate. Priority 1 remains active; these images have not replaced the gameplay renderer or original player/NPC/portrait assets. Existing saves are not accessed by this page.

## Implemented
- Three transparent, built-in imagegen vest sheets, preserving the existing cream-sleeved work-vest design. Right-facing bodies mirror the left sheet. Original directional heads, hairstyles and cap are still assembled from the existing source artwork.
- Separate measured cell bounds and foot registrations for the vest. The front output is one pixel taller than the linen source and is not sliced with the old dimensions.
- Six existing creator garment palettes, original-colour mode, and a visible magenta selection preview. Selection is a bounded source-colour classifier per registered torso; it is not a hand-painted material map. Only selected fabric RGB changes; source pixels and alpha are retained. Cream sleeves/collars, skin, hair, boots and brown outlines are excluded in the inspected views. This does not implement new skin/hair masks.
- Source-sheet colour cache limited to twelve entries. Repaint matrix canvases when they enter view; the first scroll review exposed blank panels and the corrected deployment was visually rechecked.
- Device-layout wrapper uses a directory iframe URL so clean-URL hosting redirects do not break relative artwork/module paths. A regression test covers that specific URL failure.

## Verification
- Full local suite: 223 passed before adding the clean-URL regression. The new regression and focused garment/cycle checks passed separately. Final CI result is recorded in the workspace verification artifact.
- 62 runtime/inline scripts pass syntax checks; four import maps parse. The check now includes all five walking-proof JavaScript modules.
- Real PNG analysis: all 24 linen/vest source cells contain selected fabric; every registered grip samples alpha at least 250. Full measurements: outputs/authored-walk-proof/vest-material-audit.json in the task workspace.
- Browser: inspected all sixteen hair × outfit × cap combinations, four directions and four key poses (256 assembled poses) in the blue garment matrix at 2× world scale (64 CSS-pixel figure height). Both side profiles, shoulder joins, knees, boots, tails and cap clearance were reviewed. No detached or cropped parts were visible in that matrix review.
- Cast comparison and front/rear/side close-ups at 4× (128 CSS-pixel figure height). Original heads retained; front and rear vest collars/sleeves remain connected.
- Six garment colours were reviewed in representative views across linen/vest: blue full matrix; sage right vest; terracotta left vest; gold front vest; heather rear vest; sand rear linen. This is not the complete palette × wardrobe × direction Cartesian product.
- Side basket grips move with measured hands in both mirrored directions. The basket drawing remains a grip-test placeholder, not final equipment art.
- Reduced motion pins frame 1 even after Next frame. Standing selects passing pose 1. Paused controls, outfit swaps and scroll repaint were checked in the browser.
- Browser layout checks: 320×740, 390×844, 768×1024 and 844×390 report no horizontal overflow. Small-phone key poses, tablet cast and landscape controls were visually inspected. These are embedded browser viewports, not physical touch-device/performance tests.
- Screenshot: outputs/authored-walk-proof/vest-front-and-poses.jpg in the task workspace. Exact generation instructions: walk-frame-proof/generation-prompts-vest-v1.md.

## Remaining gate
Purpose-built tool/action poses, coherent skin/hair/body palette support, continuous-motion review, full outfit × palette × action coverage and physical-device checks remain required before gameplay integration. The selected-material classifier remains a preview technique pending complete edge/colour coverage review. Do not describe this as final production animation or a completed character creator.
