import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {garmentMask,colourGarment} from '../walk-frame-proof/garment-mask.js';
import {DIRECTIONS,frameSpec,handAt,drawBody,VEST_DATA} from '../walk-frame-proof/cycle-v2.js';

test('garment selection excludes skin, cream, brown outlines and pixels outside the registered torso',()=>{
 const width=8,height=10,pixels=new Uint8ClampedArray(width*height*4);
 const put=(x,y,rgba)=>pixels.set(rgba,(y*width+x)*4);
 for(const [x,colour] of [[0,[90,105,65,255]],[1,[225,160,90,255]],[2,[240,215,170,255]],[3,[38,30,23,255]],[4,[90,105,65,0]]])put(x,6,colour);
 put(0,1,[90,105,65,255]);put(0,9,[90,105,65,255]);
 const geometry={height:10,rects:Array(4).fill([0,0,8,10]),anchors:Array(4).fill([4,10])};
 const mask=garmentMask(pixels,width,height,geometry);
 assert.equal(mask[6*width],1);assert.equal(mask.reduce((a,b)=>a+b),1);
 for(let palette=0;palette<6;palette++){
  const before=new Uint8ClampedArray(pixels),after=colourGarment(pixels,mask,palette);
  assert.deepEqual(pixels,before);assert.notDeepEqual(after.slice(6*width*4,6*width*4+3),pixels.slice(6*width*4,6*width*4+3));
  for(let n=0;n<mask.length;n++){assert.equal(after[n*4+3],pixels[n*4+3]);if(!mask[n])assert.deepEqual(after.slice(n*4,n*4+4),pixels.slice(n*4,n*4+4));}
 }
 assert.deepEqual(colourGarment(pixels,mask,999),pixels);
 assert.deepEqual(colourGarment(pixels,mask,-1),pixels);
});

test('vests have separate bounded cells and grips reflected consistently with their bodies',()=>{
 for(const dir of DIRECTIONS)for(let pose=0;pose<4;pose++){
  const spec=frameSpec(dir,pose,false,1),base=dir==='right'?'left':dir,data=VEST_DATA[base];
  assert.equal(spec.image,'vest-'+base);assert.deepEqual(spec.rect,data.rects[pose]);
  assert.equal(frameSpec(dir,pose,true,1).pose,0);
  const left=handAt(0,0,'left',pose,false,1),right=handAt(0,0,'right',pose,false,1);
  assert.equal(left.x,-right.x);assert.equal(left.y,right.y);
  const calls=[],c={save(){},restore(){},translate(){},scale(){},beginPath(){},rect(){},clip(){},drawImage(...a){calls.push(a);}};
  assert.deepEqual(drawBody(c,{},0,0,dir,pose,{outfit:1}),handAt(0,0,dir,pose,false,1));assert.equal(calls.length,1);
  assert.deepEqual(calls[0].slice(1,5),spec.rect);
 }
});

test('device review keeps the embedded proof on a directory URL after clean-URL redirects',async()=>{
 const html=await readFile(new URL('../walk-frame-proof/device-review.html',import.meta.url),'utf8');
 const src=html.match(/<iframe[^>]+src="([^"]+)"/)[1];
 const resolved=new URL(src,'https://example.test/games/the-fading-kingdom/walk-frame-proof/device-review');
 assert.equal(resolved.pathname,'/games/the-fading-kingdom/walk-frame-proof/');
 assert.equal(new URL('proof.js',resolved).pathname,'/games/the-fading-kingdom/walk-frame-proof/proof.js');
});
