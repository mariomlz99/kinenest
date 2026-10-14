import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.HOME_URL||'http://127.0.0.1:8034/');
 await page.waitForFunction(()=>!document.querySelector('#locale').disabled);
 assert.deepEqual(await page.locator('.module-grid h3').allTextContents(),['Communication & QoS','Manipulation','Navigation & Planning']);
 assert.deepEqual(await page.locator('.module-number').allTextContents(),['04','05','06']);assert.equal(await page.locator('.module-icon').count(),1);assert.equal(await page.locator('.module-status').count(),3);
 for(const locale of ['en','nl','fr','de','es','pt','it']){await page.locator('#locale').selectOption(locale);assert((await page.locator('#tf-title').textContent()).startsWith('TF'));assert.equal(await page.locator('[aria-labelledby="tf-title"] .module-progress').textContent(),'0/0 completed');assert(!/(undefined|\[object)/.test(await page.locator('.module-grid').textContent()));}
 await page.locator('#locale').selectOption('en');await mkdir('artifacts/screenshots',{recursive:true});
 for(const width of [1280,899,390]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('.upcoming').screenshot({path:`artifacts/screenshots/upcoming-modules-${width}.png`});}
 assert.deepEqual(errors,[]);console.log('PASS active TF card, three coming-soon modules, seven locales and three widths');
}finally{await browser.close();}
