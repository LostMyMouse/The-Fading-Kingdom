import {prepareEnvironment,drawProp} from './environment-art.js';
// Rendering only. These anchors follow the existing 56x40 rules/save world.
export const BUILDING_RECTS={timber:[18,86,612,593],stone:[630,86,613,593],foundation:[34,1032,586,154],frame:[660,707,546,479]};
export function buildingLayout(h,home=false){
 const door={x:(h.x+(home?3:2))*16+8,y:(h.y+4)*16+8};
 const width=home?96:80;
 return {door,width,left:door.x-width/2,bottom:door.y-5,sortY:(h.y+4)*16+1};
}
let art=null,buildings=null,ground=null,loading=null;
const load=path=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=new URL(path,import.meta.url).href;});
export function prepareVillageArt(){
 if(loading)return loading;
 loading=Promise.all([prepareEnvironment().catch(()=>null),load('./assets/environment/village-buildings-v1.png')]).then(([a,b])=>{if(!a||!b){loading=null;return false;}art=a;buildings=b;ground=makeGround();return true;});return loading;
}
function makeGround(){
 const cv=document.createElement('canvas');cv.width=56*16;cv.height=40*16;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 c.fillStyle=c.createPattern(art.patterns[0],'repeat');c.fillRect(0,0,cv.width,cv.height);
 // Quiet the material so crops and the original characters remain easy to read.
 c.fillStyle='#a5b88b88';c.fillRect(0,0,cv.width,cv.height);
 const path=document.createElement('canvas');path.width=cv.width;path.height=cv.height;const p=path.getContext('2d');p.imageSmoothingEnabled=false;p.fillStyle=c.createPattern(art.patterns[1],'repeat');
 p.beginPath();p.roundRect(48,17*16,800,16,5);p.roundRect(11*16,12*16,16,96,5);p.roundRect(45*16,10*16,16,128,5);p.fill();
 c.drawImage(path,0,0);return cv;
}
export function drawVillageGround(c){if(!ground)return false;c.drawImage(ground,0,0);return true;}
export function drawVillageBuilding(c,h,home=false){
 if(!art||!buildings||h.stage===0)return false;
 const g=buildingLayout(h,home),id=h.stage===1?'foundation':h.stage===2?'frame':h.style===1?'timber':h.style===2?'stone':null;
 const rect=id?BUILDING_RECTS[id]:art.cottageRect,image=id?buildings:art.cottage;
 const height=Math.round(g.width*rect[3]/rect[2]);
 c.fillStyle='#35472c33';c.beginPath();c.ellipse(g.door.x,g.bottom-1,g.width*.45,4,0,0,Math.PI*2);c.fill();
 c.drawImage(image,...rect,Math.round(g.left),g.bottom-height,g.width,height);
 if(h.stage===3){
  // Retain the chosen finishing trim as a small doorstep ribbon, not a roof filter.
  c.fillStyle=['#bf9c62','#77947b','#a07b8d'][h.trim||0];c.fillRect(g.door.x-6,g.bottom-3,12,2);
  if(h.lived){c.fillStyle='#efd593';for(const dx of [-24,24])c.fillRect(g.door.x+dx-2,g.bottom-25,3,5);}
 }
 return true;
}
export function drawVillageTree(c,x,y,index){if(!art)return false;drawProp(c,art,index%3===0?'pine':'oak',x*16+8,y*16+12,index%3===0?42:50);return true;}
export function drawVillageDecor(c,d){
 if(!art||!['planter','bench','lantern','path'].includes(d.type)||d.rotation&&d.type==='bench')return false;
 if(d.type==='path'){c.fillStyle=c.createPattern(art.patterns[1],'repeat');c.beginPath();c.roundRect(d.x*16,d.y*16,16,16,3);c.fill();}
 else drawProp(c,art,d.type,d.x*16+8,d.y*16+14,d.type==='lantern'?10:16);
 return true;
}
export function drawVillageResource(c,n){if(!art)return false;drawProp(c,art,n.type==='wood'?'log':'rock',n.x*16+8,n.y*16+13,13);return true;}
export function drawVillageCrop(c,p){if(!art||!p.planted||p.ripe&&(p.crop||'carrot')!=='carrot')return false;drawProp(c,art,p.ripe?'carrot':p.watered?'growing':'seedling',p.x*16+8,p.y*16+12,13);return true;}
export function drawVillageSoil(c,p){if(!art)return; c.save();c.globalAlpha=p.watered?.65:.4;c.fillStyle=c.createPattern(art.patterns[2],'repeat');c.fillRect(p.x*16,p.y*16,16,14);c.restore();}
