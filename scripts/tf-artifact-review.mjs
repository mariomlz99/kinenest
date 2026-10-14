import assert from 'node:assert/strict';import {readFile,readdir} from 'node:fs/promises';import {createHash} from 'node:crypto';
const build=JSON.parse(await readFile('dist/build-info.json','utf8'));const html=await readFile('dist/basics.html','utf8');assert(html.includes('assets/'+build.assetVersion+'/src/app.js'));
let count=0;
for(const name of (await readdir('tests/fixtures')).filter(name=>/^production-assets-.*\.json$/.test(name))){
 const manifest=JSON.parse(await readFile('tests/fixtures/'+name,'utf8'));
 for(const {path,sha256}of manifest.files){const contents=await readFile('dist/assets/'+manifest.version+'/'+path);assert.equal(createHash('sha256').update(contents).digest('hex'),sha256,path);count++;}
 assert(!html.includes('assets/'+manifest.version+'/src/app.js'));
}
console.log('PASS current candidate HTML and all '+count+' retained production assets');
