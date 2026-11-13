import {DATA,VEST_DATA,DIRECTIONS,POSES,frameIndex,frameSpec,handAt,drawBody} from './cycle-v2.js';
import {ACTION_DATA,ACTION_POSES,SWING_DURATION,actionFrame,drawSwing,swingFrame} from './action-frames.js';
import {garmentCanvas} from './garment-mask.js';
import {prepareHeads,drawHead,drawReference} from './original-heads.js';
import {prepareCharacters,drawCharacter} from '../chapter-characters.js';
import {HAIRSTYLES} from '../player-layered.js';

const $ = id => document.getElementById(id);
const canvas = $('cast');
const names = {down:'Front',left:'Left',right:'Right',up:'Back'};
const images = new Map();
const palettes = new Map();
const walkData = {...DATA,...Object.fromEntries(Object.entries(VEST_DATA).map(([key,data]) => ['vest-'+key,data]))};
let playing = true;
let moving = true;
let ready = false;
let loadingAction = false;
let actionFailed = false;
let tool = '';
let phase = 0;
let elapsed = 0;
let manualFrame = null;
let last = 0;

function loadImage(key, file) {
  if (images.has(key)) return Promise.resolve();
  return new Promise((resolve,reject) => {
    const image = new Image();
    image.onload = () => {
      images.set(key,image);
      resolve();
    };
    image.onerror = () => reject(Error('Artwork unavailable'));
    image.src = new URL(file,import.meta.url).href;
  });
}

function context(view) {
  const {width,height} = view.getBoundingClientRect();
  const ratio = devicePixelRatio || 1;
  const backingWidth = Math.round(width*ratio);
  const backingHeight = Math.round(height*ratio);
  if (view.width !== backingWidth) view.width = backingWidth;
  if (view.height !== backingHeight) view.height = backingHeight;
  const c = view.getContext('2d');
  c.setTransform(ratio,0,0,ratio,0,0);
  c.clearRect(0,0,width,height);
  c.imageSmoothingEnabled = false;
  return {c,width,height};
}

function basket(c,x,y) {
  c.save();
  c.translate(x,y);
  c.fillStyle = '#624b35'; c.fillRect(-3.5,2,7,6);
  c.fillStyle = '#bd9b65'; c.fillRect(-3,2,6,5);
  c.fillStyle = '#ead09a';
  c.fillRect(-3.5,2,7,1); c.fillRect(-3.5,-1,1,4); c.fillRect(2.5,-1,1,4); c.fillRect(-2.5,-2,5,1);
  c.restore();
}

function appearance() {
  return {
    style:Number($('hair').value), hat:$('hat').checked,
    outfit:Number($('outfit').value), garment:Number($('colour').value),
    skin:Number($('skin').value), hair:Number($('hair-colour').value), mask:$('mask').checked
  };
}

function bodyImage(key, geometry, look) {
  const {garment,mask,skin} = look;
  const cacheKey = [key,garment,mask,skin].join(':');
  if (!palettes.has(cacheKey)) {
    palettes.set(cacheKey,garmentCanvas(images.get(key),geometry,garment,mask,skin,key));
    if (palettes.size > 12) palettes.delete(palettes.keys().next().value);
  }
  return palettes.get(cacheKey);
}

function candidate(c,x,y,direction,frame,look,carry = false) {
  const head = () => drawHead(c,x,y,direction,look.style,look.hat,look.skin,look.hair);
  if (tool) {
    const pose = actionFrame(direction,look.outfit,frame);
    drawSwing(c,bodyImage(pose.key,pose.geometry,look),pose,x,y,tool,head);
    return;
  }
  const spec = frameSpec(direction,frame,false,look.outfit);
  const hand = handAt(x,y,direction,frame,false,look.outfit);
  if (carry && hand.behind) basket(c,hand.x,hand.y);
  drawBody(c,bodyImage(spec.image,walkData[spec.image],look),x,y,direction,frame,{outfit:look.outfit});
  head();
  if (carry && !hand.behind) basket(c,hand.x,hand.y);
}

