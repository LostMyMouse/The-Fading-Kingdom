import {SKINS,HAIRS,SHIRTS} from './model.js';
export const PLAYER_PARTS={
 head:[[28,39,163,187],[261,39,145,185],[481,38,146,186],[699,37,158,187]],
 short:[[16,251,188,180],[237,249,190,189],[460,249,190,189],[684,249,188,183]],
 tied:[[10,459,194,191],[230,459,197,196],[461,458,196,197],[684,458,176,208]],
 linen:[[11,692,209,170],[283,692,124,170],[480,692,127,170],[654,693,223,169]],
 vest:[[11,897,212,188],[290,897,127,188],[470,897,127,188],[660,897,217,183]],
 arms:[[[18,1125,65,188],[147,1125,64,188]],[[279,1125,58,193],[353,1125,59,188]],[[476,1125,59,188],[550,1125,59,193]],[[677,1123,63,188],[806,1123,63,188]]],
 legs:[[[18,1353,85,182],[125,1353,85,181]],[[260,1349,86,186],[350,1352,84,174]],[[453,1352,85,174],[541,1349,87,186]],[[678,1352,84,182],[785,1352,79,181]]],
 hat:[[18,1580,190,114],[240,1582,194,128],[453,1582,194,128],[682,1579,184,131]]
};
const views={down:0,right:1,left:2,up:3};
export function playerPose(frame=0,walking=false,reduce=false){
 const phase=walking&&!reduce?[0,1,0,-1][((frame%4)+4)%4]:0;
 return {leftLeg:phase,rightLeg:-phase,leftArm:-phase,rightArm:phase};
}
let atlas=null,ready=false,failed=false;const cache=new Map();
export function preparePlayer(){if(atlas)return;atlas=new Image();atlas.onload=()=>{ready=true;};atlas.onerror=()=>{failed=true;};atlas.src=new URL('./assets/player/parts.png',import.meta.url).href;}
export function playerArtStatus(){return failed?'unavailable':ready?'ready':'loading';}
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
function materialPixel(r,g,b,kind){
 const light=.299*r+.587*g+.114*b;if(light<40||Math.max(r,g,b)-Math.min(r,g,b)<12&&light>190)return null;
 if(kind==='skin'){if(light>220||r<g*1.08)return null;return 'skin';}
 if(kind==='hair'){return r>145&&r>g*1.3&&g>b*1.2?'skin':'hair';}
 if(kind==='linen'){return light>85?'shirt':null;}
 if(kind==='vest'){return light>48&&light<170?'shirt':null;}
 return null;
}
function part(name,index,look,limb=0){
 const rect=name==='arms'||name==='legs'?PLAYER_PARTS[name][index][limb]:PLAYER_PARTS[name][index];
 const kind=name==='head'||name==='arms'?'skin':name==='short'||name==='tied'?'hair':name;
 const key=name+':'+index+':'+limb+':'+look.skin+':'+look.hair+':'+look.shirt;
 if(cache.has(key)){const hit=cache.get(key);cache.delete(key);cache.set(key,hit);return hit;}
 const out=document.createElement('canvas');out.width=rect[2];out.height=rect[3];const c=out.getContext('2d',{willReadFrequently:true});c.drawImage(atlas,...rect,0,0,rect[2],rect[3]);
 if(['skin','hair','linen','vest'].includes(kind)){
  const pixels=c.getImageData(0,0,out.width,out.height),data=pixels.data;
  const colours={skin:rgb(SKINS[look.skin??1]),hair:rgb(HAIRS[look.hair??0]),shirt:rgb(SHIRTS[look.shirt??0])};
  for(let j=0;j<data.length;j+=4){
   if(data[j+3]<90){data[j+3]=0;continue;}const slot=materialPixel(data[j],data[j+1],data[j+2],kind);if(!slot)continue;
   const brightness=.299*data[j]+.587*data[j+1]+.114*data[j+2],target=colours[slot],reference=slot==='skin'?155:slot==='hair'?63:kind==='vest'?105:205;
   const factor=Math.max(.38,Math.min(1.65,brightness/reference));for(let k=0;k<3;k++)data[j+k]=Math.min(255,Math.round(target[k]*factor));
  }c.putImageData(pixels,0,0);
 }
 cache.set(key,out);if(cache.size>96)cache.delete(cache.keys().next().value);return out;
}
function image(c,img,x,y,w,h,rotation=0,pivot=.5){
 c.save();c.translate(x,y);if(rotation)c.rotate(rotation);c.drawImage(img,-w*pivot,0,w,h);c.restore();
}
export function drawPlayer(c,x,y,look={},frame=0,direction='down',walking=false,reduce=false){
 if(!ready)return false;const d=views[direction]??0,p=playerPose(frame,walking,reduce),side=d===1||d===2,sign=d===2?-1:1,back=d===3?-1:1;
 const outfit=look.outfit===1?'vest':'linen',style=look.style===1?'tied':'short';x=Math.round(x);y=Math.round(y);
 const head=part('head',d,look),hair=part(style,d,look),shirt=part(outfit,d,look);
 c.fillStyle='#304d3c40';c.fillRect(x-6,y+1,12,2);
 // The rear limbs draw first, then clothing hides their shoulder and hip joins.
 const legs=[p.leftLeg,p.rightLeg],arms=[p.leftArm,p.rightArm];
 const rear=side?0:1,front=1-rear;
 for(const i of [rear,front]){
  const travel=legs[i],xx=side?x+(i?1:-1):x+(i?2.5:-2.5);
  image(c,part('legs',d,look,i),xx,y-7,side?3.6:3.8,8+(side?0:travel*back),side?travel*sign*-.22:0);
 }
 const arm=(i)=>{const travel=arms[i],xx=side?x+(i?1.5:-1):x+(i?5:-5);image(c,part('arms',d,look,i),xx,y-17,2.7,8+(side?0:travel*back*.9),side?travel*sign*-.30:0);};
 if(side)arm(rear);else{arm(0);arm(1);}
 image(c,shirt,x,y-18,side?8:13,11);
 if(side)arm(front);
 // Head, hollow hair layer and optional cap are separately swappable.
 image(c,head,x,y-31,side?11.5:13.3,15);
 image(c,hair,x+(d===1?-.8:d===2?.8:0),y-32.4,side?15.8:17.2,style==='tied'?18:17);
 if(look.hat===1)image(c,part('hat',d,look),x,y-34,16,d===0?7.5:9);
 return true;
}
