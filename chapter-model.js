import {initialSquare,readSquare,squareAction,settleSquare,squareAvailable,squareActive,squareDelay,SQUARE} from './chapter-square.js';
import {initialGathering,readGathering,gatheringAction,WORKSHOP,replenishLoose} from './chapter-gathering.js';
import {carryCapacity,claimCarryBasket} from './chapter-hauling.js';
import {initialGardener,readGardener,gardenerAction,rowan,validGardenHouse,CROPS,growCrops,farm} from './chapter-gardener.js';
import {initialEconomy,readEconomy,economyAction,settleVillageDay,fundHome,missingFlour} from './chapter-economy.js';
import {chatLine} from './chapter-dialogue.js';
// Chapter One rules. Every action is synchronous and saved after it commits.
export const SAVE_KEY='the-fading-kingdom:chapter-one:v2';
export const W=56,H=40;
export const STYLES=['Meadow','Timber','Stone'];
export const DECOR=['planter','bench','lantern','path','fence'];
export const TREES=Array.from({length:40},(_,i)=>({x:2+(i*13%52),y:i<18?3+i%3:31+i%7}));
export const RESOURCES=Array.from({length:26},(_,i)=>({id:i,type:i<16?'wood':'stone',x:19+(i*7%23),y:19+Math.floor(i/6)*2+(i%2)}));
export const FIXED={home:{x:11,y:12},kit:{x:13,y:13},store:{x:8,y:13},orin:{x:18,y:17},timber:{x:20,y:17},nursery:{x:45,y:10}};
export function fresh(){return {square:initialSquare(),gathering:initialGathering(),gardener:initialGardener(),version:2,day:1,room:'outside',player:{x:12,y:14,skin:1,hair:0,shirt:0,style:0,outfit:0,hat:0},inventory:{seed:6,carrot:0,wood:0,stone:0,bun:0,berry:0,fruitbun:0,turnipSeed:0,flowerSeed:0,turnip:0,marigold:0,planter:4,bench:2,lantern:4,path:40,fence:12},carry:{wood:0,stone:0},plots:Array.from({length:9},(_,i)=>({x:8+i%3*2,y:16+Math.floor(i/3)*2,planted:false,watered:false,ripe:false,crop:'carrot',growth:0})),gathered:[],house:null,decor:[],story:{arrival:0,wideCan:false,carryBasket:false,kit:false,harvest:false,met:false,invited:false,orin:false,basket:'none',late:false,timber:'untouched',timberNoticed:false,dependable:false,returned:false,lifted:false,herbs:false,cooking:0,cooked:false,shared:false,nursery:false},conversation:{mara:0,orin:0,movedDay:0,cookedDay:0},economy:initialEconomy(),settings:{sound:true,music:false}};}
export function mara(s){if(!s.story.harvest)return null;if(s.room==='bakery')return {x:11,y:s.day%2?5:7};if(s.room!=='outside')return null;if(s.house?.stage===3)return {x:s.house.x+5,y:s.house.y+4};return {x:22,y:16};}
const within=(x,y,a,b,c,d)=>x>=a&&x<=c&&y>=b&&y<=d;
export function blocked(s,x,y,room=s.room,house=s.house,decor=s.decor){
 if(!Number.isInteger(x)||!Number.isInteger(y))return true;
 if(room!=='outside'){
  if(x<1||y<3||x>16||y>12)return true;
  if(room==='home'&&((x===3&&y>=4&&y<=6)||(x===13&&y===4)||(x===5&&y===4)))return true;
  if(room==='garden'&&(y===4&&x>=3&&x<=13||x===13&&y>=8&&y<=10))return true;
  if(room==='bakery'&&((y===4&&x>=3&&x<=13)||(within(x,y,7,7,9,8))))return true;
 }else{
  if(s.economy?.projects.market&&within(x,y,5,15,7,16))return true;
  if(x<3||y<6||x>52||y>35||within(x,y,8,7,13,11)||within(x,y,46,20,52,28)||TREES.some(t=>t.x===x&&t.y===y))return true;
  if(s.gardener?.house&&within(x,y,s.gardener.house.x,s.gardener.house.y,s.gardener.house.x+4,s.gardener.house.y+3))return true;
  if(house&&within(x,y,house.x,house.y,house.x+4,house.y+3))return true;
 }
 return decor.some(d=>d.room===room&&d.type!=='path'&&d.x===x&&d.y===y);
}
export function route(s,from,to,room=s.room,house=s.house,decor=s.decor){
 if(blocked(s,to.x,to.y,room,house,decor))return [];
 const width=room==='outside'?W:18,queue=[from],seen=new Map([[from.y*width+from.x,null]]);let found=false;
 for(let i=0;i<queue.length;i++){const p=queue[i];if(p.x===to.x&&p.y===to.y){found=true;break;}for(const [dx,dy]of [[0,1],[1,0],[0,-1],[-1,0]]){const q={x:p.x+dx,y:p.y+dy},id=q.y*width+q.x;if(!seen.has(id)&&!blocked(s,q.x,q.y,room,house,decor)){seen.set(id,p);queue.push(q);}}}
 if(!found)return [];const out=[];let p=to;while(p.x!==from.x||p.y!==from.y){out.unshift(p);p=seen.get(p.y*width+p.x);}return out;
}
// Guided travel must not accidentally enter another building on the way past.
export function walkingRoute(s,from,to){const doors=s.room==='outside'?[FIXED.home,...[s.house,s.gardener?.house].filter(h=>h?.stage===3).map(h=>({x:h.x+2,y:h.y+4}))]:[{x:8,y:12}];const reserved=doors.filter(p=>!(p.x===to.x&&p.y===to.y)&&!(p.x===from.x&&p.y===from.y)).map(p=>({...p,type:'bench',room:s.room}));return route(s,from,to,s.room,s.house,[...s.decor,...reserved]);}
function reachable(s,room,house,decor){
 const start=room==='outside'?{x:11,y:12}:{x:8,y:12};
 const goals=room==='outside'?[FIXED.kit,FIXED.store,FIXED.orin,FIXED.timber,FIXED.nursery,{x:22,y:16},...s.plots,...RESOURCES,...(s.gathering?.job==='done'?[WORKSHOP]:[]),...(s.gardener?.house?[{x:s.gardener.house.x+2,y:s.gardener.house.y+4}]:[]),...(house?[{x:house.x+2,y:house.y+4},{x:house.x+5,y:house.y+4}]:[])]:room==='home'?[{x:3,y:7},{x:5,y:5},{x:13,y:5}]:[{x:4,y:5},{x:11,y:5},{x:11,y:7}];
 return goals.every(g=>(g.x===start.x&&g.y===start.y)||route(s,start,g,room,house,decor).length>0);
}
export function validHouse(s,x,y){
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<16||x>44||y<7||y>29)return false;
 if(s.room==='outside'&&within(s.player.x,s.player.y,x,y,x+4,y+3))return false;
 const h={x,y,stage:0,style:0,trim:0};
 for(let yy=y;yy<=y+4;yy++)for(let xx=x;xx<=x+5;xx++)if(blocked(s,xx,yy,'outside',null)||yy===17||Object.values(FIXED).some(p=>p.x===xx&&p.y===yy)||RESOURCES.some(p=>p.x===xx&&p.y===yy))return false;
 return reachable(s,'outside',h,s.decor);
}
export function validDecor(s,type,x,y,ignore=-1){
 if(ignore<0&&s.decor.length>=200)return false;
 if(!DECOR.includes(type)||!Number.isInteger(x)||!Number.isInteger(y))return false;
 const decor=s.decor.filter((_,i)=>i!==ignore);
 if(s.room==='outside'&&s.gathering?.job==='done'&&x===WORKSHOP.x&&y===WORKSHOP.y)return false;
 if(blocked(s,x,y,s.room,s.house,decor)||decor.some(d=>d.room===s.room&&d.x===x&&d.y===y)||s.player.x===x&&s.player.y===y)return false;
 if(s.room==='outside'&&(y===17||s.plots.some(p=>p.x===x&&p.y===y)||RESOURCES.some(p=>p.x===x&&p.y===y)||Object.values(FIXED).some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<=1)||s.house&&within(x,y,s.house.x,s.house.y,s.house.x+5,s.house.y+4)||s.gardener?.house&&within(x,y,s.gardener.house.x,s.gardener.house.y,s.gardener.house.x+5,s.gardener.house.y+4)||within(x,y,21,15,23,16)))return false;
 if(s.room!=='outside'&&(y===12||y===5||within(x,y,10,5,12,7)||s.room==='home'&&within(x,y,2,4,6,7)))return false;
 return reachable(s,s.room,s.house,[...decor,{type,x,y,room:s.room,rotation:0}]);
}
export function wateringArea(s,index){const p=s.plots[index];if(s.room!=='outside'||!p||!p.planted||p.ripe)return [];return s.plots.filter(q=>q.y===p.y&&Math.abs(q.x-p.x)<=(s.story.wideCan?2:0));}
export function canEarnWideCan(s){return s.house?.stage===3&&s.story.cooked&&s.story.orin;}
export function goal(s){const e=s.story,h=s.house;
 if(!e.kit)return {title:'A little ground',text:'Pick up the tools by your cottage door.',target:FIXED.kit};
 if(!e.harvest){const p=s.plots.find(p=>p.ripe)||s.plots.find(p=>p.planted&&!p.watered)||s.plots.find(p=>p.planted);return {title:'A little ground',text:!p?'Plant a carrot in a garden patch.':p.ripe?'Harvest your first carrot.':!p.watered?'Water your carrot.':'Enter your cottage and sleep in the bed.',target:!p?s.plots[0]:p.watered&&!p.ripe?FIXED.home:p};}
 if(!e.invited)return {title:'Room for one more',text:'Meet Mara by the road when you’re ready.',target:{x:22,y:16}};
 if(!h)return {title:'A place to call home',text:'Choose Build to plan Mara’s home.',target:{x:30,y:10}};
 const target={x:h.x+2,y:h.y+4};
 if(h.stage<2){
  const type=h.stage===0?'stone':'wood',needed=h.stage===0?6:8,total=s.inventory[type]+s.carry[type],cap=carryCapacity(s);
  if(s.carry.wood+s.carry.stone&&(s.carry.wood+s.carry.stone>=cap||total>=needed))return {title:'Gather and lend a hand',text:'Drop your carried materials at the building sign.',target};
  if(total<needed){const node=RESOURCES.filter(n=>n.type===type&&!s.gathered.includes(n.id)).sort((a,b)=>Math.abs(a.x-s.player.x)+Math.abs(a.y-s.player.y)-Math.abs(b.x-s.player.x)-Math.abs(b.y-s.player.y))[0];if(node)return {title:'Gather and lend a hand',text:`Gather loose ${type} · ${total}/${needed}. Drop it at the building sign.`,target:node};}
  if(h.stage===1&&e.timber==='taken')return {title:e.timberNoticed?'Boards for the mill':'The house frame',text:e.timberNoticed?'Orin needs the boards for the mill roof. Bring the bundle back.':'Talk to Orin about lifting the frame.',target:e.timberNoticed?FIXED.timber:FIXED.orin};
  if(h.stage===1&&e.basket==='held')return {title:'Orin’s tools',text:'Return the basket to Orin before lifting the frame.',target:FIXED.orin};
  return {title:'From the ground up',text:h.stage===0?'Lay the foundations at the building sign.':'Lift the frame together at the building sign.',target};
 }
 if(h.stage===2)return {title:'From the ground up',text:'Place the herb planter and choose the finishing touches.',target};
 if(!e.cooked)return {title:'Something in the oven',text:e.cooking?'Return to the kitchen to finish your batch.':'Enter Mara’s home and cook together.',target};
 if(s.economy.flour.noticed&&missingFlour(s))return {title:'Morning orders',text:s.economy.flour.state==='used'?'Orin has a mill delivery. Two carrots for a replacement flour sack.':'Put the flour sack on the shelf in Mara’s kitchen for tomorrow’s orders.',target:s.economy.flour.state==='used'?FIXED.orin:target};
 if(!e.wideCan)return {title:'A hand on the farm',text:'Orin has a watering-can upgrade for you. Visit his cart when you like.',target:FIXED.orin};
 if(s.economy.projects.nursery&&!s.gardener.invited)return {title:'A visitor among the plants',text:'Someone is tending the nursery. Say hello when you like.',target:{x:43,y:11}};
 if(s.gardener.invited&&s.gardener.house?.stage!==3)return {title:'Room for Rowan',text:s.gardener.house?'Visit Rowan’s building sign to fund the next stage.':'Choose Build to plan Rowan’s home and seed shop.',target:s.gardener.house?{x:s.gardener.house.x+2,y:s.gardener.house.y+4}:{x:43,y:11}};
 if(squareAvailable(s))return {title:s.square.opened?'Our village square':'Somewhere to gather',text:s.square.marketDay===s.day?'Market day in your square. Take a wander; the stalls contribute tomorrow.':s.square.started?'Check the square board for contributions and furnishings. You choose the arrangement.':'Restore the old square, southwest of your garden, with your neighbours.',target:SQUARE};
 return {title:'A village that grows',text:s.economy.projects.nursery&&s.economy.projects.market?'Pick berries at the nursery, try Mara’s recipes, or make the village yours.':'Mara’s bakery contributes each morning. Open the village fund to choose our next project.',target:s.economy.projects.nursery?FIXED.nursery:{x:6,y:17}};
}
export function act(s,id,data={}){
 const e=s.story,h=s.house,i=s.inventory;
 const square=squareAction(s,id,data);if(square!==null)return square;
 const gathering=gatheringAction(s,id,data);if(gathering!==null)return gathering;
 const garden=gardenerAction(s,id,data);if(garden!==null)return garden;
 const economy=economyAction(s,id,data);if(economy!==null)return economy;
 if(['cook','mix','shape','bake'].includes(id)&&squareActive(s)&&!squareDelay(s,'mara'))return 'Mara’s at the square today. Your ingredients and unfinished batch can wait until she’s back.';
 switch(id){
 case 'arrivalNext':e.arrival=Math.min(3,e.arrival+1);return 'The road to Bramblewick.';
 case 'arrivalSkip':e.arrival=3;return 'You can read the letter again in your journal.';
 case 'claimBasket':return claimCarryBasket(s,data.npc);
 case 'upgradeCan':if(e.wideCan)return 'That wide spout’s already fitted. Go give it a try.';if(!canEarnWideCan(s))return 'Get Mara settled and make that first batch of buns. I’ll have something ready for your garden.';if((s.room!=='outside'&&data.npc?.room!==s.room)||Math.abs(s.player.x-(data.npc?.x??FIXED.orin.x))+Math.abs(s.player.y-(data.npc?.y??FIXED.orin.y))>1)return 'Bring your can over to Orin’s cart.';if(e.timber==='taken'){e.timberNoticed=true;return 'I’ll need those mill boards back first. Then I can sort this spout for you.';}e.wideCan=true;return 'There. Wider spout. Try it on the middle of a row. Less walking, more time for lunch.';
 case 'kit':if(e.kit)return 'Your tools are ready.';e.kit=true;return 'Carrot seeds and a watering can. Let’s plant something.';
 case 'farm':return farm(s,data);
 case 'sleep':if(s.room!=='home')return 'Your bed is inside the cottage.';const contribution=settleVillageDay(s)+settleSquare(s);s.day++;replenishLoose(s,RESOURCES);growCrops(s);return contribution?`A fresh morning. Village businesses added ${contribution} G to the village fund.${s.economy.lastBatch==='small'?' A smaller batch: the order flour was missing.':''}`:'A fresh morning. Your watered carrots have grown.';
 case 'seeds':if(i.seed<6)i.seed=6;return 'Your starter seed tin is full again.';
 case 'meet':if(!e.harvest)return 'The road is quiet.';e.met=true;return 'I’m Mara. Baker, flour-covered traveller, owner of one very squeaky cart.';
 case 'invite':if(!e.met)return 'Say hello to Mara first.';e.invited=true;return 'An oven, somewhere to sleep… that’s about it. Herbs by the door would be nice.';
 case 'plan':if(!e.invited||h?.stage===3||!validHouse(s,data.x,data.y)||!STYLES[data.style])return 'Choose a clear site with room for the door and herbs.';s.house={x:data.x,y:data.y,style:data.style,stage:h?.stage||0,trim:h?.trim||0};return 'A place for a home. The building sign shows everything we need.';
 case 'orin':e.orin=true;return 'You bring the wood and stone. I’ll bring the tools. Between us, we should manage a house.';
 case 'borrow':if(e.basket!=='none')return 'We’ve sorted that basket already, haven’t we?';if(e.timber==='taken')return 'I need those boards back first. They’re for the mill roof.';e.basket='held';return h?.stage===3?'Yep, go on. Give it back when you’re done hauling things. I use it for my tools too.':'Yep, go on. Holds more than your bag. I’ll need it back when we put the frame up.';
 case 'returnBasket':if(e.basket!=='held')return 'Basket’s already here. Unless I’ve got two now.';if(s.carry.wood+s.carry.stone)return 'Drop your materials at storage or the building sign first.';e.basket='returned';e.dependable=!e.late;return e.late?'There it is. Right, let’s get these tools out.':'Ah, cheers. Saves me hunting round the cart for it.';
 case 'take':if(e.timber!=='untouched')return 'The other bundles are tied onto the cart.';e.timber='taken';e.timberNoticed=false;return 'Picked up a bundle of boards.';
 case 'noticeWood':if(e.timber!=='taken')return 'The boards are stacked by the cart.';e.timberNoticed=true;return 'Ah. There’s my wood. I was starting to blame the squirrels.';
 case 'askWood':return e.timber==='taken'?'Not that bundle. It’s cut to fit the mill roof. There’s loose wood by the path you can use, though.':'Those boards are for the mill roof. Try the loose branches by the path.';
 case 'chat':{if(!['mara','orin'].includes(data.who))return '';const line=chatLine(s,data.who);s.conversation[data.who]++;return line;}
 case 'returnWood':if(e.timber!=='taken')return 'Boards are back on the cart.';e.timber='returned';e.returned=true;return e.timberNoticed?'Cheers. I’d have had a very draughty mill to explain.':'Bundle put back on the stack.';
 case 'gather':{if(s.room!=='outside')return 'The loose materials are outside.';const node=RESOURCES.find(n=>n.id===data.id);if(!node||s.gathered.includes(node.id))return 'You’ve gathered this already.';const cap=carryCapacity(s);if(s.carry.wood+s.carry.stone>=cap)return 'Your bag is full. Drop these at storage or the building sign.';s.gathered.push(node.id);s.carry[node.type]++;return `Collected ${node.type}. Carrying ${s.carry.wood+s.carry.stone}/${cap}.`;}
 case 'deposit':i.wood+=s.carry.wood;i.stone+=s.carry.stone;s.carry={wood:0,stone:0};return `Materials stored: ${i.wood} wood, ${i.stone} stone.`;
 case 'build':if(!h)return 'Plan a house first.';if(!e.orin)return 'Meet Orin at his cart first.';if(h.stage===0){if(i.stone<6)return 'Six stones for this bit. Bring them over and we’ll get the base sorted.';i.stone-=6;h.stage=1;return 'There’s our first corner. Definitely looks more house-like than it did.';}if(h.stage===1){if(e.basket==='held'){e.late=true;return 'Ah, my basket. I need it for these tools. Bring it over, then we’ll get lifting.';}if(e.timber==='taken'){e.timberNoticed=true;return 'Hang on. Those boards in your bag are for the mill roof. I’ll need them back before we get this frame up.';}if(i.wood<8)return 'Eight bundles of loose wood should do it. Still a few short.';i.wood-=8;h.stage=2;e.lifted=true;return 'Together, you lift the frame into place.';}return h.stage===2?'Place the herb planter, then choose the finishing touches.':'Mara’s home is finished.';
 case 'herbs':if(h?.stage!==2)return 'The frame needs to be ready first.';e.herbs=true;return 'A little herb garden by the door.';
 case 'finish':if(h?.stage!==2||!e.herbs)return 'Set out the herb planter first.';if(!fundHome(s))return 'The home needs 12 G from the village welcome fund for its finishing supplies.';h.trim=Number.isInteger(data.trim)?Math.max(0,Math.min(2,data.trim)):0;h.stage=3;s.conversation.movedDay=s.day;return 'The oven fits! The table… nearly fits. We’ll eat sideways. It’s fine.';
 case 'enterHome':s.room='home';s.player.x=8;s.player.y=11;return 'Your cottage';
 case 'enterBakery':if(h?.stage!==3)return 'The home isn’t ready yet.';s.room='bakery';s.player.x=8;s.player.y=11;return 'Mara’s kitchen';
 case 'exit':{const out=s.room==='garden'&&s.gardener.house?{x:s.gardener.house.x+2,y:s.gardener.house.y+4}:s.room==='bakery'&&h?{x:h.x+2,y:h.y+4}:FIXED.home;s.room='outside';Object.assign(s.player,out);return 'Back in the village';}
 case 'cook':if(s.room!=='bakery'||h?.stage!==3)return 'Visit Mara’s kitchen first.';if(e.cooking)return 'Your batch is already waiting.';if(i.carrot<1)return 'Got a carrot? Mine are all imaginary at the moment.';if(data.recipe==='fruit'&&(!s.economy.recipe||i.berry<2))return 'Fruit buns need the recipe, two berries and a carrot.';s.economy.fruitBatch=data.recipe==='fruit';if(s.economy.fruitBatch)i.berry-=2;i.carrot--;e.cooking=1;return 'Flour’s in. Pop your carrot on the board.';
 case 'mix':if(e.cooking!==1||s.room!=='bakery')return 'Start a batch at the preparation counter.';e.cooking=2;return 'I’ll do this one. Your turn with the next. They don’t have to match.';
 case 'shape':if(e.cooking!==2||s.room!=='bakery')return 'Mix the batch first.';e.cooking=3;return 'Three buns, ready for the oven. Mara takes the tray.';
 case 'bake':if(e.cooking!==3||s.room!=='bakery')return 'Your tray isn’t ready yet.';e.cooking=0;if(!e.cooked)s.conversation.cookedDay=s.day;e.cooked=true;if(s.economy.fruitBatch){i.fruitbun+=3;s.economy.fruitBatch=false;return 'Berry juice on the counter. That’s how you know they’re good. Three fruit buns, ready to go.';}i.bun+=3;return 'Ooh, look at those. Careful. They’re still doing the hot-bun thing.';
 case 'share':if(!e.cooked||e.shared)return 'We’ve already shared our first batch.';if(i.bun<2)return 'We can share another batch later.';i.bun-=2;e.shared=true;return 'Ooh, yes please. Nothing beats a warm bun.';
 case 'eatFruit':if(!i.fruitbun)return 'No fruit buns in your basket yet.';i.fruitbun--;return 'A warm fruit bun, with a little berry juice on your fingers.';
 case 'eatBerry':if(!i.berry)return 'No berries in your basket yet.';i.berry--;return 'Sweet, a little sharp, and straight from the nursery.';
 case 'eat':if(!i.bun)return 'There are no buns in your basket.';i.bun--;return 'A warm vegetable bun. A quiet moment to enjoy what you made.';
 case 'nursery':if(!e.cooked)return 'Settle in with Mara first.';e.nursery=true;return 'Up the old path? There used to be a nursery. Little plants, not little people. Fancy a look?';
 case 'place':if(!(Number.isInteger(data.index)&&data.index>=0)&&s.decor.length>=200)return 'You’ve placed 200 decorations. Store one to make room; nothing has been used.';if(!validDecor(s,data.type,data.x,data.y,data.index??-1))return 'Leave doors, work areas, and walking routes clear.';if(Number.isInteger(data.index)&&s.decor[data.index]){Object.assign(s.decor[data.index],{x:data.x,y:data.y,rotation:data.rotation===1?1:0});return 'Moved.';}if(!i[data.type])return 'There are no more in storage.';i[data.type]--;s.decor.push({type:data.type,x:data.x,y:data.y,room:s.room,rotation:data.rotation===1?1:0});return 'Placed. Move it or put it back in storage any time.';
 case 'store':{const d=s.decor[data.index];if(!d||d.room!==s.room)return 'Choose a placed decoration.';i[d.type]++;s.decor.splice(data.index,1);return 'Back in storage.';}
 default:return 'Take your time. The village will be here.';
 }
}
export function readSave(raw){
 const s=JSON.parse(raw),base=fresh(),int=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
 if(!s||s.version!==2||!int(s.day,1,100000)||!['outside','home','bakery','garden'].includes(s.room))throw Error('Invalid chapter save');
 for(const k of ['berry','fruitbun','turnipSeed','flowerSeed','turnip','marigold'])if(s.inventory&&s.inventory[k]===undefined)s.inventory[k]=0;
 const square=readSquare(s.square,int,s.day),gathering=readGathering(s.gathering,int,s.day),economy=readEconomy(s,int),gardener=readGardener(s.gardener,int,s.day);
 for(const [k,n]of Object.entries(base.inventory))if(!int(s.inventory?.[k],0,1000000))throw Error('Invalid inventory');
 for(const k of ['wood','stone'])if(!int(s.carry?.[k],0,4))throw Error('Invalid carry');
 if(s.story&&s.story.arrival===undefined)s.story.arrival=3;
 if(s.story&&s.story.wideCan===undefined)s.story.wideCan=false;
 if(s.story&&s.story.carryBasket===undefined)s.story.carryBasket=false;
 if(s.carry.wood+s.carry.stone>carryCapacity(s))throw Error('Overfilled carry basket');
 if(s.story&&s.story.timberNoticed===undefined)s.story.timberNoticed=s.story.timber==='taken';
 for(const [k,v]of Object.entries(base.story))if(typeof v==='boolean'?typeof s.story?.[k]!=='boolean':typeof s.story?.[k]!==typeof v)throw Error('Invalid story');
 if(!int(s.story.arrival,0,3))throw Error('Invalid arrival');
 if(!['none','held','returned'].includes(s.story.basket)||!['untouched','taken','returned'].includes(s.story.timber)||!int(s.story.cooking,0,3))throw Error('Invalid event');
 if(s.player){if(s.player.outfit===undefined)s.player.outfit=0;if(s.player.hat===undefined)s.player.hat=0;}
 if(!s.player||!int(s.player.outfit,0,1)||!int(s.player.hat,0,1)||!int(s.player.x,0,W)||!int(s.player.y,0,H)||!['skin','hair','shirt'].every(k=>int(s.player[k],0,5))||!int(s.player.style,0,4))throw Error('Invalid player');
 if(!Array.isArray(s.gathered)||new Set(s.gathered).size!==s.gathered.length||s.gathered.some(n=>!int(n,0,25)))throw Error('Invalid gathering');
 if(!Array.isArray(s.plots)||s.plots.length!==9)throw Error('Invalid farm');s.plots.forEach((p,j)=>{if(p.crop===undefined)p.crop='carrot';if(p.growth===undefined)p.growth=p.ripe?CROPS[p.crop]?.nights:0;if(!CROPS[p.crop]||!int(p.growth,0,CROPS[p.crop].nights))throw Error('Invalid crop kind');if(p.x!==base.plots[j].x||p.y!==base.plots[j].y||['planted','watered','ripe'].some(k=>typeof p[k]!=='boolean')||p.ripe&&!p.planted)throw Error('Invalid crop');});
 if(s.house&&(!int(s.house.x,16,44)||!int(s.house.y,7,29)||!int(s.house.stage,0,3)||!int(s.house.style,0,2)||!int(s.house.trim,0,2)))throw Error('Invalid home');
 if(!Array.isArray(s.decor)||s.decor.length>200)throw Error('Invalid decoration');const checked={...s,decor:[]};for(const d of s.decor){if(!DECOR.includes(d.type)||!['outside','home','bakery','garden'].includes(d.room)||!int(d.x,1,52)||!int(d.y,3,35)||!int(d.rotation,0,1)||checked.decor.some(o=>o.x===d.x&&o.y===d.y&&o.room===d.room))throw Error('Invalid item');checked.decor.push({type:d.type,x:d.x,y:d.y,room:d.room,rotation:d.rotation});}
 const conversation={...base.conversation};for(const k of Object.keys(conversation)){if(s.conversation?.[k]!==undefined){if(!int(s.conversation[k],0,k.endsWith('Day')?s.day:1000000))throw Error('Invalid conversation');conversation[k]=s.conversation[k];}}
 const clean={...base,square,gathering,gardener,conversation,economy,day:s.day,room:s.room,player:Object.fromEntries(Object.keys(base.player).map(k=>[k,s.player[k]])),inventory:Object.fromEntries(Object.keys(base.inventory).map(k=>[k,s.inventory[k]])),carry:{wood:s.carry.wood,stone:s.carry.stone},plots:s.plots.map(p=>({x:p.x,y:p.y,planted:p.planted,watered:p.watered,ripe:p.ripe,crop:p.crop,growth:p.growth})),gathered:[...s.gathered],house:s.house?{x:s.house.x,y:s.house.y,stage:s.house.stage,style:s.house.style,trim:s.house.trim}:null,decor:checked.decor,story:Object.fromEntries(Object.keys(base.story).map(k=>[k,s.story[k]])),settings:{sound:typeof s.settings?.sound==='boolean'?s.settings.sound:true,music:typeof s.settings?.music==='boolean'?s.settings.music:false}};
 if(clean.house&&!validHouse({...clean,decor:[],player:{...clean.player,x:-99,y:-99}},clean.house.x,clean.house.y))throw Error('Blocked home');
 if(clean.gardener.house&&!validGardenHouse({...clean,player:{...clean.player,x:-99,y:-99}},clean.gardener.house.x,clean.gardener.house.y))throw Error('Blocked gardener home');
 const items=clean.decor;clean.decor=[];for(const d of items){if(!validDecor({...clean,room:d.room,player:{...clean.player,x:-99,y:-99}},d.type,d.x,d.y))throw Error('Blocked decoration');clean.decor.push(d);}
 if(clean.room==='garden'&&clean.gardener.house?.stage!==3)clean.room='outside';
 if(clean.room==='bakery'&&clean.house?.stage!==3)clean.room='outside';
 if(blocked(clean,clean.player.x,clean.player.y))Object.assign(clean.player,clean.room==='outside'?{x:12,y:14}:{x:8,y:11});
 return clean;
}
