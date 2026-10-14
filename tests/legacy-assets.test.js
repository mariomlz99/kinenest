import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';import {createHash} from 'node:crypto';
for(const name of readdirSync(new URL('./fixtures/',import.meta.url)).filter(name=>/^production-assets-.*\.json$/.test(name))){
 const manifest=JSON.parse(readFileSync(new URL('./fixtures/'+name,import.meta.url),'utf8'));
 test('released assets '+manifest.version+' are immutable and available to clean-build packaging',()=>{
  assert(manifest.files.length>0);
  for(const {path,sha256,bytes}of manifest.files){const content=readFileSync(new URL('../legacy-assets/'+manifest.version+'/'+path,import.meta.url));assert.equal(content.length,bytes,path);assert.equal(createHash('sha256').update(content).digest('hex'),sha256,path);}
 });
}
