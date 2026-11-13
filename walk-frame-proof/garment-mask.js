import {materialRamp} from '../player-layered.js';
import {SHIRTS} from '../model.js';
import {colourBodySkin} from './character-colour.js';
import {skinRegions} from './skin-regions.js';

// A bounded material selection, not a whole-character hue shift. Each source
// cell has its own foot registration. Cream sleeves, skin and brown outlines
// are excluded by the sage material predicate; the head is outside the bounds.
export function garmentMask(pixels,width,height,geometry){
 if(pixels.length!==width*height*4)throw Error('Invalid pixel dimensions');
 const mask=new Uint8Array(width*height);
 for(let f=0;f<4;f++){
  const [cx,cy,cw,ch]=geometry.rects[f],foot=geometry.anchors[f][1];
  const top=Math.max(0,Math.ceil(foot-geometry.height*.47));
  const bottom=Math.min(ch,Math.floor(foot-geometry.height*.16));
  for(let y=top;y<bottom;y++)for(let x=0;x<cw;x++){
   const px=cx+x,py=cy+y;if(px>=width||py>=height)continue;
   const n=py*width+px,i=n*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
   if(pixels[i+3]>=100&&g>=r*.80&&g>b*1.35&&(r+g+b)/3>55)mask[n]=1;
  }
 }
 return mask;
}

// Never mutate source pixels or alpha. Palette indices are deliberately
// restricted to the existing creator's six clothing choices.
export function colourGarment(pixels,mask,palette=-1,showMask=false){
 if(pixels.length!==mask.length*4)throw Error('Invalid mask dimensions');
 const result=new Uint8ClampedArray(pixels),hex=SHIRTS[palette];
 if(!hex&&!showMask)return result;
 const ramp=hex?materialRamp(hex):null;
 for(let n=0;n<mask.length;n++)if(mask[n]===1){
  const i=n*4;
  if(showMask){result[i]=230;result[i+1]=40;result[i+2]=210;continue;}
  const light=.299*pixels[i]+.587*pixels[i+1]+.114*pixels[i+2];
  const t=Math.max(0,Math.min(4,(light-48)/34)),a=Math.floor(t),b=Math.min(4,a+1),mix=t-a;
  for(let k=0;k<3;k++)result[i+k]=Math.round(ramp[a][k]*(1-mix)+ramp[b][k]*mix);
 }
 return result;
}

export function garmentCanvas(image,geometry,palette=-1,showMask=false,skin=-1,key){
 if(palette===-1&&!showMask&&skin===-1)return image;
 const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
 const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
 const data=c.getImageData(0,0,canvas.width,canvas.height),mask=garmentMask(data.data,canvas.width,canvas.height,geometry);
 if(skin!==-1)colourBodySkin(data.data,canvas.width,geometry,skinRegions(key,geometry),skin);
 data.data.set(colourGarment(data.data,mask,palette,showMask));c.putImageData(data,0,0);return canvas;
}
