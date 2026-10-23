import test from 'node:test';import assert from 'node:assert/strict';
import {WIDTH,HEIGHT,SPAWN,STOPS,blocked,route} from '../outdoor-review/world.js';
test('outdoor review keeps every open square and independent resident stop reachable',()=>{
 for(let y=1;y<HEIGHT-1;y++)for(let x=1;x<WIDTH-1;x++)if(!blocked({x,y})){const path=route(SPAWN,{x,y});assert.ok(path,`Unreachable ${x},${y}`);let prev=SPAWN;for(const step of path){assert.equal(Math.abs(step.x-prev.x)+Math.abs(step.y-prev.y),1);assert.equal(blocked(step),false);prev=step;}}
 for(const stops of Object.values(STOPS))for(let i=0;i<stops.length;i++)assert.ok(route(stops[i],stops[(i+1)%stops.length]));
});
test('outdoor routes reject props, cottage footprint and off-map taps',()=>{for(const p of [{x:4,y:4},{x:15,y:9},{x:16,y:13},{x:0,y:4},{x:24,y:8},{x:NaN,y:1}])assert.equal(route(SPAWN,p),null);assert.deepEqual(route(SPAWN,SPAWN),[]);});
