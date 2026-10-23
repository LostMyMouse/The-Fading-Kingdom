import {HOME_DOOR,HOME_APPROACH} from './world.js';
export const ROOM_WIDTH=14,ROOM_HEIGHT=12,EXIT={x:6,y:11},EXIT_RIGHT={x:7,y:11},ENTRY={x:6,y:10};
export const PREVIEW_KEY='the-fading-kingdom:art-cottage:v1';
export const FURNITURE={
 bed:{label:'Bed',w:2,h:3},bookcase:{label:'Bookcase',w:2,h:1},hearth:{label:'Hearth',w:2,h:2},cupboard:{label:'Cupboard',w:2,h:2},
 table:{label:'Table',w:2,h:2},chair:{label:'Chair',w:1,h:1},rug:{label:'Rug',w:3,h:2,flat:true}
};
export const FIXED_FURNITURE=[{id:'bed',x:2,y:4},{id:'bookcase',x:5,y:3},{id:'hearth',x:10,y:3},{id:'cupboard',x:10,y:6}];
export const startingFurniture=()=>[{id:'table',x:6,y:6},{id:'chair',x:6,y:8},{id:'rug',x:5,y:8}];
const same=(a,b)=>a.x===b.x&&a.y===b.y;
export const allFurniture=layout=>[...FIXED_FURNITURE,...layout];
export function contains(item,p){const d=FURNITURE[item.id];return p.x>=item.x&&p.x<item.x+d.w&&p.y>=item.y&&p.y<item.y+d.h;}
function inFloor(p){return Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=1&&p.x<=12&&p.y>=3&&p.y<=10;}
export function roomBlocked(layout,p){return !(inFloor(p)||same(p,EXIT)||same(p,EXIT_RIGHT))||allFurniture(layout).some(item=>!FURNITURE[item.id].flat&&contains(item,p));}
export function roomRoute(layout,from,to){if(roomBlocked(layout,from)||roomBlocked(layout,to))return null;const key=p=>p.x+','+p.y,queue=[from],seen=new Map([[key(from),null]]);for(let i=0;i<queue.length;i++){const p=queue[i];if(same(p,to)){const out=[];let q=p;while(seen.get(key(q))){out.unshift(q);q=seen.get(key(q));}return out;}for(const [dx,dy]of [[0,1],[1,0],[0,-1],[-1,0]]){const q={x:p.x+dx,y:p.y+dy},k=key(q);if(!roomBlocked(layout,q)&&!seen.has(k)){seen.set(k,p);queue.push(q);}}}return null;}
export function placement(layout,id,x,y,player=ENTRY){
 const original=layout.find(p=>p.id===id);if(!original)return {ok:false,reason:'Choose the table, chair or rug.'};
 const candidate={id,x,y},d=FURNITURE[id];if(!Number.isInteger(x)||!Number.isInteger(y)||x<1||y<3||x+d.w>13||y+d.h>11)return {ok:false,reason:'Keep it inside the room.'};
 if(contains(candidate,ENTRY)||contains(candidate,{x:7,y:10}))return {ok:false,reason:'Leave the doorway clear.'};
 if(!d.flat&&contains(candidate,player))return {ok:false,reason:'Leave a little room for your feet.'};
 const next=layout.map(p=>p.id===id?candidate:{...p});
 if(!d.flat){for(const other of allFurniture(layout)){if(other.id===id||FURNITURE[other.id].flat)continue;const od=FURNITURE[other.id];if(x<other.x+od.w&&x+d.w>other.x&&y<other.y+od.h&&y+d.h>other.y)return {ok:false,reason:'Something is already there.'};}}
 // A rug is floor decoration: it may sit underneath furniture, never a barrier.
 const reachable=new Set(),queue=[ENTRY];if(roomBlocked(next,ENTRY))return {ok:false,reason:'Leave the doorway clear.'};
 for(let i=0;i<queue.length;i++){const p=queue[i],key=p.x+','+p.y;if(reachable.has(key))continue;reachable.add(key);for(const [dx,dy]of [[0,1],[1,0],[0,-1],[-1,0]]){const q={x:p.x+dx,y:p.y+dy};if(!roomBlocked(next,q)&&!reachable.has(q.x+','+q.y))queue.push(q);}}
 for(let cy=3;cy<=10;cy++)for(let cx=1;cx<=12;cx++)if(!roomBlocked(next,{x:cx,y:cy})&&!reachable.has(cx+','+cy))return {ok:false,reason:'Leave a way around the furniture.'};
 return {ok:true,reason:'Clear spot · ready to place',layout:next};
}
export function portalAt(room,tile){return room==='outside'&&same(tile,HOME_DOOR)?{room:'cottage',tile:{...ENTRY},direction:'up'}:room==='cottage'&&(same(tile,EXIT)||same(tile,EXIT_RIGHT))?{room:'outside',tile:{...HOME_APPROACH},direction:'down'}:null;}
export function readFurniture(raw){try{const value=JSON.parse(raw);if(value?.version!==1||!Array.isArray(value.furniture)||value.furniture.length!==3)return startingFurniture();const ids=value.furniture.map(p=>p?.id);if(new Set(ids).size!==3||!['table','chair','rug'].every(id=>ids.includes(id)))return startingFurniture();const layout=value.furniture.map(({id,x,y})=>({id,x,y}));if(layout.every(p=>placement(layout,p.id,p.x,p.y).ok))return layout;}catch{}return startingFurniture();}
export const writeFurniture=layout=>JSON.stringify({version:1,furniture:layout.map(({id,x,y})=>({id,x,y}))});
