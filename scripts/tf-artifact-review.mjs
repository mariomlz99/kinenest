import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile('tests/fixtures/production-assets-fdd7cb638f68.json','utf8'));
for(const {path,sha256}of manifest.files){const contents=await readFile('dist/assets/'+manifest.version+'/'+path);assert.equal(createHash('sha256').update(contents).digest('hex'),sha256,path);}
const build=JSON.parse(await readFile('dist/build-info.json','utf8'));const html=await readFile('dist/basics.html','utf8');assert(html.includes('assets/'+build.assetVersion+'/src/app.js'));assert(!html.includes('assets/'+manifest.version+'/src/app.js'));
console.log('PASS current candidate HTML and all '+manifest.files.length+' retained production assets');
