import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,readSave} from '../chapter-model.js';import {PLAYER_RECTS,materialRamp,sourceMaterial,playerPose} from '../player-layered.js';
test('legacy chapter appearance migrates safely while new wardrobe choices persist',()=>{
 const old=fresh();delete old.player.outfit;delete old.player.hat;old.player.style=2;old.player.skin=5;
 const migrated=readSave(JSON.stringify(old));assert.equal(migrated.player.outfit,0);assert.equal(migrated.player.hat,0);assert.equal(migrated.player.style,2);assert.equal(migrated.player.skin,5);
 migrated.player.outfit=1;migrated.player.hat=1;migrated.player.style=1;
 assert.deepEqual(readSave(JSON.stringify(migrated)).player,migrated.player);
});
test('invalid wardrobe ids cannot silently replace a valid appearance',()=>{
 for(const key of ['outfit','hat'])for(const value of [-1,2,'1',null]){const s=fresh();s.player[key]=value;assert.throws(()=>readSave(JSON.stringify(s)));}
});
test('coherent templates have four measured directions within the source image',()=>{
 assert.equal(PLAYER_RECTS.length,3);for(const row of PLAYER_RECTS){assert.equal(row.length,4);for(const [x,y,w,h]of row)assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=1024&&y+h<=1536);}
});
test('material palettes preserve ordered shadow and highlight ramps',()=>{
 for(const colour of ['#593c34','#f3c99b','#352c31','#ded4b0','#799c84']){const ramp=materialRamp(colour);assert.equal(ramp.length,5);for(let i=1;i<5;i++)assert.ok(ramp[i].reduce((a,b)=>a+b)>ramp[i-1].reduce((a,b)=>a+b));}
});
test('wardrobe movement alternates opposing limbs; reduced motion keeps a stable pose',()=>{
 const left=playerPose(1,true),right=playerPose(3,true);for(const key of ['leftLeg','rightLeg','leftArm','rightArm'])assert.equal(left[key],-right[key]);
 assert.equal(left.leftLeg,-left.leftArm);assert.equal(left.rightLeg,-left.rightArm);assert.deepEqual(playerPose(1,true,true),playerPose(0,false));
});

test('measured olive shirt pixels remain clothing rather than skin or hair',()=>{
 for(const rgb of [[142,129,75],[139,127,74],[123,110,62],[137,124,75]])assert.equal(sourceMaterial(...rgb,.62),'shirt');
 assert.equal(sourceMaterial(244,143,69,.35),'skin');assert.equal(sourceMaterial(77,47,35,.15),'hair');assert.equal(sourceMaterial(30,15,8,.35),null);assert.equal(sourceMaterial(250,224,179,.62),null);
});
