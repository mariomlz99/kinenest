import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const socket=net.createServer();await new Promise(resolve=>socket.listen(0,'127.0.0.1',resolve));
const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
let log='',failure;const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--local','--ip','127.0.0.1','--port',String(port)],{cwd:root,env:{...process.env,WRANGLER_SEND_METRICS:'false'},stdio:['ignore','pipe','pipe']});
for(const stream of [child.stdout,child.stderr])stream.on('data',data=>log=(log+data).slice(-12000));
child.on('error',error=>failure=error);child.on('exit',code=>{failure??=Error('Wrangler exited '+code);});
const base='http://127.0.0.1:'+port;
try{
 let ready=false;
 for(let i=0;i<150;i++){if(failure)throw failure;try{const r=await fetch(base+'/build-info.json',{signal:AbortSignal.timeout(500)});if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
 assert.ok(ready,'Workers local server did not start');
 for(const path of ['/','/index.html','/session-01.html','/session-02.html','/session-03.html','/session-04.html','/session-05.html','/session-06.html','/about.html','/licences.html','/real-ros.html']){
  const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,200,path);assert.match(r.headers.get('content-type'),/text\/html/);
  assert.equal(await r.text(),await readFile(root+'dist/'+(path==='/'?'index.html':path.slice(1)),'utf8'),path+' must serve exact tested HTML');
 }
 const info=await(await fetch(base+'/build-info.json')).json(),asset='/assets/'+info.assetVersion;
 for(const path of ['/src/ui/transitions.css','/src/ui/session3-boot.js','/src/python/compat.py','/src/cpp/compat.hpp','/src/cpp/vendor/wasm-clang.js','/public/lessons/session-02-01-subscriber.json'])assert.equal((await fetch(base+asset+path,{redirect:'manual'})).status,200,path);
 for(const path of ['/missing','/tests/python/solution-1.py','/docs/review/FINAL_REVIEW_REPORT.md','/.git/config'])assert.equal((await fetch(base+path,{redirect:'manual'})).status,404,path);
 console.log('PASS Workers static assets: root rewrite, ten exact HTML pages, versioned runtime assets and real 404s; no application Worker');
}catch(error){console.error(log);throw error;}finally{child.kill();await new Promise(resolve=>{if(child.exitCode!==null)return resolve();child.once('exit',resolve);});}
