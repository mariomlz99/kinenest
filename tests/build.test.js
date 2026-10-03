import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,readdir,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

test('production build excludes reference answers and versions all application assets',async()=>{
 const root=new URL('../',import.meta.url);await promisify(execFile)(process.execPath,['scripts/build.mjs'],{cwd:fileURLToPath(root)});
 const files=await readdir(new URL('dist/',root));assert.deepEqual(files.sort(),['LICENSE','NOTICE','about.html','assets','build-info.json','index.html','licences.html','real-ros.html','session-02.html','session-03.html','session-04.html','session-05.html','session-06.html']);
 const info=JSON.parse(await readFile(new URL('dist/build-info.json',root),'utf8'));assert.equal(info.project,'KineNest');assert.match(info.commit,/^[a-f0-9]{40}$/);assert.ok(Number.isFinite(Date.parse(info.builtAt)));assert.equal(typeof info.dirty,'boolean');assert.deepEqual(Object.keys(info).sort(),['assetVersion','builtAt','commit','dirty','project']);
 const versions=await readdir(new URL('dist/assets/',root));assert.equal(versions.length,1);assert.equal(info.assetVersion,versions[0]);assert.match(versions[0],/^[a-f0-9]{12}$/);
 const html=await readFile(new URL('dist/session-03.html',root),'utf8');assert.ok(html.includes('./assets/'+versions[0]+'/src/ui/session3-boot.js'));
 await access(new URL('dist/assets/'+versions[0]+'/src/python/compat.py',root));
 for(const file of ['bridge.js','compat.hpp','toolchain.js','worker.js','vendor/wasm-clang.js','vendor/LICENSE','vendor/LICENSE.llvm'])await access(new URL('dist/assets/'+versions[0]+'/src/cpp/'+file,root));
 for(const theme of ['light','dark'])await access(new URL('dist/assets/'+versions[0]+'/public/assets/brand/kinenest-logo-'+theme+'.png',root));
 const source=JSON.parse(await readFile(new URL('dist/assets/'+versions[0]+'/public/assets/brand/source.json',root),'utf8'));assert.equal(source.tagline,'A safe place to learn robotics by making things move.');
 await assert.rejects(access(new URL('dist/tests/python/solution-1.py',root)));
 await assert.rejects(access(new URL('dist/experiments/',root)));
 for(const name of files.filter(name=>name.endsWith('.html'))){
  const page=await readFile(new URL('dist/'+name,root),'utf8');
  assert.match(page,/<title>KineNest/);assert.ok(page.includes('an Italian soul'));for(const url of ['https://www.linkedin.com/in/mario-malizia/','https://chatgpt.com/','https://openai.com/','https://buymeacoffee.com/mariomlz99'])assert.ok(page.includes('href="'+url+'"'));assert.doesNotMatch(page,/ROS2Learn|Lab 01|LAB 01|KineCourse|KineNest preliminary candidate/);
  assert.ok(page.includes('property="og:title" content="KineNest'));
  assert.ok(page.includes('/ros2learn/assets/'+versions[0]+'/public/assets/brand/social-preview.png'));
  assert.ok(page.includes('rel="canonical" href="https://mariomlz99.github.io/ros2learn/'+(name==='index.html'?'':name)+'"'));
  await access(new URL('dist/assets/'+versions[0]+'/public/assets/brand/social-preview.png',root));
 }
 const lesson=JSON.parse(await readFile(new URL('dist/assets/'+versions[0]+'/public/lessons/session-03-03-color-detection.json',root),'utf8'));assert.ok(lesson.programming.python.starterCode.includes('TODO'));assert.equal(lesson.solution,undefined);
});
