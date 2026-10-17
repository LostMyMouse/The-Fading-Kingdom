import {route,blocked,FIXED} from './chapter-model.js';
import {blinkAt} from './chapter-motion.js';
export function breakfastRoute(s){const h=s.house,door={x:h.x+2,y:h.y+4};const open=(choices)=>choices.find(p=>!blocked(s,p.x,p.y,'bakery'))||choices[0];const counter=open([{x:6,y:5},{x:5,y:5},{x:6,y:6}]),seat=open([{x:6,y:8},{x:6,y:9},{x:5,y:8}]);return [
 {room:'outside',...FIXED.orin,hold:5000,face:'down',activity:'Carpentry',work:true},
 ...(s.economy.projects.market?[{room:'outside',x:6,y:17,hold:5000,face:'up',activity:'Checking the breakfast stall'}]:[]),
 {room:'outside',...door,hold:0,face:'up',activity:'Visiting the bakery'},
 {room:'bakery',x:8,y:11,hold:0,face:'up',activity:'Visiting the bakery'},
 {room:'bakery',...counter,hold:10000,face:'up',activity:'Buying breakfast',exchange:true},
 {room:'bakery',...seat,hold:6000,face:'left',activity:'Breakfast break'},
 {room:'bakery',x:8,y:12,hold:0,face:'down',activity:'Back to the workshop'},
 {room:'outside',...door,hold:0,face:'down',activity:'Back to the workshop'},
 {room:'outside',...FIXED.orin,hold:16000,face:'down',activity:'Carpentry',work:true},
 {room:'outside',x:18,y:19,hold:6000,face:'left',activity:'Checking supplies'}
 ];}
// One persistent visitor across rooms. Looking away never restarts his journey.
export function createBakeryVisitor(){let a=null;
 return {reset(){a=null;},location(){return a?{room:a.room,x:Math.round(a.x),y:Math.round(a.y)}:null;},update(s,dt,{paused=false,reduce=false,cue=null}={}){
  if(s.house?.stage!==3||!s.story.cooked){a=null;return null;}
  const stops=breakfastRoute(s),key=[s.day,s.house.x,s.house.y,s.economy.projects.market].join(':'),delta=Math.max(0,Math.min(50,dt));
  if(!a||a.key!==key)a={key,room:'outside',node:{...FIXED.orin},x:18,y:17,index:0,wait:stops[0].hold,path:[],next:null,progress:0,clock:0,direction:'down'};
  const speaking=cue?.speaker==='orin';if(!paused||speaking)a.clock+=delta;let walking=false;
  if(!paused&&!reduce&&!speaking){
   if(a.next){const occupied=s.room===a.room&&s.player.x===a.next.x&&s.player.y===a.next.y;
    if(blocked(s,a.next.x,a.next.y,a.room)){a.next=null;a.path=[];a.x=a.node.x;a.y=a.node.y;a.wait=500;}
    else if(!occupied){a.progress=Math.min(1,a.progress+delta/400);walking=true;a.x=a.node.x+(a.next.x-a.node.x)*a.progress;a.y=a.node.y+(a.next.y-a.node.y)*a.progress;if(a.progress===1){a.node={...a.next};a.next=null;a.progress=0;}}
   }else if(a.path.length){a.next=a.path.shift();a.progress=0;const dx=a.next.x-a.node.x,dy=a.next.y-a.node.y;a.direction=dx>0?'right':dx<0?'left':dy>0?'down':'up';}
   else if(a.wait>0){a.wait=Math.max(0,a.wait-delta);a.direction=stops[a.index].face;}
   else{const target=stops[a.index],at=a.node.x===target.x&&a.node.y===target.y;
    if(at){const nextIndex=(a.index+1)%stops.length,next=stops[nextIndex];const occupied=next.room!==a.room&&(blocked(s,next.x,next.y,next.room)||s.room===next.room&&s.player.x===next.x&&s.player.y===next.y);if(occupied)a.wait=400;else{a.index=nextIndex;if(next.room!==a.room){a.room=next.room;a.node={x:next.x,y:next.y};a.x=next.x;a.y=next.y;}a.wait=next.hold;}}
    const stop=stops[a.index];const decor=a.room==='outside'?[...s.decor,...[17,18,19].map(x=>({x,y:16,room:'outside',type:'bench'}))]:s.decor;a.path=route(s,a.node,stop,a.room,s.house,decor);if(!a.path.length&&(a.node.x!==stop.x||a.node.y!==stop.y))a.wait=500;
   }
  }
  const stop=stops[a.index],settled=!walking&&!a.next&&!a.path.length&&a.node.x===stop.x&&a.node.y===stop.y;
  if(speaking&&cue.talking){const dx=s.player.x-a.x,dy=s.player.y-a.y;a.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
  const short=s.economy.lastBatch==='small',exchange=settled&&stop.exchange&&!speaking;
  const speech=exchange?(a.wait>6500?(short?'Just the small loaf today?':'Morning! Usual breakfast?'):a.wait>3000?(short?'Save the last one for the road.':'One now. One for the road.'):null):null;
  return {name:'orin',room:a.room,anchor:{...FIXED.orin},x:a.x,y:a.y,tileX:Math.round(a.x),tileY:Math.round(a.y),direction:a.direction,walking,work:settled&&!!stop.work&&!speaking,emotion:speaking?cue.emotion:'neutral',talking:!!(speaking&&cue.talking),activity:stop.activity,clock:a.clock,gait:a.clock/150,blink:blinkAt(a.clock,4,reduce),speech,speechSpeaker:a.wait>6500&&!short?'Mara':'Orin',breakfast:settled&&stop.activity==='Breakfast break',frame:0};
 }};
}
