# The Fading Kingdom

A cosy browser farming and village-building adventure, designed for ages 7–11 and welcoming all ages.

## Play Chapter One

[Play on JamesCube](https://james-lost-his-mouse.vercel.app/play?game=the-fading-kingdom).

Grow a carrot, welcome a travelling baker, choose and place their home, gather materials, build in stages with a carpenter, enter the finished house, and cook together. Your own cottage is a walkable room with a bed, mirror and storage. Decorate inside and outside. Borrowing and taking owned wood have separate, repairable consequences.

This is an expanded prototype. Procedural pixel art, basic animation and a small cast establish the systems; production art, full resident schedules, further chapters and physical-device testing remain ahead. It is not a finished commercial release.

## Project documents

- [Game design](docs/game-design.md): agreed direction and open decisions.
- [Chapter One script](docs/chapter-one.md): narrative target and detailed quest branches.
- [Chapter One release notes](docs/chapter-one-release.md): implemented scope, differences, verification and limits.
- [Original prototype notes](docs/implementation.md): historical garden-opening implementation.
- [Art reference](docs/art/approved-visual-direction.png): approved concept direction, not a gameplay screenshot.

## Development

Run `node tools/serve.mjs` and open `http://127.0.0.1:4175/`. No installs or build step. Run `node --test tests/*.test.mjs` for the twenty rules and hosting tests.

Runtime files: `index.html`, `chapter.css`, `chapter.js`, `chapter-model.js`, `chapter-world.js`, plus the reused `world.js` and `model.js` character/icon modules. Copy them together into the website's `games/the-fading-kingdom/` folder. The earlier `game.js` and `style.css` remain historical source.

Controls: tap an object to walk to it; arrows/WASD to walk; E/Space to interact; J for journal; 1–5 for tools. Placement supports arrow keys, Enter, Escape, and R for supported rotation. Touch movement controls are provided. Show me guides you toward the current objective.

Save key: `the-fading-kingdom:chapter-one:v2`. Earlier version-one saves are preserved separately. The menu can download and restore chapter backups. Local saves do not sync automatically between devices.
