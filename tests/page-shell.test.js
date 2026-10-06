import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pageSession,pageTitle,brandMark} from '../src/ui/product.js';
import {pageShell} from '../src/ui/page-shell.js';

test('landing and explicit session routes have distinct identity',()=>{
 assert.equal(pageSession('/'),null);assert.equal(pageSession('/index.html'),null);
 for(let i=1;i<=6;i++)assert.equal(pageSession('/prefix/session-0'+i+'.html'),String(i));
 assert.equal(pageSession('/session-07.html'),null);
 assert.equal(pageTitle(null,'about.html'),'KineNest — About');
 assert.equal(pageTitle(null,'real-ros.html'),'KineNest — Transition to native ROS 2');
 assert.equal(pageTitle(null,'bridge.html'),'KineNest — From KineNest to ROS 2');
 assert.match(brandMark(),/class="brand-tagline" data-product-tagline>A safe place/);
});
test('every public source has a synchronized first-paint shell and no-JS escape',async()=>{
 for(const name of ['index.html','session-01.html','session-02.html','session-03.html','session-04.html','session-05.html','session-06.html','bridge.html','about.html','licences.html','real-ros.html']){
  const html=await readFile(new URL('../'+name,import.meta.url),'utf8');
  assert.equal(pageShell(html),html,name+': run scripts/sync-page-shell.mjs');
  assert.ok(html.indexOf('<meta charset="utf-8">')<100,name+': declare encoding before the bootstrap');
  assert.ok(html.indexOf('<!-- kn:head -->')<html.indexOf('rel="stylesheet"'),name+': theme must precede CSS');
  assert.match(html,/<body[^>]*><!-- kn:cover -->/);
  assert.doesNotMatch(html.match(/<html[^>]*>/)[0],/data-kinenest-boot/,'Without JS the content must stay visible');
  assert.match(html,/class="brand-tagline" data-product-tagline/);
 }
 const landing=await readFile(new URL('../index.html',import.meta.url),'utf8');
 assert.match(landing,/class="primary start-course" href="\.\/session-01.html"/);
 assert.doesNotMatch(landing,/id="python-code"|id="mission-title"/);
 assert.match(await readFile(new URL('../session-01.html',import.meta.url),'utf8'),/id="world"/);
});
