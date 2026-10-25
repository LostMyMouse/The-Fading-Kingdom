// Keep the complete indoor walking/body range visible when it fits. Narrow
// landscape views still follow the player; outdoor placement keeps its focus.
export function verticalCamera(outside,mapHeight,viewHeight,focusY,placingHouse=false){
 if(!outside&&viewHeight>=176)return mapHeight/2-2-viewHeight/2;
 return mapHeight<viewHeight?(mapHeight-viewHeight)/2:Math.max(0,Math.min(mapHeight-viewHeight,focusY-viewHeight*(placingHouse?.35:.62)));
}
