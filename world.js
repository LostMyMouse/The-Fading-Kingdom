import { CROPS, SKINS, HAIRS, SHIRTS, validPlacement } from './model.js';
export const TILE=16, W=48, H=32;
export const landmarks=[
 {id:'home',x:9,y:11,label:'Cottage · sleep & wardrobe'},
 {id:'rowan',x:21,y:13,label:'Rowan · gardener'},
 {id:'packet',x:23,y:13,label:'Rowan’s seed crate'},
 {id:'orin',x:27,y:23,label:'Orin · carpenter'},
 {id:'pip',x:18,y:25,label:'Pip · apprentice'},
 {id:'garden',x:30,y:17,label:'Restore the village garden'},
 {id:'greenhouse',x:38,y:11,label:'The old greenhouse'}
];
const trees=[[2,3],[3,6],[1,11],[2,17],[2,24],[3,29],[8,29],[13,29],[16,4],[20,4],[25,5],[28,5],[31,3],[44,3],[45,8],[46,13],[45,26],[41,29],[35,29],[29,28],[23,29]];
export function blocked(x,y) {
 return x<1||y<2||x>46||y>30||(x>=5&&x<=12&&y>=5&&y<=10)||(x>=34&&x<=42&&y>=5&&y<=10)||(x>=43&&y>=17&&y<=24)||trees.some(t=>t[0]===x&&t[1]===y);
}
// Breadth-first paths keep touch movement from walking into buildings or water.
export function pathTo(from,to) {
 if(blocked(to.x,to.y))return [];
 const start=from.y*W+from.x,goal=to.y*W+to.x,queue=[start],prev=new Map([[start,null]]);
 for(let i=0;i<queue.length;i++) {const k=queue[i];if(k===goal)break;const x=k%W,y=Math.floor(k/W);
  for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]){const nx=x+dx,ny=y+dy,n=ny*W+nx;if(!blocked(nx,ny)&&!prev.has(n)){prev.set(n,k);queue.push(n);}}
 }
 if(!prev.has(goal))return [];
 const out=[];for(let n=goal;n!==start;n=prev.get(n))out.unshift({x:n%W,y:Math.floor(n/W)});return out;
}
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
const hash=(x,y)=>(Math.sin(x*127.1+y*311.7)*43758.5453)%1;
function shadow(c,x,y,w=14){rect(c,x-w/2,y-1,w,3,'#3e673b45');}
function tree(c,x,y,t=0){x*=16;y*=16;shadow(c,x+8,y+10,23);rect(c,x+5,y-7,7,19,'#6c5940');rect(c,x+8,y-5,3,17,'#a4804e');const cols=['#3c6c4d','#4f8250','#6c9857'];for(let i=0;i<3;i++){rect(c,x-10+i*3,y-30-i*3,34-i*5,19,cols[i]);rect(c,x-5+i*3,y-37-i*2,24-i*4,13,cols[i]);}rect(c,x-5,y-30,6,3,'#87a762');if(t%3===0){rect(c,x+14,y-26,3,3,'#dbaf58');rect(c,x+1,y-35,3,3,'#dbaf58');}}
function flower(c,x,y,col='#f7edbf'){rect(c,x,y,1,4,'#527d47');rect(c,x-2,y-2,5,2,col);rect(c,x-1,y-3,3,4,col);rect(c,x,y-2,1,1,'#dca653');}
function house(c,x,y,green=false){x*=16;y*=16;shadow(c,x+62,y+91,136);rect(c,x,y+18,128,74,'#76644b');rect(c,x+3,y+18,122,71,green?'#8aa998':'#ead7aa');rect(c,x+7,y+25,114,4,green?'#c7ddbd':'#f6e3b7');
 for(let i=0;i<6;i++){const pad=i*5;rect(c,x-10+pad,y-7-i*5,148-pad*2,7,green?'#4c7364':'#426d67');rect(c,x-9+pad,y-8-i*5,146-pad*2,2,green?'#78977b':'#6b9290');}
 rect(c,x+28,y-37,72,3,'#3b5b57');rect(c,x+99,y-27,12,28,'#99836b');rect(c,x+97,y-29,16,4,'#ccba90');
 for(const wx of [14,86]){rect(c,x+wx,y+41,26,25,'#79644a');rect(c,x+wx+3,y+44,20,19,green?'#bad4b9':'#719eab');rect(c,x+wx+12,y+44,2,19,'#ddca9e');rect(c,x+wx+3,y+52,20,2,'#ddca9e');rect(c,x+wx-2,y+66,30,5,'#8e7250');for(let j=0;j<4;j++)flower(c,x+wx+j*7,y+65,j%2?'#dca4aa':'#e8d394');}
 rect(c,x+51,y+47,26,44,'#70523b');rect(c,x+55,y+51,18,40,'#a7804f');rect(c,x+58,y+55,2,32,'#b89160');rect(c,x+69,y+73,2,2,'#edd991');rect(c,x+47,y+91,34,4,'#b8b396');rect(c,x+43,y+95,42,4,'#d8d0ab');if(green){rect(c,x+5,y+19,118,3,'#d3dab7');for(let j=0;j<3;j++){rect(c,x+10+j*38,y+25,31,10,'#b4cfb0');rect(c,x+23+j*38,y+25,2,10,'#708d72');}}}
