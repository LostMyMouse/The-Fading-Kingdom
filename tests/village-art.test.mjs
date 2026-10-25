import test from 'node:test';
import assert from 'node:assert/strict';
import {buildingLayout,BUILDING_RECTS,prepareVillageArt,drawVillageBuilding} from '../village-art.js';
import {fresh,validHouse,readSave,FIXED} from '../chapter-model.js';
import {doorAt} from '../chapter-motion.js';

test('building art follows actual automatic thresholds at freely chosen sites',()=>{
 const s=fresh();const home=buildingLayout({x:8,y:8},true);assert.deepEqual(home.door,{x:FIXED.home.x*16+8,y:FIXED.home.y*16+8});
 let count=0;for(let y=7;y<=29;y++)for(let x=16;x<=44;x++)if(validHouse(s,x,y)){s.house={x,y,stage:3,style:count%3,trim:count%3};const g=buildingLayout(s.house);assert.equal(doorAt(s,{x:g.door.x/16-.5,y:g.door.y/16-.5}),'enterBakery');assert.equal(g.left+g.width/2,g.door.x);assert.ok(g.sortY<g.door.y);assert.deepEqual(readSave(JSON.stringify(s)),s);count++;s.house=null;}assert.ok(count>100);
});

test('atlas rectangles stay in the actual image and do not bleed across rows',()=>{for(const rect of Object.values(BUILDING_RECTS)){const [x,y,w,h]=rect;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=1254&&y+h<=1254);}assert.ok(BUILDING_RECTS.timber[1]+BUILDING_RECTS.timber[3]<BUILDING_RECTS.frame[1]);});

test('scenery loading waits for every image, retries failures, and rendering never changes a save',async()=>{
 const image=globalThis.Image,document=globalThis.document,queue=[];
 const calls=[],context=new Proxy({getImageData:()=>({data:new Uint8ClampedArray(4*4*4).fill(255)}),createPattern:()=>({}),drawImage:(...a)=>calls.push(a)}, {get:(t,k)=>k in t?t[k]:(()=>{}),set:(t,k,v)=>(t[k]=v,true)});
 globalThis.Image=class {constructor(){this.width=this.height=4;queue.push(this);}set src(s){this.url=s;}};
 globalThis.document={createElement:()=>({width:4,height:4,getContext:()=>context})};
 try{const first=prepareVillageArt();assert.equal(prepareVillageArt(),first);assert.equal(queue.length,4);queue[0].onerror();queue.slice(1).forEach(i=>i.onload());assert.equal(await first,false);
 const second=prepareVillageArt();assert.equal(queue.length,8);queue.slice(4).forEach(i=>i.onload());assert.equal(await second,true);
 const s=fresh();s.house={x:24,y:9,stage:3,style:1,trim:2};const before=JSON.stringify(s);
 for(const stage of [1,2,3])for(const style of [0,1,2]){const h={...s.house,stage,style};const old=JSON.stringify(h);assert.equal(drawVillageBuilding(context,h),true);assert.equal(JSON.stringify(h),old);const draw=calls.at(-1);assert.equal(draw.length,9);assert.ok(draw.slice(1).every(Number.isFinite));}
 assert.equal(JSON.stringify(s),before);assert.equal(drawVillageBuilding(context,{...s.house,stage:0}),false);
 }finally{globalThis.Image=image;globalThis.document=document;}
});
