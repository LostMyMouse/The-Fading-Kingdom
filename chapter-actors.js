import {squareActive,squareDelay,squareStops} from './chapter-square.js';
import {rowan} from './chapter-gardener.js';
import {createBakeryVisitor} from './chapter-visits.js';
import {blinkAt} from './chapter-motion.js';
import {blocked,mara,FIXED,route} from './chapter-model.js';
// Scene actors are transient presentation state; they never change saves or rewards.
export const SPRITE_RECTS={
 rowan:[[80,16,148,231],[321,16,148,234],[560,16,147,231],[802,16,147,233],[80,254,144,226],[320,254,145,226],[560,254,145,226],[801,257,145,223],[80,487,149,228],[319,487,149,228],[560,487,149,228],[799,488,149,227],[80,723,147,224],[320,724,147,223],[560,723,146,224],[802,724,146,223],[79,960,151,243],[320,960,151,243],[559,960,151,243],[801,959,157,244],[71,1215,161,272],[317,1215,157,272],[552,1215,160,272],[798,1215,159,272]],
 mara:[[78,21,147,227],[320,21,147,230],[552,21,146,227],[793,21,150,230],[94,258,139,223],[337,261,134,219],[572,261,136,219],[812,261,139,219],[85,491,142,223],[332,492,141,222],[561,491,143,223],[808,492,141,222],[93,723,130,221],[339,723,129,223],[568,723,129,222],[812,723,127,223],[84,964,145,237],[323,964,145,237],[559,964,146,237],[793,962,150,239],[76,1217,154,274],[314,1217,159,274],[547,1216,175,275],[793,1217,161,274]],
 orin:[[89,25,136,223],[337,24,135,227],[569,24,135,224],[822,24,137,227],[94,260,126,225],[337,261,128,222],[579,261,125,224],[825,260,126,223],[93,496,132,227],[345,496,131,224],[575,496,133,227],[827,496,132,227],[97,730,122,225],[340,729,121,224],[578,730,124,225],[826,730,121,226],[79,964,142,239],[330,965,139,242],[571,965,140,239],[820,964,154,238],[74,1216,160,242],[332,1216,150,243],[551,1216,169,242],[819,1216,140,242]]
};
const rows={down:0,left:1,right:2,up:3};
export function animationFrame({direction='down',walking=false,work=false,emotion='neutral',talking=false,clock=0,reduce=false}={}){
 if(walking&&!reduce)return (rows[direction]??0)*4+Math.floor(clock/150)%4;
 if(emotion==='amused'||emotion==='happy')return reduce||Math.floor(clock/450)%2?18:0;
 if(emotion==='thoughtful'||emotion==='concerned')return 19;
 if(emotion==='surprised')return 17;
 if(talking)return reduce?0:Math.floor(clock/280)%2?17:0;
 if(work)return reduce?20:20+Math.floor(clock/440)%4;
 return (rows[direction]??0)*4;
}
export function routineFor(s,name,anchor){
 if(squareActive(s)&&s.room==='outside'&&!squareDelay(s,name))return squareStops(s,name);
 if(name==='rowan')return s.room==='garden'?[{...anchor,hold:10000,work:true,face:'down',activity:'Sorting seeds'},{x:10,y:6,hold:6000,face:'left',activity:'Checking seedlings'},{x:11,y:7,hold:7000,face:'down',activity:'Taking a break'}]:[{...anchor,hold:11000,work:true,face:'down',activity:'Tending the nursery'},{x:44,y:12,hold:6500,face:'up',activity:'Checking the berry pots'},{x:42,y:12,hold:6500,face:'right',activity:'Taking a break'}];
 if(s.room==='bakery')return [
  {x:11,y:5,hold:11000,work:true,face:'down',activity:'Baking'},
  {x:10,y:6,hold:6000,face:'left',activity:'Tidying the kitchen'},
  {x:11,y:7,hold:7000,face:'down',activity:'Taking a break'}
 ];
 if(name==='orin')return [
  ...(s.economy?.projects.market?[{x:6,y:17,hold:7500,face:'up',activity:'Buying breakfast'}]:[]),
  {...anchor,hold:11000,work:true,face:'down',activity:'Carpentry'},
  {x:18,y:19,hold:6500,face:'left',activity:'Checking supplies'},
  {x:16,y:19,hold:7500,face:'right',activity:'Taking a break'}
 ];
 if(s.house?.stage===3)return [
  {...anchor,hold:9000,face:'up',activity:'Checking the herbs'},
  {x:anchor.x,y:anchor.y+2,hold:6000,face:'down',activity:'Getting some air'},
  {x:anchor.x+1,y:anchor.y+2,hold:7000,face:'left',activity:'Taking a break'}
 ];
 return [
  {...anchor,hold:10000,face:'down',activity:'Sorting the cart'},
  {x:24,y:16,hold:6000,face:'right',activity:'Stretching her legs'},
  {x:24,y:18,hold:6500,face:'left',activity:'Taking a break'}
 ];
}
export function createActors(){
 const actors=new Map(),visitor=createBakeryVisitor(),marketLocations=new Map();
 return {reset(){actors.clear();visitor.reset();marketLocations.clear();},location(name){return marketLocations.get(name)||(name==='orin'?visitor.location():null);},update(s,dt,{paused=false,reduce=false,cue=null}={}){
  const market=squareActive(s),visit=market?null:visitor.update(s,dt,{paused,reduce,cue});const delta=Math.max(0,Math.min(dt,50)),anchors=[];if(s.room==='outside'&&!visit)anchors.push(['orin',FIXED.orin]);const m=mara(s);if(m)anchors.push(['mara',m]);const r=rowan(s);if(r)anchors.push(['rowan',r]);
  if(market){for(const name of ['orin','mara','rowan']){if(squareDelay(s,name)){marketLocations.delete(name);if(name==='orin')marketLocations.set(name,{room:'outside',...FIXED.orin});}else{const last=marketLocations.get(name),a=actors.get(name),p=a||last||squareStops(s,name)[0];marketLocations.set(name,{room:'outside',x:Math.round(p.x),y:Math.round(p.y)});}}}else marketLocations.clear();
  if(market){for(let j=anchors.length-1;j>=0;j--)if(!squareDelay(s,anchors[j][0]))anchors.splice(j,1);if(s.room==='outside')for(const name of ['orin','mara','rowan'])if(!squareDelay(s,name))anchors.push([name,squareStops(s,name)[0]]);}
  const visible=new Set(anchors.map(([name])=>name));for(const name of actors.keys())if(!visible.has(name))actors.delete(name);
  const views=anchors.map(([name,anchor])=>{
   const key=s.room+':'+anchor.x+','+anchor.y+':'+(market?s.day+':'+JSON.stringify(s.decor):'ordinary');let a=actors.get(name);
   const stops=routineFor(s,name,anchor);
   if(!a||a.key!==key){const initial=Math.max(0,stops.findIndex(p=>p.x===anchor.x&&p.y===anchor.y));a={key,node:{...anchor},x:anchor.x,y:anchor.y,next:null,progress:0,path:[],index:initial,wait:stops[initial].hold,direction:stops[initial].face,clock:0};actors.set(name,a);}
   const speaking=cue?.speaker===name;if(!paused||speaking)a.clock+=delta;
   let walking=false;
   if(!paused&&!speaking&&!reduce){
    if(a.next){
     // A blocked path pauses the errand. It never causes a resident to chase the player.
     const occupied=s.player.x===a.next.x&&s.player.y===a.next.y;
     if(!occupied&&!blocked(s,a.next.x,a.next.y)){
      a.progress=Math.min(1,a.progress+delta/750);walking=true;
      a.x=a.node.x+(a.next.x-a.node.x)*a.progress;a.y=a.node.y+(a.next.y-a.node.y)*a.progress;
      if(a.progress===1){a.node={...a.next};a.next=null;a.progress=0;}
     }else if(blocked(s,a.next.x,a.next.y)){a.path=[];a.next=null;a.x=a.node.x;a.y=a.node.y;a.wait=1000;}
    }else if(a.path.length){a.next=a.path.shift();a.progress=0;const dx=a.next.x-a.node.x,dy=a.next.y-a.node.y;a.direction=dx>0?'right':dx<0?'left':dy>0?'down':'up';}
    else if(a.wait>0){a.wait=Math.max(0,a.wait-delta);a.direction=stops[a.index].face;}
    else{
     a.index=(a.index+1)%stops.length;const stop=stops[a.index];a.wait=stop.hold;
     const decor=s.room==='outside'?[...s.decor,...[17,18,19].map(x=>({x,y:16,room:'outside',type:'bench'}))]:s.decor;
     a.path=route(s,a.node,stop,s.room,s.house,decor);
     if(!a.path.length&&(a.node.x!==stop.x||a.node.y!==stop.y))a.wait=400;
    }
   }
   if(speaking&&cue.talking){const dx=s.player.x-a.x,dy=s.player.y-a.y;a.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
   const work=!speaking&&!walking&&!a.next&&!a.path.length&&!!stops[a.index].work;
   const emotion=speaking?cue.emotion:'neutral',talking=!!(speaking&&cue.talking);
   return {blink:blinkAt(a.clock,name==='mara'?1:name==='rowan'?3:4,reduce),gait:a.clock/150,name,anchor:{...anchor},x:a.x,y:a.y,tileX:Math.round(a.x),tileY:Math.round(a.y),direction:a.direction,walking,work,emotion,talking,activity:stops[a.index].activity,...(market&&!speaking&&!walking&&!a.path.length&&a.wait>6500?{speech:name==='mara'?'Tray’s here. Mind the warm ones!':name==='orin'?'Built this bench. Very thorough testing.':"That plant’s enjoying the company.",speechSpeaker:name==='mara'?'Mara':name==='orin'?'Orin':'Rowan'}:{}),clock:a.clock,frame:animationFrame({direction:a.direction,walking,work,emotion,talking,clock:a.clock,reduce})};
  });if(market&&s.room==='outside')for(const n of views)marketLocations.set(n.name,{room:'outside',x:n.tileX,y:n.tileY});if(visit&&visit.room===s.room){visit.frame=animationFrame({...visit,reduce});views.push(visit);}return views;
 }};
}

/** Opposing limb travel for a four-beat walk: pass, left contact, pass, right contact. */
export {gaitPose} from './character-rig.js';
