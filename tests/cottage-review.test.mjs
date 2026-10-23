import test from 'node:test';import assert from 'node:assert/strict';
import {HOME_DOOR,HOME_APPROACH,SPAWN,point,route} from '../outdoor-review/world.js';
import {ENTRY,EXIT,PREVIEW_KEY,startingFurniture,placement,roomRoute,roomBlocked,portalAt,readFurniture,writeFurniture} from '../outdoor-review/cottage.js';
import {moveActor} from '../outdoor-review/movement.js';
const actor=tile=>({tile:{...tile},...point(tile),direction:'down',clock:0,path:[],walking:false});
test('the cottage opens automatically only after completed threshold movement, and both spawns can leave safely',()=>{
 for(const fps of [30,60,120]){const p=actor(SPAWN);p.path=route(SPAWN,HOME_DOOR);assert.ok(p.path.length);let entry=null;for(let i=0;i<fps*10&&!entry;i++)entry=moveActor(p,1000/fps,tile=>portalAt('outside',tile));assert.deepEqual(entry,{room:'cottage',tile:ENTRY,direction:'up'});assert.deepEqual(p.path,[]);assert.deepEqual(p.tile,HOME_DOOR);
 const inside=actor(entry.tile);assert.equal(moveActor(inside,50,tile=>portalAt('cottage',tile)),null);inside.path=roomRoute(startingFurniture(),ENTRY,EXIT);let exit=null;for(let i=0;i<fps*2&&!exit;i++)exit=moveActor(inside,1000/fps,tile=>portalAt('cottage',tile));assert.deepEqual(exit,{room:'outside',tile:HOME_APPROACH,direction:'down'});const outside=actor(exit.tile);assert.equal(moveActor(outside,50,tile=>portalAt('outside',tile)),null);assert.ok(route(outside.tile,SPAWN));}
});
test('furniture cannot occupy walls, the doorway, the player or another solid item',()=>{
 const f=startingFurniture();for(const [id,x,y,player]of [['table',5,9,ENTRY],['chair',6,10,ENTRY],['rug',5,9,ENTRY],['table',2,4,ENTRY],['chair',6,6,ENTRY],['table',-1,5,ENTRY],['table',12,5,ENTRY],['table',7,5,{x:7,y:5}]])assert.equal(placement(f,id,x,y,player).ok,false,`${id} ${x},${y}`);
 assert.equal(placement(f,'rug',5,6).ok,true,'A flat rug can go under the table.');assert.equal(roomBlocked(f,{x:5,y:9}),false,'A rug is walkable.');assert.equal(placement(f,'chair',8,8).ok,true);
});
test('every accepted furniture move leaves all open floor squares connected to the exit',()=>{
 const original=startingFurniture();let accepted=0,rejectedRoute=0;for(const id of ['table','chair','rug'])for(let y=3;y<=10;y++)for(let x=1;x<=12;x++){const result=placement(original,id,x,y);if(!result.ok){if(result.reason.includes('way around'))rejectedRoute++;continue;}accepted++;assert.ok(roomRoute(result.layout,ENTRY,EXIT));for(let cy=3;cy<=10;cy++)for(let cx=1;cx<=12;cx++)if(!roomBlocked(result.layout,{x:cx,y:cy}))assert.ok(roomRoute(result.layout,ENTRY,{x:cx,y:cy}),`${id} at ${x},${y} stranded ${cx},${cy}`);}
 assert.ok(accepted>30);assert.ok(rejectedRoute>0,'The reachability rule must reject actual disconnected arrangements.');assert.deepEqual(original,startingFurniture(),'Previews do not mutate the committed layout.');
});
test('preview furniture survives reload while invalid or counterfeit layouts fall back to a safe room',()=>{
 const changed=placement(startingFurniture(),'chair',8,8).layout;assert.deepEqual(readFurniture(writeFurniture(changed)),changed);assert.notEqual(PREVIEW_KEY,'the-fading-kingdom:chapter-one:v2');
 for(const raw of [null,'bad','{}',JSON.stringify({version:2,furniture:changed}),JSON.stringify({version:1,furniture:[...changed,changed[0]]}),JSON.stringify({version:1,furniture:changed.map(p=>p.id==='chair'?{...p,x:6,y:10}:p)}),JSON.stringify({version:1,furniture:changed.map(p=>p.id==='rug'?{...p,id:'gold'}:p)})])assert.deepEqual(readFurniture(raw),startingFurniture());
});
test('walking keeps its frame remainder across tiles and never runs doorway callbacks while idle',()=>{
 const p=actor({x:6,y:9});p.path=[{x:6,y:10},{x:6,y:11}];let calls=0;for(let i=0;i<5;i++)moveActor(p,50,()=>{calls++;return null;});assert.equal(calls,1);assert.ok(p.y>point({x:6,y:10}).y);p.path=[];moveActor(p,50,()=>{calls++;});assert.equal(calls,1);
});
test('held movement has the same distance and phase at 30, 60 and 120 Hz with no tile-boundary pause',()=>{for(const fps of [30,60,120]){const p=actor({x:1,y:9}),start=p.x;for(let i=0;i<fps;i++)moveActor(p,1000/fps,()=>null,t=>({x:t.x+1,y:t.y}));assert.ok(Math.abs(p.x-start-65)<1e-7);assert.ok(Math.abs(p.clock-1000)<1e-7);}});
