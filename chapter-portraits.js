import {ROWAN_LINES} from './chapter-gardener.js';
import {BASKET_LINES} from './chapter-hauling.js';
import {BAKERY_LINES} from './chapter-bakery.js';
// Authored line expressions; no sentiment analysis or morality score.
export const EXPRESSIONS=['neutral','happy','amused','thoughtful','surprised','concerned'];
let portraitLoading=null;
export function preparePortraits(){if(portraitLoading)return portraitLoading;portraitLoading=Promise.all(['mara','orin','rowan'].map(name=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(true);image.onerror=()=>resolve(false);image.src=new URL('./assets/portraits/'+name+'-expressions.png',import.meta.url).href;}))).then(results=>{const ready=results.every(Boolean);if(!ready)portraitLoading=null;return ready;});return portraitLoading;}
const groups={
 surprised:['Oh, hello! Is this your place? I’ve got flour in my boots and a wheel that squeaks.'],
 happy:[
 'It’s nice here. Room for one more? I’d love to give this cart a rest.',
 'Fancy making something? I’ve got flour. You’ve got carrots. I like where this is going.',
 'Oh, hey! Come in. Mind the flour. Actually, don’t. It’s everywhere.',
 'Hey! Something smells good. For once, I haven’t left a tray in the oven.',
 'Oh, I can see it now. Herbs here, oven in there… yes. This could work.',
 'Ooh, look at those. Careful. They’re still doing the hot-bun thing.',
 'Ooh, yes please. Nothing beats a warm bun.',
 'Mara’s got her place and the oven’s going, then. I’ve found a wider spout for your watering can. Want me to fit it?',
 'Mara’s got the oven going, then. Smells better than sawdust.',
 'Walked past Mara’s place earlier. Smoke coming out of the chimney. That’s the nice bit of building a house.',
 'Found my basket exactly where I needed it. Makes a change from my hammer. That thing’s always hiding.',
 'That bun we had together? I’m still thinking about it. Next time I might sneak a few herbs into the dough.',
 'First night in the new house! Slept like a loaf. Is that a saying? It is now.',
 'The oven fits! I checked twice. Three times, if you count standing here grinning at it.',
 'I like it here. You can hear yourself think. Mostly I’m thinking about lunch.',
 'Cheers. I’d have had a very draughty mill to explain.'
 ],
 amused:[
 'Ah. There’s my wood. I was starting to blame the squirrels.',
 'Very. I’m Mara. I bake things. Mostly bread. Sometimes things that were meant to be bread.',
 'Yep. I’ll be here, negotiating with this wheel.',
 'Sure. I’ll try not to eat all the ingredients.',
 'No rush. I’ve got a very important sandwich to finish.',
 'Yep, all yours. Save me a sniff, at least.',
 'The oven fits! The table… nearly fits. We’ll eat sideways. It’s fine.',
 'Building a house, eh? I’m Orin. Made a few of those. Most of them are still standing.',
 'Oh, hey. Just sorting these tools. They don’t sort themselves. I’ve checked.',
 'How’s the basket doing? More useful than my pockets, I bet.',
 'I found flour in my boots this morning. No idea how. Well… some idea.',
 'I packed one cup and three rolling pins. A very sensible amount of rolling pins. Not enough cups.',
 'I found a crumb from yesterday’s buns in my pocket. Saving that for later. Kidding. Mostly.',
 'The table nearly fits. We’ll eat sideways. It’s fine.',
 'Orin says my bread’s good for a long walk. I’m hoping he means eating it, not using it to fix his boots.',
 'I’m still reaching for things where they used to be on the cart. Tried to open a wall earlier.',
 'A squirrel sat on my cart for ten minutes. Didn’t lift a thing. Terrible assistant.',
 'Measure twice, cut once. I measured three times this morning. Couldn’t find my pencil.',
 'I’ve got a new hammer. Looks just like the old one, but I haven’t dropped this one on my foot yet.'
 ],
 thoughtful:[
 'An oven, somewhere to sleep… that’s about it. Herbs by the door would be nice.',
 'Easy mix-up. I cut those to fit the roof. Loose branches by the path are fine to use.',
 'Try south of the road. Branches, loose stones… plenty lying about. Saves me sweeping them up.',
 'Get Mara settled and try out that oven. I might have something useful for your garden after that.',
 'Spreads the water across a short row. Same can, fewer trips. Start in the middle.',
 'Wide spout still behaving? Aim for the middle of a row. Saves a fair bit of pottering.',
 'Those boards are for the mill roof. Try the loose branches by the path.',
 'Do you know which way the wind blows here? I like to put the washing where it has a fighting chance.',
 'I keep thinking about where to put the oven. Then I remember we need walls first. One thing at a time, Mara.',
 'I’ve put mint by the door. Lovely smell. Very strong opinions about how much room it needs.',
 'The herbs are in. Now I just have to remember which little green thing is which.',
 'Hear that creak? Cart wheel. I’ll fix it after this job. Been saying that since last spring.'
 ],
 concerned:[
 'Those boards are for the mill roof. Can you pop them back?',
 'Not that bundle. It’s cut to fit the mill roof. There’s loose wood by the path you can use, though.',
 'Still need those boards for the mill. Other than that? Can’t complain. Well, I could. Splinter in my thumb.'
 ]
};
groups.concerned.push('Bit of a small batch today. I couldn’t find that sack for the morning orders.');
groups.thoughtful.push('Oh, that sack? I’d set it aside for the morning orders.','Pop it on the shelf when you’re ready. Then I can get the full batch going.','Orin’s got a delivery from the mill. Two carrots for a sack, he said. Could you put a fresh one on the shelf?','That sack’s for the morning orders. The little tin by the mixing bowl is for cooking together. Help yourself to that when we bake.');
groups.happy.push('There we go. A full batch tomorrow. Thanks for sorting that out.','Been saving this one. Two berries, a carrot and a bit of flour. Fruit buns! Fancy trying it when you’ve got some berries?','Sold the last loaf! I’ve put a little gold in the village pot. What shall we build next?','That stall’s getting busy! Orin came for one bun and stayed for three.','Berry juice on the counter. That’s how you know they’re good. Three fruit buns, ready to go.');
groups.happy.push(BAKERY_LINES.accept,BAKERY_LINES.delivered,BAKERY_LINES.ready,BAKERY_LINES.done,BAKERY_LINES.built);
groups.thoughtful.push(BAKERY_LINES.ask,BAKERY_LINES.waiting,BAKERY_LINES.late,BAKERY_LINES.porch);
groups.amused.push(BAKERY_LINES.decline,'Caught myself watering the window boxes before breakfast. Nearly watered my toast as well.','Remember that tray we made for Orin? He brought it back so clean I nearly put it straight in the cupboard.','Those carrot buns you and Mara made? Didn’t get much carpentry done until they were gone.');
groups.happy.push(ROWAN_LINES.hello,ROWAN_LINES.settled,ROWAN_LINES.thanks,ROWAN_LINES.repaired);groups.thoughtful.push(ROWAN_LINES.invite,ROWAN_LINES.help);groups.concerned.push(ROWAN_LINES.missing);groups.amused.push(ROWAN_LINES.chatter);
const authored=new Map(Object.entries(groups).flatMap(([expression,lines])=>lines.map(text=>[text,expression])));
authored.set(BASKET_LINES.ask,'happy');authored.set(BASKET_LINES.gift,'amused');
export function portraitFor(speaker,text,expression=authored.get(text)||'neutral'){
 const name=speaker.toLowerCase();if(!['mara','orin','rowan'].includes(name))return null;
 const frame=Math.max(0,EXPRESSIONS.indexOf(expression));
 return {name,expression:EXPRESSIONS[frame],src:'./assets/portraits/'+name+'-expressions.png',position:(frame%3*50)+'% '+(Math.floor(frame/3)*100)+'%'};
}
