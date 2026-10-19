// A permanent practical upgrade, earned through the community's second home.
export const BASKET_LINES={ask:'Two new homes. Lot of trips up and down that path, eh? Made you something for the next lot.',gift:'Two new homes! You’ve done a fair bit of carrying. Made you this one. Four bundles, and no need to bring it back. Unless there’s cake in it.'};
export function carryCapacity(s){return s.story.carryBasket?4:s.story.basket==='held'?2:1;}
export function canEarnCarryBasket(s){return s.house?.stage===3&&s.story.cooked&&s.gardener?.house?.stage===3&&!s.story.carryBasket;}
export function claimCarryBasket(s,npc){
 if(s.story.carryBasket)return 'That basket’s yours. Four bundles at a time. Much kinder on your pockets.';
 if(!canEarnCarryBasket(s))return 'Let’s get Rowan’s place finished. I’ve got an idea for all this hauling.';
 const target=npc??{x:18,y:17,room:'outside'};
 if(s.room!==(target.room||'outside')||Math.abs(s.player.x-target.x)+Math.abs(s.player.y-target.y)>1)return 'Come over when you have a moment. I’ll show you the basket.';
 if(s.story.basket==='held')return 'Could you drop off those materials and bring my tool basket back first? This one’s for you to keep.';
 s.story.carryBasket=true;return BASKET_LINES.gift;
}
