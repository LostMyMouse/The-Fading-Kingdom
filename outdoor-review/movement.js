import {point} from './world.js';
// Complete each tile before invoking a doorway. An idle spawn never triggers it.
export function moveActor(actor,dt,stopAt=()=>null,nextStep=()=>null){actor.walking=false;let remaining=Math.max(0,Math.min(50,dt))*65/1000;
 while(remaining>0){if(!actor.path.length){const next=nextStep(actor.tile);if(!next)break;actor.path.push(next);}const next=actor.path[0],target=point(next),dx=target.x-actor.x,dy=target.y-actor.y,distance=Math.hypot(dx,dy);actor.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  const travel=Math.min(remaining,distance);if(distance){actor.x+=dx/distance*travel;actor.y+=dy/distance*travel;}actor.clock+=travel/65*1000;actor.walking=true;remaining-=travel;
  if(distance<=travel+.001){actor.x=target.x;actor.y=target.y;actor.tile={...next};actor.path.shift();const portal=stopAt(actor.tile);if(portal){actor.path=[];return portal;}}else break;
 }if(!actor.walking)actor.clock=0;return null;
}
