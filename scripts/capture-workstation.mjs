import http from 'node:http';
import {readFile,writeFile,mkdtemp,mkdir,rm} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url)),output=path.resolve(process.argv[2]??'/tmp/kinenest-captures');await mkdir(output,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(req.url.split('?')[0]).replace(/^\/ros2learn\//,'')||'index.html',file=path.resolve(root,name);if(!file.startsWith(root))throw Error('Invalid path');res.setHeader('Content-Type',({'.svg':'image/svg+xml','.png':'image/png','.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.py':'text/plain'})[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=process.argv[3]??('http://127.0.0.1:'+server.address().port+'/ros2learn/');
const profile=await mkdtemp(path.join(tmpdir(),'kinenest-capture-')),browser=spawn('google-chrome',['--headless','--disable-gpu','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:'ignore'}),wait=ms=>new Promise(r=>setTimeout(r,ms));
let socket;
try{
 let port;for(let i=0;i<100;i++){try{port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await wait(100);}}if(!port)throw Error('Chrome debugging port unavailable');
 const targets=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});let id=0;const pending=new Map();socket.onmessage=event=>{const message=JSON.parse(event.data);if(pending.has(message.id)){const [resolve,reject]=pending.get(message.id);pending.delete(message.id);message.error?reject(Error(message.error.message)):resolve(message.result);}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,[resolve,reject]);socket.send(JSON.stringify({id:n,method,params}));});
 const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.text);return result.result.value;};
 await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
 const cases=[['index.html','en','dark'],['session-02.html','en','dark'],['session-02.html?experimentalCpp=1','it','light',0,1440,true],['session-02.html?experimentalCpp=1','de','dark',0,1100,true],['session-03.html','it','light',3,1100],['session-05.html','it','light',2,1100],['session-03.html','en','dark'],['session-05.html','en','light'],['session-06.html','en','dark'],['session-05.html','en','dark',2],...['es','de','pt','it'].flatMap(lang=>['index.html','session-03.html','session-05.html'].map(page=>[page,lang,lang==='de'?'light':'dark']))];
 const audits=[];
 for(const [page,lang,theme,lessonIndex=3,width=1440,compare=false]of cases){
  await call('Emulation.setDeviceMetricsOverride',{width,height:1100,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:base+page});let ready=false;for(let i=0;i<150;i++){ready=await evaluate('!!document.getElementById("language") && !!document.getElementById("check") && !document.getElementById("check").disabled');if(ready)break;await wait(100);}if(!ready)throw Error('Page not ready: '+page);
  if(page==='session-05.html'){await evaluate('document.getElementById("lesson-select").selectedIndex='+lessonIndex+';document.getElementById("lesson-select").dispatchEvent(new Event("change"))');for(let i=0;i<150;i++){if(await evaluate('document.body.dataset.lessonState==="ready"'))break;await wait(100);}}
  await evaluate('(()=>{const l=document.getElementById("language");l.value='+JSON.stringify(lang)+';l.dispatchEvent(new Event("change"));if(document.documentElement.dataset.theme!=='+JSON.stringify(theme)+')document.getElementById("theme").click();window.scrollTo(0,0);})()');await wait(300);
  if(compare)await evaluate("document.querySelector('[data-code-language=compare]').click()");await wait(100);
  const name=page.split('?')[0].replace('.html','')+'-'+lang+'-'+theme+(compare?'-compare':'')+'-'+width+'.png';const shot=await call('Page.captureScreenshot',{format:'png'});await writeFile(path.join(output,name),Buffer.from(shot.data,'base64'));
  if(page==='session-05.html'&&lessonIndex===2){await evaluate('window.scrollTo(0,600)');const detail=await call('Page.captureScreenshot',{format:'png'});await writeFile(path.join(output,'session-05-tf-details.png'),Buffer.from(detail.data,'base64'));await evaluate('window.scrollTo(0,0)');}
  const audit=await evaluate('({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth>window.innerWidth,title:document.title,mission:document.getElementById("mission-title").textContent,steps:[...document.querySelectorAll("#steps li")].map(e=>e.textContent),legacy:/ROS2Learn|KineCourse|Lab 01/.test(document.body.textContent)})');if(audit.overflow||audit.legacy||audit.lang!==lang)throw Error('Visual acceptance failed: '+JSON.stringify({page,...audit}));audits.push({page,lang,theme,...audit});console.log(name+' '+JSON.stringify(audit));
 }
 await writeFile(path.join(output,'audit.json'),JSON.stringify(audits,null,2));
}finally{socket?.close();browser.kill();server.close();await wait(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});}
