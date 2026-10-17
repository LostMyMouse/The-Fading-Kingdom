import {SPRITE_RECTS} from './chapter-actors.js';
import {drawRig} from './character-rig.js';
export {CHARACTER_HEIGHT} from './character-rig.js';
const images=new Map();
export function prepareCharacters(){return Promise.all(['mara','orin'].map(name=>{if(images.has(name))return Promise.resolve();return new Promise(resolve=>{const image=new Image();image.onload=image.onerror=resolve;image.src=new URL('./assets/characters/'+name+'-world.png',import.meta.url).href;images.set(name,image);});}));}
export function drawCharacter(c,actor,x,y){const image=images.get(actor.name);if(!image?.complete||!image.naturalWidth)return false;const index=actor.walking?Math.floor(actor.frame/4)*4:actor.frame;drawRig(c,image,SPRITE_RECTS[actor.name][index],actor,x,y);return true;}