function selectedFrame() {
  if (tool) {
    if ($('reduce').checked) return swingFrame(0,true);
    return manualFrame ?? swingFrame(elapsed);
  }
  return frameIndex(moving ? phase : 0,$('reduce').checked);
}

function cast() {
  if (!ready) return;
  const {c,width,height} = context(canvas);
  const zoom = Number($('scale').value);
  const narrow = width < 600;
  const feet = narrow ? [height*.38,height*.82] : [height*.72];
  const xs = narrow ? [width*.28,width*.72] : [width*.14,width*.38,width*.62,width*.86];
  const labels = ['Mara','Original player',tool ? 'Tool preview' : 'Walking preview','Orin'];
  const direction = $('direction').value;
  const look = appearance();
  const frame = selectedFrame();
  for (let i = 0; i < 4; i++) {
    const x = xs[narrow ? i%2 : i];
    const y = feet[narrow ? Math.floor(i/2) : 0];
    c.save();
    c.translate(x,y);
    c.scale(zoom,zoom);
    if (i === 1 || i === 2) {
      c.fillStyle = '#304d3c40';
      c.fillRect(-6,0,12,3);
    }
    if (i === 0 || i === 3) {
      drawCharacter(c,{name:i===0?'mara':'orin',frame:DIRECTIONS.indexOf(direction)*4,direction,walking:false},0,0);
    } else if (i === 1) {
      drawReference(c,0,2,direction,look.style,look.hat);
    } else {
      candidate(c,0,2,direction,frame,look,$('basket').checked);
    }
    c.restore();
    c.fillStyle = '#354b3c';
    c.font = '14px system-ui';
    c.textAlign = 'center';
    c.fillText(labels[i],x,y+24);
  }
  const poses = tool ? ACTION_POSES : POSES;
  const playback = $('reduce').checked ? 'reduced motion' : !tool && !moving ? 'standing' : playing ? 'playing' : 'paused';
  const status = loadingAction ? 'Loading tool artwork…' : actionFailed ? 'Tool artwork could not load. Choose a tool to retry.' :
    `Frame ${frame+1}/4 · ${poses[frame]} · ${playback} · ${names[direction]}`;
  if ($('status').textContent !== status) $('status').textContent = status;
}

function posePanel(labelText, description) {
  const figure = document.createElement('figure');
  const view = document.createElement('canvas');
  const label = document.createElement('figcaption');
  view.setAttribute('aria-label',description);
  label.textContent = labelText;
  figure.append(view,label);
  return {figure,view};
}

function keys() {
  if (!ready) return;
  const host = $('poses');
  host.replaceChildren();
  const direction = $('direction').value;
  const look = appearance();
  const poses = tool ? ACTION_POSES : POSES;
  for (const [frame,label] of poses.entries()) {
    const {figure,view} = posePanel(label,label+' '+names[direction]+' pose');
    host.append(figure);
    const {c,width,height} = context(view);
    const zoom = Math.min(4,width/(tool ? 50 : 28));
    c.save();
    c.translate(width/2,height-30);
    c.scale(zoom,zoom);
    candidate(c,0,0,direction,frame,look,$('basket').checked);
    c.restore();
  }
}

const auditPaint = new WeakMap();
const auditObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) auditPaint.get(entry.target)?.();
});

function audit() {
  auditObserver.disconnect();
  if (!ready || !$('audit').open) return;
  const host = $('matrix');
  host.replaceChildren();
  const look = appearance();
  for (const [style,name] of HAIRSTYLES) {
    for (const hat of [false,true]) {
      for (const outfit of [0,1]) {
        const row = document.createElement('section');
        const title = document.createElement('h3');
        const views = document.createElement('div');
        title.textContent = name+' · '+(outfit?'Work vest':'Linen')+' · '+(hat?'Cap':'No hat');
        views.className = 'audit-views';
        row.append(title,views);
        host.append(row);
        for (const direction of DIRECTIONS) {
          const {figure,view} = posePanel(names[direction],title.textContent+' '+names[direction]+' four poses');
          views.append(figure);
          const paint = () => {
            const {c,width,height} = context(view);
            const zoom = Math.min(2,width/(tool ? 155 : 105));
            c.save();
            c.scale(zoom,zoom);
            for (let frame = 0; frame < 4; frame++) {
              candidate(c,width/zoom*(.14+frame*.24),height/zoom-14,direction,frame,{...look,style,hat,outfit});
            }
            c.restore();
          };
          auditPaint.set(view,paint);
          auditObserver.observe(view);
        }
      }
    }
  }
}

