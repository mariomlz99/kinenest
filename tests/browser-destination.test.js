import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesDestination,destinationExpression} from '../scripts/browser-destination.mjs';

test('browser acceptance recognizes canonical Core URLs without accepting wrong destinations',()=>{
  const base='https://example.test/session-02.html',lesson='session-02-01-subscriber';
  assert.equal(matchesDestination(base+'?lesson='+lesson,base,lesson,lesson),true);
  assert.equal(matchesDestination(base,base,null,lesson),true);
  for(const actual of [base+'?lesson=session-02-04-avoidance',base+'?lesson='+lesson+'&extra=1',base+'?lesson='+lesson+'#other','https://elsewhere.test/session-02.html?lesson='+lesson])assert.equal(matchesDestination(actual,base,lesson,lesson),false);
  assert.equal(matchesDestination(base+'?lesson='+lesson,base,'session-02-04-avoidance',lesson),false);
  assert.equal(matchesDestination(base+'?lesson='+lesson,base+'?lesson=session-02-04-avoidance',lesson,lesson),false);
  assert.match(destinationExpression(base),/session-02-01-subscriber/);
  assert.equal(matchesDestination('https://example.test/about.html?lesson='+lesson,'https://example.test/about.html',lesson,null),false);
});
