import {tfModuleUrl,moduleHomeUrl} from './tf-browser-route.mjs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:process.env.HEADED!=='1'});
const report={errors:[],layouts:[],cycles:[],performance:[]};await mkdir('artifacts/review',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),cdp=await page.context().newCDPSession(page);
 page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',dialog=>dialog.accept());
 await page.addInitScript(()=>{
  const intervals=new Set(),workers=new Set(),observers=new Set(),si=window.setInterval,ci=window.clearInterval,W=window.Worker,R=window.ResizeObserver;
  window.setInterval=(...a)=>{const id=si(...a);intervals.add(id);return id;};window.clearInterval=id=>{intervals.delete(id);return ci(id);};
  window.Worker=class extends W{constructor(...a){super(...a);workers.add(this);}terminate(){workers.delete(this);return super.terminate();}};
  window.ResizeObserver=class extends R{observe(...a){observers.add(this);return super.observe(...a);}disconnect(){observers.delete(this);return super.disconnect();}};
  window.reviewResources=()=>({intervals:intervals.size,workers:workers.size,observers:observers.size});
 });
 const entry=tfModuleUrl(process.env.LAB_URL||'http://127.0.0.1:8042/basics.html');
 await page.goto(entry);
 const observe=async()=>page.evaluate(async()=>{
  const base=document.querySelector('script[src*="/app.js"]').src,{Lab}=await import(new URL('lab.js',base)),{TFVisualizer}=await import(new URL('tf/visualizer.js',base));window.reviewBase=base;window.reviewLabs=[];window.updateCosts=[];
  const terminal=Lab.prototype.terminal;Lab.prototype.terminal=function(...a){if(!window.reviewLabs.includes(this))window.reviewLabs.push(this);return terminal.apply(this,a);};
  const update=TFVisualizer.prototype.update;TFVisualizer.prototype.update=function(...a){window.reviewVisual=this;const begin=performance.now();const result=update.apply(this,a);window.updateCosts.push(performance.now()-begin);return result;};
 });
 await observe();await page.locator('#start').click();await page.locator('.xterm').waitFor();
 assert.equal(await page.locator('#nav button[data-index],#exercise-nav button').count(),0);
 await page.locator('#tf-start').click();await page.locator('[data-frame="laser_link"]').waitFor();
 const pose=async(x,y,yaw)=>page.evaluate(({x,y,yaw})=>{const v=window.reviewVisual;Object.assign(v.playground.robot,{x,y,yaw});v.playground.publishPose();v.update(true);},{x,y,yaw});
 const far=await page.evaluate(()=>{const v=window.reviewVisual;clearInterval(v.playground.timer);v.playground.timer=null;Object.assign(v.playground.robot,{x:1000,y:-1000,yaw:-3.14});const begin=performance.now();v.playground.publishPose();v.update(true);return{grid:document.querySelectorAll('.tf-grid').length,ms:performance.now()-begin};});report.performance.push({far});console.log('far-pose grid',far);
 if(process.env.PROBE_ONLY==='1'){await writeFile('artifacts/review/ui-probe.json',JSON.stringify(report,null,2));process.exitCode=far.grid>150?1:0;}
 else{
  assert(far.grid<=150,'Far-away finite TF must not create unbounded grid lines');
  await pose(1e308,-1e308,0);
  assert.match(await page.locator('.tf-space').textContent(),/Coordinates exceed/);
  assert.equal(await page.locator('.tf-grid').count(),0,'Unrenderable finite coordinates fail safely');
  for(const [x,y,yaw]of [[0,0,0],[-2,-1,-Math.PI/2],[1.2,-.7,2.8],[0,0,Math.PI]]){
   await pose(x,y,yaw);await page.locator('#tf-reference').selectOption('odom');await page.locator('#tf-frame').selectOption('base_link');
   const inspection=await page.locator('.tf-values').innerText();assert(inspection.includes(x.toFixed(3)),inspection);
   await page.screenshot({path:`artifacts/review/pose-${x}-${y}-${yaw.toFixed(2)}.png`,fullPage:true});
  }
  for(const [width,height]of [[1920,1080],[1440,900],[1366,768],[820,1180],[320,800]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(100);
   for(const locale of ['en','fr','nl','es','de','pt','it']){await page.locator('#locale').selectOption(locale);await page.waitForTimeout(30);if(locale!=='en'){assert.notEqual(await page.locator('#tf-start').textContent(),'Start simulator');assert.notEqual(await page.locator('.tf-tree-panel h2').textContent(),'TF tree');assert(!String(await page.locator('.tf-direction').textContent()).includes('{'));assert.equal(await page.locator('[data-frame=laser_link] code').textContent(),'laser_link');}const scroll=await page.evaluate(()=>document.documentElement.scrollWidth);report.layouts.push({width,locale,scroll});assert(scroll<=width+1,`${width}px ${locale} overflow ${scroll}`);}
   await page.locator('#locale').selectOption('en');await page.screenshot({path:`artifacts/review/responsive-${width}.png`,fullPage:true});
  }
  await page.setViewportSize({width:1440,height:900});
  await page.locator('[data-frame="laser_link"]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('#tf-frame').inputValue(),'laser_link');
  await page.locator('#tf-reference').selectOption('laser_link');assert.match(await page.locator('.tf-values').innerText(),/0.000/);
  await page.evaluate(()=>{const v=window.reviewVisual,s={header:{stamp:{sec:0,nanosec:0},frame_id:'island'},child_frame_id:'<img onerror=alert(1)>',transform:{translation:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0,w:1}}};v.runtime.publish('/tf','tf2_msgs/msg/TFMessage',{transforms:[s]},{node:'/extra'});v.update(true);});
  assert.equal(await page.locator('.tf-tree img').count(),0);await page.locator('#tf-frame').selectOption('<img onerror=alert(1)>');assert.match(await page.locator('.tf-values').innerText(),/not connected/);
  await page.evaluate(()=>{window.reviewVisual.runtime.removeNode('/extra');window.reviewVisual.update(true);});assert.equal(await page.locator('#tf-frame').inputValue(),'base_link');
  await page.locator('#tf-stop').click();await page.locator('#prepare-unit').click();await page.waitForFunction(()=>!document.querySelector('#prepare-unit').disabled);
  await page.evaluate(async()=>{const v=window.reviewVisual,lab=window.reviewLabs.find(l=>l.runtime===v.runtime);window.reviewTfLab=lab;const path='/home/learner/ros2_ws/src/tf_lab/tf_lab/lookup.py';lab.fs.write(path,lab.fs.read(path).replace("'laser'","'laser_link'"));await lab.builder.build();});
  await page.locator('#save-session').click();await page.waitForTimeout(300);const allCosts=[];
  for(let cycle=0;cycle<55;cycle++){
   if(cycle){await page.goto(entry);await observe();await page.locator('#start').click();await page.locator('#tf-start').waitFor();await page.evaluate(()=>{window.reviewTfLab=window.reviewLabs.find(l=>l.runtime===window.reviewVisual.runtime);});}
   assert(await page.evaluate(()=>{const l=window.reviewTfLab,r=l.runtime;return l.processes.active().length===0&&r.nodes.size===0&&r.listeners.size===0&&r.tf.listeners.size===0&&r.jobs.size===0&&r.tfEvidence.length===0&&r.tf.frames().length===0;}),'module entry must not revive runtime resources');
   await page.locator('#tf-start').click();await page.locator('#tf-forward').click();
   await page.evaluate(async()=>{const l=window.reviewTfLab;await l.processes.run('tf_lab','lookup');});
   await page.waitForFunction(()=>window.reviewTfLab.runtime.tfEvidence.length>0,null,{timeout:180000});
   await page.locator('[data-frame="laser_link"]').click();await page.locator('#tf-reset-pose').click();await page.locator('#tf-stop').click();
   allCosts.push(...await page.evaluate(()=>window.updateCosts));
   await page.goto(moduleHomeUrl(entry));assert.equal(page.workers().length,0,`cycle ${cycle}: language workers survived module navigation`);
   const resource=await page.evaluate(()=>({...window.reviewResources(),overlays:document.querySelectorAll('#tf-stage>*').length}));
   for(const key of ['workers','overlays'])assert.equal(resource[key],0,`cycle ${cycle} ${key}`);
   if(cycle%10===0||cycle===54){await cdp.send('HeapProfiler.collectGarbage');const dom=await cdp.send('Memory.getDOMCounters'),memory=await page.evaluate(()=>performance.memory?.usedJSHeapSize);report.cycles.push({cycle,...resource,...dom,memory});console.log('cycle '+cycle+' '+JSON.stringify(resource));}
  }
  assert(report.cycles.at(-1).jsEventListeners<=report.cycles[0].jsEventListeners+5,'event listeners grow');
  assert(report.cycles.at(-1).nodes<=report.cycles[0].nodes+30,'DOM nodes grow');
  assert.equal(report.cycles.at(-1).intervals,report.cycles[0].intervals);assert.equal(report.cycles.at(-1).observers,report.cycles[0].observers);
  const costs=allCosts.sort((a,b)=>a-b);report.performance.push({updates:costs.length,median:costs[Math.floor(costs.length*.5)],p95:costs[Math.floor(costs.length*.95)],max:costs.at(-1)});
  assert.deepEqual(report.errors,[]);await writeFile('artifacts/review/ui-stress.json',JSON.stringify(report,null,2));console.log('PASS UI stress, responsive, malicious frame text and keyboard');
 }
}finally{await browser.close();}
