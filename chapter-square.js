import {blocked,route,FIXED} from './chapter-model.js';
export const SQUARE={x:4,y:21,left:3,right:14,top:22,bottom:24};
export const SQUARE_COST={gold:12,wood:4,stone:4};
export const SQUARE_LINES={
 orin:'A bench or two, somewhere for a natter. I can manage that. You pick the spots. My knees vote for somewhere level.',
 mara:'Two carrots? Perfect. I’ll make a tray for the square. One bun for everyone. Two for whoever carries the tray. That’s me.',
 rowan:'Flowers and a couple of little lanterns. Leave the arranging to you? Good. I’ve moved this pot six times already.',
 orinWait:'The mill roof still needs those boards, and I need my borrowed basket back. Let’s sort the cart first. Then I’m all yours.',
 maraWait:'I’m missing the flour for my orders. Could you get a sack back on the kitchen shelf? Then I can spare a tray for the square.',
 rowanWait:'My seed delivery’s missing. I’m keeping the stall going with the last few packets. Once it’s back, I can bring plants over.'
};
export function initialSquare(){return {started:false,orin:false,mara:false,rowan:false,opened:false,marketDay:0,paidDay:0,markets:0};}
export const squareAvailable=s=>s.gathering?.job==='done'&&s.house?.stage===3&&s.story.cooked&&s.gardener?.house?.stage===3&&s.economy.projects.market;
export const inSquare=d=>d.room==='outside'&&d.x>=SQUARE.left&&d.x<=SQUARE.right&&d.y>=SQUARE.top&&d.y<=SQUARE.bottom;
export function squareDelay(s,name){return name==='orin'?(s.story.timber==='taken'||s.story.basket==='held'?SQUARE_LINES.orinWait:''):name==='mara'?(['held','used','replacement'].includes(s.economy.flour.state)?SQUARE_LINES.maraWait:''):name==='rowan'?(['held','used'].includes(s.gardener.parcel)?SQUARE_LINES.rowanWait:''):'';}
export function squareLayout(s){const placed=s.decor.filter(inSquare),entry={x:SQUARE.x,y:SQUARE.y};return Object.fromEntries(['bench','planter','lantern'].map(type=>[type,placed.some(d=>d.type===type&&[[0,1],[1,0],[0,-1],[-1,0]].some(([dx,dy])=>{const p={x:d.x+dx,y:d.y+dy};return !blocked(s,p.x,p.y,'outside')&&route(s,entry,p,'outside').length>0;}))]));}
export function squareReady(s){return s.square.started&&['orin','mara','rowan'].every(n=>s.square[n]&&!squareDelay(s,n))&&Object.values(squareLayout(s)).every(Boolean)&&new Set(['orin','mara','rowan'].flatMap(n=>squareStops(s,n)).map(p=>p.x+','+p.y)).size===6;}
export const squareActive=s=>!!s.square?.started&&s.square.marketDay===s.day;
const near=(s,p)=>s.room===(p.room||'outside')&&Math.abs(s.player.x-p.x)+Math.abs(s.player.y-p.y)<=1;
export function squareAction(s,id,data={}){const q=s.square,i=s.inventory;
 switch(id){
 case 'startSquare':
  if(q.started)return 'The square is yours to arrange. Have a look at our little project board.';
  if(!squareAvailable(s))return 'Get both neighbours settled, repair the workbench and open the market stall first. Then we can make somewhere to gather.';
  if(!near(s,SQUARE))return 'Visit the old square marker, southwest of your garden.';
  if(s.economy.gold<12||i.wood<4||i.stone<4)return 'For the ground repairs: 12 village gold, 4 stored wood and 4 stored stone.';
  s.economy.gold-=12;i.wood-=4;i.stone-=4;q.started=true;s.economy.ledger.push({day:s.day,kind:'square',amount:-12});s.economy.ledger=s.economy.ledger.slice(-8);return 'We’ve levelled the old ground. Orin, Mara and Rowan each have something to bring. You get to arrange it.';
 case 'squareHelp':{
  const n=data.name;if(!['orin','mara','rowan'].includes(n)||!q.started)return 'Start with the project board at the old square.';
  if(q[n])return 'Already packed and ready. You choose where everything goes.';
  if(!data.npc||!near(s,data.npc))return 'Have a word in person. No need to shout across the village.';
  const delay=squareDelay(s,n);if(delay)return delay;
  if(n==='mara'&&i.carrot<2)return 'Two carrots for the tray. I’ll bring the rest. The garden can take its time.';
  const gifts=n==='orin'?{bench:1,path:12}:n==='rowan'?{planter:1,lantern:2}:{};
  if(Object.entries(gifts).some(([key,count])=>i[key]+count>1000000))return 'Make a little room in storage for these first.';
  if(n==='mara')i.carrot-=2;for(const [key,count]of Object.entries(gifts))i[key]+=count;q[n]=true;return SQUARE_LINES[n];
 }
 case 'openSquare':
  if(!near(s,SQUARE))return 'Visit the square marker when you’re ready to gather everyone.';
  if(squareActive(s))return 'The gathering’s already on. Enjoy a wander; we’ll put the takings in the village pot tomorrow.';
  if(!squareReady(s))return 'Check the project board: everyone’s contribution, a reachable bench, a planter and a lantern in the square. Missing work supplies need sorting first.';
  if(q.opened&&i.carrot<2)return 'Another tray needs two carrots. Bring them when you fancy another market day.';
  if(q.opened)i.carrot-=2;q.opened=true;q.marketDay=s.day;q.markets++;return 'Mara’s bringing the tray. Orin’s leaving the hammer at home. Rowan has packed rather a lot of plants. Market day!';
 default:return null;
 }
}
export function settleSquare(s){const q=s.square;if(!squareActive(s)||q.paidDay>=q.marketDay)return 0;q.paidDay=q.marketDay;const amount=['orin','mara','rowan'].filter(n=>!squareDelay(s,n)).length*2;s.economy.gold+=amount;s.economy.lastIncome+=amount;s.economy.ledger.push({day:s.day,kind:'square',amount});s.economy.ledger=s.economy.ledger.slice(-8);return amount;}
export function readSquare(value,int,day){const q=value===undefined?initialSquare():value;if(!q||['started','orin','mara','rowan','opened'].some(k=>typeof q[k]!=='boolean')||['marketDay','paidDay'].some(k=>!int(q[k],0,day))||!int(q.markets,0,day)||q.paidDay>q.marketDay||!q.started&&(q.orin||q.mara||q.rowan)||q.opened!==!!q.marketDay||q.opened!==!!q.markets||q.opened&&!(q.started&&q.orin&&q.mara&&q.rowan)||q.markets>q.marketDay)throw Error('Invalid village square');return Object.fromEntries(Object.keys(initialSquare()).map(k=>[k,q[k]]));}
// Deterministic places to browse and chat. Never target the player's position.
const stopCache=new WeakMap();
export function squareStops(s,name){const cacheKey=JSON.stringify(s.decor);let cached=stopCache.get(s);if(cached?.key===cacheKey)return cached.stops[name];const items=s.decor.filter(inSquare),preferred=['bench','planter','lantern'].flatMap(type=>{const d=items.find(d=>d.type===type);return d?[[d.x,d.y+1],[d.x+1,d.y],[d.x,d.y-1],[d.x-1,d.y]]:[];}),all=[...preferred,...Array.from({length:36},(_,j)=>[3+j%12,22+Math.floor(j/12)])],used=new Set();const spots=[];
 for(const [x,y]of all){const key=x+','+y;if(used.has(key)||x<=5&&y<=23||x<SQUARE.left||x>SQUARE.right||y<SQUARE.top||y>SQUARE.bottom||spots.some(p=>Math.max(Math.abs(p.x-x),Math.abs(p.y-y))<2)||blocked(s,x,y,'outside')||!route(s,{x:SQUARE.x,y:SQUARE.y},{x,y},'outside').length)continue;used.add(key);spots.push({x,y});}
 const stops={};for(const resident of ['orin','mara','rowan']){const offset={orin:0,mara:2,rowan:4}[resident],p=spots[offset%spots.length]||FIXED.orin,b=spots[(offset+1)%spots.length]||p;stops[resident]=[{...p,hold:{orin:10000,mara:8000,rowan:13000}[resident],face:'down',activity:resident==='orin'?'Resting by the square':resident==='mara'?'Sharing the market tray':'Showing the plants'},{...b,hold:{orin:7000,mara:11000,rowan:6000}[resident],face:'left',activity:'Chatting at the square'}];}stopCache.set(s,{key:cacheKey,stops});return stops[name];
}
