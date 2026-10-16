# The Fading Kingdom

A cosy browser farming and decorating adventure for ages 7–11. Grow a farm, make a home, build friendships, and help revitalise a magical kingdom. Thoughtful words and dependable actions open up opportunities to work with its people.

## Project documents

- [Chapter One: Room for One More](docs/chapter-one.md): proposed new opening, full quest script, dialogue, and repair paths; not yet implemented.
- [Game design](docs/game-design.md): agreed direction, gameplay systems, and open decisions.
- [First playable prototype](docs/first-playable.md): a bounded experience and its acceptance criteria.
- [Art reference](docs/art/approved-visual-direction.png): approved concept direction, not a playable screenshot or production sprite sheet.

## First playable

A dependency-free Canvas 2D prototype with farming, player-controlled days, character customisation, free decoration, three NPCs, a friendship journal, borrowing and stealing encounters, a garden restoration, and a moonflower greenhouse unlock.

Play on [JamesCube](https://james-lost-his-mouse.vercel.app/play.html?game=the-fading-kingdom).

Run `node tools/serve.mjs`, then open `http://127.0.0.1:4175`. No dependency installation or build step is required. To run checks: `node --check game.js`, `node --check world.js`, and `node --test tests/game.test.mjs tests/hosting.test.mjs`.

For JamesCube, copy `index.html`, `style.css`, `game.js`, `model.js`, and `world.js` unchanged into `games/the-fading-kingdom/`, then add the project registry entry. Relative paths work in the website's existing iframe. See [integration notes](docs/implementation.md).

Controls: WASD / arrows to walk, E / Space to interact, J for journal, 1–6 for tools. Tap the map to walk or use the touch direction pad and ACT button. Tap a ripe crop to harvest. Select Decorate for placement, movement, storage, rotation, and undo. Save data stays in the current browser under `the-fading-kingdom:save:v1`.

This is a prototype. Ten automated tests pass, and the main progression loop has been exercised in the live browser. Browser/device verification status is recorded in the implementation notes. Production art and physical-device playtests are still needed.
