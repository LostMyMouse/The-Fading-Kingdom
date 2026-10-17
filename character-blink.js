// Closed eyes are made from the existing face texture; no alternate full-body frame or size change.
const variants=new WeakMap();
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
export function blinkImage(image,rect){
 let cache=variants.get(image);if(!cache){cache=new Map();variants.set(image,cache);}const key=rect.join(',');if(cache.has(key))return cache.get(key);
 const [sx,sy,w,h]=rect,out=canvas(w,h),c=out.getContext('2d',{willReadFrequently:true});c.drawImage(image,sx,sy,w,h,0,0,w,h);
 const original=canvas(w,h);original.getContext('2d').drawImage(out,0,0);const pixels=c.getImageData(0,0,w,h).data,seen=new Uint8Array(w*h),blobs=[];
 const white=(x,y)=>{const p=(y*w+x)*4,r=pixels[p],g=pixels[p+1],b=pixels[p+2];return pixels[p+3]>180&&r>190&&g>180&&b>145&&Math.max(r,g,b)-Math.min(r,g,b)<100;};
 for(let y=Math.floor(h*.20);y<Math.floor(h*.44);y++)for(let x=Math.floor(w*.10);x<Math.floor(w*.90);x++){
  const id=y*w+x;if(seen[id]||!white(x,y))continue;const queue=[[x,y]];seen[id]=1;let l=x,r=x,t=y,b=y;
  for(let j=0;j<queue.length;j++){const [xx,yy]=queue[j];l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=xx+dx,ny=yy+dy,nid=ny*w+nx;if(nx>=0&&nx<w&&ny>=h*.2&&ny<h*.44&&!seen[nid]&&white(nx,ny)){seen[nid]=1;queue.push([nx,ny]);}}}
  if(r-l>=w*.035&&b-t>=h*.025&&queue.length>8&&(r-l)<=(b-t)*2.2)blobs.push({l,r,t,b,area:queue.length});
 }
 const eyes=[];for(const blob of blobs.sort((a,b)=>b.area-a.area)){if(eyes.some(e=>Math.abs((e.l+e.r-blob.l-blob.r)/2)<w*.16))continue;eyes.push(blob);if(eyes.length===2)break;}
 for(const e of eyes){const pad=Math.max(3,w*.04),vertical=Math.max(2,h*.012),x=e.l-pad,y=e.t-vertical,ew=e.r-e.l+1+pad*2,eh=e.b-e.t+1+vertical*2;
  c.save();c.beginPath();c.ellipse(x+ew/2,y+eh/2,ew/2,eh/2,0,0,Math.PI*2);c.clip();c.drawImage(original,x,y+eh+2,ew,Math.max(3,eh*.18),x,y,ew,eh);c.restore();
  c.strokeStyle='#412a24';c.lineWidth=Math.max(1,h*.007);c.lineCap='round';c.beginPath();c.moveTo(x+ew*.16,y+eh*.55);c.quadraticCurveTo(x+ew*.5,y+eh*.76,x+ew*.84,y+eh*.55);c.stroke();
 }
 cache.set(key,out);return out;
}
