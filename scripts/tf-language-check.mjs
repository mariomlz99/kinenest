import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {tfModuleUrl} from './tf-browser-route.mjs';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true}),results=[];
await mkdir('artifacts/unit-language',{recursive:true});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:1000}});
  await page.goto(tfModuleUrl(process.env.LAB_URL||'http://127.0.0.1:8062/basics.html'));
  await page.locator('#start').click();await page.locator('.xterm').first().waitFor();
  assert.deepEqual(await page.locator('#nav [data-exercise]').evaluateAll(nodes=>nodes.map(n=>n.dataset.exercise)),['frames','tree','lookup','point','odometry']);
  for(const exercise of ['frames','tree','lookup','point','odometry']){
   await page.locator(`[data-exercise="${exercise}"]`).click();
   const count=Number((await page.locator('.guide-progress').innerText()).split('/').at(-1));
   for(let step=0;step<count;step++){
    const before=await page.locator('.guide-progress').innerText();
    for(const language of ['cpp','python']){
     await page.locator('#language').selectOption(language);
     assert.equal(await page.locator('.guide-progress').innerText(),before);
     assert.equal(await page.locator('#nav [aria-current="step"]').getAttribute('data-exercise'),exercise);
    }
    if(step<count-1)await page.locator('#guide-next').click();
   }
   results.push({width,exercise,steps:count,passed:true});
   await page.screenshot({path:`artifacts/unit-language/tf-${width}-${exercise}.png`});
   await page.reload();await page.locator('#start').click();await page.locator('.xterm').first().waitFor();
   assert.equal(await page.locator('#nav [aria-current="step"]').getAttribute('data-exercise'),exercise);
   assert.equal(await page.locator('.guide-progress').innerText(),`Step ${count} / ${count}`);
  }
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.close();
 }
 console.log('PASS every TF/Odometry guide step in both languages, desktop/mobile and reload');
}finally{await writeFile('artifacts/unit-language/tf-results.json',JSON.stringify(results,null,2));await browser.close();}
