import {blocked,mara,FIXED} from './chapter-model.js';
// Scene actors are transient presentation state; they never change saves or rewards.
export const SPRITE_RECTS={
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
 if(!reduce&&clock%5600<180)return 16;
 return (rows[direction]??0)*4;
}
export function createActors(){
 const actors=new Map();
 return {reset(){actors.clear();},update(s,dt,{paused=false,reduce=false,cue=null}={}){
  const anchors=[];if(s.room==='outside')anchors.push(['orin',FIXED.orin]);const m=mara(s);if(m)anchors.push(['mara',m]);
  const visible=new Set(anchors.map(([name])=>name));for(const name of actors.keys())if(!visible.has(name))actors.delete(name);
  return anchors.map(([name,anchor])=>{
   const key=s.room+':'+anchor.x+','+anchor.y;let a=actors.get(name);
   if(!a||a.key!==key){a={key,x:anchor.x,y:anchor.y,direction:'down',clock:name==='orin'?1500:3200};actors.set(name,a);}
   const speaking=cue?.speaker===name;if(!paused||speaking)a.clock+=Math.max(0,Math.min(dt,50));
   const distance=Math.abs(s.player.x-anchor.x)+Math.abs(s.player.y-anchor.y);
   let target=anchor;const phase=a.clock%10000;
   if(!paused&&!reduce&&!speaking&&distance>5&&phase>=6000&&phase<7600){
    const dirs=[[0,1],[-1,0],[0,-1],[1,0]],d=dirs[Math.floor(a.clock/10000)%4];
    const candidate={x:anchor.x+d[0],y:anchor.y+d[1]};
    if(!blocked(s,candidate.x,candidate.y)&&!(s.room==='outside'&&candidate.y===16&&candidate.x>=17&&candidate.x<=19)&&!s.plots.some(p=>p.x===candidate.x&&p.y===candidate.y)&&!(s.room==='outside'&&candidate.y===17&&candidate.x===20))target=candidate;
   }
   let walking=false;
   if(reduce){a.x=anchor.x;a.y=anchor.y;}
   else if(!paused){const dx=target.x-a.x,dy=target.y-a.y,delta=Math.abs(dx)+Math.abs(dy);
    if(delta>.001){walking=true;a.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';const n=Math.min(1,dt/1000*2.5/delta);a.x+=dx*n;a.y+=dy*n;}
    else if(distance<=4){const dx=s.player.x-anchor.x,dy=s.player.y-anchor.y;a.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
   }
   const work=!speaking&&!walking&&distance>2&&(name==='orin'||s.room==='bakery')&&phase<4200;
   const emotion=speaking?cue.emotion:'neutral',talking=speaking&&cue.talking;
   return {name,anchor:{...anchor},x:a.x,y:a.y,direction:a.direction,walking,work,emotion,talking,clock:a.clock,frame:animationFrame({direction:a.direction,walking,work,emotion,talking,clock:a.clock,reduce})};
  });
 }};
}

/** Opposing limb travel for a four-beat walk: pass, left contact, pass, right contact. */
export function gaitPose(frame){const phase=[0,1,0,-1][((frame%4)+4)%4];return {leftLeg:phase,rightLeg:-phase,leftArm:-phase,rightArm:phase};}
