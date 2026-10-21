import {carryCapacity} from './chapter-hauling.js';
export const WORKSHOP={x:15,y:18};
export const SITES=[
 {id:0,x:6,y:25,kind:'wood'},{id:1,x:11,y:27,kind:'wood'},{id:2,x:13,y:26,kind:'wood'},
 {id:3,x:5,y:28,kind:'stone'},{id:4,x:9,y:30,kind:'stone'},{id:5,x:15,y:25,kind:'stone'}
];
export const TOOL_LINES={ask:'This bench wobbles more than my knees. Bring two wood and two stone from your storage? We’ll fix it up, then I’ll sort you an axe and a pickaxe.',accept:'Lovely. Loose branches and stones will do. Pop them in storage, then bring me over to the bench.',gift:'There. Sturdy bench, sturdy tools. The fallen logs and small rocks down southwest are yours to work on. Leave the big trees growing. They were here first.',upgrade:'Sharper edges, better handles. Two swings instead of three. My elbows approve.'};
export const RECIPES={bench:{name:'Garden bench',wood:4,stone:2,count:1},planter:{name:'Planter',wood:2,stone:1,count:1},lantern:{name:'Two lanterns',wood:2,stone:2,count:2},path:{name:'Four path tiles',wood:0,stone:2,count:4},fence:{name:'Four fence pieces',wood:2,stone:0,count:4}};
export function initialGathering(){return {job:'none',axe:false,pickaxe:false,improved:false,cleared:0,sites:SITES.map(()=>({hits:0,left:0,readyDay:0}))};}
export function readGathering(value,int,day){
 const g=value===undefined?initialGathering():value;
 if(!g||!['none','accepted','done'].includes(g.job)||['axe','pickaxe','improved'].some(k=>typeof g[k]!=='boolean')||!int(g.cleared,0,1000000)||g.axe!==(g.job==='done')||g.pickaxe!==g.axe||g.improved&&!g.axe||!Array.isArray(g.sites)||g.sites.length!==SITES.length)throw Error('Invalid gathering tools');
 const sites=g.sites.map(n=>{if(!n||!int(n.hits,0,2)||!int(n.left,0,2)||!int(n.readyDay,0,day+2)||n.left&&(!n.readyDay||n.hits)||n.hits&&n.readyDay||g.job!=='done'&&(n.hits||n.left||n.readyDay))throw Error('Invalid gathering patch');return {hits:n.hits,left:n.left,readyDay:n.readyDay};});
 return {job:g.job,axe:g.axe,pickaxe:g.pickaxe,improved:g.improved,cleared:g.cleared,sites};
}
export const toolJobAvailable=s=>!!(s.story.kit&&s.story.harvest&&s.story.orin);
export function siteVisible(s,n){return s.room==='outside'&&!s.decor.some(d=>d.room==='outside'&&d.type!=='path'&&d.x===n.x&&d.y===n.y);}
export function siteStatus(s,n){const p=s.gathering.sites[n.id];return {...p,depleted:p.left===0&&p.readyDay>s.day,tool:n.kind==='wood'?'axe':'pickaxe',strikes:s.gathering.improved?2:3};}
const near=(s,p)=>Math.abs(s.player.x-p.x)+Math.abs(s.player.y-p.y)<=1;
function carpenterHere(s,npc){return !!npc&&s.room===(npc.room||'outside')&&near(s,npc);}
function pay(s,wood,stone){if(s.inventory.wood<wood||s.inventory.stone<stone)return false;s.inventory.wood-=wood;s.inventory.stone-=stone;return true;}
export function gatheringAction(s,id,data){
 const g=s.gathering;
 switch(id){
 case 'acceptToolsJob':if(!toolJobAvailable(s))return 'Grow your first carrot and meet Orin. He knows his way around tools.';if(g.job!=='none')return 'That bench job’s already in our book.';g.job='accepted';return TOOL_LINES.accept;
 case 'finishTools':
  if(g.job==='done')return 'Those tools are yours. Take them out for a spin.';
  if(g.job!=='accepted')return 'Ask Orin about the workbench first.';
  if(!carpenterHere(s,data.npc))return 'Bring those supplies over to Orin.';
  if(s.decor.some(d=>d.room==='outside'&&d.type!=='path'&&d.x===WORKSHOP.x&&d.y===WORKSHOP.y))return 'Move the decoration beside the workbench first. We need that corner clear.';
  if(!pay(s,2,2))return 'Two wood and two stone from storage. Drop off what you’re carrying first.';
  g.job='done';g.axe=g.pickaxe=true;return TOOL_LINES.gift;
 case 'sharpenTools':
  if(g.improved)return 'Already fitted. Those edges are looking good.';
  if(!g.axe||g.cleared<4||!s.story.cooked)return 'Try the tools on four logs or rocks, and get Mara’s oven going. I’ll work on some better fittings.';
  if(!carpenterHere(s,data.npc))return 'Bring the tools over to Orin.';
  if(!pay(s,4,4))return 'Four wood and four stone from storage for the new fittings.';
  g.improved=true;return TOOL_LINES.upgrade;
 case 'strike':{
  const n=SITES.find(n=>n.id===data.id);if(!n||!siteVisible(s,n)||!near(s,n))return 'Walk beside a fallen log or a small rock.';
  const p=g.sites[n.id],v=siteStatus(s,n);if(v.depleted)return 'A cleared patch. More loose material will be ready on day '+p.readyDay+'.';
  const free=carryCapacity(s)-s.carry.wood-s.carry.stone;if(free<=0)return 'Your basket is full. Drop these materials at storage or a building sign.';
  if(!p.left){if(!g[v.tool])return n.kind==='wood'?'This log needs an axe. Ask Orin about tools.':'This rock needs a pickaxe. Ask Orin about tools.';
   if(p.readyDay){p.readyDay=0;p.hits=0;}p.hits++;
   if(p.hits<v.strikes)return (n.kind==='wood'?'Chop':'Mine')+' · '+p.hits+'/'+v.strikes+'.';
   p.hits=0;p.left=2;p.readyDay=s.day+2;g.cleared++;
  }
  const amount=Math.min(free,p.left);s.carry[n.kind]+=amount;p.left-=amount;
  return 'Gathered '+amount+' '+n.kind+'.'+(p.left?' '+p.left+' more waiting here.':' Patch cleared.')+' Carrying '+(s.carry.wood+s.carry.stone)+'/'+carryCapacity(s)+'.';
 }
 case 'craft':{
  if(g.job!=='done')return 'Fix the workbench with Orin first.';
  if(s.room!=='outside'||!near(s,WORKSHOP))return 'Use the workbench beside Orin’s cart.';
  const r=Object.hasOwn(RECIPES,data.recipe)?RECIPES[data.recipe]:null;if(!r)return 'Choose something from the workbench plans.';
  if(s.inventory[data.recipe]+r.count>1000000)return 'Your storage is full of those already.';
  if(!pay(s,r.wood,r.stone))return 'Not enough stored wood and stone. Drop off your materials first.';
  s.inventory[data.recipe]+=r.count;return r.name+' made. Find '+(r.count>1?'them':'it')+' in Decorate. You choose the spot.';
 }
 default:return null;
 }
}

export function replenishLoose(s,resources){for(const kind of ['wood','stone']){const id=s.gathered.find(id=>resources.some(n=>n.id===id&&n.type===kind));if(id!==undefined)s.gathered=s.gathered.filter(n=>n!==id);}}