export function person(c,x,y,look={},frame=0,dir='down') {
 x=Math.round(x)-6;y=Math.round(y)-21;const skin=SKINS[look.skin??0],hair=HAIRS[look.hair??0],shirt=SHIRTS[look.shirt??0];
 shadow(c,x+6,y+22,12);const step=frame%2;
 if(look.cape){rect(c,x-2,y+10,16,10,'#5f6d91');rect(c,x,y+13,2,6,'#c5c797');}
 rect(c,x+2,y+16,4,5+step,'#584f42');rect(c,x+7,y+16,4,6-step,'#584f42');rect(c,x+1,y+21+step,5,2,'#544539');rect(c,x+7,y+22-step,5,2,'#544539');
 rect(c,x,y+10,13,8,shirt);rect(c,x+3,y+10,2,7,'#e4d3a9');rect(c,x+9,y+10,2,7,'#e4d3a9');rect(c,x+3,y+14,8,4,'#7b7858');rect(c,x-1,y+11,2,6,skin);rect(c,x+12,y+11,2,6,skin);
 rect(c,x+1,y+1,11,10,hair);rect(c,x+2,y+4,10,7,skin);rect(c,x+2,y+1,9,4,hair);rect(c,x,y+4,3,4,hair);
 if(dir!=='up'){rect(c,x+5,y+6,1,2,'#3e3932');rect(c,x+9,y+6,1,2,'#3e3932');rect(c,x+7,y+9,2,1,'#b77760');}else rect(c,x+2,y+4,10,7,hair);
 if(look.style===1){rect(c,x+10,y+3,4,9,hair);rect(c,x+11,y+10,3,3,'#aa785b');}if(look.style===2)rect(c,x-1,y,15,4,hair);
 if(look.hat==='witch'){rect(c,x-5,y+1,23,3,'#625274');rect(c,x,y-4,13,5,'#78638d');rect(c,x+4,y-10,5,7,'#78638d');rect(c,x+5,y-11,6,2,'#78638d');rect(c,x+8,y-2,3,3,'#d1b86e');}
 if(look.hat==='cap'){rect(c,x,y-1,13,5,'#7a9c73');rect(c,x+9,y+2,7,2,'#466b53');}
}
export function icon(c,type,x=0,y=0,rot=0){
 const r=(a,b,w,h,col)=>rect(c,x+a,y+b,w,h,col);
 if(type==='water'){r(3,6,9,8,'#397b80');r(4,5,7,2,'#8db9ac');r(12,7,3,3,'#599b98');r(14,5,2,3,'#b0d4bf');r(0,5,4,2,'#397b80');r(0,5,2,6,'#397b80');r(4,8,2,5,'#6caaa1');}
 else if(type==='hands'){r(5,5,7,9,'#dca67e');r(3,8,3,4,'#dca67e');r(6,2,2,6,'#efd0a1');r(9,3,2,5,'#efd0a1');r(12,6,2,5,'#c18c67');}
 else if(type==='carrot'){r(7,7,4,5,'#de8b40');r(6,6,6,3,'#efad56');r(8,12,2,3,'#de8b40');r(7,3,2,4,'#628748');r(10,2,2,5,'#7b9b4f');}
 else if(type==='flower'||type==='moonflower'){flower(c,x+8,y+9,type==='moonflower'?'#bba0df':'#fff0bc');r(5,11,3,1,'#6b9050');r(9,12,3,1,'#6b9050');}
 else if(type==='bench'){if(rot){r(4,2,7,12,'#a0794e');r(3,3,3,12,'#ccab76');r(10,4,2,3,'#6b583e');r(10,12,2,3,'#6b583e');}else{r(1,5,14,3,'#a0794e');r(1,9,14,3,'#c7a16a');r(2,12,2,3,'#715b40');r(12,12,2,3,'#715b40');r(2,3,2,9,'#806443');r(12,3,2,9,'#806443');}}
 else if(type==='planter'){r(3,9,10,6,'#b57753');r(2,8,12,2,'#d49b6d');flower(c,x+5,y+7,'#e8bcbd');flower(c,x+10,y+7,'#fff2cc');}
 else if(type==='lantern'){r(7,2,2,13,'#6b6351');r(4,3,8,2,'#5c5a4b');r(5,5,6,6,'#e8bf65');r(7,6,2,4,'#fff0a0');r(4,11,8,2,'#5c5a4b');}
 else if(type==='path'){r(1,2,8,5,'#bdb599');r(10,1,5,7,'#d6c9a6');r(2,9,5,6,'#c8bb9a');r(8,10,7,5,'#e2d2ac');}
 else if(type==='fence'){if(rot){r(5,1,4,15,'#b69663');r(9,3,2,10,'#8f7651');}else{r(1,3,3,12,'#b69663');r(12,3,3,12,'#b69663');r(2,6,12,2,'#d0b27c');r(2,11,12,2,'#d0b27c');}}
 else if(type==='decorate'){r(2,5,11,10,'#a37951');r(1,3,13,3,'#c49d6a');r(5,0,5,4,'#7f9b58');r(9,1,3,3,'#c7a6bc');}
}
export function drawWorld(c,s,time,view) {
 const {width,height,camera,hover,decoration,rotation,walkFrame,direction,reduceMotion}=view;
 c.imageSmoothingEnabled=false;rect(c,0,0,width,height,'#8ba064');c.save();c.translate(-Math.round(camera.x),-Math.round(camera.y));
 const minX=Math.max(0,Math.floor(camera.x/16)-2),maxX=Math.min(W,Math.ceil((camera.x+width)/16)+2),minY=Math.max(0,Math.floor(camera.y/16)-3),maxY=Math.min(H,Math.ceil((camera.y+height)/16)+3);
 for(let y=minY;y<maxY;y++)for(let x=minX;x<maxX;x++){
  const h=Math.abs(hash(x,y));rect(c,x*16,y*16,16,16,h>.65?'#93ad6c':h>.3?'#8faa67':'#91aa69');
  if((y>=11&&y<=13&&x>=3&&x<=42)||(x>=17&&x<=19&&y>=12&&y<=27)||(y===20&&x>=18&&x<=41)){
   rect(c,x*16,y*16,16,16,'#d3c393');rect(c,x*16+2,y*16+2,9,5,'#ded0a4');rect(c,x*16+8,y*16+10,7,4,'#c2b689');
  }else if(h>.72){rect(c,x*16+3,y*16+6,2,3,'#7b9b5a');rect(c,x*16+5,y*16+8,2,2,'#a7bd7a');}
  if(x===0||y<2||y===31||x===47)rect(c,x*16,y*16,16,16,'#557c4c');
 }
 // Quiet pond and stepping bridge.
 for(let y=17;y<=24;y++)for(let x=43;x<47;x++){rect(c,x*16,y*16,16,16,'#619c9c');if((x+y)%2===0)rect(c,x*16+2+(reduceMotion?0:Math.floor(time/700)%3),y*16+5,8,1,'#9ac2b1');}
 rect(c,17*16,26*16,3*16,12,'#ab8a58');for(let j=0;j<6;j++)rect(c,17*16,26*16+j*2,48,1,'#cbae78');
 // Shared garden: same space changes as the player restores it.
 rect(c,28*16,15*16,13*16,10*16,s.events.restored?'#a4b47a':'#839568');
 for(let i=0;i<13;i++){rect(c,(28+i)*16,15*16,15,4,'#c4b995');rect(c,(28+i)*16,25*16-4,15,4,'#b2aa88');}
 rect(c,33*16,15*16,3*16,10*16,'#d6c8a0');rect(c,28*16,20*16,13*16,16,'#d6c8a0');
 if(s.events.restored){for(let x=29;x<41;x+=2){if(x>=33&&x<=35)continue;flower(c,x*16+5,16*16+8,'#e8bcc6');flower(c,x*16+9,23*16+8,'#fff2bd');}rect(c,33*16+2,18*16,43,22,'#9fa793');rect(c,33*16+7,18*16+3,33,14,'#7eabaa');rect(c,34*16+3,18*16-14,5,20,'#cbd0b3');rect(c,34*16-2,18*16-15,15,4,'#e0dfbd');}
 else{for(let i=0;i<18;i++){const x=29+(i*7%11),y=16+(i*3%8);if(x>=33&&x<=35||y===20)continue;rect(c,x*16+5,y*16+3,2,10,'#5e7d4f');rect(c,x*16+2,y*16+5,8,2,'#637b4f');}}
 house(c,5,5);house(c,34,5,true);
 if(!s.events.restored){rect(c,38*16-8,11*16-9,16,3,'#846948');rect(c,38*16-6,11*16-7,12,2,'#a68956');}
 // Farming plots with generous spacing.
 for(const p of s.plots){const x=p.x*16,y=p.y*16;rect(c,x-2,y-2,20,19,'#a78c59');rect(c,x,y,16,14,p.watered?'#74563d':'#916444');for(let j=0;j<3;j++)rect(c,x+2,y+2+j*4,12,1,p.watered?'#86674b':'#a67b53');
  if(p.crop){const grown=p.age>=CROPS[p.crop].days;
   if(!grown){rect(c,x+7,y+5,2,6,'#629044');rect(c,x+4,y+3,4,3,'#7fa956');rect(c,x+9,y+1,4,3,'#9cba6e');}
   else{icon(c,p.crop,x,y-6);if(p.crop==='moonflower'&&!reduceMotion&&Math.floor(time/600)%2)rect(c,x+14,y-6,2,2,'#fff0c4');}
  }
 }
 // Seed crate, signpost, wood stack, and home details.
 rect(c,23*16,13*16-4,15,12,'#9d7751');rect(c,23*16+2,13*16-7,11,6,'#e9d6a2');flower(c,23*16+7,13*16-6);
 rect(c,30*16+6,17*16,3,16,'#8c704c');rect(c,30*16-5,17*16-10,25,13,'#b99c67');rect(c,30*16-3,17*16-8,21,9,'#e6d5a8');flower(c,30*16+7,17*16-4,'#8b728f');
 for(let i=0;i<3;i++)rect(c,26*16+i*2,24*16-i*4,23,4,i%2?'#bb9b64':'#90704c');
 icon(c,'planter',5*16,11*16);icon(c,'planter',12*16,11*16);icon(c,'bench',26*16,10*16);
 // Sparse flowers keep the playable field clear.
 for(let i=0;i<27;i++){const x=(i*137+47)%720+10,y=(i*83+49)%452+24;if(!blocked(Math.floor(x/16),Math.floor(y/16))&&x<240&&y>340)flower(c,x,y,i%3?'#eee3b8':'#d3a2b4');}
 for(const d of s.decor)icon(c,d.type,d.x*16,d.y*16,d.rotation);
 if(decoration){for(let y=16;y<=26;y++)for(let x=4;x<=40;x++)if(validPlacement(s,x,y,decoration)){rect(c,x*16,y*16,16,1,'#e6ecbb55');rect(c,x*16,y*16,1,16,'#e6ecbb55');}}
 if(hover){const x=hover.x*16,y=hover.y*16;const valid=decoration?validPlacement(s,hover.x,hover.y,decoration):!blocked(hover.x,hover.y);c.strokeStyle=valid?'#fff3b8':'#d58f74';c.lineWidth=1;c.strokeRect(x+.5,y+.5,15,15);if(decoration){c.globalAlpha=.65;icon(c,decoration,x,y,rotation);c.globalAlpha=1;}}
 const people=[{x:21*16+8,y:13*16+12,look:{skin:1,hair:5,shirt:4,hat:'witch'},name:'Rowan'},{x:27*16+8,y:23*16+12,look:{skin:3,hair:0,shirt:1,hat:'cap'},name:'Orin'},{x:18*16+8,y:25*16+12,look:{skin:2,hair:2,shirt:2,style:1},name:'Pip'}, {x:view.playerX??s.player.x*16+8,y:view.playerY??s.player.y*16+12,look:s.player,name:''}];
 const drawables=[...people.map(p=>({y:p.y,draw:()=>{person(c,p.x,p.y,p.look,p.name?0:walkFrame,p.name?'down':direction);if(p.name){c.font='6px monospace';c.textAlign='center';c.fillStyle='#fff5d7';c.fillText(p.name,p.x,p.y-30);}}})),...trees.map((t,i)=>({y:t[1]*16+11,draw:()=>tree(c,t[0],t[1],i)}))];
 drawables.sort((a,b)=>a.y-b.y).forEach(d=>d.draw());c.restore();
}
