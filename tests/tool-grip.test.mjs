import test from 'node:test';
import assert from 'node:assert/strict';
import {drawGatheringTool} from '../gathering-art.js';
import {toolHand} from '../character-rig.js';
function render(direction,tool,progress){const transforms=[],fills=[];const c={save(){},restore(){},getTransform(){return {a:1,d:1,e:0,f:0};},translate(x,y){transforms.push({x,y});},rotate(angle){transforms[0].angle=angle;},fillRect(x,y,w,h){fills.push({x,y,w,h});}};drawGatheringTool(c,100,100,direction,{tool,progress});return {...transforms[0],fills};}
test('a raised rear tool extends outboard of the hand instead of folding back into the head',()=>{for(const tool of ['axe','pickaxe']){const r=render('up',tool,.28);const shaftEndX=r.x-Math.sin(r.angle)*13;assert.ok(shaftEndX<r.x-8,`${tool}: rear shaft points inward`);}});
test('both gathering tools retain the sleeve grip in every direction throughout the swing',()=>{for(const direction of ['down','left','right','up'])for(const tool of ['axe','pickaxe'])for(let i=0;i<=100;i++){const progress=i/100,hand=toolHand(direction,progress),r=render(direction,tool,progress);assert.equal(r.x,Math.round(100+hand.x));assert.equal(r.y,Math.round(100+hand.y));assert.ok(Number.isFinite(r.angle));const shaft=r.fills[0];assert.ok(shaft.x<=0&&shaft.x+shaft.w>=0&&shaft.y<=0&&shaft.y+shaft.h>=0);if(direction!=='up')assert.equal(r.angle,hand.angle);}});
