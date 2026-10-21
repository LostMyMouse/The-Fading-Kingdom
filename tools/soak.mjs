import assert from 'node:assert/strict';
import {act,readSave} from '../chapter-model.js';
import {squareActive,squareReady,SQUARE} from '../chapter-square.js';
import {createActors} from '../chapter-actors.js';

// Seeded rules stress test. Unlike journey.mjs, this focuses on repeated actions,
// save round-trips and economy invariants rather than reproducing every walk.
export function soak(initial,seed,days=20){let s=structuredClone(initial),random=seed>>>0,actions=0;const goldAtStart=s.economy.gold,totals=Object.fromEntries(['bench','planter','lantern','path','fence'].map(k=>[k,s.inventory[k]+s.decor.filter(d=>d.type===k).length]));
 const commit=(id,data)=>{act(s,id,data);actions++;s=readSave(JSON.stringify(s));};
 const outside=()=>{if(s.room!=='outside')commit('exit');};
 for(let day=0;day<days;day++){
  random=(Math.imul(random,1664525)+1013904223)>>>0;outside();
  if(s.economy.flour.state==='held'){commit('enterBakery');Object.assign(s.player,{x:3,y:10});commit('returnFlour');outside();}
  if(s.gardener.parcel==='held'){commit('enterGarden');Object.assign(s.player,{x:4,y:5});commit('returnParcel');outside();}
  for(let index=0;index<3;index++)if(s.plots[index].ripe)commit('farm',{index});
  if(s.inventory.seed<3){commit('enterHome');commit('seeds');outside();}
  for(let index=0;index<3;index++){commit('farm',{index,tool:'seed'});commit('farm',{index,tool:'water'});}
  Object.assign(s.player,{x:SQUARE.x,y:SQUARE.y});assert.ok(squareReady(s));if(!squareActive(s)){const carrot=s.inventory.carrot;commit('openSquare');assert.ok(squareActive(s),'Farming must sustain the next gathering');assert.equal(s.inventory.carrot,carrot-2);}
  const count=s.square.markets,carrots=s.inventory.carrot;commit('openSquare');assert.equal(s.square.markets,count);assert.equal(s.inventory.carrot,carrots);
  if(random%3===0&&s.economy.flour.state==='shelf'){commit('enterBakery');Object.assign(s.player,{x:3,y:10});commit('takeFlour');outside();}
  if(random%5===0&&s.gardener.parcel==='shelf'){commit('enterGarden');Object.assign(s.player,{x:4,y:5});commit('takeParcel');outside();}
  if(random%2===0){const index=s.decor.findIndex(d=>d.type==='bench');commit('store',{index});commit('place',{type:'bench',x:random%4+6,y:23});assert.ok(squareReady(s)||s.economy.flour.state==='held'||s.gardener.parcel==='held');}
  // Browser menus may repeat these safely; none are a source of extra gold.
  const before=s.economy.gold;for(let j=0;j<3;j++){commit('chat',{who:'mara'});commit('chat',{who:'orin'});commit('rowanChat');}assert.equal(s.economy.gold,before);
  const flour=s.economy.flour.state==='held',parcel=s.gardener.parcel==='held',expected=(flour?8:14)+(parcel?2:6)+(3-Number(flour)-Number(parcel))*2;
  const actors=createActors();for(let j=0;j<100;j++)actors.update(s,50);assert.equal(s.economy.gold,before);
  commit('enterHome');commit('sleep');assert.equal(s.economy.gold,before+expected);assert.equal(s.economy.lastIncome,expected);assert.equal(squareActive(s),false);
  for(const [key,total]of Object.entries(totals))assert.equal(s.inventory[key]+s.decor.filter(d=>d.type===key).length,total,'Furniture conservation: '+key);
 }
 return {seed,days,actions,firstDay:initial.day,lastDay:s.day,goldEarned:s.economy.gold-goldAtStart,markets:s.square.markets};
}
