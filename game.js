import {SAVE_KEY,CROPS,FURNITURE,SKINS,HAIRS,SHIRTS,newGame,clone,cropAction,nextDay,social,journal,disputes,place,validPlacement,parseSave} from './model.js';
import {TILE,W,H,landmarks,blocked,pathTo,drawWorld,icon,person} from './world.js';

const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d'),modal=$('modal');
let state=newGame(),playing=false,tool='hands',decorType='bench',rotation=0,hover=null,undo=null,moveIndex=-1,mode='place';
let camera={x:0,y:0},path=[],onArrival=null,keys=new Set(),stepTime=0,oldPos={x:15,y:17},direction='down',time=0,last=0,width=480,height=300,toastTimer,saveTimer;
let stored=null,loadError='',saveError='',draft=null;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{const raw=localStorage.getItem(SAVE_KEY);if(raw)stored=parseSave(raw);}catch(e){loadError='Your previous save could not be read. It has not been overwritten.';}
if(stored)$('continue').classList.remove('hide');
const tools=[['hands','Hands'],['water','Water'],['carrot','Carrot seeds'],['flower','Daisy seeds'],['moonflower','Moonflower seeds'],['decorate','Decorate']];
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),5500);}
function save(){if(!playing)return;clearTimeout(saveTimer);try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));saveError='';stored=clone(state);}catch{saveError='Saving is unavailable. Keep this page open to retain this session.';toast(saveError);}updateHud();}
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,500);}
function updateHud(){
 $('day').textContent=`Day ${state.day}${saveError?' · not saved':''}`;
 const flowers=Math.min(state.inventory.flower,3),wood=Math.min(state.inventory.wood,2);
 $('quest-progress').textContent=state.events.greenhouse?'Moonflowers and a magical cape unlocked!':state.events.restored?'Visit the greenhouse, then make the garden yours.':`Daisies ${flowers}/3 · Wood ${wood}/2${disputes(state)?' · Repair trust':''}`;
 $('quest-fill').style.width=`${state.events.restored?100:(flowers/3*45+wood/2*25+(state.events.introduced?15:0)+(state.events.helpedOrin?15:0))}%`;
 document.querySelectorAll('#toolbar button').forEach((b,i)=>{const t=tools[i][0];b.setAttribute('aria-pressed',t===tool);const counter=b.querySelector('.count');counter.textContent=CROPS[t]?state.inventory[CROPS[t].seed]:'';b.setAttribute('aria-label',`${tools[i][1]}${CROPS[t]?`, ${state.inventory[CROPS[t].seed]} remaining`:''}`);});
 $('selection').textContent=tool==='decorate'?`${mode==='move'?'Move an item':mode==='store'?'Tap an item to store it':`${decorType} · ${state.inventory[decorType]} in storage`} · Tap a space to preview`:tool==='hands'?'Hands · Talk, harvest, and explore':tool==='water'?'Watering can · Tap a planted plot':`${CROPS[tool].name} seeds · Tap an empty plot`;
}
for(const [i,[id,label]] of tools.entries()){
 const b=document.createElement('button');b.type='button';b.title=label;b.setAttribute('aria-label',label);b.innerHTML=`<small>${i+1}</small><canvas width="16" height="16" aria-hidden="true"></canvas><span class="count"></span>`;
 icon(b.querySelector('canvas').getContext('2d'),id);b.onclick=()=>selectTool(id);$('toolbar').append(b);
}
function selectTool(id){tool=id;hover=null;moveIndex=-1;mode='place';updateHud();if(id==='decorate')decorMenu();else canvas.focus({preventScroll:true});}
function clearMovement(){keys.clear();path=[];onArrival=null;stepTime=0;oldPos={x:state.player.x,y:state.player.y};}
function show(title,text,choices=[],eyebrow='BRAMBLEWICK'){
 clearMovement();const body=$('dialog-body');body.replaceChildren();
 const tag=document.createElement('div');tag.className='eyebrow';tag.textContent=eyebrow;body.append(tag);
 const h=document.createElement('h2');h.id='dialog-title';h.textContent=title;body.append(h);
 if(text){const p=document.createElement('p');p.textContent=text;body.append(p);}
 const list=document.createElement('div');list.className='choices';
 for(const choice of choices){const b=document.createElement('button');b.textContent=choice.label;b.className=choice.style||'';b.disabled=!!choice.disabled;b.onclick=choice.fn;list.append(b);}body.append(list);
 if(!modal.open)modal.showModal();
}
function close(){modal.close();canvas.focus({preventScroll:true});}
$('close-dialog').onclick=close;
modal.addEventListener('close',()=>{clearMovement();if(playing)canvas.focus({preventScroll:true});});
modal.addEventListener('cancel',()=>clearMovement());
function reply(name,action,then){undo=null;const message=social(state,action);save();show(name,message,[{label:'Okay',fn:()=>{close();if(then)then();}}]);}
function beginNew(){
 if(stored||loadError){show('Start a new story?',loadError||'This will replace the story saved in this browser.',[{label:'Keep my current story',fn:close},{label:'Start a new story',style:'warning',fn:()=>{state=newGame();appearance(true);}}]);}
 else{state=newGame();appearance(true);}
}
$('begin').onclick=beginNew;
$('continue').onclick=()=>{state=clone(stored);start();};
function start(){playing=true;loadError='';$('welcome').classList.add('hide');for(const id of ['hud','quest','bottom','location','dpad','touch-action'])$(id).classList.remove('hide');close();oldPos={x:state.player.x,y:state.player.y};resize();save();toast('Welcome to Bramblewick. Tap to walk. Your journal will help you find your way.');}
function appearance(first=false){
 draft={...state.player};show(first?'Make yourself at home':'The cottage mirror','Choose your look. You can change it here any time.',[],first?'YOUR STORY STARTS HERE':'YOUR WARDROBE');
 const shell=document.createElement('div');shell.className='appearance';const portrait=document.createElement('canvas');portrait.width=30;portrait.height=45;const controls=document.createElement('div');shell.append(portrait,controls);$('dialog-body').append(shell);
 const paint=()=>{const c=portrait.getContext('2d');c.clearRect(0,0,30,45);person(c,15,34,draft,0);};
 for(const [key,label,colours] of [['skin','Skin tone',SKINS],['hair','Hair colour',HAIRS],['shirt','Clothes',SHIRTS]]){
  const l=document.createElement('label');l.textContent=label;controls.append(l);const row=document.createElement('div');row.className='swatches';
  colours.forEach((col,i)=>{const b=document.createElement('button');b.style.background=col;b.setAttribute('aria-label',`${label} ${i+1}`);b.setAttribute('aria-pressed',draft[key]===i);b.onclick=()=>{draft[key]=i;row.querySelectorAll('button').forEach((el,j)=>el.setAttribute('aria-pressed',i===j));paint();};row.append(b);});controls.append(row);
 }
 const styleLabel=document.createElement('label');styleLabel.textContent='Hairstyle';const select=document.createElement('select');select.setAttribute('aria-label','Hairstyle');['Short & tousled','Long & tied','Soft curls'].forEach((name,i)=>select.add(new Option(name,i)));select.value=draft.style;select.onchange=()=>{draft.style=Number(select.value);paint();};controls.append(styleLabel,select);
 if(state.events.magicalCloak){const b=document.createElement('button');b.className='quiet';b.textContent='Toggle leaf-stitched cape';b.onclick=()=>{draft.cape=!draft.cape;paint();};controls.append(b);}
 const done=document.createElement('button');done.className='primary';done.textContent=first?'Begin my story →':'Save my look';done.onclick=()=>{state.player={...state.player,...draft};if(first)start();else{save();close();}};$('dialog-body').append(done);paint();
}
function rowan(){
 const e=state.events,choices=[];
 if(!e.introduced)choices.push({label:'Hello! I’m new here. Could you show me around?',fn:()=>reply('Rowan','introduce')});
 if(e.borrow==='none')choices.push({label:'Could I borrow your copper watering can, please?',fn:()=>reply('Rowan','borrow')},{label:'Give me your watering can!',style:'warning',fn:()=>reply('Rowan','demand')});
 if(e.borrow==='refused')choices.push({label:'I’m sorry I demanded it. May I try asking again?',fn:()=>reply('Rowan','retry',rowan)});
 if(['held','late'].includes(e.borrow))choices.push({label:e.borrow==='late'?'Return the can: “Sorry I kept it too long.”':'Return the can: “Thank you for lending it.”',fn:()=>reply('Rowan','returnCan')});
 if(e.packet==='taken')choices.push({label:'Return your seed packet. I should have asked.',fn:()=>reply('Rowan','returnSeeds')});
 choices.push({label:'Could I have starter seeds if I’m running low?',fn:()=>reply('Rowan','refill')});
 show('Rowan, the gardener',e.packet==='taken'?'My seeds are missing, so I can’t help plant our garden yet. You can put this right.':e.borrow==='late'?'I was hoping to use my can. Would you bring it back?':e.restored?'Look at what we grew together. The greenhouse is open for you.':'A garden grows better with a little care. So does a friendship.',choices,'A FRIEND BY THE GARDEN');
}
function packet(){const p=state.events.packet;
 show('Rowan’s seed crate',p==='untouched'?'These daisy seeds belong to Rowan. They are not a shared supply. What would you like to do?':p==='taken'?'You have Rowan’s unopened packet. Returning it will let them plant again.':'The seed packet has been sorted out. There is no extra packet to take.',p==='untouched'?[
  {label:'Ask Rowan: “May I have some seeds?”',fn:()=>reply('Rowan','askSeeds')},
  {label:'Leave the seeds where they belong',fn:close},
  {label:'Take without asking',style:'warning',fn:()=>show('Take Rowan’s seeds?','Rowan needs these for the garden. This is taking someone else’s belongings without permission.',[{label:'Leave them and ask instead',fn:()=>reply('Rowan','askSeeds')},{label:'Take the packet anyway',style:'warning',fn:()=>reply('Rowan','take')}])}
 ]:p==='taken'?[{label:'Return them: “I took these. I’m sorry.”',fn:()=>reply('Rowan','returnSeeds')}]:[],'BELONGINGS & PERMISSION');
}
function interact(id){
 switch(id){
  case 'rowan':rowan();break;
  case 'packet':packet();break;
  case 'home':show('Your little cottage','A place to rest, change your look, and begin again. Watered crops grow when you sleep. There is no rush.',[
   {label:'Sleep until tomorrow',style:'primary',fn:()=>{const msg=nextDay(state);state.player.x=9;state.player.y=12;oldPos={...state.player};undo=null;save();close();toast(msg);}},
   {label:'Look in the wardrobe mirror',fn:()=>appearance(false)}
  ],'HOME, SWEET HOME');break;
  case 'orin':show('Orin, the carpenter',state.events.helpedOrin?'The garden’s edging is ready. I’m glad we worked together.':'I’ve gathered fallen branches for the garden. Would you help me stack them?',state.events.helpedOrin?[]:[{label:'Yes, let’s carry them together.',fn:()=>reply('Orin','orin')},{label:'Not just now, thank you.',fn:()=>show('Orin','Of course. Come back whenever you’re ready.')}],'GOOD THINGS TAKE TEAMWORK');break;
  case 'pip':show('Pip, the apprentice',state.events.helpedPip?'Our bridge has room for both of us, one at a time.':'I’m carrying a wobbly pile of pots over the little bridge. May I go first?',state.events.helpedPip?[]:[{label:'Of course. I’ll wait until you’re across.',fn:()=>reply('Pip','pip')},{label:'I’ll take another path for now.',fn:close}],'A MOMENT OF KINDNESS');break;
  case 'garden':show(state.events.restored?'Our village garden':'The forgotten garden',state.events.restored?'A place for everyone, made by you. Place decorations in the garden or beside your farm.':'Three daisies, two pieces of wood, and willing friends can bring this place back.',[
   state.events.restored?{label:'Make this space your own',style:'primary',fn:()=>{close();tool='decorate';decorMenu();}}:{label:'Restore the garden together',style:'primary',fn:()=>reply('The village garden','restore')},
   {label:'Open my journal',fn:openJournal}
  ],'BRING THE KINGDOM BACK');break;
  case 'greenhouse':reply('The moonflower greenhouse','greenhouse');break;
 }
}
function openJournal(){
 show('Your friendship journal','Small things make a difference. Listen, keep promises, and put mistakes right.',[],'PEOPLE & POSSIBILITIES');
 for(const entry of journal(state)){const box=document.createElement('section');box.className='journal-entry';const h=document.createElement('h3');h.textContent=entry.name;const stage=document.createElement('div');stage.className='stage';stage.textContent=entry.stage;const p=document.createElement('p');p.textContent=entry.note;box.append(h,stage,p);$('dialog-body').append(box);}
 const h=document.createElement('h3');h.textContent='In your basket';$('dialog-body').append(h);const basket=document.createElement('div');basket.className='inventory-list';
 for(const [key,label] of [['carrot','Carrots'],['flower','Daisies'],['wood','Wood'],['moonflower','Moonflowers']]){const el=document.createElement('span');el.textContent=`${label}: ${state.inventory[key]}`;basket.append(el);}$('dialog-body').append(basket);
 const note=document.createElement('p');note.className='muted';note.textContent=state.events.restored?'The greenhouse is open. Plant moonflowers, decorate, and enjoy your village.':'Next: harvest three daisies, help Orin, and return any borrowed or taken belongings. Tap the garden sign when you’re ready.';$('dialog-body').append(note);
}
$('journal').onclick=openJournal;
function decorMenu(){
 show('Make a lovely little place','Choose a decoration, then tap a clear space to preview it. A Place button confirms it. Your cottage garden and the village garden are yours to arrange.',[],'DECORATING');
 const row=document.createElement('div');row.className='decor-controls';
 for(const name of FURNITURE){const b=document.createElement('button');b.textContent=`${name[0].toUpperCase()+name.slice(1)} · ${state.inventory[name]}`;b.setAttribute('aria-pressed',decorType===name);b.onclick=()=>{decorType=name;mode='place';moveIndex=-1;close();updateHud();toast('Tap a clear space to preview. Paths and entrances stay open.');};row.append(b);}$('dialog-body').append(row);
 const ops=document.createElement('div');ops.className='choices';for(const [label,fn] of [
  ['Move a placed item',()=>{mode='move';moveIndex=-1;close();updateHud();toast('Tap the item you want to move, then tap its new space.');}],
  ['Store a placed item',()=>{mode='store';close();updateHud();toast('Tap a placed item to return it to storage.');}],
  ['Undo last decoration change',()=>{undoDecor();close();}],
  ['Done decorating',()=>{tool='hands';hover=null;close();updateHud();}]
 ]){const b=document.createElement('button');b.textContent=label;b.onclick=fn;ops.append(b);}$('dialog-body').append(ops);
}
function rememberDecor(){undo={decor:clone(state.decor),inventory:Object.fromEntries(FURNITURE.map(k=>[k,state.inventory[k]]))};}
function undoDecor(){if(!undo){toast('Nothing to undo yet.');return;}state.decor=undo.decor;Object.assign(state.inventory,undo.inventory);undo=null;hover=null;moveIndex=-1;save();toast('Your last decoration change was undone.');}
function previewDecor(x,y){
 if(mode==='store'){const i=state.decor.findIndex(d=>d.x===x&&d.y===y);if(i<0){toast('Tap a decoration you have placed.');return;}rememberDecor();state.inventory[state.decor[i].type]++;state.decor.splice(i,1);save();toast('Back in storage. You can place it again any time.');return;}
 if(mode==='move'&&moveIndex<0){moveIndex=state.decor.findIndex(d=>d.x===x&&d.y===y);if(moveIndex<0){toast('Tap a decoration you have placed.');return;}decorType=state.decor[moveIndex].type;rotation=state.decor[moveIndex].rotation;toast('Now tap a clear space for this item.');return;}
 if(!validPlacement(state,x,y,decorType,mode==='move'?moveIndex:-1)){toast('Choose a clear garden space. Main paths stay open.');return;}
 hover={x,y};show(`Place ${decorType} here?`,'You can always move it, store it, or undo.',[
  {label:mode==='move'?'Move here':'Place here',style:'primary',fn:()=>{rememberDecor();if(mode==='move'){Object.assign(state.decor[moveIndex],{x,y,rotation});moveIndex=-1;}else{toast(place(state,decorType,x,y,rotation));}save();close();hover=null;}},
  {label:'Rotate preview',fn:()=>{rotation=(rotation+1)%2;toast('Preview rotated.');}},
  {label:'Choose another space',fn:()=>{hover=null;close();}}
 ],'YOUR KINGDOM, YOUR WAY');
}
function menu(){show('A little pause',saveError||loadError||'Your story saves automatically in this browser. Each device has its own save. Clearing browser data removes it.',[
 {label:'How to play',fn:()=>show('Settle in at your own pace','Walk with arrow keys or WASD, or tap the ground. Select seeds, then tap a farm plot. Water it, and sleep at your cottage to grow it. Use E or ACT to interact nearby. To harvest, tap a ripe crop with any tool. Open Decorate to arrange your home garden and village garden. The journal keeps track of people and your next steps.')},
 {label:'Save now',fn:()=>{save();show('Your story',saveError||'Saved in this browser. You can close the page and continue later.');}},
 {label:'Change my appearance',fn:()=>appearance(false)},
 {label:'Start a new story',style:'warning',fn:()=>show('Replace your saved story?','This replaces your farm, friendships, and decorations in this browser.',[{label:'Keep this story',fn:close},{label:'Replace and start again',style:'warning',fn:()=>{clearMovement();undo=null;tool='hands';state=newGame();appearance(true);}}])}
 ],'THE FADING KINGDOM');}
