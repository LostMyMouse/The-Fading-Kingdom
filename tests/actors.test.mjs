import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,blocked,FIXED,act} from '../chapter-model.js';
import {createActors,animationFrame,SPRITE_RECTS,routineFor} from '../chapter-actors.js';
test('independent errands stay on clear tiles and never alter saved gameplay',()=>{
 const s=fresh();s.player.x=3;s.player.y=6;const before=JSON.stringify(s),actors=createActors(),positions=new Set(),activities=new Set();
 for(let i=0;i<1400;i++)for(const n of actors.update(s,50)){
  assert.equal(blocked(s,Math.round(n.x),Math.round(n.y)),false);positions.add(Math.round(n.x)+','+Math.round(n.y));activities.add(n.activity);
 }
 assert.ok(positions.size>=5);assert.ok(activities.size>=3);assert.equal(JSON.stringify(s),before);
});
test('moving the player does not change NPC routes, work or facing',()=>{
 const one=fresh(),two=fresh();one.story.harvest=two.story.harvest=true;one.player.x=3;one.player.y=6;two.player.x=52;two.player.y=35;
 const a=createActors(),b=createActors();
 for(let i=0;i<1300;i++){
  if(i%100===0){two.player.x=two.player.x===52?48:52;two.player.y=34;}
  assert.deepEqual(a.update(one,50),b.update(two,50));
 }
});
test('menus pause routines, conversation freezes its speaker, reduced motion stays still',()=>{
 const s=fresh();s.player.x=3;s.player.y=6;s.story.harvest=true;const actors=createActors();let ns;
 for(let i=0;i<260;i++)ns=actors.update(s,50);const before=ns.map(n=>[n.x,n.y,n.clock]);
 for(let i=0;i<30;i++)ns=actors.update(s,50,{paused:true});assert.deepEqual(ns.map(n=>[n.x,n.y,n.clock]),before);
 const frozen=ns.find(n=>n.name==='orin');for(let i=0;i<30;i++)ns=actors.update(s,50,{cue:{speaker:'orin',emotion:'neutral',talking:true}});
 assert.equal(ns[0].x,frozen.x);assert.equal(ns[0].y,frozen.y);
 const reduced=createActors();for(let i=0;i<500;i++){ns=reduced.update(s,50,{reduce:true});assert.equal(ns[0].x,18);assert.equal(ns[0].y,17);}
});
test('ordinary pickup does not trigger a reaction; only explicit dialogue does',()=>{
 const s=fresh(),actors=createActors();s.story.timber='taken';let [n]=actors.update(s,50);assert.equal(n.emotion,'neutral');
 [n]=actors.update(s,50,{cue:{speaker:'orin',emotion:'concerned',talking:true},paused:true});assert.equal(n.frame,19);assert.equal(s.story.timberNoticed,false);
});
test('routines follow room visibility and home placement without stale actors',()=>{
 const s=fresh(),actors=createActors();assert.equal(actors.update(s,0).length,1);s.story.harvest=true;assert.equal(actors.update(s,0).length,2);
 s.room='home';assert.equal(actors.update(s,0).length,0);s.room='bakery';let [m]=actors.update(s,0);assert.equal(m.name,'mara');assert.equal(m.x,11);assert.equal(m.y,5);
 s.day=2;[m]=actors.update(s,0);assert.equal(m.y,7);
 s.room='outside';s.house={x:28,y:10,stage:3,style:0,trim:0};m=actors.update(s,0).find(n=>n.name==='mara');assert.equal(m.x,33);assert.equal(m.y,14);assert.equal(routineFor(s,'mara',m.anchor)[0].activity,'Checking the herbs');
});
test('a moving carpenter can fit the upgrade beside his current location',()=>{
 const s=fresh();Object.assign(s.story,{orin:true,cooked:true});s.house={x:28,y:10,stage:3,style:0,trim:0};s.player.x=16;s.player.y=20;
 act(s,'upgradeCan',{npc:{x:16,y:19}});assert.equal(s.story.wideCan,true);
});
test('all action and walking rectangles remain in their source image',()=>{
 for(const frames of Object.values(SPRITE_RECTS)){assert.equal(frames.length,24);for(const [x,y,w,h]of frames){assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=1024&&y+h<=1536);}}
 for(const direction of ['up','down','left','right']){const frames=new Set([0,150,300,450].map(clock=>animationFrame({direction,walking:true,clock})));assert.equal(frames.size,4);}
 assert.deepEqual([0,440,880,1320].map(clock=>animationFrame({work:true,clock})),[20,21,22,23]);
});

test('contact poses alternate legs and opposing arms in every direction',async()=>{
 const {gaitPose}=await import('../chapter-actors.js');
 for(const row of [0,1,2,3]){
  const left=gaitPose(row*4+1),right=gaitPose(row*4+3);
  assert.equal(left.leftLeg,1);assert.equal(right.rightLeg,1);
  assert.equal(left.leftArm,-left.leftLeg);assert.equal(left.rightArm,-left.rightLeg);
  for(const limb of ['leftLeg','rightLeg','leftArm','rightArm'])assert.equal(left[limb],-right[limb]);
 }
});
