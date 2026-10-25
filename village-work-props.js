export const WORK_PROP_RECTS={cart:[56,124,602,380],boards:[734,241,480,267],stall:[93,577,607,559],bedside:[821,714,375,419]};
let atlas=null,loading=null;
export function prepareWorkProps(){if(loading)return loading;loading=new Promise(resolve=>{const im=new Image();im.onload=()=>{atlas=im;resolve(true);};im.onerror=()=>{loading=null;resolve(false);};im.src=new URL('./assets/environment/village-work-props-v1.png',import.meta.url).href;});return loading;}
export function drawWorkProp(c,id,x,y,width){if(!atlas)return false;const r=WORK_PROP_RECTS[id],h=Math.round(width*r[3]/r[2]);c.drawImage(atlas,...r,Math.round(x-width/2),Math.round(y-h),width,h);return true;}
export function drawWorkCart(c,s){if(!atlas)return false;drawWorkProp(c,'cart',18*16+8,17*16,44);if(s.story.timber!=='taken')drawWorkProp(c,'boards',20*16+8,17*16+8,18);return true;}
export function drawMarketStall(c,s){if(!atlas)return false;drawWorkProp(c,'stall',6*16+8,17*16,50);for(let j=0;j<(s.economy.lastBatch==='small'?2:5);j++){c.fillStyle='#c28a4f';c.fillRect(5*16+5+j*7,16*16-3,5,4);c.fillStyle='#efd09a';c.fillRect(5*16+6+j*7,16*16-3,2,1);}return true;}
