import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const manifest=JSON.parse(readFileSync(new URL('./fixtures/production-assets-fdd7cb638f68.json',import.meta.url),'utf8'));
test('currently released assets are immutable and available to clean-build packaging',()=>{
 assert.equal(manifest.files.length,115);
 for(const {path,sha256,bytes}of manifest.files){const content=readFileSync(new URL('../legacy-assets/'+manifest.version+'/'+path,import.meta.url));assert.equal(content.length,bytes,path);assert.equal(createHash('sha256').update(content).digest('hex'),sha256,path);}
});
