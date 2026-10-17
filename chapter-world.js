import {person,icon} from './world.js';
import {W,H,TREES,RESOURCES,FIXED,mara,validHouse,validDecor} from './chapter-model.js';
export const T=16;
const r=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
const noise=(x,y)=>((x*374761393+y*668265263)^(x*31+y*57))>>>0;
function plant(c,x,y,col='#f4d99e'){r(c,x,y,1,5,'#52754c');r(c,x-2,y-2,5,3,col);r(c,x,y-1,1,1,'#bd8747');}
function label(c,x,y,name){c.font='6px monospace';c.textAlign='center';const w=c.measureText(name).width;r(c,x-w/2-3,y-7,w+6,10,'#304a3ce8');c.fillStyle='#fff1cf';c.fillText(name,x,y);}
function tree(c,x,y,i){x=x*16+8;y=y*16+12;r(c,x-15,y,30,4,'#47684155');r(c,x-3,y-24,6,27,'#6a513c');r(c,x,y-22,2,24,'#98724a');const cols=i%3===0?['#566c45','#71864d','#91a25c']:['#365d43','#4b7950','#699254'];for(let k=0;k<3;k++){r(c,x-20+k*3,y-35-k*9,40-k*6,20,cols[k]);r(c,x-15+k*3,y-43-k*7,30-k*6,13,cols[k]);}r(c,x-8,y-59,7,2,'#a3b76c');}
function building(c,h,time,home=false){
 const x=h.x*16,y=h.y*16,w=home?96:80,stage=h.stage;
 r(c,x-3,y+60,w+6,8,'#405c3b40');
 if(stage===0){for(let j=0;j<w;j+=8){r(c,x+j,y,w>j+4?4:2,1,'#fff0b9');r(c,x+j,y+63,4,1,'#fff0b9');}for(let j=0;j<64;j+=8){r(c,x,y+j,1,4,'#fff0b9');r(c,x+w-1,y+j,1,4,'#fff0b9');}r(c,x+4,y+5,3,10,'#a78960');r(c,x+w-8,y+5,3,10,'#a78960');return;}
 r(c,x,y+56,w,8,'#777e6b');for(let j=0;j<w;j+=13)r(c,x+j,y+58,11,4,'#a2a38c');
 if(stage===1){for(let j=0;j<w;j+=16){r(c,x+j,y+5,14,5,'#b8af8e');r(c,x+j,y+44,14,5,'#b8af8e');}return;}
 if(stage===2){for(let j=0;j<w;j+=24){r(c,x+j,y-13,4,70,'#9c724b');r(c,x+j+1,y-13,1,70,'#d0aa76');}r(c,x,y-13,w,4,'#a27e50');r(c,x,y+20,w,3,'#a27e50');c.strokeStyle='#b28c5a';c.lineWidth=3;c.beginPath();c.moveTo(x,y+50);c.lineTo(x+w,y-8);c.stroke();return;}
 const walls=['#e6cf9e','#c89964','#b6b6a1'][h.style],roof=['#5f8171','#a96b53','#697b92'][h.style];
 r(c,x,y+3,w,52,'#74563d');r(c,x+3,y+3,w-6,51,walls);for(let j=0;j<4;j++)r(c,x+3,y+9+j*12,w-6,1,h.style===1?'#a37851':'#c4b786');r(c,x+5,y+4,3,50,'#82684b');r(c,x+w-8,y+4,3,50,'#82684b');
 for(let j=0;j<7;j++){const pad=j*4;r(c,x-6+pad,y-j*5,w+12-pad*2,6,roof);r(c,x-6+pad,y-j*5,w+12-pad*2,1,'#ffffff30');for(let k=12;k<w-pad*2;k+=16)r(c,x-6+pad+k,y-j*5+2,1,3,'#273f3830');}
 r(c,x+18,y-35,w-36,3,'#405348');r(c,x+w-23,y-31,9,22,'#8c8169');r(c,x+w-25,y-33,13,3,'#c7baa1');
 for(const wx of [11,w-26]){r(c,x+wx-2,y+19,18,20,'#795a40');r(c,x+wx,y+21,14,16,'#83b4b1');r(c,x+wx+2,y+23,4,6,'#c7d9bf');r(c,x+wx+6,y+21,2,16,'#e6d2a5');r(c,x+wx,y+28,14,2,'#e6d2a5');r(c,x+wx-3,y+39,20,4,'#96704b');plant(c,x+wx+3,y+38,'#e7b5a1');plant(c,x+wx+11,y+38);}
 const door=home?48:32;r(c,x+door,y+24,16,32,'#624c37');r(c,x+door+2,y+26,12,30,['#b38b52','#789c82','#a27a90'][h.trim]);r(c,x+door+4,y+28,1,24,'#edd0a455');r(c,x+door+11,y+43,2,2,'#f9d98d');r(c,x+door-3,y+56,22,4,'#c1bda1');r(c,x+door-5,y+60,26,4,'#dfd1ae');
 if(!home){r(c,x+door-3,y+16,22,6,'#f4dfb2');plant(c,x+door+5,y+19,'#c58e53');}
 if(time!==null){const t=Math.floor(time/500)%8;r(c,x+w-21+t/2,y-40-t,3,3,'#e9e4ca55');}
}
function furniture(c,id,x,y){const a=x*16,b=y*16;if(id==='bed'){r(c,a,b,17,43,'#795b43');r(c,a+2,b+3,13,36,'#f5e4b8');r(c,a+2,b+15,13,23,'#85a491');r(c,a+4,b+6,9,6,'#fff2cf');r(c,a+4,b+19,9,1,'#b3c3a1');}if(id==='mirror'){r(c,a-2,b-15,20,27,'#99734f');r(c,a+1,b-12,14,20,'#88afad');r(c,a+3,b-10,4,13,'#c3d2bd');r(c,a+6,b+12,3,5,'#795b43');}if(id==='chest'){r(c,a,b,17,14,'#9b714a');r(c,a,b-3,17,6,'#c3975e');r(c,a+2,b+2,13,1,'#dfba7b');r(c,a+7,b+4,3,5,'#ecce85');}if(id==='oven'){r(c,a,b-16,29,31,'#adac94');r(c,a+2,b-12,25,6,'#ccbea0');r(c,a+5,b-3,19,17,'#655948');r(c,a+8,b,13,11,'#df9250');r(c,a+11,b+3,6,8,'#f6c56c');r(c,a+2,b+13,25,3,'#7e7f6a');}if(id==='counter'){r(c,a,b,96,15,'#9e7951');r(c,a-1,b-3,98,5,'#ead6aa');for(let j=0;j<6;j++){r(c,a+2+j*16,b+4,11,7,'#b99663');r(c,a+7+j*16,b+5,2,1,'#5f5440');}r(c,a+12,b-8,15,5,'#c29460');r(c,a+53,b-10,8,9,'#ddd7ae');r(c,a+54,b-11,6,2,'#f4e5bf');}if(id==='table'){r(c,a,b,48,30,'#816347');r(c,a+2,b-2,44,25,'#be9c69');r(c,a+4,b,40,1,'#dfc28e');for(let j=0;j<2;j++){r(c,a+8+j*24,b+7,10,8,'#eee3bd');r(c,a+10+j*24,b+9,6,4,'#b5c2a0');}}}
export function draw(c,s,v){
 const {width,height,camera,time,preview,guide,px,py,frame,direction,reduce}=v,out=s.room==='outside';
 c.imageSmoothingEnabled=false;r(c,0,0,width,height,out?'#8da16b':'#263e38');c.save();c.translate(-camera.x,-camera.y);
 if(out){
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const n=noise(x,y)%100;r(c,x*16,y*16,16,16,n>70?'#91a970':n>35?'#8ca56a':'#88a166');if(n>78){r(c,x*16+4,y*16+7,1,3,'#6f8f55');r(c,x*16+6,y*16+8,1,3,'#719357');r(c,x*16+5,y*16+11,3,1,'#b1bd7c');}if(y===17||x===11&&y>=12&&y<=17||x===45&&y>=10&&y<17){r(c,x*16,y*16,16,16,'#cabd91');r(c,x*16+3,y*16+4,7,2,'#daceaa');r(c,x*16+11,y*16+12,3,1,'#b4a77e');}}
  for(let y=20;y<29;y++)for(let x=46;x<53;x++){r(c,x*16,y*16,16,16,'#679b94');if((x+y)%3===0)r(c,x*16+(reduce?3:Math.floor(time/750)%4),y*16+7,10,1,'#a9c7ae');}for(let y=20;y<29;y++)r(c,46*16-3,y*16,3,16,'#b5b88d');
  for(let j=0;j<70;j++){const x=4+j*17%47,y=8+j*11%24;if((x<15||y>28)&&!s.plots.some(p=>p.x===x&&p.y===y))plant(c,x*16+5,y*16+10,j%3?'#e9d9a1':'#d7a6a0');}
  building(c,{x:8,y:8,stage:3,style:0,trim:0},reduce?null:time,true);
  // The collision footprint includes the roof; the threshold is on row 12.
  icon(c,'planter',8*16,12*16);icon(c,'planter',13*16,12*16);
  if(!s.story.kit){furniture(c,'chest',13,13);icon(c,'water',13*16,13*16-8);}furniture(c,'chest',8,13);
  // Carpenter's cart and distinctly owned timber, never free branches.
  r(c,17*16,16*16,42,13,'#9d764d');r(c,17*16-2,16*16-3,46,5,'#ccac76');r(c,17*16+3,16*16+10,7,7,'#65513b');r(c,19*16,16*16+10,7,7,'#65513b');
  for(let j=0;j<3;j++)r(c,20*16,17*16-6+j*4,17,3,j%2?'#d8b27c':'#a2794f');r(c,20*16+6,17*16-9,4,12,'#5c796a');
  if(s.house){building(c,s.house,reduce?null:time);const h=s.house;if(s.story.herbs)icon(c,'planter',(h.x+5)*16,(h.y+3)*16);r(c,(h.x+1)*16,(h.y+4)*16-7,12,9,'#cfb27c');r(c,(h.x+1)*16+5,(h.y+4)*16+1,2,9,'#8c6b48');}
  for(const p of s.plots){const x=p.x*16,y=p.y*16;r(c,x-1,y-1,18,16,'#aa8c5d');r(c,x,y,16,14,p.watered?'#745b44':'#99734e');for(let j=0;j<3;j++)r(c,x+2,y+3+j*4,12,1,p.watered?'#8a7050':'#b18a5d');if(p.ripe)icon(c,'carrot',x,y-4);else if(p.planted){r(c,x+7,y+4,2,6,'#56834b');r(c,x+4,y+3,4,3,'#83ab63');r(c,x+9,y+1,4,4,'#a2bc72');}}
  for(const n of RESOURCES)if(!s.gathered.includes(n.id)){const x=n.x*16,y=n.y*16;if(n.type==='wood'){r(c,x+2,y+7,12,4,'#826443');r(c,x+4,y+5,10,3,'#ae8b58');r(c,x+10,y+2,3,5,'#99754a');r(c,x+2,y+7,2,3,'#d3b47a');}else{r(c,x+2,y+7,12,6,'#939b86');r(c,x+4,y+4,8,8,'#b5baa2');r(c,x+5,y+4,5,2,'#d2cfaf');}}
  r(c,44*16,9*16,35,17,'#8b9573');r(c,44*16+3,9*16+2,28,12,'#b0b494');for(let j=0;j<4;j++)plant(c,44*16+5+j*8,9*16-2,'#b2bea1');label(c,45*16+8,9*16-12,'Old nursery');
 }else{
  r(c,8,29,272,182,'#172f2b');r(c,16,32,256,176,'#82684c');
  for(let y=3;y<13;y++)for(let x=1;x<17;x++){r(c,x*16,y*16,16,16,(x+y)%2?'#c6a77a':'#c0a173');r(c,x*16,y*16+15,16,1,'#a78963');r(c,x*16+((y%2)*7),y*16,1,15,'#ad9067');}
  r(c,16,23,256,27,'#b9c2a1');r(c,16,24,256,3,'#dce0b9');r(c,16,47,256,4,'#745f45');r(c,12,23,4,185,'#68593f');r(c,272,23,4,185,'#68593f');
  for(const x of [7,12]){r(c,x*16,28,26,17,'#816c4c');r(c,x*16+2,30,22,13,'#94bbba');r(c,x*16+4,31,5,10,'#e6e6bb');r(c,x*16+12,30,2,13,'#e0d0a3');r(c,x*16-3,25,7,24,'#c19a78');r(c,x*16+23,25,6,24,'#c19a78');}
  r(c,7*16,9*16,48,32,'#8f9e7a');r(c,7*16+3,9*16+3,42,26,'#bac19b');r(c,7*16+7,9*16+7,34,18,'#a2af86');r(c,8*16-2,12*16,20,16,'#5d6b51');r(c,8*16,12*16,16,16,'#cabc8d');
  if(s.room==='home'){furniture(c,'bed',3,4);furniture(c,'chest',5,4);furniture(c,'mirror',13,4);icon(c,'planter',15*16,6*16);r(c,2*16,10*16,27,13,'#b39566');r(c,2*16,10*16-3,27,4,'#d7bc86');label(c,8*16+8,14*16,'Outside');}
  else{furniture(c,'counter',3,4);furniture(c,'oven',12,4);furniture(c,'table',7,7);icon(c,'planter',15*16,8*16);furniture(c,'chest',3,9);if(s.story.cooking){r(c,4*16,4*16-5,12,5,'#e1c694');if(s.story.cooking>=2)for(let j=0;j<3;j++)r(c,4*16+j*4,4*16-7,3,3,'#efdab0');}label(c,8*16+8,14*16,'Village');}
 }
 for(const d of s.decor)if(d.room===s.room)icon(c,d.type,d.x*16,d.y*16,d.rotation);
 if(out&&v.waterArea?.length){for(const p of v.waterArea){r(c,p.x*16,p.y*16,16,14,'#95c7d235');c.strokeStyle='#e2f1d1';c.lineWidth=1;c.strokeRect(p.x*16+.5,p.y*16+.5,15,13);r(c,p.x*16+7,p.y*16+3,2,5,'#b6e0de');r(c,p.x*16+6,p.y*16+6,4,2,'#b6e0de');}}
 if(preview){const valid=preview.valid;c.globalAlpha=.55;if(preview.kind==='house')building(c,{...preview,stage:3,trim:0},null);else icon(c,preview.type,preview.x*16,preview.y*16,preview.rotation);c.globalAlpha=1;c.strokeStyle=valid?'#fff1ba':'#a44035';c.lineWidth=1;c.strokeRect(preview.x*16+.5,preview.y*16+.5,preview.kind==='house'?79:15,preview.kind==='house'?63:15);}
 if(guide){const g=guide;c.strokeStyle='#fff1ac';c.lineWidth=1;const bounce=reduce?0:Math.floor(Math.sin(time/250)*2);c.beginPath();c.moveTo(g.x*16+4,g.y*16-9+bounce);c.lineTo(g.x*16+8,g.y*16-5+bounce);c.lineTo(g.x*16+12,g.y*16-9+bounce);c.stroke();}
 const people=[{x:px,y:py,look:s.player,name:'',frame,dir:direction}];
 if(out)people.push({x:18*16+8,y:17*16+12,look:{skin:3,hair:0,shirt:1,hat:'cap'},name:'Orin'});
 const m=mara(s);if(m)people.push({x:m.x*16+8,y:m.y*16+12,look:{skin:2,hair:2,shirt:3,style:1},name:'Mara'});
 const layers=people.map(p=>({y:p.y,draw:()=>{person(c,p.x,p.y,p.look,p.frame||0,p.dir||'down');if(p.name)label(c,p.x,p.y-27,p.name);if(!p.name&&(s.carry.wood+s.carry.stone||s.story.basket==='held')){r(c,p.x-8,p.y-2,7,6,'#bd9b65');r(c,p.x-8,p.y-3,7,1,'#ead09a');if(s.story.basket==='held'){r(c,p.x-8,p.y-6,1,4,'#ead09a');r(c,p.x-2,p.y-6,1,4,'#ead09a');r(c,p.x-7,p.y-7,5,1,'#ead09a');}}}}));
 if(out)for(let j=0;j<TREES.length;j++){const t=TREES[j];layers.push({y:t.y*16+12,draw:()=>tree(c,t.x,t.y,j)});}layers.sort((a,b)=>a.y-b.y).forEach(p=>p.draw());
 c.restore();
}
