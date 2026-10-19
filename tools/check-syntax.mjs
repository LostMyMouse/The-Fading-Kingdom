import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));let count=0;
for(const name of await readdir(root)){
 if(name.endsWith('.js')){const result=spawnSync(process.execPath,['--check',root+name],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);count++;}
 if(name.endsWith('.html'))for(const [,code]of (await readFile(root+name,'utf8')).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){
  if(!code.trim())continue;const result=spawnSync(process.execPath,['--check','--input-type=module'],{input:code,encoding:'utf8'});if(result.status!==0)throw Error(name+': '+result.stderr);count++;
 }
}
console.log(`${count} runtime and inline scripts passed syntax checks.`);
