import {blinkImage} from './character-blink.js';
import {SKINS,HAIRS,SHIRTS} from './model.js';
import {drawRig,gaitPose,pixelAnchor} from './character-rig.js';
// Whole, coherent figures share proportions. Swaps are made at measured landmarks, not by stretching isolated anatomy.
export const PLAYER_RECTS=[
 [[35,175,217,364],[287,175,218,367],[519,175,219,367],[773,175,213,364]],
 [[38,584,209,361],[288,584,217,363],[519,584,218,363],[777,584,209,361]],
 [[35,988,217,366],[287,988,218,369],[519,988,218,369],[773,988,213,366]]
];
export const HAIRSTYLES=[[0,'Tousled'],[1,'Tied back'],[3,'Rounded bob'],[4,'Twin puffs']];
export const HAIR_RECTS=[[[34,131,273,433],[349,134,254,433],[652,134,253,432],[946,131,274,433]],[[37,649,281,458],[349,647,262,464],[642,647,260,464],[931,647,285,460]]];
const views={down:0,left:1,right:2,up:3};
// The same joints/timeline as the NPCs, fitted to this character's hair and sleeve silhouette.
const layout={left:{arm:[.51,.53,.73,.80],torso:[.24,.53,.67,.88]},right:{arm:[.27,.53,.49,.80],torso:[.33,.53,.76,.88]}};
export function playerPose(frame=0,walking=false,reduce=false){return gaitPose(walking&&!reduce?frame:0);}
let atlas=null,hairAtlas=null,cap=null,ready=false,failed=false,loading=null;const cache=new Map();
export function preparePlayer(){if(loading)return loading;loading=Promise.all([['atlas','./assets/player/coherent-template.png'],['cap','./assets/player/parts.png'],['hair','./assets/player/hairstyles.png']].map(([name,url])=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(true);img.onerror=()=>resolve(false);if(name==='atlas')atlas=img;else if(name==='hair')hairAtlas=img;else cap=img;img.src=new URL(url,import.meta.url).href;}))).then(results=>{ready=results.every(Boolean);failed=!ready;cache.clear();if(failed)loading=null;return ready;});return loading;}
export function playerArtStatus(){return failed?'unavailable':ready?'ready':'loading';}
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v*(1-t)+b[i]*t));
// Five shared, warm material ramps. Eyes, outlines, boots and cream sleeves retain their authored colours.
export function materialRamp(hex){const base=rgb(hex);return [mix(base,[43,28,26],.58),mix(base,[59,35,26],.30),base,mix(base,[255,217,158],.24),mix(base,[255,234,185],.42)];}
export function sourceMaterial(r,g,b,y){
 const light=(r+g+b)/3;if(light<37)return null;
 if(y<.22&&r>g*1.12&&g>b*1.04)return 'hair';
 if(y>=.22&&r>g*1.25&&g>b*1.45&&r>85)return 'skin';
 if(y<.64&&r>g*1.28&&g>b*1.05&&g<b*1.9&&light<160)return 'hair';
 if(y>.48&&y<.80&&g>r*.83&&g>b*1.45&&light>50)return 'shirt';
 return null;
}
export function tiedHairOverlap(style,d,x,y){if(style!==1||y<.50||y>.64)return false;const range=[[0,.35],[.64,1],[0,.36],[.30,.70]][d];return !!range&&x>=range[0]&&x<=range[1];}
function body(d,look){
 const key=[d,look.style??0,look.outfit??0,look.skin??1,look.hair??0,look.shirt??0].join(':');
 if(cache.has(key))return cache.get(key);
 const out=document.createElement('canvas');out.width=216;out.height=366;const c=out.getContext('2d',{willReadFrequently:true});c.imageSmoothingEnabled=false;
 if((look.style===3||look.style===4)&&hairAtlas?.complete&&hairAtlas.naturalWidth)c.drawImage(hairAtlas,...HAIR_RECTS[look.style-3][d],0,0,216,366);else c.drawImage(atlas,...PLAYER_RECTS[look.style===1?1:0][d],0,0,216,366);
 const original=c.getImageData(0,0,216,366);
 if(look.outfit===1){const r=PLAYER_RECTS[2][d];c.clearRect(0,183,216,117);c.drawImage(atlas,r[0],r[1]+r[3]*.5,r[2],r[3]*.32,0,183,216,117);
  // Preserve tied hair in front of a new shirt, including the low ponytail in profile/back views.
  const composite=c.getImageData(0,0,216,366);for(let y=183;y<235;y++)for(let x=0;x<216;x++){if(!tiedHairOverlap(look.style,d,x/216,y/366))continue;const i=(y*216+x)*4;const [r,g,b,a]=original.data.slice(i,i+4);if(a>100&&r>g*1.12&&g>b*1.04&&g<b*1.9&&(r+g+b)/3<160){for(let k=0;k<4;k++)composite.data[i+k]=original.data[i+k];}}c.putImageData(composite,0,0);
 }
 const pixels=c.getImageData(0,0,216,366),data=pixels.data;
 const ramps={skin:materialRamp(SKINS[look.skin??1]),hair:materialRamp(HAIRS[look.hair??0]),shirt:materialRamp(SHIRTS[look.shirt??0])};
 for(let i=0;i<data.length;i+=4){if(data[i+3]<100){data[i+3]=0;continue;}const y=Math.floor(i/4/216)/366,kind=sourceMaterial(data[i],data[i+1],data[i+2],y);if(!kind)continue;
  const light=.299*data[i]+.587*data[i+1]+.114*data[i+2];const thresholds=kind==='hair'?[46,61,79,104]:kind==='skin'?[77,116,153,186]:[76,105,136,163];const stops=[20,...thresholds,255];let index=0;while(index<4&&light>stops[index+1])index++;const t=Math.max(0,Math.min(1,(light-stops[index])/(stops[index+1]-stops[index])));
  const colour=mix(ramps[kind][index],ramps[kind][Math.min(4,index+1)],t);for(let k=0;k<3;k++)data[i+k]=colour[k];
 }c.putImageData(pixels,0,0);cache.set(key,out);if(cache.size>96)cache.delete(cache.keys().next().value);return out;
}
const CAP_RECTS=[[18,1580,190,114],[453,1582,194,128],[240,1582,194,128],[682,1579,184,131]];
export function drawPlayer(c,x,y,look={},frame=0,direction='down',walking=false,reduce=false,blink=false){
 if(!ready)return false;const d=views[direction]??0,source=body(d,look),img=blink&&!reduce&&direction!=='up'?blinkImage(source,[0,0,216,366]):source;drawRig(c,img,[0,0,216,366],{direction,frame,layout,walking:walking&&!reduce},x,y);
 if(look.hat===1&&cap?.complete&&cap.naturalWidth){const [hx,hy]=pixelAnchor(c,x,y);c.drawImage(cap,...CAP_RECTS[d],hx-9.5,hy-31,19,10);}
 return true;
}