$('settings').onclick=menu;
function nearest(){let best=null,dist=2.8;for(const p of landmarks){const d=Math.hypot(p.x-state.player.x,p.y-state.player.y);if(d<dist){dist=d;best=p;}}return best;}
function interactNearby(){const p=nearest();if(p)interact(p.id);else{const idx=state.plots.findIndex(p=>Math.abs(p.x-state.player.x)+Math.abs(p.y-state.player.y)<=1);if(idx>=0){toast(cropAction(state,idx,tool));save();}else toast('Walk closer to a villager, your cottage, a plot, or the garden sign.');}}
$('interact').onclick=interactNearby;$('touch-action').onclick=interactNearby;
function clickWorld(event){if(!playing||modal.open)return;const bounds=canvas.getBoundingClientRect(),x=Math.floor(((event.clientX-bounds.left)/bounds.width*width+camera.x)/16),y=Math.floor(((event.clientY-bounds.top)/bounds.height*height+camera.y)/16);if(blocked(x,y))return;
 hover={x,y};if(tool==='decorate'){previewDecor(x,y);return;}
 const landmark=landmarks.find(p=>p.x===x&&p.y===y),plot=state.plots.findIndex(p=>p.x===x&&p.y===y);
 const action=landmark?()=>interact(landmark.id):plot>=0?()=>{toast(cropAction(state,plot,tool));save();}:null;
 const distance=Math.abs(x-state.player.x)+Math.abs(y-state.player.y);
 if(distance<=2&&action){action();return;}
 path=pathTo(state.player,{x,y});onArrival=action;if(!path.length&&distance!==0)toast('That spot cannot be reached from here.');
 canvas.focus({preventScroll:true});
}
canvas.addEventListener('pointerdown',clickWorld);
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&playing&&!modal.open){const b=canvas.getBoundingClientRect();hover={x:Math.floor(((e.clientX-b.left)/b.width*width+camera.x)/16),y:Math.floor(((e.clientY-b.top)/b.height*height+camera.y)/16)};}});
canvas.addEventListener('pointerleave',()=>{if(!modal.open)hover=null;});
const directions={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
document.addEventListener('keydown',e=>{if(!playing||modal.open||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.length===1?e.key.toLowerCase():e.key;
 if(directions[k]){e.preventDefault();keys.add(k);path=[];onArrival=null;}
 else if(!e.repeat){if(k==='e'||k===' '){e.preventDefault();interactNearby();}if(k==='j')openJournal();if(k==='Escape')menu();const index=Number(k)-1;if(index>=0&&index<tools.length)selectTool(tools[index][0]);if(k==='z'&&tool==='decorate')undoDecor();}
});
document.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
for(const b of document.querySelectorAll('#dpad button')){const k={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[b.dataset.dir];b.addEventListener('pointerdown',e=>{if(!playing||modal.open)return;e.preventDefault();b.setPointerCapture(e.pointerId);path=[];onArrival=null;keys.add(k);});for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>keys.delete(k));}
window.addEventListener('blur',()=>{clearMovement();if(playing)save();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearMovement();if(playing)save();}});window.addEventListener('pagehide',save);
function resize(){const b=canvas.getBoundingClientRect();const scale=b.width<600?2.4:3; width=Math.max(180,Math.min(640,Math.round(b.width/scale)));height=Math.max(135,Math.round(width*b.height/b.width));canvas.width=width;canvas.height=height;}
window.addEventListener('resize',resize);resize();
function tick(now){
 const dt=Math.min(50,now-last||16);last=now;time=now;
 if(playing&&!modal.open){
  stepTime=Math.max(0,stepTime-dt);
  if(stepTime===0){let next=null;const pressed=[...keys].at(-1);if(pressed){const [dx,dy]=directions[pressed];next={x:state.player.x+dx,y:state.player.y+dy};}else if(path.length)next=path.shift();
   if(next&&!blocked(next.x,next.y)){oldPos={x:state.player.x,y:state.player.y};direction=next.x>state.player.x?'right':next.x<state.player.x?'left':next.y<state.player.y?'up':'down';state.player.x=next.x;state.player.y=next.y;stepTime=150;scheduleSave();}
   else if(!path.length&&onArrival){const f=onArrival;onArrival=null;f();}
  }
  const p=nearest();$('context').classList.toggle('hide',!p||tool==='decorate');if(p)$('interact').firstChild.textContent=`${p.label} `;
 }
 const lerp=reduceMotion?1:1-stepTime/150,px=(oldPos.x+(state.player.x-oldPos.x)*lerp)*16+8,py=(oldPos.y+(state.player.y-oldPos.y)*lerp)*16+12;
 const targetX=playing?px:21*16,targetY=playing?py:14*16;
 camera.x=Math.max(0,Math.min(W*16-width,targetX-width/2));camera.y=Math.max(0,Math.min(H*16-height,targetY-height*.47));
 drawWorld(ctx,state,time,{width,height,camera,hover,decoration:playing&&tool==='decorate'?decorType:null,rotation,walkFrame:stepTime>0?Math.floor(time/130):0,direction,reduceMotion,playerX:px,playerY:py});
 requestAnimationFrame(tick);
}
updateHud();requestAnimationFrame(tick);
if(loadError)toast(loadError);
