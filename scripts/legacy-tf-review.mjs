// Read-only production comparison. Never uploads or deploys anything.
import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const version='fdd7cb638f68',root='/tmp/kinenest-review-baseline',files=[];
async function walk(dir){for(const entry of await readdir(root+'/'+dir,{withFileTypes:true})){const path=dir+'/'+entry.name;if(entry.isDirectory())await walk(path);else files.push(path);}}
await walk('src');await walk('public');const records=[];let next=0;
await Promise.all(Array.from({length:4},async()=>{while(next<files.length){const path=files[next++],local=await readFile(root+'/'+path),response=await fetch('https://kinenest.com/assets/'+version+'/'+path);assert(response.ok,path+' '+response.status);const deployed=Buffer.from(await response.arrayBuffer());assert(local.equals(deployed),'Production differs: '+path);records.push({path,bytes:local.length,sha256:createHash('sha256').update(local).digest('hex')});}}));
await mkdir('artifacts/review',{recursive:true});await writeFile('artifacts/review/production-assets.json',JSON.stringify({version,commit:'2ae347acc02c98b3cfaa96715ce79c27f1bb78e3',files:records.sort((a,b)=>a.path.localeCompare(b.path))},null,2));console.log('PASS '+records.length+' assets byte-identical to current production');
