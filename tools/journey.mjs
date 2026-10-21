import assert from 'node:assert/strict';
import {fresh,act,readSave,walkingRoute,blocked,FIXED,RESOURCES} from '../chapter-model.js';
import {doorAt} from '../chapter-motion.js';
import {SITES,WORKSHOP} from '../chapter-gathering.js';
import {SQUARE,squareReady,squareActive} from '../chapter-square.js';
import {carryCapacity} from '../chapter-hauling.js';

// Rules-level integration: no invented materials, gold, tools or story flags.
// Every destination is reached through the production pathfinder and door triggers.
export function playJourney(){let s=fresh(),actions=0,walked=0,reloads=0;const stages=[],checkpoints={};
 const reload=()=>{s=readSave(JSON.stringify(s));reloads++;return s;};
 const commit=(id,data={})=>{const message=act(s,id,data);actions++;for(const [key,n]of Object.entries(s.inventory))assert.ok(Number.isInteger(n)&&n>=0,`${id}: invalid ${key}`);assert.ok(s.economy.gold>=0);assert.ok(s.carry.wood+s.carry.stone<=carryCapacity(s));reload();return message;};
 const walk=target=>{if(s.player.x===target.x&&s.player.y===target.y&&doorAt(s,target)){commit(doorAt(s,target));return;}const path=walkingRoute(s,s.player,target);assert.ok(path.length||s.player.x===target.x&&s.player.y===target.y,`No route in ${s.room} to ${target.x},${target.y}`);for(const p of path){assert.equal(blocked(s,p.x,p.y),false);Object.assign(s.player,p);walked++;const door=doorAt(s,p);if(door){commit(door);break;}}};
 const beside=p=>{const paths=[[p.x,p.y+1],[p.x+1,p.y],[p.x-1,p.y],[p.x,p.y-1]].map(([x,y])=>({x,y})).filter(q=>!blocked(s,q.x,q.y)&&!doorAt(s,q)).map(q=>({q,path:walkingRoute(s,s.player,q)})).filter(v=>v.path.length||v.q.x===s.player.x&&v.q.y===s.player.y).sort((a,b)=>a.path.length-b.path.length);assert.ok(paths.length,`No approach to ${p.x},${p.y}`);walk(paths[0].q);};
 const outside=()=>{if(s.room!=='outside')walk({x:8,y:12});assert.equal(s.room,'outside');};
 const enter=room=>{outside();walk(room==='home'?FIXED.home:{x:(room==='bakery'?s.house:s.gardener.house).x+2,y:(room==='bakery'?s.house:s.gardener.house).y+4});assert.equal(s.room,room);};
 const sleep=()=>{enter('home');beside({x:3,y:7});commit('sleep');outside();};
 const orin=()=>{outside();beside(FIXED.orin);return {...FIXED.orin,room:'outside'};};
 const stage=name=>{stages.push({name,day:s.day,gold:s.economy.gold,actions,walked});checkpoints[name]=structuredClone(s);};
 const deposit=()=>{outside();beside(FIXED.store);commit('deposit');};
 const collect=(kind,amount)=>{let attempts=0;while(s.inventory[kind]<amount){assert.ok(attempts++<100,'Gathering must not deadlock');outside();const loose=RESOURCES.find(n=>n.type===kind&&!s.gathered.includes(n.id));if(loose){beside(loose);commit('gather',{id:loose.id});deposit();continue;}const site=SITES.find(n=>n.kind===kind&&(s.gathering.sites[n.id].left||s.gathering.sites[n.id].readyDay<=s.day));if(!site){sleep();continue;}beside(site);commit('strike',{id:site.id});if(s.carry.wood+s.carry.stone)deposit();}};
 const earn=gold=>{let days=0;while(s.economy.gold<gold){assert.ok(days++<30,'Economy must not deadlock');sleep();}};

 commit('arrivalSkip');outside();beside(FIXED.kit);commit('kit');
 for(let index=0;index<6;index++){beside(s.plots[index]);commit('farm',{index,tool:'seed'});commit('farm',{index,tool:'water'});}sleep();
 for(let index=0;index<6;index++){beside(s.plots[index]);commit('farm',{index});}assert.equal(s.inventory.carrot,6);stage('first harvest');
 beside({x:22,y:16});commit('meet');commit('invite');orin();commit('orin');commit('acceptToolsJob');collect('wood',2);collect('stone',2);commit('finishTools',{npc:orin()});assert.ok(s.gathering.axe&&s.gathering.pickaxe);stage('earned tools');
 commit('plan',{x:28,y:10,style:1});commit('borrow');collect('stone',6);collect('wood',8);orin();commit('returnBasket');beside({x:30,y:14});commit('build');commit('build');commit('herbs');commit('finish',{trim:2});assert.equal(s.house.stage,3);
 enter('bakery');beside({x:4,y:5});for(const id of ['cook','mix','shape','bake'])commit(id);commit('share');assert.equal(s.inventory.bun,1);commit('upgradeCan',{npc:orin()});assert.ok(s.story.wideCan);stage('first home and cooking');
 collect('wood',8);collect('stone',4);earn(42);commit('project',{project:'nursery'});commit('project',{project:'market'});assert.ok(s.economy.projects.nursery&&s.economy.projects.market);
 beside({x:43,y:11});commit('meetRowan');commit('inviteRowan');commit('planGarden',{x:36,y:9,style:2});for(let i=0;i<3;i++){earn([12,16,12][i]);beside({x:38,y:13});commit('buildGarden');}assert.equal(s.gardener.house.stage,3);commit('claimBasket',{npc:orin()});assert.equal(carryCapacity(s),4);
 enter('garden');beside({x:4,y:5});commit('seedPack');outside();beside({x:43,y:11});commit('flowerHelp');
 for(let index=0;index<2;index++){beside(s.plots[index]);commit('farm',{index,tool:'seed',crop:'marigold'});commit('farm',{index,tool:'water'});}sleep();for(let index=0;index<2;index++){beside(s.plots[index]);commit('farm',{index,tool:'water'});}sleep();for(let index=0;index<2;index++){beside(s.plots[index]);commit('farm',{index});}const rowan={x:43,y:11,room:'outside'};beside(rowan);commit('giveFlowers',{npc:rowan});assert.ok(s.gardener.sower);stage('second home and flowers');
 collect('wood',8);collect('stone',8);
 // Exercise active tool use even if the loose branches supplied earlier work.
 for(const site of SITES.slice(0,4)){beside(site);for(let j=0;j<3;j++)commit('strike',{id:site.id});deposit();}
 commit('sharpenTools',{npc:orin()});assert.ok(s.gathering.improved);beside(WORKSHOP);commit('craft',{recipe:'bench'});stage('improved tools and crafting');
 collect('wood',4);collect('stone',4);earn(12);beside(SQUARE);commit('startSquare');commit('squareHelp',{name:'orin',npc:orin()});enter('bakery');const baker={room:'bakery',x:11,y:5};beside(baker);commit('squareHelp',{name:'mara',npc:baker});outside();beside(rowan);commit('squareHelp',{name:'rowan',npc:rowan});
 outside();beside(SQUARE);for(const [type,x]of [['bench',6],['planter',9],['lantern',12]])commit('place',{type,x,y:23});assert.ok(squareReady(s));stage('square ready');
 const gold=s.economy.gold;commit('openSquare');assert.ok(squareActive(s));assert.equal(s.economy.gold,gold);const carrots=s.inventory.carrot;commit('openSquare');assert.equal(s.inventory.carrot,carrots);assert.equal(s.square.markets,1);stage('market open');sleep();assert.equal(s.economy.gold,gold+26);assert.equal(s.economy.ledger.at(-1).amount,6);assert.equal(s.square.markets,1);stage('market paid');
 beside(SQUARE);commit('openSquare');assert.equal(s.inventory.carrot,carrots-2);assert.equal(s.square.markets,2);stage('second market');
 return {state:s,checkpoints,report:{stages,actions,walked,reloads,day:s.day,markets:s.square.markets}};
}
