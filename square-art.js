import {SQUARE,squareActive,squareDelay} from './chapter-square.js';
export function drawSquare(c,s){const q=s.square,active=squareActive(s),r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 for(let y=SQUARE.top;y<=SQUARE.bottom;y++)for(let x=SQUARE.left;x<=SQUARE.right;x++){
  r(x*16,y*16,16,16,q.started?(x+y)%2?'#b5b184':'#bcb68b':'#819365');
  if(!q.started&&(x+y)%3===0){r(x*16+4,y*16+8,5,2,'#969b72');r(x*16+6,y*16+5,2,5,'#6f8755');}
  if(q.started&&(x+y)%4===0)r(x*16+3,y*16+9,5,1,'#ccc59a');
 }
 const bx=SQUARE.x*16,by=SQUARE.y*16;
 if(!s.decor.some(d=>d.room==='outside'&&d.x===SQUARE.x&&d.y===SQUARE.y)){r(bx+6,by-3,3,20,'#725d40');r(bx,by-10,17,14,'#876846');r(bx+2,by-8,13,10,'#e1cf9e');r(bx+5,by-5,7,1,'#98794f');r(bx+5,by-2,5,1,'#98794f');}
 c.fillStyle='#425641';c.font='7px system-ui';c.textAlign='center';c.fillText(active?'Market day':q.opened?'Our village square':q.started?'Make it yours':'The old square',(SQUARE.x+1)*16,SQUARE.y*16-17);
 if(q.opened){for(const x of [3,14]){r(x*16+5,22*16-17,2,26,'#826b45');r(x*16+3,22*16-19,6,3,'#b69660');}
  r(3*16+6,22*16-16,11*16,1,'#796d4a');for(let j=0;j<14;j++){const x=3*16+10+j*12;r(x,22*16-15,7,4,j%3===0?'#d6ad76':j%3===1?'#829c70':'#d7c38e');r(x+2,22*16-11,3,2,j%3===0?'#d6ad76':j%3===1?'#829c70':'#d7c38e');}
 }
 if(active&&!squareDelay(s,'mara')){r(13*16+1,21*16+5,13,7,'#785e43');r(13*16+2,21*16+4,11,5,'#e4d2a3');for(let j=0;j<3;j++){r(13*16+3+j*3,21*16+3,3,3,'#ce9d5c');r(13*16+3+j*3,21*16+3,2,1,'#f0d49a');}}
}
