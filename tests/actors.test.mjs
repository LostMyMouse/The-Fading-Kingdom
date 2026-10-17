import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,blocked,FIXED} from '../chapter-model.js';
import {createActors,animationFrame,SPRITE_RECTS} from '../chapter-actors.js';
test('ambient strolls stay on clear adjacent tiles and never alter saved gameplay',()=>{
 const s=fresh(),before=JSON.stringify(s),actors=createActors();const directions=new Set();
 for(let i=0;i<1000;i++)for(const n of actors.update(s,50)){
  assert.ok(Math.abs(n.x-n.anchor.x)+Math.abs(n.y-n.anchor.y)<=1.001);
  assert.equal(blocked(s,Math.round(n.x),Math.round(n.y)),false);
  if(n.walking)directions.add(n.direction);
 }
 assert.ok(directions.size>=3);assert.equal(JSON.stringify(s),before);
});
test('approaching Orin brings him home before interaction distance, preserving the upgrade station',()=>{
 const s=fresh(),actors=createActors();for(let i=0;i<100;i++)actors.update(s,50);
 s.player={...s.player,x:18,y:15};for(let i=0;i<12;i++)actors.update(s,50);
 const [n]=actors.update(s,50);assert.equal(n.x,FIXED.orin.x);assert.equal(n.y,FIXED.orin.y);assert.equal(n.walking,false);
});
test('menus pause movement; reduced motion uses stable poses without wandering',()=>{
 const s=fresh(),actors=createActors();let n;
 for(let i=0;i<105;i++)[n]=actors.update(s,50);
 const p={x:n.x,y:n.y,clock:n.clock};for(let i=0;i<30;i++)[n]=actors.update(s,50,{paused:true});
 assert.deepEqual({x:n.x,y:n.y,clock:n.clock},p);
 const frames=new Set();for(let i=0;i<300;i++){[n]=actors.update(s,50,{reduce:true});frames.add(n.frame);assert.equal(n.x,18);assert.equal(n.y,17);}
 assert.ok(frames.size<=2);
 assert.equal(animationFrame({reduce:true,emotion:'concerned',clock:999}),19);
});
test('ordinary pickup cannot trigger a reaction; dialogue metadata controls brief gestures',()=>{
 const s=fresh(),actors=createActors();s.story.timber='taken';
 let [n]=actors.update(s,50);assert.equal(n.emotion,'neutral');
 [n]=actors.update(s,50,{cue:{speaker:'orin',emotion:'concerned',talking:true},paused:true});
 assert.equal(n.frame,19);assert.equal(n.emotion,'concerned');assert.equal(s.story.timberNoticed,false);
 [n]=actors.update(s,50);assert.equal(n.emotion,'neutral');
});
test('characters follow room visibility, home placement and day anchors without stale actors',()=>{
 const s=fresh(),actors=createActors();assert.equal(actors.update(s,0).length,1);s.story.harvest=true;assert.equal(actors.update(s,0).length,2);
 s.room='home';assert.equal(actors.update(s,0).length,0);s.room='bakery';let [m]=actors.update(s,0);assert.equal(m.name,'mara');assert.equal(m.x,11);assert.equal(m.y,5);
 s.day=2;[m]=actors.update(s,0);assert.equal(m.y,7);
 s.room='outside';s.house={x:28,y:10,stage:3,style:0,trim:0};m=actors.update(s,0).find(n=>n.name==='mara');assert.equal(m.x,33);assert.equal(m.y,14);
});
test('all action and walking rectangles remain in their source image',()=>{
 for(const frames of Object.values(SPRITE_RECTS)){assert.equal(frames.length,24);for(const [x,y,w,h]of frames){assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=1024&&y+h<=1536);}}
 for(const direction of ['up','down','left','right']){const frames=new Set([0,150,300,450].map(clock=>animationFrame({direction,walking:true,clock})));assert.equal(frames.size,4);}
 assert.deepEqual([0,440,880,1320].map(clock=>animationFrame({work:true,clock})),[20,21,22,23]);
});
