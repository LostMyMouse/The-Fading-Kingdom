# Playable interiors and quality review · 26 October 2026

This integrates matching timber/plaster interiors into the real 18x15 cottage, bakery and seed-shop rooms. It keeps the production room dimensions, original blocking, automatic exits, fixed interaction points, village layouts, inventory and save schema. The canonical cast/portrait source files and shared rig are unchanged.

The original cottage furniture/material atlases provide bed, table, cupboard, windows, lamps, rug, floor, plaster and beams. The new kitchen-furniture-v1.png atlas supplies oven, modular counter, flour sack and standing mirror, generated with the built-in image-generation tool using cottage-furniture-v1.png as style reference. Exact prompt: kitchen-furniture-prompt.txt. Actual atlas: 1254x1254 RGBA. interior-art.js records measured individual bounds; no equal-cell assumption is made.

Large furniture bases align with the existing blocked cells; tall images rise behind their bases. Furniture and characters share feet-based depth sorting. The low front cutaway wall leaves the existing single-tile exit open. Kitchen flour/bread/order/cooking displays and Rowan's parcel/stock reflect actual state; drawing does not grant items or notice missing supplies. Existing furniture decorations retain orientation and can be moved/stored normally. The home chest/mirror now also respond when tapping their fixed art tiles, routing to the real approach square.

Legacy small floor storage in the bakery and seed shop remains walkable, as before; this pass does not insert new obstacles into an old decorated room. The floor rug and doormat are also walkable. Static painted oven fire is not a new flame animation. No new furniture catalogue, rigid-body physics, wardrobe, limb artwork, story rewards or arrival cutscene is introduced.

Initial assembled review is gated by ?review=bridge&interiors=cozy; the review save is separate from the production story. Final activation follows browser checks. Quality coverage and any limits are recorded after actual review, not inferred from passing unit tests.
