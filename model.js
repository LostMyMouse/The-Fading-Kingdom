// Serializable game rules. UI, drawing, and storage are deliberately separate.
export const SAVE_KEY = 'the-fading-kingdom:save:v1';
export const CROPS = {
  carrot: { name: 'Carrot', days: 1, seed: 'carrotSeed', colour: '#e99043' },
  flower: { name: 'Daisy', days: 1, seed: 'flowerSeed', colour: '#fff0bd' },
  moonflower: { name: 'Moonflower', days: 2, seed: 'moonSeed', colour: '#c6a1ed' },
};
export const FURNITURE = ['bench', 'planter', 'lantern', 'path', 'fence'];
export const PLOTS = Array.from({length:12}, (_,i)=>({x:6+(i%4)*2,y:15+Math.floor(i/4)*2,crop:null,age:0,watered:false}));
export const SKINS = ['#f3c99b','#dfab7d','#c58b62','#a2694c','#7f503e','#593c34'];
export const HAIRS = ['#643f32','#c68b43','#352c31','#ded4b0','#a24f35','#625281'];
export const SHIRTS = ['#799c84','#bd795b','#7b91ac','#c1a461','#917899','#d5b993'];
export function newGame() {
  return {version:1,day:1,player:{x:15,y:17,skin:0,hair:0,shirt:0,style:0},plots:structuredClone(PLOTS),
    inventory:{carrotSeed:8,flowerSeed:8,moonSeed:0,carrot:0,flower:0,moonflower:0,wood:0,bench:2,planter:3,lantern:3,path:12,fence:6},
    relationships:{rowan:0,orin:0,pip:0},events:{introduced:false,borrow:'none',borrowDay:0,packet:'untouched',helpedOrin:false,helpedPip:false,restored:false,greenhouse:false,magicalCloak:false},decor:[]};
}
export const clone = s => structuredClone(s);
export function relationStage(n) {return n>=3?'Trusted friend':n>=1?'Growing friendship':'Getting to know you';}
export function disputes(s) {return ['held','late'].includes(s.events.borrow) || s.events.packet==='taken';}
export function cropAction(s,index,tool) {
  const p=s.plots[index]; if(!p) return 'Choose a garden plot.';
  if(p.crop && p.age>=CROPS[p.crop].days) {
    const name=CROPS[p.crop].name; s.inventory[p.crop]++; p.crop=null;p.age=0;p.watered=false;
    return `${name} harvested! Your empty plot is ready to plant again.`;
  }
  if(tool==='water') {if(!p.crop)return 'Plant a seed here first.';if(p.watered)return 'Already watered. It will grow when you sleep.';p.watered=true;return 'A little water, a little patience. Sleep to help it grow.';}
  if(CROPS[tool]) {
    if(p.crop)return 'Something is growing here. Choose the watering can.';
    const seed=CROPS[tool].seed;if(s.inventory[seed]<1)return `No ${CROPS[tool].name.toLowerCase()} seeds left. Rowan can help.`;
    s.inventory[seed]--;p.crop=tool;p.age=0;p.watered=false;return `${CROPS[tool].name} planted. Give it some water!`;
  }
  return p.crop ? `${CROPS[p.crop].name}: ${p.watered?'watered':'needs water'}. Ready in ${Math.max(0,CROPS[p.crop].days-p.age)} growing day(s).` : 'Empty plot. Select a seed, then tap this plot.';
}
export function nextDay(s) {
  s.day++; for(const p of s.plots){if(p.crop&&p.watered)p.age++;p.watered=false;}
  if(s.events.borrow==='held'&&s.day>s.events.borrowDay)s.events.borrow='late';
  return 'A fresh morning. Your watered crops have grown.';
}
export function social(s,action) {
  const e=s.events,r=s.relationships;
  switch(action) {
    case 'introduce':if(e.introduced)return 'Rowan is glad to see you again.';e.introduced=true;r.rowan++;return 'Welcome to Bramblewick! The old garden could use a friend. Grow three daisies, ask Orin about wood, and we can bring it back together.';
    case 'borrow':if(e.borrow!=='none')return 'You have already talked about borrowing the can.';if(e.packet==='taken')return 'Please return my seeds before borrowing something else.';e.borrow='held';e.borrowDay=s.day;return 'Of course. Please bring my copper can back before you sleep. Your own little can will always work too.';
    case 'demand':if(e.borrow!=='none')return 'Let’s finish our current borrowing agreement first.';e.borrow='refused';r.rowan=Math.max(-2,r.rowan-1);return 'I use that can too. Please ask me before borrowing it. We can try that conversation again.';
    case 'retry':if(e.borrow!=='refused')return 'There is no request to retry.';e.borrow='none';return 'Thank you for asking again. We can start fresh.';
    case 'returnCan':if(!['held','late'].includes(e.borrow))return 'You are not holding Rowan’s can.';e.borrow='returned';r.rowan=Math.max(0,r.rowan)+1;return 'Thank you for bringing it back. Keeping promises helps us work together. If it was late, we can still put things right.';
    case 'take':if(e.packet!=='untouched')return 'There is no other packet to take.';e.packet='taken';r.rowan=Math.max(-2,r.rowan-1);return 'Those are my seeds. I needed them for the garden. I cannot plant with you while they are missing. You can return the packet and make this right.';
    case 'askSeeds':if(e.packet!=='untouched')return 'We have already sorted out this packet.';if(['held','late'].includes(e.borrow))return 'Please return my can first. Then we can discuss the seeds.';e.packet='gifted';s.inventory.flowerSeed+=3;r.rowan++;return 'Thank you for asking. Yes, you may have three daisy seeds for the village garden.';
    case 'returnSeeds':if(e.packet!=='taken')return 'There is no taken packet to return.';e.packet='returned';r.rowan=Math.max(0,r.rowan);return 'Thank you for returning the whole packet and telling me. I can use it again. We can rebuild trust by keeping our next promises.';
    case 'orin':if(e.helpedOrin)return 'You already helped Orin stack the fallen branches.';e.helpedOrin=true;s.inventory.wood+=4;r.orin+=2;return 'Good teamwork! Four pieces of fallen wood for our garden. Keep two for a later project.';
    case 'pip':if(e.helpedPip)return 'Pip remembers how you shared the bridge.';e.helpedPip=true;r.pip+=2;s.inventory.flowerSeed+=2;return 'Thanks for waiting for me to cross! These two daisy seeds are for your farm. Next time, I’ll wait for you.';
    case 'restore':
      if(e.restored)return 'The garden is already restored. Make it your own with decorations!';
      if(!e.introduced)return 'Talk to Rowan before starting the shared garden.';
      if(disputes(s))return 'Rowan needs their belongings back before joining in. Check your journal for how to repair things.';
      if(!e.helpedOrin)return 'Ask Orin about helping with the garden’s wooden edging.';
      if(s.inventory.flower<3||s.inventory.wood<2)return 'We need three harvested daisies and two wood. Grow daisies on your farm and help Orin.';
      s.inventory.flower-=3;s.inventory.wood-=2;e.restored=true;r.rowan++;r.orin++;s.inventory.bench++;s.inventory.lantern++;return 'The garden is alive again! Rowan has opened the greenhouse for you. Add your own benches, flowers, and paths wherever they fit.';
    case 'greenhouse':if(!e.restored)return 'The greenhouse is resting. Restore the village garden to open it.';if(e.greenhouse)return 'The greenhouse is open. Rowan can replenish your moonflower seeds.';e.greenhouse=true;s.inventory.moonSeed+=4;e.magicalCloak=true;return 'You found four moonflower seeds and a leaf-stitched cape! Moonflowers grow over two watered nights. Change your outfit at the cottage mirror.';
    case 'refill':
      if(e.packet==='taken')return 'Please return my packet first. You still have your own tools and crops.';
      if(s.inventory.carrotSeed+s.plots.filter(p=>p.crop==='carrot').length<2)s.inventory.carrotSeed+=4;
      if(s.inventory.flowerSeed+s.plots.filter(p=>p.crop==='flower').length<3)s.inventory.flowerSeed+=4;
      if(e.greenhouse&&s.inventory.moonSeed+s.plots.filter(p=>p.crop==='moonflower').length<2)s.inventory.moonSeed+=2;
      return 'Here are starter seeds if your supply was low. There is always a way to keep growing.';
    default:return 'Take your time. The village will be here.';
  }
}
export function journal(s) {
 const e=s.events;
 return [
  {name:'Rowan · gardener',stage:relationStage(s.relationships.rowan),note:e.packet==='taken'?'Your taking of Rowan’s seed packet has paused their help. Return it at the seed crate and acknowledge what happened.':e.borrow==='late'?'Rowan needs the borrowed can back. Talk to them to return it and apologise.':e.borrow==='held'?'You promised to return the copper can before sleeping. Talk to Rowan.':e.restored?'You brought the garden back together. Rowan’s greenhouse is open.':e.introduced?'Rowan wants to restore the garden. Grow three daisies and get Orin’s help.':'Introduce yourself. Rowan tends the seed crate beside the path.'},
  {name:'Orin · carpenter',stage:relationStage(s.relationships.orin),note:e.helpedOrin?'Orin appreciated your help stacking fallen branches.':'Orin has gathered fallen branches south of the village garden. Offer to help.'},
  {name:'Pip · apprentice',stage:relationStage(s.relationships.pip),note:e.helpedPip?'Pip remembers that you waited your turn at the bridge.':'Pip is near the little bridge. Say hello when you have a moment.'}
 ];
}
// The farm and garden are generous decorating zones. Paths and key interactions stay clear.
export function validPlacement(s,x,y,type,ignore=-1) {
  if(!Number.isInteger(x)||!Number.isInteger(y)||!FURNITURE.includes(type))return false;
  const zone=(x>=4&&x<=14&&y>=21&&y<=26)||(x>=29&&x<=40&&y>=16&&y<=24);
  if(!zone||y===20||(x>=33&&x<=35)||(x===30&&y<=18))return false;
  if(s.plots.some(p=>p.x===x&&p.y===y))return false;
  return !s.decor.some((d,i)=>i!==ignore&&d.x===x&&d.y===y);
}
export function place(s,type,x,y,rotation=0) {
  if(!validPlacement(s,x,y,type))return 'Choose a clear, highlighted space. Main paths stay open.';
  if(s.inventory[type]<1)return 'No more of that decoration in storage. Move one you placed, or choose another.';
  s.inventory[type]--;s.decor.push({type,x,y,rotation:rotation%2});return 'Placed! You can move it, store it, or undo.';
}
export function parseSave(raw) {
  const s=JSON.parse(raw), base=newGame();
  if(!s||s.version!==1||!Number.isInteger(s.day)||s.day<1||s.day>100000)throw Error('Unsupported save');
  const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
  if(!s.player||!integer(s.player.x,1,46)||!integer(s.player.y,1,30))throw Error('Invalid position');
  for(const [k,max] of [['skin',5],['hair',5],['shirt',5],['style',2]])if(!integer(s.player[k],0,max))throw Error('Invalid appearance');
  if(typeof s.player.cape!=='undefined'&&typeof s.player.cape!=='boolean')throw Error('Invalid cape');
  for(const k of Object.keys(base.inventory))if(!integer(s.inventory?.[k],0,1000000))throw Error('Invalid inventory');
  for(const k of Object.keys(base.relationships))if(!integer(s.relationships?.[k],-2,100))throw Error('Invalid relationship');
  if(!s.events||!['none','held','late','refused','returned'].includes(s.events.borrow)||!['untouched','taken','returned','gifted'].includes(s.events.packet)||!integer(s.events.borrowDay,0,s.day))throw Error('Invalid story');
  for(const k of ['introduced','helpedOrin','helpedPip','restored','greenhouse','magicalCloak'])if(typeof s.events[k]!=='boolean')throw Error('Invalid story');
  if(s.events.greenhouse&&!s.events.restored)throw Error('Invalid unlock');
  if(!Array.isArray(s.plots)||s.plots.length!==PLOTS.length)throw Error('Invalid farm');
  s.plots.forEach((p,i)=>{if(p.x!==PLOTS[i].x||p.y!==PLOTS[i].y||!(p.crop===null||Object.hasOwn(CROPS,p.crop))||!integer(p.age,0,100000)||typeof p.watered!=='boolean')throw Error('Invalid crop');});
  if(!Array.isArray(s.decor)||s.decor.length>200)throw Error('Invalid decorations');
  const checked={...s,decor:[]};for(const d of s.decor){if(!integer(d.rotation,0,1)||!validPlacement(checked,d.x,d.y,d.type))throw Error('Invalid decoration');checked.decor.push(d);}
  // Whitelist stored fields instead of retaining arbitrary input properties.
  return {version:1,day:s.day,player:{x:s.player.x,y:s.player.y,skin:s.player.skin,hair:s.player.hair,shirt:s.player.shirt,style:s.player.style,cape:!!s.player.cape&&s.events.magicalCloak},plots:s.plots.map(p=>({x:p.x,y:p.y,crop:p.crop,age:p.age,watered:p.watered})),inventory:Object.fromEntries(Object.keys(base.inventory).map(k=>[k,s.inventory[k]])),relationships:Object.fromEntries(Object.keys(base.relationships).map(k=>[k,s.relationships[k]])),events:Object.fromEntries(Object.keys(base.events).map(k=>[k,s.events[k]])),decor:checked.decor.map(d=>({type:d.type,x:d.x,y:d.y,rotation:d.rotation}))};
}
