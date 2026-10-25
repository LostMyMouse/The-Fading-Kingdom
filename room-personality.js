// Personal surface/wall details only: no new floor obstacles, inventory or saves.
export const ROOM_DETAILS={
 mara:{shelf:[59,120,492,423],clock:[634,97,277,414],herbs:[1009,145,463,373],book:[55,611,458,310],tea:[551,625,492,305],cloth:[1076,657,425,278]},
 rowan:{shelf:[48,127,489,408],tools:[568,174,435,331],frames:[1069,178,419,270],seedlings:[48,625,463,290],pot:[564,558,383,376],rug:[1001,597,503,342]}
};
const images=new Map();let loading=null;
const load=name=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=new URL('./assets/environment/'+name+'-room-details-v1.png',import.meta.url).href;});
export function prepareRoomDetails(){if(loading)return loading;loading=Promise.all(['mara','rowan'].map(load)).then(list=>{if(list.some(i=>!i)){loading=null;return false;}['mara','rowan'].forEach((name,i)=>images.set(name,list[i]));return true;});return loading;}
export const residentFor=room=>room==='bakery'?'mara':room==='garden'?'rowan':null;
export function detailPlan(room){
 if(room==='bakery')return [
  {id:'shelf',surface:'wall',x:153,y:47,width:22}, {id:'clock',surface:'wall',x:75,y:44,width:11}, {id:'herbs',surface:'wall',x:236,y:45,width:19},
  {id:'cloth',surface:'counter-left',x:76,y:60,width:16}, {id:'book',surface:'table',x:150,y:124,width:12}, {id:'tea',surface:'table',x:121,y:127,width:14}
 ];
 if(room==='garden')return [
  {id:'shelf',surface:'wall',x:153,y:47,width:23}, {id:'tools',surface:'wall',x:72,y:45,width:24}, {id:'frames',surface:'wall',x:236,y:44,width:22},
  {id:'pot',surface:'counter-middle',x:122,y:60,width:12}, {id:'seedlings',surface:'cupboard',x:200,y:48,width:26},
  {id:'rug',surface:'floor',x:136,y:188,width:88}
 ];
 return [];
}
export function detailBounds(room,p){const r=ROOM_DETAILS[residentFor(room)][p.id],height=Math.round(p.width*r[3]/r[2]);return {left:Math.round(p.x-p.width/2),top:Math.round(p.y-height),width:p.width,height};}
export function drawRoomDetails(c,s,surface,{breakfast=false}={}){
 const name=residentFor(s.room),im=images.get(name);if(!im)return false;
 for(const p of detailPlan(s.room)){if(p.surface!==surface||p.id==='cloth'&&s.story.cooking||p.id==='tea'&&breakfast)continue;const b=detailBounds(s.room,p);c.drawImage(im,...ROOM_DETAILS[name][p.id],b.left,b.top,b.width,b.height);}
 return true;
}

export const roomDetailsReady=()=>images.size===2;
