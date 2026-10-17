// One world-character contract: common height, foot baseline and textured limb regions.
export const CHARACTER_HEIGHT=32;
export const RIG={head:[0,0,1,.53],leftArm:[0,.51,.25,.80],rightArm:[.75,.51,1,.80],leftLeg:[.23,.84,.50,1],rightLeg:[.50,.84,.77,1]};
export function gaitPose(frame=0){const phase=[0,1,0,-1][((frame%4)+4)%4];return {leftLeg:phase,rightLeg:-phase,leftArm:-phase,rightArm:phase};}
function piece(c,image,rect,box,x,y,w,h,dx=0,dy=0,dark=false){
 const [sx,sy,sw,sh]=rect,[l,t,r,b]=box;c.save();if(dark)c.filter='brightness(.78)';
 c.drawImage(image,sx+l*sw,sy+t*sh,(r-l)*sw,(b-t)*sh,x+l*w+dx,y+t*h+dy,(r-l)*w,(b-t)*h);c.restore();
}
function hinged(c,image,rect,box,x,y,w,h,angle,dark=false){
 const [sx,sy,sw,sh]=rect,[l,t,r,b]=box;c.save();if(dark)c.filter='brightness(.78)';
 c.translate(x+(l+r)*w/2,y+t*h);c.rotate(angle);
 c.drawImage(image,sx+l*sw,sy+t*sh,(r-l)*sw,(b-t)*sh,-(r-l)*w/2,0,(r-l)*w,(b-t)*h);c.restore();
}
export function drawRig(c,image,rect,{direction='down',walking=false,frame=0,layout=null},x,y){
 const h=CHARACTER_HEIGHT,w=rect[2]/rect[3]*h;x=Math.round(x)-w/2;y=Math.round(y)-h+2;
 c.fillStyle='#304d3c40';c.fillRect(Math.round(x+w/2)-6,y+h-2,12,3);
 if(!walking){c.drawImage(image,...rect,x,y,w,h);return;}
 const p=gaitPose(frame),side=direction==='left'||direction==='right',sign=direction==='left'?-1:1,back=direction==='up'?-1:1;
 const sideArm=layout?.[direction]?.arm??(direction==='left'?[.66,.51,.96,.79]:[.04,.51,.34,.79]);
 const torso=layout?.[direction]?.torso??(direction==='left'?[.15,.53,.66,.88]:direction==='right'?[.34,.53,.85,.88]:[.25,.53,.75,.88]);
 if(side){hinged(c,image,rect,RIG.leftLeg,x,y,w,h,p.leftLeg*sign*-.34,true);hinged(c,image,rect,RIG.rightLeg,x,y,w,h,p.rightLeg*sign*-.34);}
 else{piece(c,image,rect,RIG.leftLeg,x,y,w,h,0,p.leftLeg*back,true);piece(c,image,rect,RIG.rightLeg,x,y,w,h,0,p.rightLeg*back);}
 if(side){
  // Preserve the entire torso silhouette around the visible arm. A shoulder pivot
  // keeps the sleeve attached; duplicating/translating this arm made floating hands.
  const [l,t,r,b]=sideArm;
  piece(c,image,rect,[0,.53,l,.84],x,y,w,h);piece(c,image,rect,[r,.53,1,.84],x,y,w,h);
  if(t>.53)piece(c,image,rect,[l,.53,r,t],x,y,w,h);
  if(b<.84)piece(c,image,rect,[l,b,r,.84],x,y,w,h);
 }
 else{piece(c,image,rect,RIG.leftArm,x,y,w,h,0,p.leftArm*back*1.5);piece(c,image,rect,RIG.rightArm,x,y,w,h,0,p.rightArm*back*1.5);}
 piece(c,image,rect,RIG.head,x,y,w,h);if(!side)piece(c,image,rect,torso,x,y,w,h);
 if(side)hinged(c,image,rect,sideArm,x,y,w,h,p.leftArm*sign*-.18);
}
