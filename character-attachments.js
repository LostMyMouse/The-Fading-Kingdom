import {handAnchor,pixelAnchor} from './character-rig.js';
// Original code-drawn basket; its handle meets the animated hand in every view.
export function drawCarryBasket(c,x,y,pose={},handles=true){
 const hand=handAnchor(pose),[hx,hy]=pixelAnchor(c,x+hand.x,y+hand.y);
 c.save();c.translate(hx,hy);c.fillStyle='#624b35';c.fillRect(-3.5,2,7,6);
 c.fillStyle='#bd9b65';c.fillRect(-3,2,6,5);c.fillStyle='#ead09a';c.fillRect(-3.5,2,7,1);
 if(handles){c.fillRect(-3.5,-1,1,4);c.fillRect(2.5,-1,1,4);c.fillRect(-2.5,-2,5,1);}
 c.fillStyle='#987348';c.fillRect(-2,4,4,1);c.restore();
}
