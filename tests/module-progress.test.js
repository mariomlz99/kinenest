import test from 'node:test';
import assert from 'node:assert/strict';
import {sessionProgress} from '../src/module-progress.js';
test('homepage totals follow the course even when the playground is the active session',()=>{
 assert.deepEqual(sessionProgress({ui:{unitIndex:1,progress:[0,1]}}),[0,1]);
 assert.deepEqual(sessionProgress({ui:{unitIndex:7,progress:[]},other:{ui:{unitIndex:2,progress:[0,1,2]}}}),[0,1,2]);
 assert.deepEqual(sessionProgress(undefined),[]);
});
