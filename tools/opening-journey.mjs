import assert from 'node:assert/strict';
import {fresh,act,readSave,walkingRoute,blocked,FIXED} from '../chapter-model.js';
import {nextStep} from '../chapter-guidance.js';
import {doorAt} from '../chapter-motion.js';
import {carryCapacity} from '../chapter-hauling.js';
import {firstTradePending} from '../chapter-economy.js';

// Real rules, routes, doorways and saves. Choices are explicit test inputs;
// guidance itself never answers a conversation or mints supplies.
export function playOpening({borrow=false,takeBoards=false,site={x:28,y:10},keepFlour=false}={}){
 let s=fresh(),actions=0,walked=0;const checkpoints={},log=[];
 const remember=name=>{checkpoints[name]=structuredClone(s);};
 const commit=(id,data={})=>{const message=act(s,id,data);log.push({id,day:s.day,message});actions++;assert.ok(s.economy.gold>=0);assert.ok(s.carry.wood+s.carry.stone<=carryCapacity(s));s=readSave(JSON.stringify(s));return message;};
 const walk=to=>{const path=walkingRoute(s,s.player,to);assert.ok(path.length||s.player.x===to.x&&s.player.y===to.y,`No route to ${to.x},${to.y} in ${s.room}`);for(const q of path){assert.equal(blocked(s,q.x,q.y),false);Object.assign(s.player,q);walked++;const door=doorAt(s,q);if(door){commit(door);break;}}};
 const beside=p=>{const choices=[[0,1],[1,0],[-1,0],[0,-1]].map(([dx,dy])=>({x:p.x+dx,y:p.y+dy})).filter(q=>!blocked(s,q.x,q.y)&&!doorAt(s,q)).map(q=>({q,r:walkingRoute(s,s.player,q)})).filter(v=>v.r.length||v.q.x===s.player.x&&v.q.y===s.player.y).sort((a,b)=>a.r.length-b.r.length);assert.ok(choices.length);walk(choices[0].q);};
 const outside=()=>{if(s.room!=='outside')walk({x:8,y:12});assert.equal(s.room,'outside');};
 const enter=room=>{outside();walk(room==='home'?FIXED.home:{x:s.house.x+2,y:s.house.y+4});assert.equal(s.room,room);};
 const orin=()=>{outside();beside(FIXED.orin);return {...FIXED.orin,room:'outside'};};
 commit('arrivalSkip');remember('arrival');let taken=false;
 for(let turns=0;turns<200;turns++){
  if(s.economy.lastIncome){remember('first trade');return {state:s,checkpoints,log,report:{actions,walked,day:s.day,gold:s.economy.gold,tools:s.gathering.axe,cleared:s.gathering.cleared}};}
  const before=JSON.stringify(s),step=nextStep(s);assert.equal(JSON.stringify(s),before,'Reading the guide changed the story');
  switch(step.action){
   case 'kit':outside();beside(FIXED.kit);commit('kit');break;
   case 'farm':outside();beside(step.target);commit('farm',{index:step.index,tool:step.tool,crop:step.crop});if(step.tool==='water'&&!s.story.harvest)remember('watered garden');break;
   case 'talk':if(step.npc==='orin'){const npc=orin();commit('orin');if(borrow)commit('borrow');remember('met Orin');}else{outside();beside({x:22,y:16});commit('meet');commit('invite');remember('Mara invited');}break;
   case 'tools':{const npc=orin();if(s.gathering.job==='none'){commit('acceptToolsJob');if(takeBoards&&!taken){beside(FIXED.timber);commit('take');taken=true;remember('bundle picked up');}}
    else if(s.story.basket==='held'){if(s.carry.wood+s.carry.stone){outside();beside(FIXED.store);commit('deposit');orin();}commit('returnBasket');remember('basket returned');}
    else{const supplies={wood:s.inventory.wood,stone:s.inventory.stone};if(s.story.timber==='taken')remember('before mill delay');commit('finishTools',{npc});if(s.story.timber==='taken'){assert.equal(s.gathering.axe,false);assert.deepEqual({wood:s.inventory.wood,stone:s.inventory.stone},supplies);remember('mill delay');}else{assert.ok(s.gathering.axe);remember('earned tools');}}break;}
   case 'timber':outside();beside(FIXED.timber);commit('returnWood');remember('bundle returned');break;
   case 'resource':outside();beside(step.target);commit('gather',{id:step.node});break;
   case 'deposit':outside();beside(step.target);commit('deposit');break;
   case 'worksite':outside();beside(step.target);commit('strike',{id:step.node});if(s.gathering.cleared&&!s.story.harvest)remember('first chop');break;
   case 'sleep':{enter('home');beside({x:3,y:7});const pending=firstTradePending(s);if(pending)remember('ready for first trade');commit('sleep');outside();break;}
   case 'plan':outside();commit('plan',{...site,style:1});assert.ok(s.house);remember('Mara plan');break;
   case 'building':outside();beside(step.target);if(s.carry.wood+s.carry.stone)commit('deposit');if(s.house.stage<2)commit('build');else{commit('herbs');commit('finish',{trim:1});remember('Mara moved in');}break;
   case 'kitchen':enter('bakery');beside({x:4,y:5});if(!s.story.cooking)commit('cook');for(const id of ['mix','shape','bake'])commit(id);remember('first batch');if(keepFlour){beside({x:3,y:10});commit('takeFlour');}break;
   default:throw Error('Unexpected opening step '+step.action+' / '+step.key);
  }
 }
 throw Error('Opening guide did not reach first trade');
}
