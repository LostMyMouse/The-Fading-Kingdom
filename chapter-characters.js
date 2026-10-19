import {blinkImage} from './character-blink.js';
import {SPRITE_RECTS} from './chapter-actors.js';
import {drawRig} from './character-rig.js';
export {CHARACTER_HEIGHT} from './character-rig.js';
const images=new Map(),poses=new WeakMap();let loading=null;
// Action rows were painted with longer bodies. Keep the original head at the
// idle source scale and fit the lower body to the common foot baseline instead
// of shrinking the face whenever a resident starts working or talking.
function actionImage(image,name,rect){
 let cache=poses.get(image);if(!cache){cache=new Map();poses.set(image,cache);}const key=rect.join(',');if(cache.has(key))return cache.get(key);
 const [sx,sy,w,h]=rect,idleHeight=SPRITE_RECTS[name][0][3],head=Math.round(idleHeight*.53),out=document.createElement('canvas');out.width=w;out.height=idleHeight;
 const c=out.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(image,sx,sy,w,head,0,0,w,head);c.drawImage(image,sx,sy+head,w,h-head,0,head,w,idleHeight-head);cache.set(key,out);return out;
}
export function prepareCharacters(){if(loading)return loading;loading=Promise.all(['mara','orin','rowan'].map(name=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(true);image.onerror=()=>resolve(false);images.set(name,image);image.src=new URL('./assets/characters/'+name+'-world.png',import.meta.url).href;}))).then(results=>{const ready=results.every(Boolean);if(!ready)loading=null;return ready;});return loading;}
export function drawCharacter(c,actor,x,y){const image=images.get(actor.name);if(!image?.complete||!image.naturalWidth)return false;const index=actor.walking?Math.floor(actor.frame/4)*4:actor.frame;let rect=SPRITE_RECTS[actor.name]?.[index];if(!rect)return false;let source=image;if(index>=16){source=actionImage(image,actor.name,rect);rect=[0,0,source.width,source.height];}const face=actor.blink&&actor.direction!=='up'?blinkImage(source,rect):null;drawRig(c,face||source,face?[0,0,rect[2],rect[3]]:rect,{...actor,frame:actor.walking?actor.gait??actor.frame:actor.frame},x,y);return true;}
