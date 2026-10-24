import {BRIDGE} from './chapter-bridge.js';
import {FIXED,RESOURCES} from './chapter-model.js';
import {carryCapacity} from './chapter-hauling.js';
import {SITES,siteStatus} from './chapter-gathering.js';
import {PROJECTS,missingFlour} from './chapter-economy.js';
import {SQUARE,SQUARE_COST,squareActive,squareDelay,squareLayout,squareReady} from './chapter-square.js';
const step=(key,title,text,label,action,target,extra={})=>({key,title,text,label,action,target,...extra});
const npc=(name,title,text,label,action='talk')=>step(name+':'+action,title,text,label,action,name==='orin'?FIXED.orin:name==='rowan'?{x:43,y:11}:{x:22,y:16},{npc:name});
const bed=(title,text)=>step('sleep',title,text,'Sleep until morning','sleep',FIXED.home);
function materials(s,wood,stone,title,target,delivery='deposit'){
 const needs={wood,stone},total=s.carry.wood+s.carry.stone;
 if(total&&(total>=carryCapacity(s)||['wood','stone'].every(k=>s.inventory[k]+s.carry[k]>=needs[k])))return step('drop-off',title,'Drop off the materials you’re carrying. Stored supplies are ready for building and repairs.','Drop off materials',delivery,target);
 const kind=['stone','wood'].find(k=>s.inventory[k]+s.carry[k]<needs[k]);
 if(!kind)return null;
 const n=RESOURCES.filter(n=>n.type===kind&&!s.gathered.includes(n.id)).sort((a,b)=>Math.abs(a.x-s.player.x)+Math.abs(a.y-s.player.y)-Math.abs(b.x-s.player.x)-Math.abs(b.y-s.player.y))[0];
 if(n)return step('gather:'+n.id,title,`Gather ${kind} · ${s.inventory[kind]+s.carry[kind]}/${needs[kind]}. Loose branches and stones are free to pick up.`,'Gather loose '+kind,'resource',n,{node:n.id});
 const site=SITES.find(n=>n.kind===kind&&!siteStatus(s,n).depleted&&!s.decor.some(d=>d.room==='outside'&&d.type!=='path'&&d.x===n.x&&d.y===n.y));
 if(s.gathering.axe&&site)return step('work:'+site.id,title,`Work a ${kind==='wood'?'fallen log':'small rock'}, then drop off the materials.`,kind==='wood'?'Chop a fallen log':'Mine a small rock','worksite',site,{node:site.id});
 if(total)return step('drop-off',title,'Store what you’re carrying before gathering more.','Drop off materials',delivery,target);
 return bed(title,'More loose branches and stones turn up after a night’s rest. Your stored supplies will wait.');
}
function farming(s,crop='carrot',wanted=1){
 const item=crop==='marigold'?'marigold':'carrot',seed=crop==='marigold'?'flowerSeed':'seed',title=crop==='marigold'?'Flowers for Rowan':'A little ground';
 const ripe=s.plots.find(p=>p.ripe&&(p.crop||'carrot')===crop),dry=s.plots.find(p=>p.planted&&!p.ripe&&!p.watered&&(p.crop||'carrot')===crop),growing=s.plots.find(p=>p.planted&&!p.ripe&&(p.crop||'carrot')===crop);
 if(ripe)return step('harvest:'+s.plots.indexOf(ripe),title,`Pick your ${crop==='marigold'?'flowers':'carrot'}. There’s room in your basket.`,'Harvest '+(crop==='marigold'?'a marigold':'a carrot'),'farm',ripe,{index:s.plots.indexOf(ripe),tool:'hands',crop});
 if(dry)return step('water:'+s.plots.indexOf(dry),title,`Give this ${crop==='marigold'?'flower':'carrot'} some water. It grows when you sleep.`,'Water this plot','farm',dry,{index:s.plots.indexOf(dry),tool:'water',crop});
 if(growing)return bed(title,crop==='marigold'?'Marigolds need two watered nights. They’ll wait safely if you miss a day.':'Your watered carrot grows overnight. Sleep in your cottage when you’re ready.');
 if(s.inventory[item]>=wanted)return null;
 if(!s.inventory[seed])return crop==='marigold'?step('flower-seeds',title,'Rowan trades three marigold seeds for one carrot at the seed counter.','Visit the seed counter','seedcounter',{x:43,y:11}):step('starter-seeds',title,'Your cottage keeps free carrot seeds. Refill the tin whenever you need it.','Refill starter seeds','seeds',FIXED.store);
 const p=s.plots.find(p=>!p.planted);
 if(!p)return step('garden',title,'The plots are full. Tend a growing crop or harvest something ripe to make room.','Visit my garden','garden',s.plots[0]);
 return step('plant:'+s.plots.indexOf(p),title,`Plant ${crop==='marigold'?'a marigold for Rowan':s.story.harvest?'a carrot':'your first carrot'}, then give it some water. There’s no rush.`,'Plant '+(crop==='marigold'?'a marigold':'a carrot'),'farm',p,{index:s.plots.indexOf(p),tool:'seed',crop});
}
function project(s,key){const p=PROJECTS[key],title='A village at work';
 if(s.economy.gold<p.gold)return bed(title,`The ${key==='nursery'?'nursery':'market stall'} needs ${p.gold} village gold. The bakery contributes when you sleep. Your garden and decorating are here whenever you fancy them.`);
 return materials(s,p.wood,p.stone,title,FIXED.store)||step('project:'+key,title,p.benefit+' You can check the costs before spending anything.','Plan the '+(key==='nursery'?'nursery':'market stall'),'project',key==='nursery'?FIXED.nursery:{x:6,y:17},{project:key});
}
// Presentation only: suggestions never change saves, award gifts, or select a moral reply.
export function nextStep(s){const e=s.story,h=s.house,g=s.gardener;
 if(!e.kit)return step('kit','A little ground','Your starter tools are beside the cottage. Pick them up when you’re ready.','Find my tools','kit',FIXED.kit);
 if(!e.harvest)return farming(s,'carrot',Infinity);
 if(!e.invited)return npc('mara','Room for one more','A traveller has stopped by the road. Go and say hello.','Meet Mara');
 if(!h)return step('plan-home','A place to call home','Mara needs a home and a kitchen. You choose the style and the spot.','Plan Mara’s home','plan',{x:30,y:10});
 if(!e.orin&&h.stage<3)return npc('orin','A helping hand','Meet Orin at his cart. He can help with the house.','Meet Orin');
 if(s.gathering.job==='accepted')return materials(s,2,2,'A workbench for Orin',FIXED.store)||npc('orin','A workbench for Orin','Two stored wood and two stored stone. Orin has the tool heads ready.','Bring supplies to Orin','tools');
 if(h.stage<2){
  if(h.stage===1&&e.timber==='taken')return npc('orin',e.timberNoticed?'Boards for the mill':'The house frame',e.timberNoticed?'Orin needs the mill boards back. Talk to him when you’re ready.':'Talk to Orin about lifting the frame.','Talk to Orin');
  if(h.stage===1&&e.basket==='held'&&s.carry.wood+s.carry.stone)return step('drop-off','Orin’s tools','Drop off your materials before returning the borrowed basket.','Drop off materials','building',{x:h.x+2,y:h.y+4});
  if(h.stage===1&&e.basket==='held')return npc('orin','Orin’s tools','Return the basket before lifting the frame. Drop off carried materials first.','Return the basket');
  const target={x:h.x+2,y:h.y+4},need=materials(s,h.stage===1?8:0,h.stage===0?6:0,'Gather and lend a hand',target,'building');
  return need||step('build-home','From the ground up',h.stage===0?'The stone is ready. Lay the foundations at the sign.':'The wood is ready. Lift the frame with Orin.','Visit the building sign','building',target);
 }
 if(h.stage===2)return step('finish-home','A front door for Mara','Set out Mara’s herbs and choose the finishing touches.','Finish Mara’s home','building',{x:h.x+2,y:h.y+4});
 if(s.economy.flour.noticed&&missingFlour(s))return s.economy.flour.state==='used'?npc('orin','Morning orders','Orin can swap two carrots for fresh flour. Put the sack on Mara’s shelf afterwards.','Find replacement flour','flourTrade'):step('flour-shelf','Morning orders','Put the flour sack back on the kitchen shelf for Mara’s next batch.','Visit the flour shelf','flourShelf',{x:h.x+2,y:h.y+4});
 if(!e.cooked){if(!s.inventory.carrot&&!e.cooking)return farming(s);return step('cook','Something in the oven',e.cooking?'Your batch is waiting in the kitchen. Pick up where you left off.':'Bring a carrot to Mara’s kitchen. Make your first tray together.','Visit Mara’s kitchen','kitchen',{x:h.x+2,y:h.y+4});}
 if(s.bridge?.started&&!s.bridge.built)return npc('orin','A path across the pond','The bridge supplies are set aside. Find Orin to put them together.','About the footbridge','bridgeHelp');
 if(!e.wideCan)return npc('orin','A hand on the farm','Orin has a wider spout for your can. Same can, fewer trips.','Visit Orin','equipment');
 if(s.gathering.job!=='done')return npc('orin','Handier tools','Orin’s bench could use a repair. Ask him about an axe and a pickaxe.','Ask about gathering tools','tools');
 if(!s.economy.projects.nursery)return project(s,'nursery');
 if(!g.invited)return npc('rowan','A visitor among the plants','Someone’s looking after the nursery. Say hello when you like.','Meet Rowan');
 if(!s.economy.projects.market)return project(s,'market');
 if(g.house?.stage!==3){if(g.house&&s.economy.gold<[12,16,12][g.house.stage])return bed('Room for Rowan','The village businesses contribute each morning. Rowan’s building sign shows the next stage’s cost.');return step('rowan-home','Room for Rowan',g.house?'Fund the next stage at Rowan’s building sign.':'Choose a place for Rowan’s home and seed shop.','Plan Rowan’s home','gardenHome',g.house?{x:g.house.x+2,y:g.house.y+4}:{x:43,y:11});}
 if(g.help&&!g.sower){if(s.inventory.marigold>=2)return npc('rowan','Flowers for Rowan','Two marigolds, ready to bring over. Rowan has something for your seed basket.','Bring Rowan the flowers','flowers');return farming(s,'marigold',2);}
 if(!s.square.opened){
  if(!s.square.started){if(s.economy.gold<SQUARE_COST.gold)return bed('Somewhere to gather','The ground repairs need 12 village gold. The bakery and seed shop contribute each morning.');const supplies=materials(s,4,4,'Somewhere to gather',FIXED.store);if(supplies)return supplies;return step('square','Somewhere to gather','The materials are ready. Visit the old marker to check the repair plan.','Visit the square board','square',SQUARE);}
  for(const name of ['orin','mara','rowan'])if(!s.square[name]||squareDelay(s,name)){if(name==='mara'&&!squareDelay(s,name)&&s.inventory.carrot<2)return farming(s,'carrot',2);return npc(name,'Made together','Have a word with '+name[0].toUpperCase()+name.slice(1)+' about the village square.','Find '+name[0].toUpperCase()+name.slice(1),'squareHelper');}
  const missing=Object.entries(squareLayout(s)).filter(([,ready])=>!ready).map(([name])=>name);
  if(missing.length||!squareReady(s))return step('arrange-square','Make it yours',missing.length?'Still to place on the pale ground: '+missing.join(', ')+'. You choose the spots.':'Leave a little walking room between furnishings so everyone can gather.','Arrange the square','squareArrange',{x:8,y:23});
  return step('square','Somewhere to gather','The square is ready. Gather everyone for the first market when you like.','Gather everyone','square',SQUARE);
 }

 return step('chapter-done','A village beginning',squareActive(s)?'Market day! Wander over, have a chat, or make something for your own corner of the village.':'Two new neighbours and a square to share. Keep growing, make things, or plan another market.','My village story','story',SQUARE);
}
export function villageStory(s){return [
 {id:'garden',title:'A little ground',done:s.story.harvest,text:'A carrot from a quiet patch. That’s how a village starts.'},
 {id:'mara',title:'A front door for Mara',done:s.house?.stage===3,text:'You choose her home’s style and place. Orin helps turn the plan into a house.'},
 {id:'buns',title:'Something in the oven',done:s.story.cooked,text:'Your carrot, Mara’s flour, and a first tray made together.'},
 {id:'tools',title:'Handier tools',done:s.gathering.job==='done',text:'Help repair Orin’s bench and earn your axe and pickaxe.'},
 {id:'trade',title:'A village at work',done:s.economy.projects.nursery&&s.economy.projects.market,text:'The nursery and market turn everyday work into a shared village fund.'},
 {id:'rowan',title:'Room for Rowan',done:s.gardener.house?.stage===3,text:'A home, a seed counter and new things to grow.'},
 {id:'square',title:'Somewhere to gather',done:s.square.opened,text:'You arrange the square. Your neighbours bring their skills and a little company.'},
 ...(s.bridge?.started?[{id:'bridge',title:'A path across the pond',done:s.bridge.built,text:'Mara’s morning trade and your gathered materials help open the island.'}]:[])
 ].map(chapter=>({...chapter,done:!!chapter.done}));}
