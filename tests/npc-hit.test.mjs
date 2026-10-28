import test from 'node:test';import assert from 'node:assert/strict';import {npcAtWorld} from '../chapter-hit.js';
test('villager taps include the painted head, interpolated body and feet but not the counter above or empty floor',()=>{
 const n={name:'rowan',x:11,y:4},fx=184,fy=76;
 assert.equal(npcAtWorld([n],fx,47),n); // Formerly tile y2: missed the one-tile hit area.
 assert.equal(npcAtWorld([n],fx,fy),n);
 assert.equal(npcAtWorld([n],fx,44),null);
 assert.equal(npcAtWorld([n],fx+12,60),null);
 assert.equal(npcAtWorld([n],fx,79),null);
 const moving={name:'mara',x:11.5,y:4.5};assert.equal(npcAtWorld([moving],192,60),moving);
 const back={name:'orin',x:11,y:3.8};assert.equal(npcAtWorld([back,n],184,60),n);
 assert.equal(npcAtWorld([],184,60),null);
});
