import {handAnchor,pixelAnchor} from './character-rig.js';
// Original code-drawn basket; its handle meets the animated hand in every view.
export function drawCarryBasket(c,x,y,pose={},handles=true){
 const hand=handAnchor(pose),[hx,hy]=pixelAnchor(c,x+hand.x,y+hand.y);
 c.save();c.translate(hx,hy);const top=handles?2:0;c.fillStyle='#624b35';c.fillRect(-3.5,top,7,6);
 c.fillStyle='#bd9b65';c.fillRect(-3,top,6,5);c.fillStyle='#ead09a';c.fillRect(-3.5,top,7,1);
 if(handles){c.fillRect(-3.5,-1,1,4);c.fillRect(2.5,-1,1,4);c.fillRect(-2.5,-2,5,1);}
 c.fillStyle='#987348';c.fillRect(-2,top+2,4,1);c.restore();
}
