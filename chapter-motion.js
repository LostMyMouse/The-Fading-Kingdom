// Preserve frame-time remainder at tile boundaries; animation advances only with travel.
export const STEP_MS=135;
export function advanceWalk(state,dt,nextStep,isBlocked,stopAt=()=>null){
 const out={step:state.step,old:{...state.old},player:{x:state.player.x,y:state.player.y},clock:state.clock||0,direction:state.direction||'down',walking:false,started:0,done:false,blocked:false,portal:null};let remaining=Math.max(0,Math.min(50,dt));
 while(remaining>0){
  if(out.step<=0){const next=nextStep(out.player);if(!next){out.done=true;break;}if(isBlocked(next)){out.portal=stopAt(out.player);out.blocked=!out.portal;break;}out.old={...out.player};out.direction=next.x>out.player.x?'right':next.x<out.player.x?'left':next.y>out.player.y?'down':'up';out.player={x:next.x,y:next.y};out.step=STEP_MS;out.started++;}
  const used=Math.min(remaining,out.step);out.step-=used;remaining-=used;out.clock+=used;out.walking=true;if(out.step===0){out.portal=stopAt(out.player);if(out.portal)break;}
 }
 if(!out.walking&&out.step===0)out.clock=0;return out;
}
export function blinkAt(clock=0,seed=0,reduce=false){if(reduce)return false;const period=4700+(seed%5)*310,phase=((clock+seed*577)%period+period)%period;return phase>period-150;}

// Trigger only on completed movement into a threshold, never on stationary room spawns.
export function doorAt(s,p=s.player){
 if(s.room!=='outside')return p.x===8&&p.y===12?'exit':null;
 if(p.x===11&&p.y===12)return 'enterHome';
 const h=s.house;return h?.stage===3&&p.x===h.x+2&&p.y===h.y+4?'enterBakery':null;
}
