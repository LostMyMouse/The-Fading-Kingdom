# The Fading Kingdom

A cosy browser farming and village-building adventure, designed for ages 7–11 and welcoming all ages.

## Play Chapter One

[Play on JamesCube](https://james-lost-his-mouse.vercel.app/play?game=the-fading-kingdom).

Answer a letter from Bramblewick, grow a carrot, welcome a travelling baker, choose and place their home, gather materials, build in stages with a carpenter, enter the finished house, and cook together. Your own cottage is a walkable room with a bed, mirror and storage. Decorate inside and outside. Borrowing and taking owned wood have separate, repairable consequences. Complete the home and first cooking batch, then visit Orin to earn a permanent can that waters up to three planted plots per action. The journal contains the arrival letter and equipment preview.

This is an expanded prototype. Procedural pixel art, basic animation and a small cast establish the systems; production art, full resident schedules, further chapters and physical-device testing remain ahead. It is not a finished commercial release.

## Project documents

- [Arrival and equipment release](docs/arrival-and-equipment-release.md): opening letter, the first earned watering upgrade and current verification.
- [Next-version direction](docs/next-version-direction.md): arrival premise, practical equipment upgrades, expressive portraits and emotional animation.
- [Dialogue and ownership](docs/dialogue-and-ownership.md): character voices, everyday chatter and the revised timber encounter.
- [Game design](docs/game-design.md): agreed direction and open decisions.
- [Chapter One script](docs/chapter-one.md): narrative target and detailed quest branches.
- [Chapter One release notes](docs/chapter-one-release.md): implemented scope, differences, verification and limits.
- [Original prototype notes](docs/implementation.md): historical garden-opening implementation.
- [Art reference](docs/art/approved-visual-direction.png): approved concept direction, not a gameplay screenshot.

## Development

Run `node tools/serve.mjs` and open `http://127.0.0.1:4175/`. No installs or build step. Run `node --test tests/*.test.mjs` for the rules and hosting tests. Run `node tools/check-syntax.mjs` to check runtime and inline scripts.

Runtime files: `index.html`, `chapter.css`, `chapter.js`, `chapter-model.js`, `chapter-world.js`, `chapter-dialogue.js`, `chapter-progression.js`, plus the reused `world.js` and `model.js` character/icon modules. Copy them together into the website's `games/the-fading-kingdom/` folder. The earlier `game.js` and `style.css` remain historical source.

Controls: tap an object to walk to it; arrows/WASD to walk; E/Space to interact; J for journal; 1–5 for tools. Placement supports arrow keys, Enter, Escape, and R for supported rotation. Touch movement controls are provided. Show me guides you toward the current objective.

Save key: `the-fading-kingdom:chapter-one:v2`. Earlier version-one saves are preserved separately. The menu can download and restore chapter backups. Local saves do not sync automatically between devices.

## Village cooperation · 0.7.0
The shared village treasury now supports Mara’s first home, daily bakery contributions, a working nursery with berries and a market stall. A missing order-flour sack leads to a smaller batch and can be returned or physically replaced through Orin. See docs/village-economy.md. World characters blink; movement preserves frame time at tile boundaries; doorways enter and exit automatically. See docs/character-motion.md. Expanded wardrobe options remain for a later pass.


### 0.8.0 · A lived-in bakery
Orin visits the kitchen for breakfast, a shared lunch job creates remembered dialogue and a one-time village contribution, and the completed job unlocks flowering windows and warm bakery lights. See docs/bakery-life.md for scope and save compatibility.


### 0.9.0 · Rowan and new hairstyles
Invite a gardener, freely place a second home, visit its seed shop and grow turnips or marigolds. Flowers for the village earn a row sower. Rounded bob and twin-puff hairstyles join the creator. See docs/gardener-and-hairstyles.md.


### 0.9.1 · Art audit and a basket of your own
Fixed carried-basket hand attachment, action-pose head scale, shirt/hair overlap and partial-art loading. After the two homes and first cooking batch, visit Orin for a permanent basket carrying four materials per trip. See docs/art-audit-and-hauling.md for visual coverage and remaining device limits. 110 checks pass.
