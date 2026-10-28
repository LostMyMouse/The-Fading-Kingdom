// One world-character contract: common height, foot baseline and textured limb regions.
export const CHARACTER_HEIGHT=32;
export const RIG={head:[0,0,1,.53],leftArm:[0,.51,.25,.80],rightArm:[.75,.51,1,.80],leftLeg:[.23,.84,.50,1],rightLeg:[.50,.84,.77,1]};
// Keep thighs/shorts fixed; only the lower leg moves under the clothing overlap.
// Extend moving regions underneath the fixed clothing. Butt-joined rectangles
// exposed the background at the hips and shoulders during rotation/translation.
const WALK_LEFT_LEG=[.23,.89,.50,1],WALK_RIGHT_LEG=[.50,.89,.77,1];
const WALK_LEFT_ARM=[0,.49,.25,.80],WALK_RIGHT_ARM=[.75,.49,1,.80];
export function gaitPose(frame=0){const cycle=((frame%4)+4)%4,value=Math.sin(cycle*Math.PI/2),phase=Math.abs(value)<1e-12?0:value;return {leftLeg:phase,rightLeg:-phase,leftArm:-phase,rightArm:phase};}
// The player, held objects and tools must use the exact same sleeve landmarks.
export const PLAYER_RIG_LAYOUT={left:{arm:[.51,.53,.73,.80],legs:[[.23,.89,.39,1],[.36,.89,.73,1]],torso:[.24,.53,.67,.88]},right:{arm:[.27,.53,.49,.80],legs:[[.61,.89,.77,1],[.27,.89,.64,1]],torso:[.33,.53,.76,.88]}};
const NPC_RIG_LAYOUT={left:{arm:[.66,.51,.96,.79]},right:{arm:[.04,.51,.34,.79]}};

function piece(c,image,rect,box,x,y,w,h,dx=0,dy=0,dark=false){
 const [sx,sy,sw,sh]=rect,[l,t,r,b]=box;c.save();if(dark)c.filter='brightness(.78)';
 c.drawImage(image,sx+l*sw,sy+t*sh,(r-l)*sw,(b-t)*sh,x+l*w+dx,y+t*h+dy,(r-l)*w,(b-t)*h);c.restore();
}
function hinged(c,image,rect,box,x,y,w,h,angle,dark=false){
 const [sx,sy,sw,sh]=rect,[l,t,r,b]=box;c.save();if(dark)c.filter='brightness(.78)';
 c.translate(x+(l+r)*w/2,y+t*h);c.rotate(angle);
 c.drawImage(image,sx+l*sw,sy+t*sh,(r-l)*sw,(b-t)*sh,-(r-l)*w/2,0,(r-l)*w,(b-t)*h);c.restore();
}
export function pixelAnchor(c,x,y){const t=c.getTransform();return [(Math.round(x*t.a+t.e)-t.e)/t.a,(Math.round(y*t.d+t.f)-t.f)/t.d];}
export function swingAngle(direction,progress=0){const t=Math.max(0,Math.min(1,progress)),keys=direction==='left'?[0,-.45,1.3,0]:direction==='right'?[0,.45,-1.3,0]:direction==='up'?[0,.8,.1,0]:[0,-1.5,-.1,0],times=[0,.28,.62,1];const i=t<.28?0:t<.62?1:2,u=(t-times[i])/(times[i+1]-times[i]),e=u*u*(3-2*u);return keys[i]+(keys[i+1]-keys[i])*e;}
export function armJoint({direction='down',walking=false,frame=0,reduce=false,layout=PLAYER_RIG_LAYOUT,action=null,hand='left',aspect=216/366}={}){
 const side=direction==='left'||direction==='right',sign=direction==='left'?-1:1,back=direction==='up'?-1:1,h=CHARACTER_HEIGHT,w=aspect*h,p=gaitPose(walking&&!reduce&&!action?frame:0);
 const box=side?(layout?.[direction]?.arm??NPC_RIG_LAYOUT[direction].arm):hand==='right'?WALK_RIGHT_ARM:action?RIG.leftArm:WALK_LEFT_ARM;
 const angle=action&&hand==='left'?swingAngle(direction,action.progress):side?p.leftArm*sign*-.18:p[hand+'Arm']*back*-.18;
 const shoulder={x:((box[0]+box[2])/2-.5)*w,y:-h+2+box[1]*h},length=(box[3]-box[1])*h;
 return {box,angle,shoulder,x:shoulder.x-Math.sin(angle)*length,y:shoulder.y+Math.cos(angle)*length,behind:direction==='up'};
}
export function toolHand(direction,progress=0){return armJoint({direction,action:{progress}});}
// A single joint calculation drives the textured sleeve and its attachment.
export function handAnchor(pose={}){return armJoint(pose);}
export function drawRig(c,image,rect,{direction='down',walking=false,frame=0,layout=null,action=null},x,y){
 const h=CHARACTER_HEIGHT,w=rect[2]/rect[3]*h;const anchor=pixelAnchor(c,x,y);x=anchor[0]-w/2;y=anchor[1]-h+2;
 c.fillStyle='#304d3c40';c.fillRect(x+w/2-6,y+h-2,12,3);
 if(!walking&&!action){c.drawImage(image,...rect,x,y,w,h);return;}
 const p=gaitPose(action?0:frame),side=direction==='left'||direction==='right',sign=direction==='left'?-1:1,back=direction==='up'?-1:1;
 const joint=armJoint({direction,walking,frame,layout:layout||NPC_RIG_LAYOUT,action,aspect:rect[2]/rect[3]}),sideArm=joint.box;
 const torso=layout?.[direction]?.torso??(direction==='left'?[.15,.53,.66,.88]:direction==='right'?[.34,.53,.85,.88]:[.25,.53,.75,.88]);
 if(side){
  // A profile boot crosses the atlas midpoint. Use its measured silhouette
  // rather than cutting that boot in half and rotating its halves apart.
  const legs=layout?.[direction]?.legs??[WALK_LEFT_LEG,WALK_RIGHT_LEG];
  piece(c,image,rect,legs[0],x,y,w,h,p.leftLeg*sign*1.15,-Math.abs(p.leftLeg)*.3);
  piece(c,image,rect,legs[1],x,y,w,h,p.rightLeg*sign*1.15,-Math.abs(p.rightLeg)*.3);
 }
 else{piece(c,image,rect,WALK_LEFT_LEG,x,y,w,h,0,p.leftLeg*back*.65);piece(c,image,rect,WALK_RIGHT_LEG,x,y,w,h,0,p.rightLeg*back*.65);}
 if(side){
  // Preserve the entire torso silhouette around the visible arm. A shoulder pivot
  // keeps the sleeve attached; duplicating/translating this arm made floating hands.
  const [l,t,r,b]=sideArm;
  piece(c,image,rect,[0,.53,l,.91],x,y,w,h);piece(c,image,rect,[r,.53,1,.91],x,y,w,h);
  if(t>.53)piece(c,image,rect,[l,.53,r,t],x,y,w,h);
  if(b<.91)piece(c,image,rect,[l,b,r,.91],x,y,w,h);
 }
 else{hinged(c,image,rect,joint.box,x,y,w,h,joint.angle);hinged(c,image,rect,WALK_RIGHT_ARM,x,y,w,h,p.rightArm*back*-.18);}
 if(!side)piece(c,image,rect,[torso[0],torso[1],torso[2],.90],x,y,w,h);
 if(side)hinged(c,image,rect,sideArm,x,y,w,h,joint.angle);
 // The neck/hair cap covers the shoulder overlap last in every direction.
 piece(c,image,rect,RIG.head,x,y,w,h);
}
