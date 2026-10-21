import {writeFile,mkdir} from 'node:fs/promises';import {resolve} from 'node:path';
import {playJourney} from './journey.mjs';import {soak} from './soak.mjs';
const started=performance.now(),journey=playJourney(),runs=[7,19,83,211].map(seed=>soak(journey.state,seed));
const report={kind:'rules integration and seeded stress test; browser review recorded separately',journey:journey.report,stress:runs,durationMs:Math.round(performance.now()-started)};
if(process.argv[2]){const out=resolve(process.argv[2]);await mkdir(out,{recursive:true});await writeFile(resolve(out,'journey-report.json'),JSON.stringify(report,null,2));for(const [name,state]of Object.entries(journey.checkpoints))await writeFile(resolve(out,name.replaceAll(' ','-')+'.json'),JSON.stringify(state,null,2));}
console.log(JSON.stringify(report,null,2));
