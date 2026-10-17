# The Fading Kingdom

Preserve the approved dialogue portrait style. Before generating or changing portraits, read docs/portrait-art-direction.md and inspect both assets/portraits/mara-expressions.png and assets/portraits/orin-expressions.png. James explicitly approved these as the canonical style and asked that future dialogue portraits do not deviate. Use both as image references for new dialogue characters. Keep identity, expression order and atlas geometry consistent.

The arrival cutscene is deferred. World character animation is a prototype under visual review; read docs/rendering-and-customisation.md before extending it. The current letter and approved portraits remain usable. Keep the browser game dependency-free and support phone, tablet, keyboard and mouse.

Before changing player or NPC sprites, follow docs/sprite-quality-standard.md. Use the actual assembly and gameplay-size review, not only the generated sheet or unit tests. Preserve independent NPC routines; proximity must not make residents face or follow the player.
