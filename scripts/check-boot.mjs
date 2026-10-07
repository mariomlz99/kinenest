import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {launch,wait} from './browser-driver.mjs';
import {serveDirectory} from './static-server.mjs';
const browser=process.argv[2]??'chrome',root=fileURLToPath(new URL('../',import.meta.url));
const option=name=>process.argv.find(x=>x.startsWith(name+'='))?.slice(name.length+1);
const output=option('--output')??root+'../.release-artifacts/boot-handoff';
const remote=option('--url'),server=remote?null:await serveDirectory(root+'dist',{prefix:'/'});
let fault='',slow=true;
const proxy=remote?null:http.createServer(async(req,res)=>{
 try{
  const pathname=new URL(req.url,'http://local').pathname;
  if(fault==='lesson'&&pathname.endsWith('/session-03.json')){res.writeHead(503);res.end('Unavailable');return;}
  if(fault==='module'&&pathname.endsWith('/session3-boot.js')){res.writeHead(503);res.end('Unavailable');return;}
  if(slow&&(pathname.endsWith('/boot.js')||pathname.endsWith('/session3-boot.js')||pathname.endsWith('/preferences.js')))await wait(800);
  if(slow&&pathname.includes('/lessons/'))await wait(250);
  const r=await fetch(server.url+req.url.slice(1));res.writeHead(r.status,{'Content-Type':r.headers.get('content-type'),'Cache-Control':'no-store'});res.end(Buffer.from(await r.arrayBuffer()));
 }catch{res.writeHead(502);res.end();}
});
if(proxy)await new Promise(resolve=>proxy.listen(0,'127.0.0.1',resolve));
const base=remote?.replace(/\/?$/,'/')??'http://127.0.0.1:'+proxy.address().port+'/';
const b=await launch(browser,{profileRoot:root+'../'}),results=[];
await mkdir(output,{recursive:true});
let context;
async function until(expression,timeout=15000){const end=Date.now()+timeout;let lastError;while(Date.now()<end){try{if(await b.evaluate(expression))return;}catch(error){lastError=error.message;}await wait(25);}throw Error('Timeout: '+expression+' '+(lastError??''));}
async function rawNavigate(url){return browser==='chrome'?b.command('Page.navigate',{url}):b.command('browsingContext.navigate',{context,url,wait:'none'});}
async function ready(){await until('document.documentElement.dataset.kinenestBoot==="ready"');}
async function capture(name){await writeFile(output+'/'+browser+'-'+name+'.png',Buffer.from(await b.screenshot(),'base64'));}
function monitor(){
 window.__paintStates=[];
 let prior;
 const sample=()=>{
  const r=document.documentElement,cover=document.getElementById('kn-boot-cover'),main=document.querySelector('main');
  if(cover&&main){
   const css=getComputedStyle(cover),box=cover.getBoundingClientRect(),logo=getComputedStyle(cover.querySelector('img'));
   const state={boot:r.dataset.kinenestBoot,ready:r.dataset.kinenestReady,theme:r.dataset.theme,lang:r.lang,layout:document.body.dataset.layout??null,content:getComputedStyle(main).visibility,cover:css.display,opacity:css.opacity,position:css.position,zIndex:css.zIndex,width:box.width,height:box.height,viewport:[document.documentElement.clientWidth,innerHeight],background:css.backgroundColor,pageBackground:getComputedStyle(r).backgroundColor};
   Object.assign(state,{logoAnimation:logo.animationName,logoIterations:logo.animationIterationCount,logoTransform:logo.transform});
   const key=JSON.stringify(state);
   if(key!==prior){prior=key;window.__paintStates.push({at:performance.now(),...state});}
  }
  if(performance.now()<15000)requestAnimationFrame(sample);
 };
 requestAnimationFrame(sample);
}
try{
 if(browser==='chrome'){
  await b.command('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
  await b.command('Page.addScriptToEvaluateOnNewDocument',{source:'('+monitor.toString()+')()'});
 }else{
  context=(await b.command('browsingContext.getTree',{})).contexts[0].context;
  await b.command('browsingContext.setViewport',{context,viewport:{width:1440,height:1100}});
  await b.command('script.addPreloadScript',{functionDeclaration:monitor.toString()});
 }
 await b.navigate(base);await ready();
 for(const [page,theme,lang,layout]of [['session-01.html','dark','en','split'],['session-02.html','light','it','stack'],['session-03.html','dark','de','split'],['session-05.html','light','it','stack'],['session-06.html','dark','en','split'],['about.html','light','it','stack'],['index.html','dark','de','split']]){
  await b.evaluate('localStorage.setItem("ros2learn-theme",'+JSON.stringify(theme)+');localStorage.setItem("ros2learn-language",'+JSON.stringify(lang)+');localStorage.setItem("ros2learn-layout",'+JSON.stringify(layout)+');true');
  await rawNavigate(base+page+'?boot-check='+Date.now());
  if(!remote){
   await until('document.getElementById("kn-boot-cover")&&document.documentElement.dataset.kinenestBoot==="loading"');
   await capture(page.replace('.html','')+'-destination-cover');
  }
  await ready();await wait(30);
  const samples=await b.evaluate('window.__paintStates');
  assert.ok(samples?.length,'No destination paint samples');
  const loading=samples.filter(s=>s.boot==='loading');
  if(!remote)assert.ok(loading.length,'Missing loading frame');
  for(const s of loading){assert.equal(s.logoAnimation,'kn-boot-spin','Destination must not replace the spinning logo with a static image');assert.equal(s.logoIterations,'infinite');}
  if(loading.length>2)assert.ok(new Set(loading.map(s=>s.logoTransform)).size>1,'Destination logo stopped rotating');
  for(const s of samples){
   assert.equal(s.theme,theme,'Wrong-theme first paint');assert.equal(s.lang,lang,'Wrong-language first paint');
   if(s.boot==='loading'){assert.equal(s.content,'hidden');assert.equal(s.opacity,'1');assert.equal(s.position,'fixed');assert.ok(+s.zIndex>=1000);assert.equal(s.width,s.viewport[0]);assert.equal(s.height,s.viewport[1]);assert.equal(s.background,s.pageBackground);}
   if(s.content==='visible')assert.equal(s.ready,'true','Content visible before readiness');
  }
  assert.equal(await b.evaluate('document.body.dataset.layout'),layout);
  assert.equal(await b.evaluate('getComputedStyle(document.getElementById("kn-boot-cover")).display'),'none');
  assert.equal(await b.evaluate('document.querySelector(".brand-tagline").textContent.includes("A safe place")'),lang==='en');
  const resources=await b.evaluate('performance.getEntriesByType("resource").map(r=>r.name)');
  assert.ok(!resources.some(url=>url.includes('pyodide')||url.includes('wasm-clang')||url.includes('/src/cpp/')),'Boot preloaded an execution runtime');
  await capture(page.replace('.html','')+'-ready');
  results.push({page,theme,lang,layout,samples});
  console.log('PASS',browser,'covered first paint, preferences and ready reveal:',page);
 }
 // Real internal handoff: outgoing, incoming protected paint, stable destination.
 for(const [from,to]of [['session-01.html','session-02.html'],['session-02.html','session-03.html'],['session-05.html','session-06.html']]){
  await b.navigate(base+from);await ready();
  await b.evaluate('document.querySelector(".session-nav a[href=\\"./'+to+'\\"]").click();true');
  await wait(350);await capture(from+'-outgoing');
  assert.equal(await b.evaluate('getComputedStyle(document.querySelector(".page-transition img")).animationIterationCount'),'infinite');
  assert.equal(await b.evaluate('getComputedStyle(document.querySelector(".page-transition svg")).display'),'none','Navigation must show only the rotating logo');
  if(!remote){await until('location.pathname.endsWith('+JSON.stringify(to)+')&&document.documentElement.dataset.kinenestBoot==="loading"');await capture(from+'-incoming');}
  assert.ok(Number.parseFloat(await b.evaluate('document.documentElement.style.getPropertyValue("--kn-motion-delay")'))<0,'Destination did not continue the outgoing rotation phase');
  await until('location.pathname.endsWith('+JSON.stringify(to)+')&&document.documentElement.dataset.kinenestBoot==="ready"');
  await capture(from+'-complete');
 }
 // Direct reload and back/forward use the same contract.
 await b.navigate(base);await ready();
 for(const to of ['session-01.html','session-02.html']){await b.evaluate('document.querySelector("a[href=\\"./'+to+'\\"]").click();true');await until('location.pathname.endsWith('+JSON.stringify(to)+')&&document.documentElement.dataset.kinenestBoot==="ready"');}
 for(const [action,path]of [['back','session-01.html'],['back','/'],['forward','session-01.html'],['forward','session-02.html']]){
  await b.evaluate('history.'+action+'();true');await until('location.pathname.endsWith('+JSON.stringify(path)+')&&document.documentElement.dataset.kinenestBoot==="ready"');
  assert.equal(await b.evaluate('document.body.inert'),false,'History restored inert content');
 }
 await b.evaluate('location.reload();true');await wait(100);await ready();
 if(!remote){
  fault='lesson';await rawNavigate(base+'session-03.html?fault=lesson');await until('document.documentElement.dataset.kinenestBoot==="error"');
  assert.match(await b.evaluate('document.querySelector(".boot-error-detail").textContent'),/503/);
  assert.equal(await b.evaluate('document.getElementById("kn-boot-cover").getAttribute("aria-hidden")'),'false');
  await capture('lesson-failure');fault='';await b.evaluate('document.querySelector(".boot-error a").click();true');await wait(100);await ready();
  fault='module';await rawNavigate(base+'session-03.html?fault=module');await until('document.documentElement.dataset.kinenestBoot==="error"',13000);
  assert.match(await b.evaluate('document.querySelector(".boot-error-detail").textContent'),/did not finish/);await capture('watchdog-failure');fault='';
  if(browser==='chrome'){
   await b.command('Emulation.setScriptExecutionDisabled',{value:true});await rawNavigate(base+'index.html?nojs=1');await wait(1500);
   assert.equal(await b.evaluate('document.documentElement.hasAttribute("data-kinenest-boot")'),false);
   assert.equal(await b.evaluate('getComputedStyle(document.querySelector("main")).visibility'),'visible');await capture('no-js');
   await b.command('Emulation.setScriptExecutionDisabled',{value:false});
  }
 }

 // Verify the actual browser motion preference, including the incoming cover.
 const calm=await launch(browser,{profileRoot:root+'../',reducedMotion:true});
 try{
  await calm.navigate(base);for(let i=0;i<250;i++){if(await calm.evaluate('document.documentElement.dataset.kinenestBoot==="ready"'))break;await wait(40);}
  assert.equal(await calm.evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'),true);
  await calm.evaluate('(async()=>{const link=document.querySelector("link[data-transitions]");const m=await import(link.href.replace(/css$/,"js"));m.setupTransitions().dispose();const start=performance.now();m.installNavigationTransitions({navigate:url=>{sessionStorage.setItem("calm-dwell",String(performance.now()-start));location.assign(url);}});document.querySelector(".start-course").click();})()');
  let calmReady=false;
  for(let i=0;i<400;i++){try{if(await calm.evaluate('location.pathname.endsWith("session-01.html")&&document.documentElement.dataset.kinenestBoot==="ready"')){calmReady=true;break;}}catch{}await wait(30);}
  assert.ok(calmReady,'Reduced-motion destination did not become ready');
  assert.ok(Number(await calm.evaluate('sessionStorage.getItem("calm-dwell")'))<150,'Reduced motion retained intentional dwell');
  assert.equal(await calm.evaluate('getComputedStyle(document.getElementById("kn-boot-cover")).display'),'none');
  assert.equal(await calm.evaluate('getComputedStyle(document.querySelector("#kn-boot-cover img")).animationName'),'none');
  console.log('PASS',browser,'real reduced-motion preference skips dwell and reveals ready content');
 }finally{await calm.close();}

 await writeFile(output+'/'+browser+'.json',JSON.stringify({browser,base,results,history:'PASS',failures:remote?'local-only':'PASS'},null,2)+'\n');
 console.log('PASS',browser,'destination handoff, direct entry/reload, history and failure recovery');
}finally{await b.close();proxy?.closeAllConnections();proxy?.close();server?.close();}
