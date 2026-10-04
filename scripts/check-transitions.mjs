import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {launch,wait} from './browser-driver.mjs';
import {serveDirectory} from './static-server.mjs';
const browser=process.argv[2]??'chrome',root=fileURLToPath(new URL('../',import.meta.url));
const option=name=>process.argv.find(x=>x.startsWith(name+'='))?.slice(name.length+1);
const output=option('--output')??root+'../.release-artifacts/transitions',remote=option('--url');
await mkdir(output,{recursive:true});
const server=remote?null:await serveDirectory(root+'dist',{prefix:'/'});
// Delay CSS deliberately. Static, render-blocking linkage must close the first-click race.
const proxy=remote?null:http.createServer(async(req,res)=>{try{if(req.url.includes('transitions.css'))await wait(600);const r=await fetch(server.url+req.url.slice(1));res.writeHead(r.status,{'Content-Type':r.headers.get('content-type')});res.end(Buffer.from(await r.arrayBuffer()));}catch{res.writeHead(502);res.end();}});
if(proxy)await new Promise(resolve=>proxy.listen(0,'127.0.0.1',resolve));
const base=remote?.replace(/\/?$/,'/')??'http://127.0.0.1:'+proxy.address().port+'/';
const b=await launch(browser,{profileRoot:root+'../'}),results=[];
async function until(expression){for(let i=0;i<250;i++){try{if(await b.evaluate(expression))return;}catch{}await wait(40);}throw Error('Timed out: '+expression);}
async function ready(){await until('document.documentElement.dataset.kinenestBoot==="ready"');}
async function navigate(from,to,{variant,theme='dark',capture=false,calm=false}={}){
 await b.navigate(base+from);await ready();
 await b.evaluate('(async()=>{localStorage.setItem("ros2learn-language","en");if(document.documentElement.dataset.theme!=='+JSON.stringify(theme)+')document.getElementById("theme").click();const link=document.querySelector("link[data-transitions]");if(!link?.sheet)throw Error("Initial transition stylesheet missing");const m=await import(link.href.replace(/css$/,"js"));if(m.setupTransitions()!==m.setupTransitions())throw Error("Duplicate initialization");'+(variant||calm?'m.setupTransitions().dispose();m.installNavigationTransitions({variant:'+JSON.stringify(variant)+',reducedMotion:()=>'+calm+'});':'')+'})()');
 const toUrl=new URL(to,base).href;
 await b.evaluate('('+function(destination){
  const link=[...document.querySelectorAll('a[href]')].find(a=>a.href===destination);if(!link)throw Error('Link not found '+destination);
  const start=performance.now();window.__transitionSamples=[];sessionStorage.removeItem('transition-test');
  const sample=()=>{const el=document.querySelector('.page-transition');if(!el)return {elapsed:performance.now()-start,missing:true};const s=getComputedStyle(el),r=el.getBoundingClientRect();return {elapsed:performance.now()-start,variant:el.dataset.variant,position:s.position,opacity:s.opacity,zIndex:s.zIndex,background:s.backgroundColor,pageBackground:getComputedStyle(document.documentElement).backgroundColor,width:r.width,height:r.height,viewport:[document.documentElement.clientWidth,innerHeight],animations:[...el.querySelectorAll('*')].map(e=>{const c=getComputedStyle(e);return {name:c.animationName,transform:c.transform,opacity:c.opacity};}).filter(a=>a.name!=='none'),image:el.querySelector('img').complete&&el.querySelector('img').naturalWidth>0};};
  window.addEventListener('pagehide',()=>sessionStorage.setItem('transition-test',JSON.stringify({prevented:window.__transitionPrevented,elapsed:performance.now()-start,samples:window.__transitionSamples})),{once:true});
  const event=new MouseEvent('click',{bubbles:true,cancelable:true,button:0});link.dispatchEvent(event);window.__transitionPrevented=event.defaultPrevented;
  setTimeout(()=>window.__transitionSamples.push(sample()),100);setTimeout(()=>window.__transitionSamples.push(sample()),450);
  // The first destination owns the transition, even if a second link is clicked.
  const second=[...document.querySelectorAll('a[href]')].find(a=>a.href!==destination&&new URL(a.href).pathname!==location.pathname);second?.click();
 }.toString()+')('+JSON.stringify(toUrl)+')');
 if(capture){await wait(330);await writeFile(output+'/'+browser+'-'+variant+'-'+theme+'.png',Buffer.from(await b.screenshot(),'base64'));}
 await until('location.href==='+JSON.stringify(toUrl)+'&&document.documentElement.dataset.kinenestBoot==="ready"');
 const result=await b.evaluate('JSON.parse(sessionStorage.getItem("transition-test"))');assert.ok(result?.prevented,'default navigation was not prevented');
 if(calm){assert.ok(result.elapsed<450,'Reduced motion delayed');}
 else{assert.ok(result.elapsed>=900&&result.elapsed<1400,'Navigation dwell '+result.elapsed);assert.equal(result.samples.length,2);for(const s of result.samples){assert.equal(s.missing,undefined);assert.equal(s.position,'fixed');assert.equal(s.opacity,'1');assert.ok(+s.zIndex>=1000);assert.equal(s.width,s.viewport[0]);assert.equal(s.height,s.viewport[1]);assert.equal(s.background,s.pageBackground);assert.ok(s.animations.length>0);assert.ok(s.image,'Brand icon not decoded');}assert.notDeepEqual(result.samples[0].animations,result.samples[1].animations,'Animation has no changing rendered state');}
 assert.equal(await b.evaluate('!!document.querySelector(".page-transition")'),false,'Destination overlay remained');results.push({from,to,theme,forcedVariant:variant??null,reducedMotion:calm,...result});
 console.log('PASS',browser,from,'→',to,theme,variant??'random',Math.round(result.elapsed)+'ms');
}
try{
 if(browser==='chrome')await b.command('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
 else{const tree=await b.command('browsingContext.getTree',{});await b.command('browsingContext.setViewport',{context:tree.contexts[0].context,viewport:{width:1440,height:1100}});}
 for(const [from,to]of [['index.html','session-01.html'],['session-01.html','session-02.html'],['session-02.html','session-03.html'],['session-03.html','session-05.html'],['session-05.html','session-06.html'],['session-06.html','session-01.html'],['session-02.html','about.html'],['about.html','']])await navigate(from,to);
 for(const [variant,theme]of [['lidar-sweep','dark'],['tf-rotate','light'],['robot-yaw','dark'],['orbit-ring','light'],['sensor-pulse','dark']])await navigate('index.html','session-02.html',{variant,theme,capture:true});
 await navigate('about.html','',{calm:true});
 // Back/Forward must clear overlays, including bfcache pageshow.
 await b.evaluate('history.back();true');await until('location.pathname.endsWith("about.html")&&!!document.getElementById("preferences")');assert.equal(await b.evaluate('!!document.querySelector(".page-transition")'),false);
 await b.evaluate('history.forward();true');await until('location.href==='+JSON.stringify(base)+'&&!!document.getElementById("preferences")');assert.equal(await b.evaluate('!!document.querySelector(".page-transition")'),false);
 await writeFile(output+'/'+browser+'.json',JSON.stringify({browser,base,delayedStylesheetMs:remote?0:600,results,history:'PASS'},null,2)+'\n');
}finally{await b.close();proxy?.closeAllConnections();proxy?.close();server?.close();}
