import {SPRITE_RECTS} from './chapter-actors.js';
const images=new Map();
export function prepareCharacters(){for(const name of ['mara','orin']){if(images.has(name))continue;const image=new Image();image.src=new URL('./assets/characters/'+name+'-world.png',import.meta.url).href;images.set(name,image);}}
export function drawCharacter(c,actor,x,y){
 const image=images.get(actor.name);if(!image?.complete||!image.naturalWidth)return false;
 const rect=SPRITE_RECTS[actor.name][actor.frame],height=28,width=Math.round(rect[2]/rect[3]*height);
 c.fillStyle='#304d3c40';c.fillRect(Math.round(x-6),Math.round(y),12,3);
 c.drawImage(image,...rect,Math.round(x-width/2),Math.round(y-height+2),width,height);return true;
}
