import assert from 'node:assert/strict';
import {playJourney} from './journey.mjs';
import {act,readSave,walkingRoute,blocked,FIXED,RESOURCES} from '../chapter-model.js';
import {doorAt} from '../chapter-motion.js';
import {BRIDGE,RIVERSIDE,BRIDGE_COST,bridgeDeck} from '../chapter-bridge.js';
import {canOfferRecipe} from '../chapter-economy.js';
export function playBridgeJourney({shortage=false,repair=false,boards=false}={}){
 const prior=playJourney();let s=structuredClone(prior.checkpoints['first home and cooking']),actions=0,walked=0,crossings=0,reloads=0;const checkpoints={},stages=[];
 const commit=(id,data={})=>{const text=act(s,id,data);actions++;s=readSave(JSON.stringify(s));reloads++;assert.ok(s.economy.gold>=0);for(const n of Object.values(s.inventory))assert.ok(Number.isInteger(n)&&n>=0);return text;};
 const walk=target=>{if(s.player.x===target.x&&s.player.y===target.y&&doorAt(s,target)){const q=[[0,1],[1,0],[-1,0],[0,-1]].map(([dx,dy])=>({x:target.x+dx,y:target.y+dy})).find(p=>!blocked(s,p.x,p.y)&&!doorAt(s,p));assert.ok(q);walk(q);}const path=walkingRoute(s,s.player,target);assert.ok(path.length||s.player.x===target.x&&s.player.y===target.y,'Unreachable journey destination');for(const p of path){assert.equal(blocked(s,p.x,p.y),false);Object.assign(s.player,p);walked++;if(bridgeDeck(p.x,p.y))crossings++;const door=doorAt(s,p);if(door){commit(door);break;}}};
 const beside=p=>{const candidates=[[0,1],[1,0],[-1,0],[0,-1]].map(([dx,dy])=>({x:p.x+dx,y:p.y+dy})).filter(q=>!blocked(s,q.x,q.y)&&!doorAt(s,q)).map(q=>({q,path:walkingRoute(s,s.player,q)})).filter(o=>o.path.length||o.q.x===s.player.x&&o.q.y===s.player.y).sort((a,b)=>a.path.length-b.path.length);assert.ok(candidates.length,'No physical approach');walk(candidates[0].q);};
 const outside=()=>{if(s.room!=='outside')walk({x:8,y:12});assert.equal(s.room,'outside');};
 const enter=room=>{outside();walk(room==='home'?FIXED.home:{x:s.house.x+2,y:s.house.y+4});assert.equal(s.room,room);};
 const sleep=()=>{enter('home');beside({x:3,y:7});commit('sleep');outside();};
 const collect=(kind,wanted)=>{let attempts=0;while(s.inventory[kind]<wanted){assert.ok(attempts++<50);outside();const node=RESOURCES.find(n=>n.type===kind&&!s.gathered.includes(n.id));if(!node){sleep();continue;}beside(node);commit('gather',{id:node.id});beside(FIXED.store);commit('deposit');}};
 const stage=name=>{checkpoints[name]=structuredClone(s);stages.push({name,day:s.day,gold:s.economy.gold,wood:s.inventory.wood,stone:s.inventory.stone,actions,walked});};
 stage('first tray');
 if(shortage){enter('bakery');beside({x:3,y:10});commit('takeFlour');commit('simpleRolls');sleep();stage('smaller batch');if(repair){beside(FIXED.orin);commit('tradeFlour',{npc:FIXED.orin});enter('bakery');beside({x:3,y:10});commit('returnFlour');outside();stage('flour repaired');}}
 collect('wood',BRIDGE_COST.wood);collect('stone',BRIDGE_COST.stone);let nights=0;while(s.economy.gold<BRIDGE_COST.gold){assert.ok(nights++<20);sleep();}stage('bakery trading');
 if(boards){beside(FIXED.timber);commit('take');}
 beside(BRIDGE);commit('startBridge');assert.equal(s.bridge.started,true);stage('supplies reserved');
 const gold=s.economy.gold,wood=s.inventory.wood,stone=s.inventory.stone;commit('startBridge');assert.equal(s.economy.gold,gold);assert.equal(s.inventory.wood,wood);assert.equal(s.inventory.stone,stone);
 beside(FIXED.orin);if(boards){commit('finishBridge',{npc:FIXED.orin});assert.equal(s.bridge.built,false);beside(FIXED.timber);commit('returnWood');beside(FIXED.orin);}
 commit('finishBridge',{npc:FIXED.orin});assert.equal(s.bridge.built,true);stage('bridge ready');
 walk({x:50,y:25});beside(RIVERSIDE);stage('first island visit');const berries=s.inventory.berry;commit('riverBerries');assert.equal(s.inventory.berry,berries+2);commit('riverBerries');assert.equal(s.inventory.berry,berries+2);stage('berries picked');assert.ok(crossings>0);
 if(canOfferRecipe(s)){enter('bakery');beside({x:11,y:5});commit('learnRecipe');beside({x:4,y:5});for(const id of ['cook','mix','shape','bake'])commit(id,id==='cook'?{recipe:'fruit'}:{});assert.equal(s.inventory.fruitbun,3);stage('island fruit buns');}
 return {state:s,checkpoints,report:{kind:'Earned rules journey with physical paths, automatic doors and reloads after every action',base:'First home and cooking checkpoint from the existing fresh-story journey',shortage,repair,boards,actions,walked,crossings,reloads,stages}};
}

