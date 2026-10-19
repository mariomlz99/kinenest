// Verify the deployed release read-only before archiving immutable URLs.
import {readdir,readFile,mkdir,writeFile,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const version=process.argv[2]||'c368e2042be8',commit=process.argv[3]||'ba78dbfd827db209d8c890985d9655f6b0052ab7';
const origin='https://kinenest.com',root='dist/assets/'+version,files=[];
const info=await fetch(origin+'/build-info.json').then(r=>r.json());assert.equal(info.commit,commit);assert.equal(info.assetVersion,version);
async function walk(dir){for(const e of await readdir(root+'/'+dir,{withFileTypes:true})){const name=dir+'/'+e.name;if(e.isDirectory())await walk(name);else files.push(name);}}
await walk('src');await walk('public');const records=[];let next=0;
await Promise.all(Array.from({length:4},async()=>{while(next<files.length){const path=files[next++],local=await readFile(root+'/'+path),response=await fetch(origin+'/assets/'+version+'/'+path);assert(response.ok,path+' '+response.status);const live=Buffer.from(await response.arrayBuffer());assert(local.equals(live),'Deployed bytes differ: '+path);records.push({path,bytes:local.length,sha256:createHash('sha256').update(local).digest('hex')});}}));
await mkdir('legacy-assets/'+version,{recursive:true});await cp(root,'legacy-assets/'+version,{recursive:true});
await writeFile('tests/fixtures/production-assets-'+version+'.json',JSON.stringify({version,commit,files:records.sort((a,b)=>a.path.localeCompare(b.path))},null,2)+'\n');
console.log('PASS '+records.length+' deployed files verified and retained; no network writes');
