import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,readSave} from '../chapter-model.js';import {PLAYER_PARTS,playerPose} from '../player-layered.js';
test('legacy chapter appearance migrates safely while new wardrobe choices persist',()=>{
 const old=fresh();delete old.player.outfit;delete old.player.hat;old.player.style=2;old.player.skin=5;
 const migrated=readSave(JSON.stringify(old));assert.equal(migrated.player.outfit,0);assert.equal(migrated.player.hat,0);assert.equal(migrated.player.style,2);assert.equal(migrated.player.skin,5);
 migrated.player.outfit=1;migrated.player.hat=1;migrated.player.style=1;
 assert.deepEqual(readSave(JSON.stringify(migrated)).player,migrated.player);
});
test('invalid wardrobe ids cannot silently replace a valid appearance',()=>{
 for(const key of ['outfit','hat'])for(const value of [-1,2,'1',null]){const s=fresh();s.player[key]=value;assert.throws(()=>readSave(JSON.stringify(s)));}
});
test('every player layer has four directions within the measured source image',()=>{
 for(const [name,views]of Object.entries(PLAYER_PARTS)){assert.equal(views.length,4);for(const view of views)for(const rect of ['arms','legs'].includes(name)?view:[view]){const [x,y,w,h]=rect;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=887&&y+h<=1774,name);}}
});
test('wardrobe movement alternates opposing limbs; reduced motion keeps a stable pose',()=>{
 const left=playerPose(1,true),right=playerPose(3,true);for(const key of ['leftLeg','rightLeg','leftArm','rightArm'])assert.equal(left[key],-right[key]);
 assert.equal(left.leftLeg,-left.leftArm);assert.equal(left.rightLeg,-left.rightArm);assert.deepEqual(playerPose(1,true,true),playerPose(0,false));
});
