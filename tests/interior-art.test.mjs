import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,blocked,route,readSave} from '../chapter-model.js';
import {doorAt,advanceWalk} from '../chapter-motion.js';
import {ROOM_FLOOR,KITCHEN_RECTS,interiorPlan,prepareInteriorArt,interiorLayers,drawInteriorGround,drawInteriorFront} from '../interior-art.js';

test('interior art bases occupy the original solid furniture cells and leave the exit unchanged',()=>{
 for(const room of ['home','bakery','garden']){const s=fresh();s.room=room;for(const p of interiorPlan(s)){assert.equal(blocked(s,Math.floor(p.x/16),Math.floor((p.y-1)/16)),!(p.id==='chest'&&room!=='home'),p.id+' changed the original solid/walkable contract');assert.ok(p.x-p.width/2>=ROOM_FLOOR.left&&p.x+p.width/2<=ROOM_FLOOR.right);}
 assert.equal(blocked(s,8,12),false);assert.equal(doorAt(s,{x:8,y:12}),'exit');
 for(const target of room==='home'?[{x:3,y:7},{x:5,y:5},{x:13,y:5}]:room==='bakery'?[{x:4,y:5},{x:3,y:10},{x:11,y:5}]:[{x:4,y:5},{x:11,y:7}]){const path=route(s,{x:8,y:11},target);assert.ok(path.length);for(const p of path)assert.equal(blocked(s,p.x,p.y),false);}}
});

test('indoor furniture routes and automatic exits remain usable at 30, 60 and 120 Hz',()=>{
 for(const room of ['home','bakery','garden'])for(const fps of [30,60,120]){const s=fresh();s.room=room;const path=route(s,{x:3,y:7},{x:8,y:12});assert.ok(path.length);let a={step:0,old:{x:3,y:7},player:{x:3,y:7},clock:0,direction:'down'},portal=null;for(let i=0;i<fps*20;i++){a=advanceWalk(a,1000/fps,()=>path.shift()||null,p=>blocked(s,p.x,p.y),p=>doorAt(s,p));if(a.portal){portal=a.portal;break;}}assert.equal(portal,'exit');}
});

test('kitchen atlas cuts remain isolated and within the actual 1254px source',()=>{for(const [name,[x,y,w,h]]of Object.entries(KITCHEN_RECTS)){assert.ok(x>=0&&y>=0&&x+w<=1254&&y+h<=1254);assert.ok(name==='oven'||name==='counter'?y+h<640:y>=640);}});

test('interior art waits for complete loads and retries missing furniture without modifying a story',async()=>{
 const oldImage=globalThis.Image,oldDocument=globalThis.document,queue=[],draws=[];
 const c=new Proxy({drawImage:(...a)=>draws.push(a),createPattern:()=>({})},{get:(t,k)=>k in t?t[k]:(()=>{}),set:(t,k,v)=>(t[k]=v,true)});
 globalThis.Image=class{constructor(){this.width=this.height=4;queue.push(this);}set src(s){this.url=s;}};globalThis.document={createElement:()=>({width:4,height:4,getContext:()=>c})};
 try{const first=prepareInteriorArt();assert.equal(prepareInteriorArt(),first);assert.equal(queue.length,3);queue[0].onerror();queue.slice(1).forEach(i=>i.onload());assert.equal(await first,false);const retry=prepareInteriorArt();assert.equal(queue.length,6);queue.slice(3).forEach(i=>i.onload());assert.equal(await retry,true);
 for(const room of ['home','bakery','garden']){const s=fresh();s.room=room;const before=JSON.stringify(s);assert.equal(drawInteriorGround(c,s),true);for(const layer of interiorLayers(c,s))layer.draw();drawInteriorFront(c,s);assert.equal(JSON.stringify(s),before);}for(const a of draws)assert.ok(a.slice(1).every(Number.isFinite));
 const s=fresh();s.room='bakery';s.story.cooked=true;const bagCount=()=>draws.filter(a=>a.length===9&&a[1]===KITCHEN_RECTS.flour[0]&&a[2]===KITCHEN_RECTS.flour[1]).length;
 let n=bagCount();interiorLayers(c,s).forEach(l=>l.draw());assert.equal(bagCount(),n+1);s.economy.flour.state='held';s.economy.flour.noticed=false;n=bagCount();const before=JSON.stringify(s);interiorLayers(c,s).forEach(l=>l.draw());assert.equal(bagCount(),n);assert.equal(JSON.stringify(s),before);
 }finally{globalThis.Image=oldImage;globalThis.document=oldDocument;}
});

 test('indoor camera contains the full 32-unit actor range and door whenever it fits',async()=>{const {verticalCamera}=await import('../chapter-camera.js');for(const h of [176,184,220,300]){const y=verticalCamera(false,240,h,188);assert.ok(y<=30);assert.ok(y+h>=206);assert.equal(y,verticalCamera(false,240,h,60));}for(const focus of [60,120,204]){const y=verticalCamera(false,240,74,focus);assert.ok(focus-y>=0&&focus-y<=74);}assert.equal(verticalCamera(true,640,184,220),220-184*.62);});
