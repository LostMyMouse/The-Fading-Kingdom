import {SPRITE_RECTS,gaitPose} from './chapter-actors.js';
const images=new Map();
export function prepareCharacters(){for(const name of ['mara','orin']){if(images.has(name))continue;const image=new Image();image.src=new URL('./assets/characters/'+name+'-world.png',import.meta.url).href;images.set(name,image);}}
export const CHARACTER_HEIGHT=32;
// Draw atlas regions directly into the display-resolution canvas. There is no tiny intermediate bitmap.
function piece(c,image,rect,box,x,y,w,h,dx=0,dy=0,dark=false){
 const [sx,sy,sw,sh]=rect,[l,t,r,b]=box;
 c.save();if(dark)c.filter='brightness(.78)';
 c.drawImage(image,sx+l*sw,sy+t*sh,(r-l)*sw,(b-t)*sh,x+l*w+dx,y+t*h+dy,(r-l)*w,(b-t)*h);
 c.restore();
}
function walk(c,image,rect,actor,x,y,w,h){
 const p=gaitPose(actor.frame),side=actor.direction==='left'||actor.direction==='right',sign=actor.direction==='left'?-1:1,back=actor.direction==='up'?-1:1;
 const sideArm=actor.direction==='left'?[.66,.51,.96,.79]:[.04,.51,.34,.79];
 const torso=actor.direction==='left'?[.15,.53,.66,.88]:actor.direction==='right'?[.34,.53,.85,.88]:[.25,.53,.75,.88];
 const leftLeg=side?p.leftLeg*sign*2.5:0,rightLeg=side?p.rightLeg*sign*2.5:0;
 const leftY=side?0:p.leftLeg*back,rightY=side?-1:p.rightLeg*back;
 // Texture-bearing limbs come from the character artwork; only their positions are animated.
 piece(c,image,rect,[.23,.84,.50,1],x,y,w,h,leftLeg,leftY,true);
 piece(c,image,rect,[.50,.84,.77,1],x,y,w,h,rightLeg,rightY);
 if(side)piece(c,image,rect,sideArm,x,y,w,h,p.rightArm*sign*2,0,true);
 else{
  piece(c,image,rect,[0,.51,.25,.80],x,y,w,h,0,p.leftArm*back*1.5);
  piece(c,image,rect,[.75,.51,1,.80],x,y,w,h,0,p.rightArm*back*1.5);
 }
 // Head and torso keep the source palette, proportions, apron and shading.
 piece(c,image,rect,[0,0,1,.53],x,y,w,h);
 piece(c,image,rect,torso,x,y,w,h);
 if(side)piece(c,image,rect,sideArm,x,y,w,h,p.leftArm*sign*2,0);
}
export function drawCharacter(c,actor,x,y){
 const image=images.get(actor.name);if(!image?.complete||!image.naturalWidth)return false;
 const index=actor.walking?Math.floor(actor.frame/4)*4:actor.frame,rect=SPRITE_RECTS[actor.name][index],h=CHARACTER_HEIGHT,w=rect[2]/rect[3]*h;
 x=Math.round(x);y=Math.round(y);c.fillStyle='#304d3c40';c.fillRect(x-6,y,12,3);
 if(actor.walking)walk(c,image,rect,actor,x-w/2,y-h+2,w,h);
 else c.drawImage(image,...rect,x-w/2,y-h+2,w,h);return true;
}
