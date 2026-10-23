import test from 'node:test';import assert from 'node:assert/strict';
import {handAnchor,gaitPose} from '../character-rig.js';

test('held basket follows the same hand pivot through both contacts and passing poses',()=>{
 for(const direction of ['down','left','right','up'])for(let frame=0;frame<4;frame+=.125){
  const p=handAnchor({direction,frame,walking:true});assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
  assert.ok(p.y>-10&&p.y<0);assert.equal(p.behind,direction==='up');
  const still=handAnchor({direction,frame,walking:true,reduce:true});assert.deepEqual(still,handAnchor({direction}));
 }
 for(const direction of ['left','right'])assert.notEqual(handAnchor({direction,frame:1,walking:true}).x,handAnchor({direction,frame:3,walking:true}).x);
 // Front/rear sleeves now rotate about a shoulder instead of detaching vertically.
 for(const direction of ['down','up']){const shoulder={x:-.375*(216/366*32),y:-32+2+.49*32};for(let frame=0;frame<4;frame+=.125){const p=handAnchor({direction,frame,walking:true});assert.ok(Math.abs(Math.hypot(p.x-shoulder.x,p.y-shoulder.y)-.31*32)<1e-8);}}
});

test('all player layers must load; a failed hairstyle can be retried without caching a false ready state',async()=>{
 const original=globalThis.Image,queue=[];
 globalThis.Image=class{constructor(){queue.push(this);}set src(value){this.url=value;}};
 try{const player=await import('../player-layered.js?loading-test');const first=player.preparePlayer();assert.equal(player.preparePlayer(),first);assert.equal(queue.length,3);queue[0].onload();queue[1].onload();assert.equal(player.playerArtStatus(),'loading');queue[2].onerror();assert.equal(await first,false);assert.equal(player.playerArtStatus(),'unavailable');
  const retry=player.preparePlayer();assert.equal(queue.length,6);queue.slice(3).forEach(image=>image.onload());assert.equal(await retry,true);assert.equal(player.playerArtStatus(),'ready');
 }finally{globalThis.Image=original;}
});

test('NPC loading callers wait for the same complete cast, including a retried missing resident',async()=>{
 const original=globalThis.Image,queue=[];globalThis.Image=class{constructor(){queue.push(this);}set src(value){this.url=value;}};
 try{const cast=await import('../chapter-characters.js?loading-test');const first=cast.prepareCharacters();assert.equal(cast.prepareCharacters(),first);assert.equal(queue.length,3);queue[0].onload();queue[1].onload();queue[2].onerror();assert.equal(await first,false);const retry=cast.prepareCharacters();assert.equal(queue.length,6);queue.slice(3).forEach(image=>image.onload());assert.equal(await retry,true);}finally{globalThis.Image=original;}
});
