import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ACTION_DATA, actionFrame, swingFrame, SWING_DURATION} from '../walk-frame-proof/action-frames.js';
import {colourHead, colourBodySkin} from '../walk-frame-proof/character-colour.js';

test('action cells and hand anchors fit the original PNG dimensions', async () => {
  for (const data of Object.values(ACTION_DATA)) {
    const png = await readFile(new URL('../walk-frame-proof/' + data.file, import.meta.url));
    for (const [frame,[x,y,w,h]] of data.rects.entries()) {
      assert.ok(x+w <= png.readUInt32BE(16) && y+h <= png.readUInt32BE(20));
      const [hx,hy] = data.hands[frame];
      assert.ok(hx >= 0 && hy >= 0 && hx < w && hy < h);
    }
  }
  for (const outfit of [0,1]) {
    const left = actionFrame('left',outfit,2), right = actionFrame('right',outfit,2);
    assert.equal(left.gripX,right.gripX);
    assert.equal(left.mirror,false);
    assert.equal(right.mirror,true);
    assert.equal(actionFrame('up',outfit,2).behind,true);
  }
});

test('a tool swing holds each action in order and reduced motion shows contact', () => {
  assert.deepEqual([0,190,400,515,SWING_DURATION].map(ms => swingFrame(ms)),[0,1,2,3,0]);
  assert.equal(swingFrame(0,true),2);
});

test('character tint preserves eyes, transparent pixels, and skin outside registered hand and knee rows', () => {
  const eye = [90,45,29,253], skin = [226,136,73,253], transparent = [226,136,73,0];
  const head = new Uint8ClampedArray(100*100*4);
  const offset = (x,y) => (y*100+x)*4;
  head.set(eye,offset(35,36)); head.set(skin,offset(54,40)); head.set(transparent,offset(48,42));
  colourHead(head,100,100,0,0,5,3);
  assert.deepEqual(Array.from(head.slice(offset(35,36),offset(35,36)+4)),eye);
  assert.notDeepEqual(Array.from(head.slice(offset(54,40),offset(54,40)+4)),skin);
  assert.deepEqual(Array.from(head.slice(offset(48,42),offset(48,42)+4)),transparent);
  const body = new Uint8ClampedArray([...skin,...skin,...skin]);
  colourBodySkin(body,1,{rects:[[0,0,1,3]]},[[[0,1,0,1]]],5);
  assert.deepEqual(Array.from(body.slice(0,4)),skin);
  assert.notDeepEqual(Array.from(body.slice(4,8)),skin);
  assert.deepEqual(Array.from(body.slice(8)),skin);
});

