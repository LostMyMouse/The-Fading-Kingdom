// Chapter One rules. Every action is synchronous and saved after it commits.
export const SAVE_KEY='the-fading-kingdom:chapter-one:v2';
export const W=56,H=40;
export const STYLES=['Meadow','Timber','Stone'];
export const DECOR=['planter','bench','lantern','path','fence'];
export const TREES=Array.from({length:40},(_,i)=>({x:2+(i*13%52),y:i<18?3+i%3:31+i%7}));
export const RESOURCES=Array.from({length:26},(_,i)=>({id:i,type:i<16?'wood':'stone',x:19+(i*7%23),y:19+Math.floor(i/6)*2+(i%2)}));
export const FIXED={home:{x:11,y:12},kit:{x:13,y:13},store:{x:8,y:13},orin:{x:18,y:17},timber:{x:20,y:17},nursery:{x:45,y:10}};
export function fresh(){return {version:2,day:1,room:'outside',player:{x:12,y:14,skin:1,hair:0,shirt:0,style:0},inventory:{seed:6,carrot:0,wood:0,stone:0,bun:0,planter:4,bench:2,lantern:4,path:40,fence:12},carry:{wood:0,stone:0},plots:Array.from({length:9},(_,i)=>({x:8+i%3*2,y:16+Math.floor(i/3)*2,planted:false,watered:false,ripe:false})),gathered:[],house:null,decor:[],story:{kit:false,harvest:false,met:false,invited:false,orin:false,basket:'none',late:false,timber:'untouched',dependable:false,returned:false,lifted:false,herbs:false,cooking:0,cooked:false,shared:false,nursery:false},settings:{sound:true,music:false}};}
export function mara(s){if(!s.story.harvest)return null;if(s.room==='bakery')return {x:11,y:s.day%2?5:7};if(s.room!=='outside')return null;if(s.house?.stage===3)return {x:s.house.x+5,y:s.house.y+4};return {x:22,y:16};}
const within=(x,y,a,b,c,d)=>x>=a&&x<=c&&y>=b&&y<=d;
export function blocked(s,x,y,room=s.room,house=s.house,decor=s.decor){
 if(!Number.isInteger(x)||!Number.isInteger(y))return true;
 if(room!=='outside'){
  if(x<1||y<3||x>16||y>12)return true;
  if(room==='home'&&((x===3&&y>=4&&y<=6)||(x===13&&y===4)||(x===5&&y===4)))return true;
  if(room==='bakery'&&((y===4&&x>=3&&x<=13)||(within(x,y,7,7,9,8))))return true;
 }else{
  if(x<3||y<6||x>52||y>35||within(x,y,8,7,13,11)||within(x,y,46,20,52,28)||TREES.some(t=>t.x===x&&t.y===y))return true;
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
function reachable(s,room,house,decor){
 const start=room==='outside'?{x:11,y:12}:{x:8,y:12};
 const goals=room==='outside'?[FIXED.kit,FIXED.store,FIXED.orin,FIXED.timber,FIXED.nursery,{x:22,y:16},...s.plots,...RESOURCES,...(house?[{x:house.x+2,y:house.y+4},{x:house.x+5,y:house.y+4}]:[])]:room==='home'?[{x:3,y:7},{x:5,y:5},{x:13,y:5}]:[{x:4,y:5},{x:11,y:5},{x:11,y:7}];
 return goals.every(g=>(g.x===start.x&&g.y===start.y)||route(s,start,g,room,house,decor).length>0);
}
export function validHouse(s,x,y){
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<16||x>44||y<7||y>29)return false;
 const h={x,y,stage:0,style:0,trim:0};
 for(let yy=y;yy<=y+4;yy++)for(let xx=x;xx<=x+5;xx++)if(blocked(s,xx,yy,'outside',null)||yy===17||Object.values(FIXED).some(p=>p.x===xx&&p.y===yy)||RESOURCES.some(p=>p.x===xx&&p.y===yy))return false;
 return reachable(s,'outside',h,s.decor);
}
export function validDecor(s,type,x,y,ignore=-1){
 if(!DECOR.includes(type)||!Number.isInteger(x)||!Number.isInteger(y))return false;
 const decor=s.decor.filter((_,i)=>i!==ignore);
 if(blocked(s,x,y,s.room,s.house,decor)||decor.some(d=>d.room===s.room&&d.x===x&&d.y===y)||s.player.x===x&&s.player.y===y)return false;
 if(s.room==='outside'&&(y===17||s.plots.some(p=>p.x===x&&p.y===y)||RESOURCES.some(p=>p.x===x&&p.y===y)||Object.values(FIXED).some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<=1)||s.house&&within(x,y,s.house.x,s.house.y,s.house.x+5,s.house.y+4)||within(x,y,21,15,23,16)))return false;
 if(s.room!=='outside'&&(y===12||y===5||within(x,y,10,5,12,7)||s.room==='home'&&within(x,y,2,4,6,7)))return false;
 return reachable(s,s.room,s.house,[...decor,{type,x,y,room:s.room,rotation:0}]);
}
export function goal(s){const e=s.story,h=s.house;
 if(!e.kit)return {title:'A little ground',text:'Pick up the tools by your cottage door.',target:FIXED.kit};
 if(!e.harvest){const p=s.plots.find(p=>p.ripe)||s.plots.find(p=>p.planted&&!p.watered)||s.plots.find(p=>p.planted);return {title:'A little ground',text:!p?'Plant a carrot in a garden patch.':p.ripe?'Harvest your first carrot.':!p.watered?'Water your carrot.':'Enter your cottage and sleep in the bed.',target:!p?s.plots[0]:p.watered&&!p.ripe?FIXED.home:p};}
 if(!e.invited)return {title:'Room for one more',text:'Meet Mara by the road when you’re ready.',target:{x:22,y:16}};
 if(!h)return {title:'A place to call home',text:'Choose Build to plan Mara’s home.',target:{x:30,y:10}};
 const target={x:h.x+2,y:h.y+4};
 if(h.stage<3)return {title:'From the ground up',text:h.stage===0?'Deliver 6 stone at the building sign.':h.stage===1?'Deliver 8 wood; return Orin’s belongings; lift the frame.':'Place the herb planter and choose the finishing touches.',target};
 if(!e.cooked)return {title:'Something in the oven',text:e.cooking?'Return to the kitchen to finish your batch.':'Enter Mara’s home and cook together.',target};
 return {title:'A village begins',text:e.nursery?'Explore the old nursery, grow crops, or decorate.':'Talk to Mara about the old path, or make the village yours.',target:e.nursery?FIXED.nursery:target};
}
export function act(s,id,data={}){
 const e=s.story,h=s.house,i=s.inventory;
 switch(id){
 case 'kit':if(e.kit)return 'Your tools are ready.';e.kit=true;return 'Carrot seeds and a watering can. Let’s plant something.';
 case 'farm':{if(!e.kit)return 'Pick up your tools by the cottage first.';const p=s.plots[data.index];if(!p)return 'Choose a garden patch.';if(p.ripe){i.carrot++;p.planted=p.ripe=p.watered=false;e.harvest=true;return 'A carrot from your own garden. Someone has arrived by the road.';}if(data.tool==='water'){if(!p.planted)return 'Plant a seed here first.';p.watered=true;return 'Watered. It will grow when you sleep in your cottage.';}if(data.tool!=='seed')return p.planted?'This carrot needs water and a night’s rest.':'Choose carrot seeds to plant here.';if(p.planted)return 'A carrot is already growing here.';if(i.seed<1)return 'Your cottage storage has free starter seeds.';i.seed--;p.planted=true;return 'Planted. Choose Water and give it a drink.';}
 case 'sleep':if(s.room!=='home')return 'Your bed is inside the cottage.';s.day++;for(const p of s.plots){if(p.planted&&p.watered)p.ripe=true;p.watered=false;}return 'A fresh morning. Your watered carrots have grown.';
 case 'seeds':if(i.seed<6)i.seed=6;return 'Your starter seed tin is full again.';
 case 'meet':if(!e.harvest)return 'The road is quiet.';e.met=true;return 'I’m Mara. I bake, mostly. At the moment, I travel.';
 case 'invite':if(!e.met)return 'Say hello to Mara first.';e.invited=true;return 'A kitchen for my oven, and a little space for herbs. You choose the style.';
 case 'plan':if(!e.invited||h?.stage===3||!validHouse(s,data.x,data.y)||!STYLES[data.style])return 'Choose a clear site with room for the door and herbs.';s.house={x:data.x,y:data.y,style:data.style,stage:h?.stage||0,trim:h?.trim||0};return 'A place for a home. The building sign shows everything we need.';
 case 'orin':e.orin=true;return 'You find the wood and stone. I’ll help with the frame. Mara’s bringing the kitchen.';
 case 'borrow':if(e.basket!=='none')return 'We’ve already agreed about the basket.';if(e.timber==='taken')return 'Please bring my wood back before borrowing something else.';e.basket='held';return 'Of course. Bring it back before we start the frame. It carries two bundles instead of one.';
 case 'returnBasket':if(e.basket!=='held')return 'You’re not holding my basket.';if(s.carry.wood+s.carry.stone)return 'Drop your materials at storage or the building sign first.';e.basket='returned';e.dependable=!e.late;return e.late?'Thanks. Let’s get the tools out.':'Right where I need it. Thanks for remembering.';
 case 'take':if(e.timber!=='untouched')return 'There’s no other bundle to take.';e.timber='taken';return 'I set that wood aside for another job. Please bring it back before we build together.';
 case 'returnWood':if(e.timber!=='taken')return 'The wood is already where it belongs.';e.timber='returned';e.returned=true;return 'Thanks for bringing it back. The fallen wood is yours to use.';
 case 'gather':{if(s.room!=='outside')return 'The loose materials are outside.';const node=RESOURCES.find(n=>n.id===data.id);if(!node||s.gathered.includes(node.id))return 'You’ve gathered this already.';const cap=e.basket==='held'?2:1;if(s.carry.wood+s.carry.stone>=cap)return 'Your bag is full. Drop these at storage or the building sign.';s.gathered.push(node.id);s.carry[node.type]++;return `Collected ${node.type}. Carrying ${s.carry.wood+s.carry.stone}/${cap}.`;}
 case 'deposit':i.wood+=s.carry.wood;i.stone+=s.carry.stone;s.carry={wood:0,stone:0};return `Materials stored: ${i.wood} wood, ${i.stone} stone.`;
 case 'build':if(!h)return 'Plan a house first.';if(!e.orin)return 'Meet Orin at his cart first.';if(h.stage===0){if(i.stone<6)return 'We need 6 stone for the foundations. Gather loose stones and drop them here.';i.stone-=6;h.stage=1;return 'The first corner. It feels more real now.';}if(h.stage===1){if(e.basket==='held'){e.late=true;return 'I need the basket back for my tools. Bring it over, then we can lift the frame.';}if(e.timber==='taken')return 'Please return my wood before we build together.';if(i.wood<8)return 'We need 8 wood for the frame.';i.wood-=8;h.stage=2;e.lifted=true;return 'Together, you lift the frame into place.';}return h.stage===2?'Place the herb planter, then choose the finishing touches.':'Mara’s home is finished.';
 case 'herbs':if(h?.stage!==2)return 'The frame needs to be ready first.';e.herbs=true;return 'A little herb garden by the door.';
 case 'finish':if(h?.stage!==2||!e.herbs)return 'Set out the herb planter first.';h.trim=Number.isInteger(data.trim)?Math.max(0,Math.min(2,data.trim)):0;h.stage=3;return 'A home, a kitchen, and a neighbour who helped me get here.';
 case 'enterHome':s.room='home';s.player.x=8;s.player.y=11;return 'Your cottage';
 case 'enterBakery':if(h?.stage!==3)return 'The home isn’t ready yet.';s.room='bakery';s.player.x=8;s.player.y=11;return 'Mara’s kitchen';
 case 'exit':{const out=s.room==='bakery'&&h?{x:h.x+2,y:h.y+4}:FIXED.home;s.room='outside';Object.assign(s.player,out);return 'Back in the village';}
 case 'cook':if(s.room!=='bakery'||h?.stage!==3)return 'Visit Mara’s kitchen first.';if(e.cooking)return 'Your batch is already waiting.';if(i.carrot<1)return 'Bring one carrot. Mara has the flour ready.';i.carrot--;e.cooking=1;return 'Mara adds the flour. Place your carrot on the board.';
 case 'mix':if(e.cooking!==1||s.room!=='bakery')return 'Start a batch at the preparation counter.';e.cooking=2;return 'Mix the dough. Mara shapes one bun; the next is yours.';
 case 'shape':if(e.cooking!==2||s.room!=='bakery')return 'Mix the batch first.';e.cooking=3;return 'Three buns, ready for the oven. Mara takes the tray.';
 case 'bake':if(e.cooking!==3||s.room!=='bakery')return 'Your tray isn’t ready yet.';e.cooking=0;e.cooked=true;i.bun+=3;return 'A batch from our first harvest. That’s worth sitting down for.';
 case 'share':if(!e.cooked||e.shared)return 'We’ve already shared our first batch.';if(i.bun<2)return 'We can share another batch later.';i.bun-=2;e.shared=true;return 'You and Mara each have a bun. The rest are yours to keep.';
 case 'eat':if(!i.bun)return 'There are no buns in your basket.';i.bun--;return 'A warm vegetable bun. A quiet moment to enjoy what you made.';
 case 'nursery':if(!e.cooked)return 'Settle in with Mara first.';e.nursery=true;return 'The old nursery is along the northern path. Let’s see what’s still growing.';
 case 'place':if(!validDecor(s,data.type,data.x,data.y,data.index??-1))return 'Leave doors, work areas, and walking routes clear.';if(Number.isInteger(data.index)&&s.decor[data.index]){Object.assign(s.decor[data.index],{x:data.x,y:data.y,rotation:data.rotation===1?1:0});return 'Moved.';}if(!i[data.type])return 'There are no more in storage.';i[data.type]--;s.decor.push({type:data.type,x:data.x,y:data.y,room:s.room,rotation:data.rotation===1?1:0});return 'Placed. Move it or put it back in storage any time.';
 case 'store':{const d=s.decor[data.index];if(!d||d.room!==s.room)return 'Choose a placed decoration.';i[d.type]++;s.decor.splice(data.index,1);return 'Back in storage.';}
 default:return 'Take your time. The village will be here.';
 }
}
export function readSave(raw){
 const s=JSON.parse(raw),base=fresh(),int=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
 if(!s||s.version!==2||!int(s.day,1,100000)||!['outside','home','bakery'].includes(s.room))throw Error('Invalid chapter save');
 for(const [k,n]of Object.entries(base.inventory))if(!int(s.inventory?.[k],0,1000000))throw Error('Invalid inventory');
 for(const k of ['wood','stone'])if(!int(s.carry?.[k],0,2))throw Error('Invalid carry');
 for(const [k,v]of Object.entries(base.story))if(typeof v==='boolean'?typeof s.story?.[k]!=='boolean':typeof s.story?.[k]!==typeof v)throw Error('Invalid story');
 if(!['none','held','returned'].includes(s.story.basket)||!['untouched','taken','returned'].includes(s.story.timber)||!int(s.story.cooking,0,3))throw Error('Invalid event');
 if(!s.player||!int(s.player.x,0,W)||!int(s.player.y,0,H)||!['skin','hair','shirt'].every(k=>int(s.player[k],0,5))||!int(s.player.style,0,2))throw Error('Invalid player');
 if(!Array.isArray(s.gathered)||new Set(s.gathered).size!==s.gathered.length||s.gathered.some(n=>!int(n,0,25)))throw Error('Invalid gathering');
 if(!Array.isArray(s.plots)||s.plots.length!==9)throw Error('Invalid farm');s.plots.forEach((p,j)=>{if(p.x!==base.plots[j].x||p.y!==base.plots[j].y||['planted','watered','ripe'].some(k=>typeof p[k]!=='boolean')||p.ripe&&!p.planted)throw Error('Invalid crop');});
 if(s.house&&(!int(s.house.x,16,44)||!int(s.house.y,7,29)||!int(s.house.stage,0,3)||!int(s.house.style,0,2)||!int(s.house.trim,0,2)))throw Error('Invalid home');
 if(!Array.isArray(s.decor)||s.decor.length>200)throw Error('Invalid decoration');const checked={...s,decor:[]};for(const d of s.decor){if(!DECOR.includes(d.type)||!['outside','home','bakery'].includes(d.room)||!int(d.x,1,52)||!int(d.y,3,35)||!int(d.rotation,0,1)||checked.decor.some(o=>o.x===d.x&&o.y===d.y&&o.room===d.room))throw Error('Invalid item');checked.decor.push({type:d.type,x:d.x,y:d.y,room:d.room,rotation:d.rotation});}
 const clean={...base,day:s.day,room:s.room,player:Object.fromEntries(Object.keys(base.player).map(k=>[k,s.player[k]])),inventory:Object.fromEntries(Object.keys(base.inventory).map(k=>[k,s.inventory[k]])),carry:{wood:s.carry.wood,stone:s.carry.stone},plots:s.plots.map(p=>({x:p.x,y:p.y,planted:p.planted,watered:p.watered,ripe:p.ripe})),gathered:[...s.gathered],house:s.house?{x:s.house.x,y:s.house.y,stage:s.house.stage,style:s.house.style,trim:s.house.trim}:null,decor:checked.decor,story:Object.fromEntries(Object.keys(base.story).map(k=>[k,s.story[k]])),settings:{sound:typeof s.settings?.sound==='boolean'?s.settings.sound:true,music:typeof s.settings?.music==='boolean'?s.settings.music:false}};
 if(clean.house&&!validHouse({...clean,decor:[]},clean.house.x,clean.house.y))throw Error('Blocked home');
 const items=clean.decor;clean.decor=[];for(const d of items){if(!validDecor({...clean,room:d.room,player:{...clean.player,x:-99,y:-99}},d.type,d.x,d.y))throw Error('Blocked decoration');clean.decor.push(d);}
 if(clean.room==='bakery'&&clean.house?.stage!==3)clean.room='outside';
 if(blocked(clean,clean.player.x,clean.player.y))Object.assign(clean.player,clean.room==='outside'?{x:12,y:14}:{x:8,y:11});
 return clean;
}
