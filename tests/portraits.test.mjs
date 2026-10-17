import test from 'node:test';
import assert from 'node:assert/strict';
import {portraitFor,EXPRESSIONS} from '../chapter-portraits.js';
import {fresh,act} from '../chapter-model.js';
test('ownership expressions appear only when a character speaks, never on ordinary pickup',()=>{
 const s=fresh();const pickup=act(s,'take');
 assert.equal(portraitFor('Boards by the cart',pickup),null);
 assert.equal(s.story.timberNoticed,false);
 assert.equal(portraitFor('Orin','Ah. There’s my wood. I was starting to blame the squirrels.').expression,'amused');
 assert.equal(portraitFor('Orin','Those boards are for the mill roof. Can you pop them back?').expression,'concerned');
 act(s,'noticeWood');assert.equal(portraitFor('Orin',act(s,'returnWood')).expression,'happy');
});
test('all atlas frames stay inside their six cells and unknown expressions safely use neutral',()=>{
 for(const name of ['Mara','Orin'])for(const [i,emotion]of EXPRESSIONS.entries()){
  const p=portraitFor(name,'',emotion);assert.equal(p.expression,emotion);
  assert.equal(p.position,(i%3*50)+'% '+Math.floor(i/3)*100+'%');
 }
 assert.equal(portraitFor('Orin','New dialogue line').expression,'neutral');
 assert.equal(portraitFor('Mara','','invalid').expression,'neutral');
});
test('happy cooking and thoughtful explanation have distinct authored expressions',()=>{
 assert.equal(portraitFor('Mara','Ooh, look at those. Careful. They’re still doing the hot-bun thing.').expression,'happy');
 assert.equal(portraitFor('Orin','Spreads the water across a short row. Same can, fewer trips. Start in the middle.').expression,'thoughtful');
});
