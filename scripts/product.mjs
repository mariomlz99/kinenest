import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const site=process.env.SITE_URL||'http://127.0.0.1:8022/';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true});
try{const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(site);await page.locator('#locale').waitFor();
 assert.equal(await page.locator('.module-grid article').count(),3);assert.equal(await page.locator('.start-unit').getAttribute('href'),'./basics.html?start=1');
 assert.deepEqual(await page.locator('#locale option').evaluateAll(options=>options.map(o=>o.value)),['en','nl','fr','es','de','pt','it']);
 for(const locale of ['en','nl','fr','es','de','pt','it']){await page.locator('#locale').selectOption(locale);assert.equal(await page.locator('html').getAttribute('lang'),locale);assert((await page.locator('.start-unit').innerText()).trim());}
 await page.locator('#locale').selectOption('en');await mkdir('artifacts/screenshots',{recursive:true});await page.screenshot({path:'artifacts/screenshots/landing.png',fullPage:true});
 await page.locator('.start-unit').click();await page.locator('.xterm').waitFor();assert.equal(await page.locator('#nav button').count(),6);assert.equal(await page.locator('#exercise-nav button').count(),1);assert.equal(await page.locator('#unit-heading').innerText(),'1. ROS 2 environment');
 for(const width of [1440,1920]){await page.setViewportSize({width,height:1000});const box=await page.locator('#workspace').boundingBox(),files=await page.locator('#files').boundingBox();assert(box.width>width*.65,'Unit 1 uses available workspace width');assert(Math.abs(files.x+files.width-(width-20))<4,'Unit 1 editor reaches right edge');}
 await page.setViewportSize({width:1440,height:1000});await page.locator('#locale').selectOption('fr');await page.screenshot({path:'artifacts/screenshots/unit-1-french.png',fullPage:true});await page.locator('#locale').selectOption('en');
 assert(!/Diepenbeek|UHasselt|KU Leuven|student|LESSONS|EXERCISES/.test(await page.locator('body').innerText()));
 await page.locator('.xterm-helper-textarea').focus();await page.keyboard.insertText('mkdir -p ~/ros2_ws/src');await page.keyboard.press('Enter');await page.waitForTimeout(100);await page.keyboard.insertText('echo "portable workspace" > ~/ros2_ws/src/notes.txt');await page.keyboard.press('Enter');await page.waitForTimeout(300);await page.locator('#save-session').click();await page.waitForFunction(()=>document.querySelector('#session-state').textContent==='Progress saved in this browser');
 for(const locale of ['nl','fr','es','de','pt','it','en']){await page.locator('#locale').selectOption(locale);await page.locator('#nav button').nth(6).click();assert((await page.locator('#unit').innerText()).length>80);}
 await page.screenshot({path:'artifacts/screenshots/actions-unit.png',fullPage:true});await page.locator('#save-session').click();await page.waitForTimeout(500);await page.reload();await page.locator('.xterm').waitFor();assert.equal(await page.locator('#unit-heading').innerText(),'6. Actions');await page.locator('.xterm-helper-textarea').focus();await page.keyboard.insertText('cat ~/ros2_ws/src/notes.txt');await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('.terminal-transcript pre').textContent.includes('portable workspace'));
 await page.locator('#exercise-nav button').click();await page.locator('#playground-start').click();await page.waitForTimeout(600);await page.locator('#playground-stop').click();await page.locator('#nav button').first().click();
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;assert(await download.path());
 await page.setViewportSize({width:390,height:844});assert(await page.locator('#export').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'artifacts/screenshots/mobile-workspace.png',fullPage:true});
 await page.goto(site);for(const locale of ['en','nl','fr','es','de','pt','it']){await page.locator('#locale').selectOption(locale);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),locale+' mobile overflow');}
 await page.locator('#theme').selectOption('light');await page.screenshot({path:'artifacts/screenshots/mobile-landing-light.png',fullPage:true});
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(site);assert.equal(await reduced.locator('.brand img').evaluate(el=>getComputedStyle(el).animationName),'none');await reduced.close();
 assert.deepEqual(errors,[]);console.log('PASS product: seven languages, BASICS entry, six units, playground, autosave/reload, export, mobile and reduced motion');
}finally{await browser.close();}
