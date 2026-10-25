import {prepareRoomDetails,drawRoomDetails,roomDetailsReady} from './room-personality.js';
import {prepareCottage,drawFurnishing} from './cottage-art.js';
import {drawVillageProp} from './village-art.js';
export const KITCHEN_RECTS={oven:[80,125,434,475],counter:[562,266,634,334],flour:[142,758,365,401],mirror:[725,694,330,467]};
export const ROOM_FLOOR={left:16,top:48,right:272,bottom:208,doorX:136,doorY:200};
let art=null,kitchen=null,grounds=new Map(),loading=null;
const load=path=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=new URL(path,import.meta.url).href;});
export function prepareInteriorArt(){if(loading)return loading;loading=Promise.all([prepareCottage().catch(()=>null),load('./assets/environment/kitchen-furniture-v1.png'),(typeof location==='undefined'||new URLSearchParams(location.search).get('details')==='personal'?prepareRoomDetails():Promise.resolve(true))]).then(([a,k,d])=>{if(!a||!k||!d){loading=null;return false;}art=a;kitchen=k;grounds=new Map();return true;});return loading;}
function part(c,id,x,y,width){const rect=KITCHEN_RECTS[id],height=Math.round(width*rect[3]/rect[2]);c.drawImage(kitchen,...rect,Math.round(x-width/2),Math.round(y-height),width,height);}
function fill(c,i,x,y,w,h){c.fillStyle=c.createPattern(art.patterns[i],'repeat');c.fillRect(x,y,w,h);}
function ground(room){
 if(grounds.has(room))return grounds.get(room);
 const cv=document.createElement('canvas');cv.width=288;cv.height=240;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 c.fillStyle='#292e27';c.fillRect(8,19,272,198);fill(c,0,16,48,256,160);c.fillStyle='#ead4ac22';c.fillRect(16,48,256,160);
 fill(c,1,16,20,256,28);fill(c,2,12,17,264,5);fill(c,2,12,22,4,186);fill(c,2,272,22,4,186);fill(c,2,16,44,256,5);
 for(const x of [17,90,190,265])fill(c,2,x,22,4,22);
 for(const x of [114,210])drawFurnishing(c,art,'window',x,43,24);
 for(const x of [48,254])drawFurnishing(c,art,'wallLamp',x,41,8);
 drawRoomDetails(c,{room,story:{}},'wall');
 if(room==='garden'&&roomDetailsReady())drawRoomDetails(c,{room,story:{}},'floor');else drawFurnishing(c,art,'rug',136,room==='bakery'&&roomDetailsReady()?188:177,room==='bakery'&&roomDetailsReady()?88:48);
 // Flour dust and potting-soil specks belong to the room, not collectible stock.
 if(room!=='home'){c.fillStyle=room==='bakery'?'#ecdbbc99':'#71543288';for(const [x,y]of [[198,94],[202,97],[207,92],[204,99],[200,100]])c.fillRect(x,y,1,1);}
 // A walkable doormat leads to the existing one-tile automatic exit.
 c.fillStyle='#6f825c';c.fillRect(128,192,16,16);c.fillStyle='#d8bd8b';c.fillRect(130,194,12,10);
 grounds.set(room,cv);return cv;
}
export function drawInteriorGround(c,s){if(!art||!kitchen||s.room==='outside')return false;c.drawImage(ground(s.room),0,0);return true;}
// Bases occupy the original fixed collision cells. Tall art rises behind its base.
export function interiorPlan(s){
 if(s.room==='home')return [{id:'bed',x:56,y:112,width:26},{id:'chest',x:88,y:80,width:16},{id:'mirror',x:216,y:80,width:18}];
 const counter=[{id:'counter',x:68,y:80,width:40},{id:'counter',x:108,y:80,width:40},{id:'counter',x:148,y:80,width:40}];
 if(s.room==='garden')return [...counter,{id:'cupboard',x:200,y:80,width:32},{id:'bed',x:216,y:176,width:26},{id:'chest',x:56,y:160,width:16}];
 return [...counter,{id:'cupboard',x:176,y:80,width:16},{id:'oven',x:208,y:80,width:30},{id:'table',x:136,y:144,width:44},{id:'chest',x:56,y:160,width:16}];
}
function bread(c,x,y){c.fillStyle='#73452d';c.fillRect(x,y,6,4);c.fillStyle='#dca55d';c.fillRect(x,y-1,6,4);c.fillStyle='#f2d49a';c.fillRect(x+1,y-1,1,2);c.fillRect(x+4,y-1,1,2);}
export function interiorLayers(c,s,npcs=[]){
 if(!art||!kitchen)return [];
 const layers=interiorPlan(s).map(p=>({id:p.id,y:p.y,draw:()=>{
  if(p.id in KITCHEN_RECTS)part(c,p.id,p.x,p.y,p.width);
  else if(p.id==='chest')drawVillageProp(c,'chest',(p.x-8)/16,(p.y-14)/16,p.width);
  else drawFurnishing(c,art,p.id,p.x,p.y,p.width);
  if(p.id==='counter'&&p.x===68)drawRoomDetails(c,s,'counter-left');
  if(p.id==='counter'&&p.x===148)drawRoomDetails(c,s,'counter-right');
  if(p.id==='cupboard')drawRoomDetails(c,s,'cupboard');
  if(p.id==='table')drawRoomDetails(c,s,'table',{breakfast:npcs.some(n=>n.breakfast)});
  if(p.id==='counter'&&p.x===108&&s.room==='bakery'&&s.story.cooked){for(let j=0;j<(s.economy.flour.noticed&&['held','used','replacement'].includes(s.economy.flour.state)?2:5);j++)bread(c,88+j*7,59);}
  if(p.id==='counter'&&p.x===148&&s.room==='bakery'&&s.economy.bakery.order.state==='ready')for(let j=0;j<4;j++)bread(c,135+j*7,59);
  if(p.id==='counter'&&p.x===68&&s.room==='bakery'&&s.story.cooking){c.fillStyle='#e1c694';c.fillRect(61,58,12,5);if(s.story.cooking>=2)for(let j=0;j<3;j++){c.fillStyle='#efdab0';c.fillRect(61+j*4,56,3,3);}}
  if(p.id==='chest'&&s.room==='bakery'&&['shelf','returned','replaced'].includes(s.economy.flour.state))part(c,'flour',56,148,12);
  if(p.id==='table'&&npcs.some(n=>n.breakfast)){c.fillStyle='#f3e5bf';c.fillRect(120,118,10,5);bread(c,122,117);}
  if(p.id==='counter'&&s.room==='garden'){const missing=s.gardener.noticed&&['held','used'].includes(s.gardener.parcel);const count=missing?1:2;for(let j=0;j<count;j++){c.fillStyle='#d7b57a';c.fillRect(p.x-10+j*13,57,9,7);c.fillStyle=j?'#ad7790':'#799454';c.fillRect(p.x-8+j*13,59,4,3);}if(p.x===68&&['shelf','returned','replaced'].includes(s.gardener.parcel)){c.fillStyle='#c3a175';c.fillRect(50,51,12,7);c.fillStyle='#ead7a5';c.fillRect(55,50,2,9);}}
 }}));
 return layers;
}
export function drawInteriorFront(c,s){if(!art||!kitchen||s.room==='outside')return;fill(c,2,12,208,116,7);fill(c,2,144,208,132,7);c.fillStyle='#c7a577';c.fillRect(128,208,16,4);}
// Match taps to the visible silhouette, including art rising above its base tile.
export function interiorHotspot(room,x,y){
 if(!art||!kitchen||room==='outside')return null;
 if(room==='home')for(const p of interiorPlan({room})){const rect=p.id==='mirror'?KITCHEN_RECTS.mirror:p.id==='bed'?[0,0,290,422]:[0,0,182,147];const h=Math.round(p.width*rect[3]/rect[2]);if(x>=p.x-p.width/2&&x<=p.x+p.width/2&&y>=p.y-h&&y<=p.y)return p.id==='bed'?{id:'bed',x:3,y:7}:p.id==='mirror'?{id:'mirror',x:13,y:4}:{id:'storage',x:5,y:4};}
 if(room==='bakery'&&x>=47&&x<=65&&y>=134&&y<=160)return {id:'flour',x:3,y:10};
 if((room==='bakery'||room==='garden')&&x>=48&&x<=225&&y>=44&&y<=80)return {id:room==='bakery'?'kitchen':'seedcounter',x:4,y:5};
 return null;
}
