// Isolated four-frame left walk. No production renderer imports this module.
export const HEIGHT=32,SOURCE_HEIGHT=545,CELL=627;
export const FRAMES=[
 {name:'Passing A',rect:[0,0,627,627],anchor:[340,604],hand:[370,431],nearBoot:327,farBoot:385},
 {name:'Near leg forward',rect:[627,0,627,627],anchor:[312,602],hand:[379,416],nearBoot:233,farBoot:391},
 {name:'Passing B',rect:[0,627,627,627],anchor:[337.5,578],hand:[266,391],nearBoot:331,farBoot:378},
 {name:'Far leg forward',rect:[627,627,627,627],anchor:[319,576],hand:[220,367],nearBoot:400,farBoot:210}
];
export function frameIndex(phase=0,reduce=false){return reduce?0:((Math.floor(phase)%4)+4)%4;}
export function drawFrame(c,image,x,y,phase=0,{reduce=false,headImage=null}={}){const f=FRAMES[frameIndex(phase,reduce)],scale=HEIGHT/SOURCE_HEIGHT; if(headImage){c.save();c.beginPath();c.rect(x-40,y-HEIGHT*(1-.53),80,HEIGHT*2);c.clip();}c.drawImage(image,...f.rect,x-f.anchor[0]*scale,y-f.anchor[1]*scale,CELL*scale,CELL*scale);if(headImage){c.restore();const w=218/367*HEIGHT;c.drawImage(headImage,287,175,218,367*.53,x-w/2,y-HEIGHT,w,HEIGHT*.53);}return {x:x+(f.hand[0]-f.anchor[0])*scale,y:y+(f.hand[1]-f.anchor[1])*scale};}
