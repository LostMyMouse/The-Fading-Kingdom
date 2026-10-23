// Measured source bounds, not assumed equal generator cells. No character art here.
export const PROPS={
 oak:[36,62,287,323,68],pine:[370,49,223,334,48],bench:[643,200,272,164,40],chest:[1009,212,182,147,22],
 fence:[48,496,275,147,32],post:[456,434,60,265,7],lantern:[1051,426,124,258,18],
 seedling:[113,811,125,107,13],growing:[395,771,164,153,15],carrot:[693,731,183,202,16],flowers:[976,759,213,174,20],
 log:[39,1053,273,134,36],rock:[370,1027,225,175,29],planter:[643,991,272,211,30],well:[986,970,220,249,32]
};
const load=path=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('An environment image could not load.'));im.src=new URL(path,import.meta.url).href;});
export async function prepareEnvironment(){
 const [props,terrain,cottage]=await Promise.all([load('./assets/environment/outdoor-props-v1.png'),load('./assets/environment/terrain-v1.png'),load('./view-proof/cottage-front.png')]);
 const patterns=[];
 for(let i=0;i<4;i++){const tile=document.createElement('canvas');tile.width=tile.height=64;const c=tile.getContext('2d');c.imageSmoothingEnabled=false;const half=terrain.width/2;c.drawImage(terrain,(i%2)*half,Math.floor(i/2)*half,half,half,0,0,64,64);patterns.push(tile);}
 const tmp=document.createElement('canvas');tmp.width=cottage.width;tmp.height=cottage.height;const c=tmp.getContext('2d',{willReadFrequently:true});c.drawImage(cottage,0,0);const data=c.getImageData(0,0,tmp.width,tmp.height).data;let l=tmp.width,t=tmp.height,r=0,b=0;
 for(let y=0;y<tmp.height;y++)for(let x=0;x<tmp.width;x++)if(data[(y*tmp.width+x)*4+3]>20){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
 return {props,patterns,cottage,cottageRect:[l,t,r-l+1,b-t+1]};
}
export function drawProp(c,art,name,x,y,width=PROPS[name][4]){const [sx,sy,sw,sh]=PROPS[name],h=Math.round(width*sh/sw);c.drawImage(art.props,sx,sy,sw,sh,Math.round(x-width/2),Math.round(y-h),width,h);}
export function drawCottage(c,art,x,y){const w=128,h=Math.round(w*art.cottageRect[3]/art.cottageRect[2]);c.drawImage(art.cottage,...art.cottageRect,x-w/2,y-h,w,h);}
