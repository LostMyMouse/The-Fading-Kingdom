import {settleGardener} from './chapter-gardener.js';
import {initialBakery,bakeryAction,settleLunch,readBakery} from './chapter-bakery.js';
// Village cooperation, expressed through work and supplies rather than a morality score.
export const PROJECTS={nursery:{name:'Restore the nursery',gold:18,wood:4,stone:2,benefit:'Pick fresh berries each day, starting tomorrow.'},market:{name:'Open the market stall',gold:24,wood:4,stone:2,benefit:'A place for breakfast and passing trade. Bakery contributions grow by 4 G a day.'}};
export const MARKET={x:6,y:17};
export function initialEconomy(day=1,homeBuilt=false){return {bakery:initialBakery(),gold:homeBuilt?0:12,homeFunded:homeBuilt,lastDay:day-1,lastIncome:0,lastBatch:'closed',fullDays:0,projects:{nursery:false,market:false},berryDay:0,recipe:false,fruitBatch:false,flour:{state:'shelf',noticed:false,takenDay:0,repairedDay:0},ledger:[{day,kind:'welcome',amount:12},...(homeBuilt?[{day,kind:'home',amount:-12}]:[])]};}
export const bakeryOpen=s=>s.house?.stage===3&&s.story.cooked;
export const missingFlour=s=>['held','used','replacement'].includes(s.economy.flour.state);
export const hasFlour=s=>['held','replacement'].includes(s.economy.flour.state);
export const canOfferRecipe=s=>bakeryOpen(s)&&s.economy.fullDays>0&&!missingFlour(s)&&!s.economy.recipe;
export function record(s,kind,amount){s.economy.ledger.push({day:s.day,kind,amount});s.economy.ledger=s.economy.ledger.slice(-8);}
export function fundHome(s){if(s.economy.homeFunded)return true;if(s.economy.gold<12)return false;s.economy.gold-=12;s.economy.homeFunded=true;record(s,'home',-12);return true;}
export function settleVillageDay(s){const v=s.economy;if(v.lastDay>=s.day)return 0;v.lastDay=s.day;v.lastIncome=0;v.lastBatch='closed';if(!bakeryOpen(s))return 0;
 const short=missingFlour(s);v.lastBatch=short?'small':'full';if(short)v.flour.noticed=true;else v.fullDays++;
 const lunch=settleLunch(s),seeds=settleGardener(s);const income=(short?4:10)+(v.projects.market?4:0)+lunch+seeds;v.gold+=income;v.lastIncome=income;record(s,'bakery',income-lunch-seeds);if(seeds)record(s,'seedstall',seeds);if(lunch)record(s,'lunch',lunch);return income;
}
const near=(s,p)=>Math.abs(s.player.x-p.x)+Math.abs(s.player.y-p.y)<=1;
const shelf=s=>s.room==='bakery'&&near(s,{x:3,y:10});
export function economyAction(s,id,data={}){const v=s.economy,i=s.inventory;
 const bakeryResult=bakeryAction(s,id);if(bakeryResult!==null)return bakeryResult;
 switch(id){
 case 'project':{const p=PROJECTS[data.project];if(!p)return 'Choose a village project.';if(v.projects[data.project])return 'That’s already part of the village.';if(!bakeryOpen(s)||!v.homeFunded)return 'Get Mara’s home and first batch ready. Then we can start the next village project.';
  if(data.project==='market'&&(s.decor.some(d=>d.room==='outside'&&d.x>=5&&d.x<=7&&d.y>=15&&d.y<=16)||s.room==='outside'&&s.player.x>=5&&s.player.x<=7&&s.player.y>=15&&s.player.y<=16))return 'Leave the stall space beside the road clear: three squares wide, just west of your garden. Move any decorations there first.';
  if(v.gold<p.gold||i.wood<p.wood||i.stone<p.stone)return `We need ${p.gold} village gold, ${p.wood} wood and ${p.stone} stone for this project. Store carried materials first.`;
  v.gold-=p.gold;i.wood-=p.wood;i.stone-=p.stone;v.projects[data.project]=true;record(s,data.project,-p.gold);if(data.project==='nursery'){v.berryDay=s.day;s.story.nursery=true;return 'Old pots, fresh soil. The berry plants will be ready for a first picking tomorrow.';}return 'The stall’s open. Orin has already picked out his breakfast spot.';}
 case 'harvestBerries':if(!v.projects.nursery)return 'The nursery needs a little work first.';if(s.room!=='outside'||!near(s,{x:45,y:10}))return 'Visit the berry plants at the old nursery.';if(v.berryDay>=s.day)return 'The rest need a little longer. Try again tomorrow.';v.berryDay=s.day;i.berry+=2;return 'Two ripe berries. The smaller ones can stay on the plant until tomorrow.';
 case 'learnRecipe':if(!canOfferRecipe(s))return v.recipe?'You’ve already got my fruit-bun recipe.':'Let’s get the morning orders sorted first. Then we can try something new.';v.recipe=true;return 'Been saving this one. Two berries, a carrot and a bit of flour. Fruit buns! Fancy trying it when you’ve got some berries?';
 case 'takeFlour':if(!shelf(s)||!bakeryOpen(s)||v.flour.state!=='shelf')return 'The other sacks are tucked behind the counter.';v.flour.state='held';v.flour.takenDay=s.day;return 'Picked up a flour sack.';
 case 'askFlour':return 'That sack’s for the morning orders. The little tin by the mixing bowl is for cooking together. Help yourself to that when we bake.';
 case 'returnFlour':if(!shelf(s)||!hasFlour(s))return 'Bring the sack to the shelf in Mara’s kitchen.';{const noticed=v.flour.noticed;v.flour.state=v.flour.state==='replacement'?'replaced':'returned';v.flour.repairedDay=s.day;return noticed?'Flour’s back on the shelf, ready for the next morning’s orders.':'Flour sack put back on the shelf.';}
 case 'simpleRolls':if(!shelf(s)||v.flour.state!=='held'||s.story.cooking)return 'You need a flour sack and a clear mixing bowl.';v.flour.state='used';i.bun+=3;return 'Three little rolls. The flour sack is empty.';
 case 'tradeFlour':if(v.flour.state!=='used')return 'There’s no replacement sack to collect.';if((s.room!=='outside'&&data.npc?.room!==s.room)||!near(s,data.npc??{x:18,y:17}))return 'Visit Orin for the mill delivery.';if(i.carrot<2)return 'The mill can swap a fresh sack for two carrots. Bring them over when they’re ready.';i.carrot-=2;v.flour.state='replacement';return 'Here you go. Fresh from the mill. Pop it on Mara’s shelf before the morning orders.';
 default:return null;
 }
}
export function readEconomy(s,int){const v=s.economy===undefined?initialEconomy(s.day,s.house?.stage===3):s.economy;
 if(!v||!int(v.gold,0,1000000000)||!int(v.lastDay,0,s.day)||!int(v.lastIncome,0,24)||!int(v.fullDays,0,s.day)||!['closed','full','small'].includes(v.lastBatch)||!int(v.berryDay,0,s.day)||['homeFunded','recipe','fruitBatch'].some(k=>typeof v[k]!=='boolean'))throw Error('Invalid village fund');
 if(!v.projects||['nursery','market'].some(k=>typeof v.projects[k]!=='boolean'))throw Error('Invalid village project');
 if(!v.flour||!['shelf','held','used','replacement','returned','replaced'].includes(v.flour.state)||typeof v.flour.noticed!=='boolean'||!int(v.flour.takenDay,0,s.day)||!int(v.flour.repairedDay,0,s.day))throw Error('Invalid flour supply');
 if(!Array.isArray(v.ledger)||v.ledger.length>8||v.ledger.some(e=>!e||!int(e.day,1,s.day)||!['welcome','home','bakery','nursery','market','lunch','porch','gardenhome','seedstall'].includes(e.kind)||!int(e.amount,-1000,1000)))throw Error('Invalid village ledger');
 return {bakery:readBakery(v.bakery,s.day,int),gold:v.gold,homeFunded:v.homeFunded,lastDay:v.lastDay,lastIncome:v.lastIncome,lastBatch:v.lastBatch,fullDays:v.fullDays,projects:{nursery:v.projects.nursery,market:v.projects.market},berryDay:v.berryDay,recipe:v.recipe,fruitBatch:v.fruitBatch,flour:{state:v.flour.state,noticed:v.flour.noticed,takenDay:v.flour.takenDay,repairedDay:v.flour.repairedDay},ledger:v.ledger.map(e=>({day:e.day,kind:e.kind,amount:e.amount}))};
}
