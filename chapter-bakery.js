// A remembered shared job, never a friendship score or a repeating gift reward.
export const PORCH_COST=16;
export const BAKERY_LINES={
 ask:'Orin’s asked for lunch for his workshop. I’ve got the flour, but my carrot patch is mostly ambition. Could you bring two carrots before the next batch?',
 accept:'Brilliant. Two carrots, here at the kitchen counter. I’ll keep the mixing bowl handy.',
 decline:'No worries. I’ll make his usual loaf. There’s always another lunch.',
 waiting:'Got those two carrots? The bowl’s ready when you are.',
 late:'I made Orin a plain loaf this time. He was hungry! Bring the carrots when you have them. We can do his next lunch.',
 delivered:'These are lovely! I’ll get Orin’s lunch in the oven. You grow, I bake. Good team, us.',
 ready:'Orin’s tray is ready for the next delivery. I saved the wonky one for myself.',
 done:'Orin brought the tray back empty. Even the crumbs. I think our carrot buns went down well.',
 porch:'People keep stopping for a chat now. Shall we brighten up the windows? Orin’s got spare offcuts for the boxes. The village fund can cover the rest.',
 built:'Look at that. Flowers in the windows and a light for anyone coming home. Feels like we’re staying, doesn’t it?'
};
export function initialBakery(){return {order:{state:'none',promisedDay:0,deliveredDay:0,completedDay:0},porch:false};}
export function orderAvailable(s){return s.house?.stage===3&&s.story.cooked&&s.economy.fullDays>0&&!['held','used','replacement'].includes(s.economy.flour.state);}
export function bakeryAction(s,id){const b=s.economy.bakery,o=b.order;
 switch(id){
 case 'promiseLunch':if(o.state!=='none')return BAKERY_LINES[o.state==='late'?'late':'waiting'];if(!orderAvailable(s))return 'Let’s get the usual morning batch sorted first.';o.state='promised';o.promisedDay=s.day;return BAKERY_LINES.accept;
 case 'deliverLunch':if(!['promised','late'].includes(o.state))return o.state==='done'?BAKERY_LINES.done:'Have a word with Mara about the workshop lunch first.';if(s.room!=='bakery'||Math.abs(s.player.x-4)+Math.abs(s.player.y-5)>1)return 'Bring the carrots to the kitchen counter.';if(s.inventory.carrot<2)return 'Two carrots for the tray. No rush — the garden takes its own time.';if(['held','used','replacement'].includes(s.economy.flour.state))return 'Let’s put flour back on the shelf first. We’ll need it for the morning orders and Orin’s lunch.';s.inventory.carrot-=2;o.state='ready';o.deliveredDay=s.day;return BAKERY_LINES.delivered;
 case 'brightenBakery':if(b.porch)return BAKERY_LINES.built;if(o.state!=='done'||s.economy.fullDays<2)return 'Let’s get a couple of batches and that workshop lunch out first.';if(s.economy.gold<PORCH_COST)return `The window boxes and lights need ${PORCH_COST} village gold.`;s.economy.gold-=PORCH_COST;b.porch=true;s.economy.ledger.push({day:s.day,kind:'porch',amount:-PORCH_COST});s.economy.ledger=s.economy.ledger.slice(-8);return BAKERY_LINES.built;
 default:return null;
 }
}
export function settleLunch(s){const o=s.economy.bakery.order;if(o.state==='promised')o.state='late';if(o.state!=='ready'||s.economy.lastBatch!=='full')return 0;o.state='done';o.completedDay=s.day;return 4;}
export function readBakery(value,day,int){const b=value===undefined?initialBakery():value,o=b?.order;if(!b||typeof b.porch!=='boolean'||!o||!['none','promised','late','ready','done'].includes(o.state)||['promisedDay','deliveredDay','completedDay'].some(k=>!int(o[k],0,day)))throw Error('Invalid bakery memories');if(o.state!=='none'&&o.promisedDay<1||['ready','done'].includes(o.state)&&o.deliveredDay<o.promisedDay||o.state==='done'&&o.completedDay<o.deliveredDay||b.porch&&o.state!=='done')throw Error('Invalid bakery order');return {porch:b.porch,order:{state:o.state,promisedDay:o.promisedDay,deliveredDay:o.deliveredDay,completedDay:o.completedDay}};}
