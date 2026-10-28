import {toolHand,pixelAnchor} from './character-rig.js';
import {SITES,siteStatus,siteVisible,WORKSHOP} from './chapter-gathering.js';
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
export function drawGatheringTool(c,x,y,direction,action){
 const hand=toolHand(direction,action.progress),[hx,hy]=pixelAnchor(c,x+hand.x,y+hand.y);
 c.save();c.translate(hx,hy);c.rotate(direction==='up'?Math.PI-hand.angle:hand.angle);rect(c,-1,-2,3,16,'#654c36');rect(c,0,-1,1,14,'#ba9360');
 if(action.tool==='axe'){rect(c,-6,8,9,7,'#493f36');rect(c,-5,9,6,5,'#7d938e');rect(c,-5,9,5,2,'#b5c6b4');rect(c,-6,10,1,3,'#e2e5ca');rect(c,-4,12,4,2,'#9daea0');rect(c,0,9,2,4,'#a98b5c');rect(c,0,10,1,1,'#e0c591');}
 else{rect(c,-6,9,12,4,'#493f36');rect(c,-4,8,9,2,'#6d847d');rect(c,-4,9,9,2,'#bdcab6');rect(c,-7,11,3,2,'#8da397');rect(c,-7,12,2,2,'#d7ddc2');rect(c,5,11,3,2,'#84998e');rect(c,6,12,2,2,'#d6ddc3');rect(c,0,9,1,2,'#c3a878');}
 c.restore();
}
export function drawGatheringSites(c,s,action=null){
 for(const n of SITES){if(!siteVisible(s,n))continue;const p=siteStatus(s,n),x=n.x*16,y=n.y*16;
  rect(c,x,y+11,16,3,'#38573a35');
  if(p.left){for(let i=0;i<p.left;i++){if(n.kind==='wood'){rect(c,x+2+i*6,y+7,5,5,'#ad8955');rect(c,x+2+i*6,y+7,2,4,'#e2c28b');}else{rect(c,x+2+i*6,y+7,5,5,'#aeb8a3');rect(c,x+3+i*6,y+7,3,1,'#d8d8ba');}}}
  else if(p.depleted){rect(c,x+3,y+11,9,2,n.kind==='wood'?'#9a8159':'#a0a991');}
  else if(n.kind==='wood'){rect(c,x-1,y+6,18,7,'#6f5339');rect(c,x,y+5,16,6,'#ad8050');rect(c,x+1,y+6,3,6,'#dec28c');rect(c,x+2,y+8,1,2,'#927043');rect(c,x+7,y+6,7,1,'#cda46a');rect(c,x+10,y+3,3,4,'#80603f');if(p.hits)rect(c,x+8,y+7,1,6,'#4d422d');}
  else{rect(c,x+1,y+7,14,6,'#7b887d');rect(c,x+3,y+3,10,9,'#a8b3a0');rect(c,x+5,y+2,6,3,'#c6cbb0');rect(c,x+4,y+5,3,2,'#bdc6ac');if(p.hits){rect(c,x+8,y+5,1,4,'#65786c');rect(c,x+7,y+8,2,3,'#65786c');}}
  if(action?.id===n.id&&action.progress>.5){const t=(action.progress-.5)*2;for(let i=0;i<4;i++)rect(c,x+8+(i-1.5)*(3+t*5),y+7-Math.sin(t*Math.PI)*7+(i%2)*3,2,2,n.kind==='wood'?'#e2c28c':'#d6dcc0');}
 }
 if(s.decor.some(d=>d.room==='outside'&&d.type!=='path'&&d.x===WORKSHOP.x&&d.y===WORKSHOP.y))return;
 const x=WORKSHOP.x*16,y=WORKSHOP.y*16;rect(c,x-3,y-4,22,5,'#d3af77');rect(c,x-2,y+1,3,10,'#74573c');rect(c,x+14,y+1,3,10,'#74573c');rect(c,x,y-3,16,2,s.gathering.job==='done'?'#e1c991':'#a7916b');if(s.gathering.job==='done'){rect(c,x+3,y-7,2,5,'#637768');rect(c,x+9,y-6,5,2,'#6d7771');}
}
