import {chromium} from 'playwright-core';import assert from 'node:assert/strict';import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true}),results=[];await mkdir('artifacts/review',{recursive:true});
try{
 for(const [name,site]of [['main','http://127.0.0.1:8045/'],['feature','http://127.0.0.1:8042/']])for(let trial=0;trial<3;trial++){
  const context=await browser.newContext(),page=await context.newPage(),requests=[];context.on('request',request=>requests.push(request.url()));
  await page.goto(site);await page.waitForLoadState('networkidle');const landing=await page.evaluate(()=>({paint:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,bytes:performance.getEntriesByType('resource').reduce((sum,e)=>sum+e.encodedBodySize,0),requests:performance.getEntriesByType('resource').length}));
  await page.goto(site+'basics.html?start=1');await page.locator('.xterm').waitFor();const basics=await page.evaluate(()=>({paint:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,bytes:performance.getEntriesByType('resource').reduce((sum,e)=>sum+e.encodedBodySize,0)}));
  let tf=null;if(name==='feature'){const begin=Date.now();await page.locator('[data-index="9"]').click();await page.locator('#tf-start').waitFor();tf={firstViewMs:Date.now()-begin};}
  assert(!requests.some(url=>/wasm-clang|\/cpp\/worker|pyodide.*\.(wasm|zip)/.test(url)),'No compiler/runtime eager loads');results.push({name,trial,landing,basics,tf,requests:requests.length});await context.close();
 }
 await writeFile('artifacts/review/loading.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
