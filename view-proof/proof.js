import {preparePlayer,drawPlayer} from '../player-layered.js';
import {prepareCharacters,drawCharacter} from '../chapter-characters.js';
import {animationFrame} from '../chapter-actors.js';

// Presentation only: use the actual shared character renderer without story state.
const $=id=>document.getElementById(id),canvas=$('scene'),c=canvas.getContext('2d');
const look={skin:1,hair:0,shirt:0,style:0,outfit:0,hat:0};
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let direction='down',zoom=innerWidth<700?2:3,walking=false,running=false,clock=0,last=0,grid=false,baseline=false,building=true,ready=false;
const cottage=new Image();
const cottageReady=new Promise((resolve,reject)=>{cottage.onload=()=>resolve();cottage.onerror=()=>reject(Error('The cottage image could not load.'));});
cottage.src=new URL('./cottage-front.png',import.meta.url).href;
let crop=null;
function findBounds(){const tmp=document.createElement('canvas');tmp.width=cottage.naturalWidth;tmp.height=cottage.naturalHeight;const ctx=tmp.getContext('2d',{willReadFrequently:true});ctx.drawImage(cottage,0,0);const {data}=ctx.getImageData(0,0,tmp.width,tmp.height);let left=tmp.width,top=tmp.height,right=0,bottom=0;for(let y=0;y<tmp.height;y++)for(let x=0;x<tmp.width;x++)if(data[(y*tmp.width+x)*4+3]>20){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}if(right<left||bottom<top)throw Error('The cottage artwork is empty.');return [left,top,right-left+1,bottom-top+1];}
const cast=[{label:'Mara',name:'mara',x:124},{label:'You',x:160},{label:'Orin',name:'orin',x:196}];
const names=[...$('names').children];
const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
function ground(){
 rect(-512,-512,1344,1248,'#92a76e');
 for(let y=-16;y<32;y++)for(let x=-16;x<36;x++){
  const a=x*16,b=y*16,n=((x*31+y*17)%19+19)%19;
  rect(a,b,16,16,n<5?'#93a86f':'#92a76e');
  if(n%4===0){rect(a+4,b+9,1,3,'#728e55');rect(a+6,b+8,1,3,'#789257');rect(a+4,b+12,3,1,'#b1bc7f');}
  if(x>=9&&x<=10&&y>=8||y===11&&x>=4&&x<=15){rect(a,b,16,16,'#c8b78c');if(n%2)rect(a+4,b+10,3,1,'#ac986f');else rect(a+9,b+4,4,1,'#dfcda1');}
 }
 // A deliberately small, axis-aligned soil trial beside the path.
 for(let y=9;y<11;y++)for(let x=5;x<8;x++){rect(x*16,y*16,16,16,'#8f6744');rect(x*16+2,y*16+4,12,1,'#a37b4c');rect(x*16+2,y*16+11,12,1,'#79583e');rect(x*16+7,y*16+6,2,5,'#49683d');rect(x*16+4,y*16+6,3,2,'#6c8a46');rect(x*16+9,y*16+4,3,2,'#6c8a46');}
}
function draw(){
 const box=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1,width=Math.round(box.width*dpr),height=Math.round(box.height*dpr);
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 const camera={x:Math.round(160-box.width/(2*zoom)),y:Math.round((zoom===4?140:107)-box.height/(2*zoom))};
 c.setTransform(dpr*zoom,0,0,dpr*zoom,0,0);c.imageSmoothingEnabled=false;c.translate(-camera.x,-camera.y);ground();
 if(building&&crop){const w=128,h=Math.round(w*crop[3]/crop[2]);rect(100,133,120,5,'#4a593b35');c.drawImage(cottage,...crop,96,136-h,w,h);}
 if(grid){c.strokeStyle='#fff3c34d';c.lineWidth=1/zoom;c.beginPath();for(let x=Math.floor(camera.x/16)*16;x<camera.x+box.width/zoom;x+=16){c.moveTo(x,camera.y);c.lineTo(x,camera.y+box.height/zoom);}for(let y=Math.floor(camera.y/16)*16;y<camera.y+box.height/zoom;y+=16){c.moveTo(camera.x,y);c.lineTo(camera.x+box.width/zoom,y);}c.stroke();}
 if(baseline){rect(104,169,112,1,'#fff1b7');rect(104,170,112,1,'#4d5c3c');}
 const frame=clock/170%4;
 if(ready)for(const [i,p]of cast.entries()){
  if(p.name)drawCharacter(c,{name:p.name,direction,walking,gait:frame,frame:animationFrame({direction,walking,clock})},p.x,168);
  else drawPlayer(c,p.x,168,look,frame,direction,walking,false,false);
  names[i].style.left=Math.round((p.x-camera.x)*zoom)+'px';names[i].style.top=Math.round((177-camera.y)*zoom)+'px';
 }
 const pose=!walking?'standing':['passing','left foot forward','passing','right foot forward'][Math.floor(frame)];
 $('status').textContent=`${{down:'Front',left:'Left',right:'Right',up:'Back'}[direction]} · ${pose} · ${zoom}×`;
}
function sync(){document.querySelectorAll('[data-direction]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.direction===direction)));document.querySelectorAll('[data-zoom]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.zoom)===zoom)));$('walk').textContent=running?'Pause walking':'Play walking';$('walk').setAttribute('aria-pressed',String(running));draw();}
document.querySelectorAll('[data-direction]').forEach(b=>b.onclick=()=>{direction=b.dataset.direction;sync();});
document.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{zoom=Number(b.dataset.zoom);sync();});
$('walk').onclick=()=>{walking=true;running=!running;sync();};
$('step').onclick=()=>{running=false;walking=true;clock=(Math.floor(clock/170)+1)*170;sync();};
$('reset').onclick=()=>{clock=0;walking=false;running=false;sync();};
for(const [id,get,set,texts]of [['grid',()=>grid,v=>grid=v,['Show ground grid','Hide ground grid']],['baseline',()=>baseline,v=>baseline=v,['Show foot line','Hide foot line']],['building',()=>building,v=>building=v,['Show cottage','Hide cottage']]])$(id).onclick=()=>{set(!get());$(id).setAttribute('aria-pressed',String(get()));$(id).textContent=texts[Number(get())];draw();};
canvas.addEventListener('keydown',e=>{if(['1','2','3','4'].includes(e.key)){direction=['down','left','right','up'][Number(e.key)-1];sync();}if(e.code==='Space'){e.preventDefault();$('walk').click();}});
new ResizeObserver(()=>draw()).observe(canvas);
document.querySelectorAll('button').forEach(b=>b.disabled=true);
Promise.all([preparePlayer(),prepareCharacters(),cottageReady]).then(([player,characters])=>{if(!player||!characters)throw Error('Some character artwork could not load.');crop=findBounds();ready=true;$('loading').hidden=true;document.querySelectorAll('button').forEach(b=>b.disabled=false);sync();}).catch(err=>{$('loading').textContent=err.message+' Reload to try again.';});
function tick(now){if(running&&!document.hidden){clock+=Math.min(50,last?now-last:0);draw();}last=now;requestAnimationFrame(tick);}requestAnimationFrame(tick);
// Reduced motion starts still; explicit Play remains available for an intentional inspection.
if(reduce.matches){walking=false;running=false;}
