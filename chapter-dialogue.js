// Original everyday conversations. They never award items or relationship points.
export function chatLine(s,who){
 const turn=s.conversation?.[who]||0,e=s.story;
 let lines;
 if(who==='mara'){
  if(!e.invited)lines=[
   'That wheel squeaks every time I turn left. Right turns? Quiet as anything. Very picky wheel.',
   'I found flour in my boots this morning. No idea how. Well… some idea.',
   'Do you know which way the wind blows here? I like to put the washing where it has a fighting chance.'
  ];
  else if(s.house?.stage!==3)lines=[
   'I keep thinking about where to put the oven. Then I remember we need walls first. One thing at a time, Mara.',
   'There’s a bird watching my cart. I think it’s spotted the crumbs. Fair enough. I’ve spotted them too.',
   'I packed one cup and three rolling pins. A very sensible amount of rolling pins. Not enough cups.',
   s.plots.some(p=>p.ripe)?'Your carrots are looking ready. Mine used to come out all wonky. Still tasted like carrots, though.':'I like it here. You can hear yourself think. Mostly I’m thinking about lunch.'
  ];
  else if(e.cooked)lines=[
   s.conversation?.cookedDay===s.day-1?'I found a crumb from yesterday’s buns in my pocket. Saving that for later. Kidding. Mostly.':'The table nearly fits. We’ll eat sideways. It’s fine.',
   e.shared?'That bun we had together? I’m still thinking about it. Next time I might sneak a few herbs into the dough.':'I was going to tidy the kitchen. Then I thought of something else to bake. You can guess what happened.',
   'I’ve put mint by the door. Lovely smell. Very strong opinions about how much room it needs.',
   'Orin says my bread’s good for a long walk. I’m hoping he means eating it, not using it to fix his boots.'
  ];
  else lines=[
   s.conversation?.movedDay===s.day-1?'First night in the new house! Slept like a loaf. Is that a saying? It is now.':'The oven fits! I checked twice. Three times, if you count standing here grinning at it.',
   'I’m still reaching for things where they used to be on the cart. Tried to open a wall earlier.',
   'The herbs are in. Now I just have to remember which little green thing is which.'
  ];
 }else if(who==='orin'){
  if(e.timber==='taken'&&e.timberNoticed)return 'Still need those boards for the mill. Other than that? Can’t complain. Well, I could. Splinter in my thumb.';
  lines=[
   s.house?.stage===3?'Walked past Mara’s place earlier. Smoke coming out of the chimney. That’s the nice bit of building a house.':'Measure twice, cut once. I measured three times this morning. Couldn’t find my pencil.',
   'A squirrel sat on my cart for ten minutes. Didn’t lift a thing. Terrible assistant.',
   e.dependable?'Found my basket exactly where I needed it. Makes a change from my hammer. That thing’s always hiding.':'I’ve got a new hammer. Looks just like the old one, but I haven’t dropped this one on my foot yet.',
   e.lifted?'That frame went up nicely. I’m taking the afternoon off. Well… a bit of it. There’s a stool with a wobbly leg.':'Hear that creak? Cart wheel. I’ll fix it after this job. Been saying that since last spring.'
  ];
 }else return '';
 return lines[turn%lines.length];
}
