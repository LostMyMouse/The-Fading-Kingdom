import {CHARACTER_HEIGHT} from './character-rig.js';
// Match the same pixel-space feet/head anchors used when drawing the cast.
// A head can rise more than one map tile above its standing tile.
export function npcAtWorld(npcs,x,y){
 return npcs.filter(n=>{const fx=n.x*16+8,fy=n.y*16+12;return Math.abs(x-fx)<=11&&y>=fy-CHARACTER_HEIGHT+2&&y<=fy+2;}).sort((a,b)=>b.y-a.y)[0]??null;
}
