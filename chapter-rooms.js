// Shared, measured floor plans: rendering and collision use the same furniture.
export const ROOM_LAYOUT=2;
const piece=(id,left,top,w,h,width,role=id)=>({id,role,left,top,w,h,width,x:(left+w/2)*16,y:(top+h)*16});
export function roomFurniture(room){
 if(room==='home')return [piece('bed',2,3,2,3,32),piece('chest',5,3,1,1,16),piece('bookcase',6,3,2,1,28),piece('mirror',13,3,1,1,18),piece('table',12,8,3,2,44),piece('chair',13,7,1,1,14)];
 const counters=[piece('counter',2,3,2.5,1,40,'counter-left'),piece('counter',4.5,3,2.5,1,40,'counter-middle'),piece('counter',7,3,2.5,1,40,'counter-right')];
 return [...counters,...(room==='bakery'?[piece('oven',10,3,2,1,30)]:[piece('cupboard',10,3,2,1,24)]),piece('bookcase',12,3,2,1,28),piece('bedside',14,3,1,1,16),piece('bed',15,3,2,3,32),piece('table',6,8,3,2,44),piece('chair',7,7,1,1,14),piece('pantry',1,8,2,2,28)];
}
export function furnitureBlocked(room,x,y){return roomFurniture(room).some(p=>x>=p.left&&x<p.left+p.w&&y>=p.top&&y<p.top+p.h);}
export function roomReserved(room,x,y){return y===12||y===5||x>=10&&x<=12&&y>=5&&y<=7||x===11&&y===4||x===9&&y===9||room!=='home'&&((x===15&&y===6)||(x===14&&y===4))||room==='home'&&x>=2&&x<=6&&y>=4&&y<=7;}
export const roomGoals=room=>room==='home'?[{x:3,y:7},{x:5,y:5},{x:13,y:5}]:[{x:4,y:5},{x:11,y:5},{x:11,y:7},{x:11,y:4},{x:10,y:6},{x:9,y:9},{x:15,y:6},{x:14,y:4},...(room==='bakery'?[{x:3,y:10}]:[])];
