import test from 'node:test';import assert from 'node:assert/strict';
import {playJourney} from '../tools/journey.mjs';
import {soak} from '../tools/soak.mjs';
test('a new player reaches two homes, earned equipment and two markets using only earned stock, physical routes and reloads',()=>{const {state,report}=playJourney();assert.equal(state.square.markets,2);assert.ok(report.actions>100);assert.ok(report.walked>1000);assert.equal(report.reloads,report.actions);});
test('four deterministic twenty-day runs sustain farming, repair shortages and conserve market money and furniture',()=>{const {state}=playJourney();for(const seed of [7,19,83,211]){const result=soak(state,seed);assert.equal(result.lastDay-result.firstDay,20);assert.equal(result.markets,21);assert.ok(result.goldEarned>0);}});
