import {BRIDGE,RIVERSIDE} from './chapter-bridge.js';
const RECTS={deck:[42,264,546,311],work:[667,268,545,282],front:[57,913,604,109],berries:[792,811,370,302]};
let atlas=null,grass=null,loading=null;
const load=path=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=new URL(path,import.meta.url).href;});
export function prepareBridgeArt(){if(loading)return loading;loading=Promise.all([load('./assets/environment/footbridge-v1.png'),load('./assets/environment/terrain-v1.png')]).then(([a,t])=>{if(!a||!t){loading=null;return false;}atlas=a;grass=document.createElement('canvas');grass.width=grass.height=64;const c=grass.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(t,0,0,t.width/2,t.height/2,0,0,64,64);c.fillStyle='#8da16b55';c.fillRect(0,0,64,64);return true;});return loading;}
function piece(c,id,x,y,w,h){if(atlas)c.drawImage(atlas,...RECTS[id],Math.round(x),Math.round(y),w,h);}
export function drawRiverside(c,s){
 if(grass){c.fillStyle=c.createPattern(grass,'repeat');c.beginPath();c.roundRect(RIVERSIDE.left*16,RIVERSIDE.top*16,(RIVERSIDE.right-RIVERSIDE.left+1)*16,(RIVERSIDE.bottom-RIVERSIDE.top+1)*16,5);c.fill();}
 c.fillStyle='#d4c49a';c.fillRect(49*16,24*16,17,32);
 piece(c,'berries',RIVERSIDE.x*16-4,23*16-4,24,20);
 const x=BRIDGE.left*16,y=(BRIDGE.bottom+1)*16;
 piece(c,s.bridge?.built?'deck':'work',x,y-42,48,42);
 if(s.bridge?.started&&!s.bridge.built){c.fillStyle='#b88c57';c.fillRect(44*16,26*16,18,4);c.fillStyle='#e5c28c';c.fillRect(44*16,26*16,18,1);}
}
export function drawBridgeFront(c){piece(c,'front',BRIDGE.left*16,(BRIDGE.bottom+1)*16-3,48,10);}

