import test from 'node:test';import assert from 'node:assert/strict';import {drawRig} from '../character-rig.js';
// Geometric raster probe: an opaque source makes exposed space at a join
// observable without a browser or a native canvas dependency. Real art still
// needs visual inspection; this specifically guards the former hip cut line.
function probe(){let m=[1,0,0,1,0,0];const stack=[],pieces=[];return {pieces,save(){stack.push([...m]);},restore(){m=stack.pop();},getTransform(){return {a:m[0],d:m[3],e:m[4],f:m[5]};},translate(x,y){m[4]+=m[0]*x+m[2]*y;m[5]+=m[1]*x+m[3]*y;},rotate(t){const [a,b,c,d,e,f]=m,co=Math.cos(t),si=Math.sin(t);m=[a*co+c*si,b*co+d*si,c*co-a*si,d*co-b*si,e,f];},fillRect(){},drawImage(...args){pieces.push({m:[...m],box:args.slice(-4)});}};}
function covered(p,x,y){return p.pieces.some(({m:[a,b,c,d,e,f],box:[l,t,w,h]})=>{const det=a*d-b*c,dx=x-e,dy=y-f,u=(d*dx-c*dy)/det,v=(-b*dx+a*dy)/det;return u>=l&&u<=l+w&&v>=t&&v<=t+h;});}
test('side walking keeps a continuous clothing bridge over both hip pivots through the whole stride',()=>{
 for(const direction of ['left','right'])for(let frame=0;frame<4;frame+=.125){const c=probe();drawRig(c,{},[0,0,200,320],{direction,walking:true,frame},50,80);for(let u=.16;u<=.84;u+=.04)for(const v of [.845,.86,.88])assert.ok(covered(c,40+u*20,50+v*32),`${direction} phase ${frame}: exposed hip ${u},${v}`);}
});

test('walking feet stay level and their upper overlap remains under an unrotated pelvis',()=>{
 for(const direction of ['left','right'])for(let frame=0;frame<4;frame+=.125){const c=probe();drawRig(c,{},[0,0,200,320],{direction,walking:true,frame},50,80);for(const foot of c.pieces.slice(0,2)){assert.equal(foot.m[1],0);assert.equal(foot.m[2],0);}for(let u=.16;u<=.84;u+=.04)for(const v of [.89,.90,.905])assert.ok(covered(c,40+u*20,50+v*32),`${direction} ${frame} exposed lower hip`);}
});
