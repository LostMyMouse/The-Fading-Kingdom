import {blocked,route,FIXED} from './chapter-model.js';
import {bakeryOpen,record} from './chapter-economy.js';
export const BRIDGE={x:45,y:25,left:46,right:48,top:24,bottom:25};
export const RIVERSIDE={x:51,y:24,left:49,right:51,top:22,bottom:27};
export const BRIDGE_COST={gold:24,wood:6,stone:4};
export const BRIDGE_LINES={
 plan:'There’s a little island across the pond. Wild berries, shady grass… no way over without very wet socks. Fancy fixing the old footbridge?',
 ready:'The supplies are by the pond. I’ll bring my tools. You can be in charge of saying whether it looks wonky.',
 waitingBasket:'I need my tool basket back before I start. The bridge supplies will wait.',
 waitingWood:'Those mill boards need to go back on the cart first. Then I can help with the bridge.',
 waiting:'I need my tool basket and those mill boards back first. Then I can help with the bridge. The supplies we set aside will wait.',
 built:'There we go. Dry socks all the way across. Mara’s already asking whether a picnic counts as bridge testing.',
 visit:'I used to look at that little island from the road. Now I can take my lunch over. Funny what a few planks can do.'
};
export const bridgeDelay=s=>s.story.timber==='taken'?(s.story.basket==='held'?BRIDGE_LINES.waiting:BRIDGE_LINES.waitingWood):s.story.basket==='held'?BRIDGE_LINES.waitingBasket:'';
export const initialBridge=()=>({started:false,built:false,builtDay:0,berryDay:0});
const inBox=(p,b)=>p.x>=b.left&&p.x<=b.right&&p.y>=b.top&&p.y<=b.bottom;
export const bridgeGround=(s,x,y)=>!!s.bridge?.built&&(inBox({x,y},BRIDGE)||inBox({x,y},RIVERSIDE));
export const bridgeDeck=(x,y)=>inBox({x,y},BRIDGE);
export const bakeryContributed=s=>s.economy.fullDays>0||s.economy.lastIncome>0;
const at=(s,p)=>s.room===(p.room||'outside')&&Math.abs(s.player.x-p.x)+Math.abs(s.player.y-p.y)<=1;
export function bridgeSiteClear(s){return !blocked(s,BRIDGE.x,BRIDGE.y,'outside')&&route(s,FIXED.home,BRIDGE,'outside').length>0;}
export function bridgeAction(s,id,data={}){const b=s.bridge;
 switch(id){
 case 'startBridge':
  if(b.started)return 'The bridge supplies are already set aside. Have a word with Orin when you’re ready.';
  if(!bakeryOpen(s)||!s.story.orin||!bakeryContributed(s))return 'Get Mara settled, cook together and let the bakery trade for a morning. Then we can plan the bridge.';
  if(!bridgeSiteClear(s))return 'Leave a way to the west bank of the pond. Move anything blocking that approach before setting supplies aside.';
  if(s.economy.gold<BRIDGE_COST.gold||s.inventory.wood<BRIDGE_COST.wood||s.inventory.stone<BRIDGE_COST.stone)return 'The bridge needs 24 village gold, 6 stored wood and 4 stored stone. Carried supplies need dropping off first.';
  s.economy.gold-=BRIDGE_COST.gold;s.inventory.wood-=BRIDGE_COST.wood;s.inventory.stone-=BRIDGE_COST.stone;b.started=true;record(s,'bridge',-BRIDGE_COST.gold);return 'Bridge supplies set aside by the pond. Orin can help put them together.';
 case 'finishBridge':{
  if(!b.started)return 'Set aside the bridge supplies through the village fund first.';if(b.built)return 'The footbridge is ready. Try the path across the pond.';
  if(!s.story.orin||!at(s,data.npc||FIXED.orin))return 'Find Orin to build the footbridge together.';
  if(s.story.timber==='taken'||s.story.basket==='held'){if(s.story.timber==='taken')s.story.timberNoticed=true;return bridgeDelay(s);}
  if(!bridgeSiteClear(s))return 'The bank needs a clear approach before we put the last boards down.';
  b.built=true;b.builtDay=s.day;return BRIDGE_LINES.built;
 }
 case 'riverBerries':
  if(!b.built||!at(s,RIVERSIDE))return 'The wild berries are on the island, across the footbridge.';
  if(b.berryDay>=s.day)return 'Let’s leave those for the birds. Try this patch again tomorrow.';
  if(s.inventory.berry>999998)return 'Your berry basket is full. Use a few before picking more.';
  b.berryDay=s.day;s.inventory.berry+=2;return 'Two ripe berries. A rather nice spot to bring your lunch.';
 default:return null;
 }
}
export function readBridge(s,int){const b=s.bridge;if(b===undefined)return initialBridge();if(!b||typeof b.started!=='boolean'||typeof b.built!=='boolean'||!int(b.builtDay,0,s.day)||!int(b.berryDay,0,s.day)||b.built&&!b.started||b.built!==(b.builtDay>0)||!b.built&&b.berryDay||b.started&&!(s.house?.stage===3&&s.story?.cooked&&s.story?.orin))throw Error('Invalid footbridge');return {started:b.started,built:b.built,builtDay:b.builtDay,berryDay:b.berryDay};}
// Observed events only: this recap is not a kindness score or a new reward.
export function residentLoop(s){const open=bakeryOpen(s),earned=open&&bakeryContributed(s),short=s.economy.flour.noticed&&['held','used','replacement'].includes(s.economy.flour.state),b=s.bridge||initialBridge();return {
 title:'Mara and the riverside',
 chapters:[{title:'A front door',done:s.house?.stage===3,text:'You choose Mara’s home and help build it with Orin.'},{title:'An oven going',done:!!s.story.cooked,text:'Your carrot and Mara’s flour make a first tray together.'},{title:'A shared village fund',done:earned,text:short?'A missing order sack meant a smaller batch and less village gold. Full orders return once the sack is back.':'Mara sells bread and contributes to shared projects each morning.'},{title:'A path across the pond',done:b.built,text:b.built?'The footbridge opens the island and its wild berry patch.':b.started?'The supplies are set aside. Orin will help put the bridge together.':'Village gold and stored materials can restore the old footbridge.'}],
 action:!open?'chapter':!earned?'sleep':!b.started?'plan':!b.built?'help':'visit',
 label:!open?'Continue getting settled':!earned?'Sleep until morning':!b.started?'Look at the bridge plan':!b.built?'Find Orin about the bridge':'Visit the island'
 };}
