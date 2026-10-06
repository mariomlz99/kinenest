import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CORE_EXERCISES,FURTHER_EXERCISES,FURTHER_PREREQUISITES,lessonHref} from '../src/ui/curriculum.js';
const catalogs=[2,3,4,5,6].flatMap(n=>JSON.parse(readFileSync(new URL('../public/lessons/session-0'+n+'.json',import.meta.url))));
test('Core and Further paths preserve every existing coding exercise exactly once',()=>{
 assert.equal(CORE_EXERCISES.length,15);assert.equal(FURTHER_EXERCISES.length,10);
 const ids=[...CORE_EXERCISES,...FURTHER_EXERCISES];assert.equal(new Set(ids).size,25);
 assert.deepEqual([...ids].sort(),catalogs.map(e=>e.id).sort());
 for(const id of ids){assert.equal(JSON.parse(readFileSync(new URL('../public/lessons/'+id+'.json',import.meta.url))).id,id);assert.match(lessonHref(id),/^\.\/session-0[2-6]\.html\?lesson=session-/);}
 assert.ok(CORE_EXERCISES.includes('session-03-05-services'));assert.ok(CORE_EXERCISES.includes('session-05-04-relative'));
 assert.ok(!CORE_EXERCISES.includes('session-06-03-beacon'));
 for(const id of FURTHER_EXERCISES)assert.ok(FURTHER_PREREQUISITES[id].every(prerequisite=>ids.includes(prerequisite)));
});
