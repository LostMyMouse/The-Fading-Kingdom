// Presentation derived from earned story/economy state. Never awards or removes stock.
export function bakeryLife(s){
 const open=s.house?.stage===3&&!!s.story.cooked,short=open&&s.economy.lastBatch==='small';
 const missing=['held','used','replacement'].includes(s.economy.flour.state);
 return {open,short,restocking:short&&!missing,bread:open?(short?2:5):0,lit:open,label:short?'Bakery · small batch':'Mara’s bakery'};
}
export function carpenterWaiting(s){return s.story.timber==='taken'&&s.story.timberNoticed?'mill':s.story.basket==='held'&&s.story.late?'basket':null;}
export function neighbourGreeting(s,name){
 if(name==='orin'){
  if(carpenterWaiting(s)==='mill')return 'Mill delivery’s still a bundle short. I’m sorting the other bits while I wait.';
  if(s.story.returned)return 'Mill delivery’s all together again. Cheers for sorting that out. Much better than blaming the squirrels.';
  if(s.story.dependable)return 'Basket where I need it, tools all together. You’ve made my morning a bit easier.';
  if(s.gathering.job==='done')return 'That bench is still standing. No wobble! Pull up a seat if you fancy a break.';
 }
 if(name==='mara'){
  const life=bakeryLife(s);
  if(life.restocking)return 'Flour’s back where I need it. Just the small batch today, but I can get the full tray ready for tomorrow.';
  if(life.short)return 'Only a little tray today. I’m saving a loaf for the road. Got to look after the walkers.';
  if(s.economy.bakery.order.state==='done')return 'There you are! Orin’s still talking about those carrot buns we made.';
  if(s.story.shared)return 'Oh, hey! Fancy a seat? I was just thinking about that first batch we made together.';
 }
 return null;
}

export function residentDoor(s,room){const h=room==='garden'?s.gardener.house:room==='bakery'?s.house:null;return h?.stage===3?{x:h.x+2,y:h.y+4}:null;}

export function workRemark(s,name){
 if(name==='orin')return carpenterWaiting(s)==='mill'?'Mill delivery’s a bundle short. I’ll sort these bits first.':carpenterWaiting(s)==='basket'?'Need my tool basket for this bit. Time for a stretch.':null;
 const life=bakeryLife(s);return name==='mara'&&life.short&&!s.story.cooking?(life.restocking?'Flour’s sorted. Full tray tomorrow.':'Just the small tray today.') :null;
}
