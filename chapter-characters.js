import {SPRITE_RECTS,gaitPose} from './chapter-actors.js';
const images=new Map();
export function prepareCharacters(){for(const name of ['mara','orin']){if(images.has(name))continue;const image=new Image();image.src=new URL('./assets/characters/'+name+'-world.png',import.meta.url).href;images.set(name,image);}}
const palettes={mara:{skin:'#c58b62',farSkin:'#965b40',shirt:'#c1a461',farShirt:'#92713e',pants:'#5c4232',farPants:'#3e302a'},orin:{skin:'#a2694c',farSkin:'#78462f',shirt:'#bd795b',farShirt:'#895038',pants:'#574137',farPants:'#392d28'}};
function pixelLine(c,x0,y0,x1,y1,color,size=1){
 x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
 let dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,error=dx+dy;c.fillStyle=color;
 for(;;){c.fillRect(x0-Math.floor(size/2),y0-Math.floor(size/2),size,size);if(x0===x1&&y0===y1)break;const e=2*error;if(e>=dy){error+=dy;x0+=sx;}if(e<=dx){error+=dx;y0+=sy;}}
}
function limb(c,x0,y0,x1,y1,color){pixelLine(c,x0,y0,x1,y1,'#392b26',3);pixelLine(c,x0,y0,x1,y1,color,2);}
function leg(c,x,y,offset,forward,pants,side){
 const fx=x+(side?offset*4:0),fy=y+1+(side?0:Math.round(forward*1.5));
 limb(c,x,y-6,fx,fy-1,pants);c.fillStyle='#382b24';c.fillRect(Math.round(fx)-1,Math.round(fy),side?4:3,2);c.fillStyle='#79503a';c.fillRect(Math.round(fx),Math.round(fy),2,1);
}
function arm(c,x,y,travel,shirt,skin,side){
 const handX=x+(side?Math.round(travel*3):0),handY=y+6+(side?0:Math.round(travel*2));
 limb(c,x,y,handX,y+3,shirt);limb(c,handX,y+3,handX,handY,skin);
}
function walk(c,image,rect,actor,x,y,width,height){
 const p=gaitPose(actor.frame),col=palettes[actor.name],side=actor.direction==='left'||actor.direction==='right',sign=actor.direction==='left'?-1:1,back=actor.direction==='up'?-1:1;
 // Separate limbs swap the lead foot and opposing hand; the atlas torso never gets mirrored.
 if(side){
  leg(c,x-1,y,-p.leftLeg*sign,0,col.farPants,true);
  arm(c,x,y-13,p.rightArm*sign,col.farShirt,col.farSkin,true);
  leg(c,x+1,y,p.leftLeg*sign,0,col.pants,true);
 }else{
  leg(c,x-3,y,0,p.leftLeg*back,col.pants,false);leg(c,x+2,y,0,p.rightLeg*back,col.farPants,false);
  arm(c,x-5,y-13,p.leftArm*back,col.shirt,col.skin,false);arm(c,x+5,y-13,p.rightArm*back,col.farShirt,col.farSkin,false);
 }
 c.save();c.beginPath();c.rect(x-width/2,y-height+2,width,height-14);c.rect(x-4,y-12,8,8);c.clip();
 c.drawImage(image,...rect,Math.round(x-width/2),Math.round(y-height+2),width,height);c.restore();
 if(side)arm(c,x+1,y-13,p.leftArm*sign,col.shirt,col.skin,true);
}
export function drawCharacter(c,actor,x,y){
 const image=images.get(actor.name);if(!image?.complete||!image.naturalWidth)return false;
 const index=actor.walking?Math.floor(actor.frame/4)*4:actor.frame;
 const rect=SPRITE_RECTS[actor.name][index],height=28,width=Math.round(rect[2]/rect[3]*height);x=Math.round(x);y=Math.round(y);
 c.fillStyle='#304d3c40';c.fillRect(x-6,y,12,3);
 if(actor.walking)walk(c,image,rect,actor,x,y,width,height);else c.drawImage(image,...rect,x-Math.round(width/2),y-height+2,width,height);return true;
}
