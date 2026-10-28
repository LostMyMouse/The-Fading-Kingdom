import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,act,blocked,FIXED,readSave} from '../chapter-model.js';
import {bakeryLife,carpenterWaiting,neighbourGreeting,residentDoor} from '../village-life.js';
import {createBakeryVisitor} from '../chapter-visits.js';
import {createActors,routineFor} from '../chapter-actors.js';
import {playOpening} from '../tools/opening-journey.mjs';
function settled(){const s=structuredClone(playOpening().state);s.economy.projects.nursery=true;s.gardener={...s.gardener,met:true,invited:true,house:{x:36,y:9,stage:3,style:2,trim:0}};s.room='outside';Object.assign(s.player,{x:3,y:6});return s;}
function sleep(s){act(s,'enterHome');act(s,'sleep');}
test('bread reflects the actual morning batch: no instant pickup verdict and no same-day replacement stock',()=>{
 const s=playOpening().state,before=JSON.stringify(s);assert.equal(bakeryLife(s).bread,5);assert.equal(JSON.stringify(s),before);
 act(s,'enterBakery');Object.assign(s.player,{x:3,y:10});act(s,'takeFlour');assert.equal(bakeryLife(s).bread,5);assert.equal(s.economy.flour.noticed,false);
 sleep(s);assert.equal(s.economy.lastIncome,4);assert.equal(bakeryLife(s).bread,2);assert.equal(bakeryLife(s).restocking,false);
 act(s,'enterBakery');Object.assign(s.player,{x:3,y:10});act(s,'returnFlour');assert.equal(bakeryLife(s).bread,2);assert.equal(bakeryLife(s).restocking,true);assert.match(routineFor(s,'mara',{x:11,y:5})[0].activity,/tomorrow/);
 sleep(s);assert.equal(bakeryLife(s).bread,5);assert.equal(bakeryLife(s).restocking,false);assert.equal(s.economy.lastIncome,10);assert.equal(bakeryLife(fresh()).lit,false);
});
test('Orin visibly waits only after noticing missing delivery equipment, and resumes without a position reset',()=>{
 const s=fresh(),a=createActors();s.story.timber='taken';let n=a.update(s,0)[0];assert.equal(n.work,true);const pos=[n.x,n.y];s.story.timberNoticed=true;n=a.update(s,0)[0];assert.equal(n.work,false);assert.match(n.activity,/delayed delivery/);assert.deepEqual([n.x,n.y],pos);
 act(s,'returnWood');n=a.update(s,0)[0];assert.equal(n.work,true);assert.deepEqual([n.x,n.y],pos);assert.equal(carpenterWaiting(s),null);
 s.story.basket='held';assert.equal(carpenterWaiting(s),null);s.story.late=true;assert.equal(carpenterWaiting(s),'basket');
});
test('Rowan walks from the seed shop through real doorways to breakfast and back without changing rewards or saves',()=>{
 const s=settled(),v=createBakeryVisitor('rowan'),before=JSON.stringify(s),rooms=new Set(),activities=new Set();let previous,returned=false;
 for(let i=0;i<7500;i++){const n=v.update(s,50);rooms.add(n.room);activities.add(n.activity);assert.equal(blocked(s,n.tileX,n.tileY,n.room),false);if(previous&&previous.room!==n.room){if(previous.room==='garden')assert.deepEqual([previous.tileX,previous.tileY],[8,12]);if(n.room==='garden'){assert.deepEqual([n.tileX,n.tileY],[8,11]);returned=true;}if(n.room==='bakery')assert.deepEqual([n.tileX,n.tileY],[8,11]);}previous=n;}
 assert.deepEqual([...rooms].sort(),['bakery','garden','outside']);assert.ok(returned);assert.ok(activities.has('Buying breakfast'));assert.equal(JSON.stringify(s),before);assert.deepEqual(residentDoor(s,'garden'),{x:38,y:13});assert.deepEqual(residentDoor(s,'bakery'),{x:30,y:14});
});
test('both visitors remain single independent people across rooms, pause/reduced motion and player movement',()=>{
 const one=settled(),two=structuredClone(one),a=createActors(),b=createActors();Object.assign(two.player,{x:50,y:33});
 for(let i=0;i<2200;i++){one.room=two.room=i<500?'garden':i<1500?'bakery':'outside';const av=a.update(one,50),bv=b.update(two,50);assert.deepEqual(av,bv);for(const name of ['rowan','orin','mara'])assert.ok(av.filter(n=>n.name===name).length<=1);}
 const v=createBakeryVisitor('rowan');for(let i=0;i<300;i++)v.update(one,50);const location=v.location();for(let i=0;i<100;i++)v.update(one,50,{paused:true});assert.deepEqual(v.location(),location);for(let i=0;i<100;i++)v.update(one,50,{reduce:true});assert.deepEqual(v.location(),location);
 const notSettled=playOpening().state;assert.equal(createBakeryVisitor('rowan').update(notSettled,50),null);
});
test('remembered help changes greetings without generating gifts or resetting an advanced save',()=>{
 let s=settled();s.story.dependable=true;assert.match(neighbourGreeting(s,'orin'),/easier/);s.story.shared=true;assert.match(neighbourGreeting(s,'mara'),/first batch/);const inventory=structuredClone(s.inventory),gold=s.economy.gold;for(let i=0;i<20;i++){act(s,'chat',{who:'orin'});act(s,'chat',{who:'mara'});}assert.deepEqual(s.inventory,inventory);assert.equal(s.economy.gold,gold);s=readSave(JSON.stringify(s));assert.equal(s.house.stage,3);assert.equal(s.gathering.axe,true);
});

test('the delayed carpenter speaks for himself rather than borrowing Mara’s speech bubble',()=>{const s=settled();s.story.timber='taken';s.story.timberNoticed=true;const v=createBakeryVisitor();let remarks=0;for(let i=0;i<4000;i++){const n=v.update(s,50);if(n.activity==='Sorting a delayed delivery'&&n.speech){assert.equal(n.speechSpeaker,'Orin');assert.equal(n.work,false);remarks++;}}assert.ok(remarks>0);});
