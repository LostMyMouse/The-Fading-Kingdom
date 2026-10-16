import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const bootstrap=html.match(/<script>([\s\S]*?)<\/script>/)[1];
test('assets resolve inside the game for clean URLs, folders and index.html',()=>{
 for(const path of ['/games/the-fading-kingdom','/games/the-fading-kingdom/','/games/the-fading-kingdom/index.html','/']){
  let base;runInNewContext(bootstrap,{location:{pathname:path},document:{createElement:()=>({}),head:{append:el=>{base=el.href;}}}});
  const origin='https://example.test';const resolved=new URL('game.js',base?new URL(base,origin):origin+path);
  assert.equal(resolved.pathname,path==='/'?'/game.js':'/games/the-fading-kingdom/game.js');
 }
});
