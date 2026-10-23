import {CHARACTER_HEIGHT,pixelAnchor} from '../character-rig.js';

// New artwork candidate, never a filter over the current production cast.
// Keep the generated source intact. These 24x32 canvases are display frames.
export const FRAME_WIDTH=24;
export const PALETTE=[
 '#2b211c','#422c23','#5b3929','#795039','#a27146',
 '#4b2d24','#693c2d','#8d5035','#b36c42','#d18b54',
 '#9d6745','#bd8359','#dfa775','#f0c391','#ffe0aa',
 '#263b2e','#3c533b','#57724d','#80945e','#a6b57d',
 '#694d28','#9c702c','#c89a3f','#e5bd63','#f3d994',
 '#776247','#ad9470','#d6c29a','#eddfb9','#fff0ce',
 '#663a29','#914b2d','#b96637','#d48b4b','#e9ae68',
 '#32352b','#4b4c39','#72745a','#9d9c7b','#c6c0a0',
 '#543e2e','#765338','#997045','#c3965f','#d9b982',
 '#1c2924','#b5a68b','#f3e6c7'
];
const rgb=PALETTE.map(hex=>[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16)));
const frames=new Map();let loading=null;
// The generator reversed the requested profile columns. Map the inspected art,
// rather than trusting the requested order: column1 faces right, column2 left.
const index={mara:0,player:1,orin:2},views={down:0,left:2,right:1,up:3};
export const audit=[];
function colour(r,g,b){let best=0,distance=Infinity;for(let i=0;i<rgb.length;i++){const [rr,gg,bb]=rgb[i],d=(r-rr)**2+(g-gg)**2+(b-bb)**2;if(d<distance){best=i;distance=d;}}return rgb[best];}
function bounds(data,width,height,x0,y0,w,h){let left=x0+w,right=-1,top=y0+h,bottom=-1;for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(data[(y*width+x)*4+3]>127){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}if(right<left)return null;return [left,top,right-left+1,bottom-top+1];}
function components(data,width,height){const visited=new Set(),sizes=[];for(let start=0;start<width*height;start++){if(visited.has(start)||data[start*4+3]===0)continue;const stack=[start];visited.add(start);let size=0;while(stack.length){const p=stack.pop(),x=p%width,y=Math.floor(p/width);size++;for(const [xx,yy]of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){const n=yy*width+xx;if(xx<0||yy<0||xx>=width||yy>=height||visited.has(n)||data[n*4+3]===0)continue;visited.add(n);stack.push(n);}}sizes.push(size);}return sizes.sort((a,b)=>b-a);}
export function preparePixelCast(){if(loading)return loading;loading=new Promise((resolve,reject)=>{const image=new Image();image.onerror=()=>reject(Error('The new pixel cast artwork could not load.'));image.onload=()=>{try{
 const source=document.createElement('canvas');source.width=image.naturalWidth;source.height=image.naturalHeight;const sc=source.getContext('2d',{willReadFrequently:true});sc.drawImage(image,0,0);const original=sc.getImageData(0,0,source.width,source.height).data;
 const cw=Math.floor(source.width/4),ch=Math.floor(source.height/3);frames.clear();audit.length=0;
 for(const [name,row]of Object.entries(index))for(const [direction,col]of Object.entries(views)){
  const box=bounds(original,source.width,source.height,col*cw,row*ch,cw,ch);if(!box)throw Error(`Missing ${name} ${direction} candidate.`);
  const w=Math.round(box[2]/box[3]*CHARACTER_HEIGHT);if(w<8||w>FRAME_WIDTH)throw Error(`Unexpected ${name} ${direction} proportions.`);
  const frame=document.createElement('canvas');frame.width=FRAME_WIDTH;frame.height=CHARACTER_HEIGHT;const fc=frame.getContext('2d',{willReadFrequently:true});fc.imageSmoothingEnabled=false;fc.drawImage(image,...box,Math.floor((FRAME_WIDTH-w)/2),0,w,CHARACTER_HEIGHT);
  const pixels=fc.getImageData(0,0,FRAME_WIDTH,CHARACTER_HEIGHT),d=pixels.data,colours=new Set();let count=0;for(let i=0;i<d.length;i+=4){if(d[i+3]<128){d[i]=d[i+1]=d[i+2]=d[i+3]=0;continue;}const chosen=colour(d[i],d[i+1],d[i+2]);d[i]=chosen[0];d[i+1]=chosen[1];d[i+2]=chosen[2];d[i+3]=255;colours.add(chosen.join(','));count++;}fc.putImageData(pixels,0,0);
  const regions=components(d,FRAME_WIDTH,CHARACTER_HEIGHT),native=bounds(d,FRAME_WIDTH,CHARACTER_HEIGHT,0,0,FRAME_WIDTH,CHARACTER_HEIGHT);
  audit.push({name,direction,source:box,nativeWidth:w,pixels:count,colours:colours.size,components:regions.length,smallest:regions.at(-1)||0,footRow:native?native[1]+native[3]-1:null});
  frames.set(name+':'+direction,frame);
 }
 resolve(audit);
 }catch(e){reject(e);}};image.src=new URL('./pixel-cast-v1.png',import.meta.url).href;});return loading;}
export function drawPixelCast(c,name,direction,x,y){const frame=frames.get(name+':'+direction);if(!frame)return false;const [px,py]=pixelAnchor(c,x,y);c.fillStyle='#304d3c40';c.fillRect(px-6,py,12,3);c.imageSmoothingEnabled=false;c.drawImage(frame,px-FRAME_WIDTH/2,py-CHARACTER_HEIGHT+2);return true;}