function redraw() {
  cast();
  keys();
  audit();
}

function render(now) {
  const dt = Math.min(50,Math.max(0,now-last));
  last = now;
  if (ready && playing && !$('reduce').checked && !document.hidden && (tool || moving)) {
    const before = selectedFrame();
    if (tool) elapsed = (elapsed+dt) % SWING_DURATION;
    else phase = (phase+dt/135)%4;
    if (selectedFrame() !== before) cast();
  }
  requestAnimationFrame(render);
}

function setPlaying(value) {
  playing = value;
  $('play').textContent = playing ? 'Pause' : 'Play';
}

$('play').onclick = () => {
  if (tool && manualFrame !== null) {
    elapsed = [0,190,400,515][manualFrame];
    manualFrame = null;
  }
  setPlaying(!playing);
  cast();
};
$('step').onclick = () => {
  setPlaying(false);
  if (tool) manualFrame = (selectedFrame()+1)%4;
  else {
    moving = true;
    $('stand').textContent = 'Stand still';
    phase = (Math.floor(phase)+1)%4;
  }
  cast();
};
$('stand').onclick = () => {
  moving = !moving;
  phase = 0;
  $('stand').textContent = moving ? 'Stand still' : 'Walk';
  cast();
};

$('action').onchange = async () => {
  const selected = $('action').value;
  actionFailed = false;
  if (selected && images.size < 12) {
    loadingAction = true;
    $('action').disabled = true;
    cast();
    const results = await Promise.allSettled(Object.entries(ACTION_DATA).map(([key,data]) => loadImage(key,data.file)));
    actionFailed = results.some(result => result.status === 'rejected');
    loadingAction = false;
    $('action').disabled = false;
    if (actionFailed) $('action').value = '';
  }
  tool = $('action').value;
  elapsed = 0;
  manualFrame = null;
  $('stand').disabled = Boolean(tool);
  $('basket').disabled = Boolean(tool);
  redraw();
};

for (const id of ['scale','direction','hair','hat','outfit','colour','mask','basket','skin','hair-colour']) {
  $(id).onchange = redraw;
}
$('reduce').onchange = cast;
$('audit').ontoggle = audit;
addEventListener('resize',redraw);
document.addEventListener('visibilitychange',() => {last = performance.now();});

const arrows = {ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up'};
const held = new Set();
canvas.addEventListener('keydown',event => {
  if (!ready || !arrows[event.key]) return;
  event.preventDefault();
  held.add(event.key);
  $('direction').value = arrows[event.key];
  if (!tool) {
    moving = true;
    setPlaying(true);
    $('stand').textContent = 'Stand still';
  }
  cast();
  keys();
});
function stopWalking() {
  if (tool) return;
  moving = false;
  phase = 0;
  $('stand').textContent = 'Walk';
  cast();
}
canvas.addEventListener('keyup',event => {
  if (!arrows[event.key]) return;
  event.preventDefault();
  held.delete(event.key);
  if (!held.size) stopWalking();
  else {
    $('direction').value = arrows[[...held].at(-1)];
    cast();
    keys();
  }
});
canvas.addEventListener('blur',() => {
  held.clear();
  stopWalking();
});

$('reduce').checked = matchMedia('(prefers-reduced-motion: reduce)').matches;
try {
  await Promise.all([
    ...Object.entries(walkData).map(([key,data]) => loadImage(key,data.file)),
    prepareHeads(),
    prepareCharacters().then(available => {if (!available) throw Error('Cast unavailable');})
  ]);
  ready = true;
  for (const control of document.querySelectorAll('.controls button,.controls select,.controls input')) control.disabled = false;
  redraw();
  requestAnimationFrame(render);
} catch {
  $('status').textContent = 'Artwork did not load. Reload this preview to retry.';
}
