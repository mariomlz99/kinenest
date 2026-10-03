import {launch,wait} from '../../../scripts/browser-driver.mjs';
import {serveDirectory} from '../../../scripts/static-server.mjs';
import {readFile} from 'node:fs/promises';
const root=new URL('../../../',import.meta.url),browser=process.argv[2]??'chrome',s=await serveDirectory(new URL('dist/',root).pathname),b=await launch(browser,{profileRoot:new URL('../',root).pathname});const data={browser,python:[],render:[]};
async function until(expr,seconds=90){for(let i=0;i<seconds*20;i++){if(await b.evaluate(expr))return;await wait(50);}throw Error('Timeout '+expr);}
async function viewport(width,height){if(browser==='chrome')await b.command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});else{const tree=await b.command('browsingContext.getTree',{});await b.command('browsingContext.setViewport',{context:tree.contexts[0].context,viewport:{width,height}});}}
try{
 await viewport(1440,1100);await b.navigate(s.url+'session-03.html');await until('document.body.dataset.lessonState==="ready"');
 data.pageResources=await b.evaluate('({transferBytes:[...performance.getEntriesByType("navigation"),...performance.getEntriesByType("resource")].reduce((n,e)=>n+e.transferSize,0),count:performance.getEntriesByType("resource").length})');
 const source=await readFile(new URL('tests/python/solution-1.py',root),'utf8');
 for(const cache of ['cold-profile','warm-http-cache-new-worker']){
  await b.evaluate('document.getElementById("python-code").value='+JSON.stringify(source)+';window.measureStages=[];window.measureStart=performance.now();window.measureObserver=new MutationObserver(()=>measureStages.push({ms:performance.now()-measureStart,text:document.getElementById("python-state").textContent}));measureObserver.observe(document.getElementById("python-state"),{childList:true,subtree:true});document.getElementById("run-python").click();true');
  await until('document.getElementById("python-state").textContent.includes("callbacks ready")');data.python.push({cache,...await b.evaluate('({elapsedMs:performance.now()-measureStart,stages:measureStages})')});await b.evaluate('measureObserver.disconnect();document.getElementById("stop-python").click();true');
 }
 await b.evaluate('document.getElementById("python-code").value='+JSON.stringify('for i in range(1000):\n    print(str(i) + "x" * 1000)'.replaceAll('\\n','\n'))+';document.getElementById("run-python").click();true');await until('document.getElementById("python-state").textContent.includes("callbacks ready")');data.output=await b.evaluate('({characters:document.getElementById("python-output").textContent.length,nodes:document.getElementById("python-output").childNodes.length})');await b.evaluate('document.getElementById("stop-python").click();true');
 if(browser==='chrome'){
  await b.command('Performance.enable');
  for(const page of ['session-02.html','session-03.html','session-05.html'])for(const width of [390,1440]){
   await viewport(width,width===390?844:1100);await b.navigate(s.url+page);await until('document.body.dataset.lessonState==="ready"');await wait(500);const before=Object.fromEntries((await b.command('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));await wait(3000);const after=Object.fromEntries((await b.command('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));data.render.push({page,width,wallSeconds:after.Timestamp-before.Timestamp,mainThreadTaskSeconds:after.TaskDuration-before.TaskDuration,scriptSeconds:after.ScriptDuration-before.ScriptDuration,layoutSeconds:after.LayoutDuration-before.LayoutDuration,heapBytes:after.JSHeapUsedSize});
  }
 }
 console.log(JSON.stringify(data,null,2));
}finally{await b.close();s.close();}
