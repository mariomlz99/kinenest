import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,readdir,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

test('production build excludes reference answers and versions all application assets',async()=>{
 const root=new URL('../',import.meta.url);await promisify(execFile)(process.execPath,['scripts/build.mjs'],{cwd:fileURLToPath(root)});
 const files=await readdir(new URL('dist/',root));assert.deepEqual(files.sort(),['LICENSE','NOTICE','assets','index.html','session-03.html']);
 const versions=await readdir(new URL('dist/assets/',root));assert.equal(versions.length,1);assert.match(versions[0],/^[a-f0-9]{12}$/);
 const html=await readFile(new URL('dist/session-03.html',root),'utf8');assert.ok(html.includes('./assets/'+versions[0]+'/src/ui/session3-boot.js'));
 await access(new URL('dist/assets/'+versions[0]+'/src/python/compat.py',root));
 await assert.rejects(access(new URL('dist/tests/python/solution-1.py',root)));
 const lesson=JSON.parse(await readFile(new URL('dist/assets/'+versions[0]+'/public/lessons/session-03-03-color-detection.json',root),'utf8'));assert.ok(lesson.starterCode.includes('TODO'));assert.equal(lesson.solution,undefined);
});
