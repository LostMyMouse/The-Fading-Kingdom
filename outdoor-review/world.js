export const WIDTH=24,HEIGHT=20,TILE=16;
export const HOME={x:128,y:142};
export const DECOR=[
 ['oak',40,106,2,6],['pine',328,126,20,7],['oak',352,275,22,17],['pine',38,295,2,18],
 ['bench',266,218,16,13],['well',247,156,15,9],['chest',178,148,11,9],['lantern',198,154,12,9],
 ['planter',72,151,4,9],['flowers',58,168],['flowers',289,228],['flowers',219,295],
 ['log',305,305,19,18],['rock',298,90,18,5],['rock',44,225,2,14],
 ['fence',72,263,4,16],['fence',104,263,6,16],['fence',72,180,4,10],['fence',104,180,6,10]
];
export const STOPS={mara:[{x:11,y:11},{x:8,y:15},{x:14,y:14}],orin:[{x:16,y:14},{x:18,y:11},{x:15,y:16}]};
export const SPAWN={x:10,y:13};
export const point=p=>({x:p.x*TILE+8,y:p.y*TILE+14});
export function blocked(p){
 if(!Number.isInteger(p.x)||!Number.isInteger(p.y)||p.x<1||p.y<1||p.x>=WIDTH-1||p.y>=HEIGHT-1)return true;
 if(p.x>=4&&p.x<=9&&p.y>=3&&p.y<=8)return true;
 return DECOR.some(([,x,y,tx,ty])=>tx!==undefined&&p.y===ty&&Math.abs(p.x-tx)<=(x===266?1:0));
}
export function route(from,to){
 if(blocked(from)||blocked(to))return null;const key=p=>p.x+','+p.y,queue=[from],seen=new Map([[key(from),null]]);let i=0;
 while(i<queue.length){const p=queue[i++];if(p.x===to.x&&p.y===to.y){const out=[];let q=p;while(seen.get(key(q))){out.unshift(q);q=seen.get(key(q));}return out;}
  for(const [dx,dy]of [[0,1],[1,0],[0,-1],[-1,0]]){const q={x:p.x+dx,y:p.y+dy},k=key(q);if(!blocked(q)&&!seen.has(k)){seen.set(k,p);queue.push(q);}}
 }return null;
}
