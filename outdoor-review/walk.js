import {preparePlayer,drawPlayer} from '../player-layered.js';
import {prepareCharacters,drawCharacter} from '../chapter-characters.js';
import {animationFrame} from '../chapter-actors.js';
import {blinkAt} from '../chapter-motion.js';
import {prepareEnvironment,drawProp,drawCottage,PROPS} from '../environment-art.js';
import {WIDTH,HEIGHT,HOME,DECOR,SPAWN,STOPS,route,point,blocked} from './world.js';
const $=id=>document.getElementById(id),canvas=$('scene'),c=canvas.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
const look={skin:1,hair:0,shirt:0,style:0,outfit:0,hat:0},zoom=innerWidth<700?2:3,keys=new Set();
const makeActor=(tile,name)=>({tile:{...tile},...point(tile),name,direction:'down',path:[],clock:0,walking:false,stop:0,wait:2000});
let player=makeActor(SPAWN),npcs=Object.entries(STOPS).map(([name,stops])=>makeActor(stops[0],name)),art,ready=false,last=0,time=0,paused=false,camera={x:0,y:0};
let ground=null;
function prepareGround(){ground=document.createElement('canvas');ground.width=WIDTH*16;ground.height=HEIGHT*16;const ctx=ground.getContext('2d');ctx.imageSmoothingEnabled=false;
 const fill=(i,x,y,w,h,r=0)=>{ctx.fillStyle=ctx.createPattern(art.patterns[i],'repeat');ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
 fill(0,0,0,ground.width,ground.height);fill(1,132,136,36,184,9);fill(1,144,237,192,30,10);fill(1,154,162,112,29,10);fill(3,98,137,61,23,5);fill(2,60,191,66,55,5);
}
function setStatus(message){$('status').textContent=message;}
function setRoute(to){const current=player.walking&&player.path.length?player.path[0]:null,path=route(current||player.tile,to);if(path===null){setStatus('That spot is occupied. Try open ground.');return;}player.path=current?[current,...path]:path;setStatus(player.path.length?'Walking to your spot…':'You’re here.');}
function move(actor,dt){actor.walking=false;let remaining=dt*65/1000;
 while(remaining>0&&actor.path.length){const next=actor.path[0],target=point(next),dx=target.x-actor.x,dy=target.y-actor.y,distance=Math.hypot(dx,dy);actor.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  const travel=Math.min(remaining,distance);if(distance){actor.x+=dx/distance*travel;actor.y+=dy/distance*travel;}actor.clock+=travel/65*1000;actor.walking=true;remaining-=travel;
  if(distance<=travel+.001){actor.x=target.x;actor.y=target.y;actor.tile={...next};actor.path.shift();}else break;
 }if(!actor.walking)actor.clock=0;
}
function update(dt){
 if(!player.path.length&&keys.size){const d=[...keys].at(-1),delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[d],to={x:player.tile.x+delta[0],y:player.tile.y+delta[1]};player.direction=d;if(!blocked(to))player.path=[to];}
 const wasWalking=player.walking;move(player,dt);if(wasWalking&&!player.walking)setStatus('Take a look around.');
 if(!paused&&!reduce.matches)for(const npc of npcs){if(!npc.path.length){npc.wait-=dt;if(npc.wait<=0){npc.stop=(npc.stop+1)%STOPS[npc.name].length;npc.path=route(npc.tile,STOPS[npc.name][npc.stop])||[];npc.wait=npc.name==='mara'?4200:6100;}}move(npc,dt);}
}
function draw(){if(!ready)return;const box=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1,w=Math.round(box.width*dpr),h=Math.round(box.height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 const vw=box.width/zoom,vh=box.height/zoom,axis=(v,span,total)=>span>total?(total-span)/2:Math.max(0,Math.min(total-span,v-span/2));camera={x:Math.round(axis(player.x,vw,WIDTH*16)),y:Math.round(axis(player.y-18,vh,HEIGHT*16))};
 c.setTransform(dpr*zoom,0,0,dpr*zoom,0,0);c.imageSmoothingEnabled=false;c.translate(-camera.x,-camera.y);c.fillStyle=c.createPattern(art.patterns[0],'repeat');c.fillRect(camera.x,camera.y,vw+1,vh+1);c.drawImage(ground,0,0);
 const crops=['seedling','growing','carrot'];for(let row=0;row<3;row++)for(let col=0;col<4;col++){const chosen=$('crop').value;drawProp(c,art,chosen==='mixed'?crops[(row+col)%3]:chosen,69+col*16,206+row*16,13);}
 const objects=DECOR.map(([name,x,y])=>({y,draw:()=>drawProp(c,art,name,x,y)}));objects.push({y:HOME.y,draw:()=>drawCottage(c,art,HOME.x,HOME.y)});
 for(const actor of [player,...npcs])objects.push({y:actor.y,draw:()=>{
  const walk=actor.walking&&!reduce.matches&&!(paused&&actor.name),phase=actor.clock/170%4,blink=blinkAt(time,actor.name==='mara'?1:actor.name==='orin'?3:0,reduce.matches);
  if(actor.name)drawCharacter(c,{...actor,walking:walk,gait:phase,blink,frame:animationFrame({direction:actor.direction,walking:walk,clock:actor.clock,reduce:reduce.matches})},actor.x,actor.y);
  else drawPlayer(c,actor.x,actor.y,look,phase,actor.direction,walk,reduce.matches,blink);
 }});
 objects.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
}
function clearKeys(){keys.clear();}window.addEventListener('blur',clearKeys);document.addEventListener('visibilitychange',()=>{clearKeys();last=0;});
const keyDirection=key=>({ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'})[key];
canvas.addEventListener('keydown',e=>{const d=keyDirection(e.key);if(d){e.preventDefault();keys.add(d);if(!player.walking)player.path=[];}});window.addEventListener('keyup',e=>{const d=keyDirection(e.key);if(d)keys.delete(d);});
canvas.addEventListener('pointerup',e=>{if(!ready)return;const b=canvas.getBoundingClientRect();canvas.focus({preventScroll:true});setRoute({x:Math.floor(((e.clientX-b.left)/zoom+camera.x)/16),y:Math.floor(((e.clientY-b.top)/zoom+camera.y)/16)});});
for(const button of document.querySelectorAll('[data-move]')){button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.move);if(!player.walking)player.path=[];});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.move));button.addEventListener('click',e=>{if(e.detail===0){const [dx,dy]={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[button.dataset.move];setRoute({x:player.tile.x+dx,y:player.tile.y+dy});}});}
$('reset').onclick=()=>{player=makeActor(SPAWN);clearKeys();setStatus('Back on the cottage path.');draw();};$('pause').onclick=()=>{paused=!paused;$('pause').setAttribute('aria-pressed',String(paused));$('pause').textContent=paused?'Resume residents':'Pause residents';};$('crop').onchange=draw;
const labels={oak:'Oak tree',pine:'Pine tree',bench:'Garden bench',chest:'Tool chest',fence:'Fence section',post:'Fence post',lantern:'Lantern',seedling:'Seedling',growing:'Growing carrot',carrot:'Mature carrot',flowers:'Wildflowers',log:'Fallen log',rock:'Boulder',planter:'Herb planter',well:'Old well'};
function shelf(){for(const name of Object.keys(PROPS)){const f=document.createElement('figure'),cv=document.createElement('canvas'),label=document.createElement('figcaption');cv.width=160;cv.height=160;cv.setAttribute('aria-label',labels[name]);const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;const width=Math.min(PROPS[name][4]*2,100),height=width*PROPS[name][3]/PROPS[name][2];drawProp(ctx,art,name,80,Math.min(150,85+height/2),width);label.textContent=labels[name];f.append(cv,label);$('shelf').append(f);}}
document.querySelectorAll('button,select').forEach(b=>b.disabled=true);
Promise.all([preparePlayer(),prepareCharacters(),prepareEnvironment()]).then(([p,n,a])=>{if(!p||!n)throw Error('Some character artwork could not load.');art=a;prepareGround();shelf();ready=true;$('loading').hidden=true;document.querySelectorAll('button,select').forEach(b=>b.disabled=false);draw();}).catch(e=>{$('loading').textContent=e.message+' Please reload to try again.';});
new ResizeObserver(draw).observe(canvas);function tick(now){const dt=last?Math.min(50,now-last):0;last=now;if(ready&&!document.hidden){time+=dt;update(dt);draw();}requestAnimationFrame(tick);}requestAnimationFrame(tick);
