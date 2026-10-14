import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const site=process.env.SITE_URL||'http://127.0.0.1:8022/';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true});
try{const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(site);await page.locator('#locale').waitFor();
 assert.deepEqual(await page.locator('.module-grid h3').allTextContents(),['Communication & QoS','Manipulation','Navigation & Planning']);assert.equal(await page.locator('.start-unit').nth(1).getAttribute('href'),'./basics.html?start=1&unit=course');
 assert.deepEqual(await page.locator('#locale option').evaluateAll(options=>options.map(o=>o.value)),['en','nl','fr','es','de','pt','it']);
 for(const locale of ['en','nl','fr','es','de','pt','it']){await page.locator('#locale').selectOption(locale);assert.equal(await page.locator('html').getAttribute('lang'),locale);assert((await page.locator('.start-unit').nth(1).innerText()).trim());}
 await page.locator('#locale').selectOption('en');await mkdir('artifacts/screenshots',{recursive:true});await page.screenshot({path:'artifacts/screenshots/landing.png',fullPage:true});
 await page.locator('.start-unit').nth(1).click();await page.locator('.xterm').waitFor();assert.equal(await page.locator('#nav button').count(),7);assert.deepEqual(await page.locator('#exercise-nav button').evaluateAll(buttons=>buttons.map(button=>({index:button.dataset.index,label:button.textContent.trim()}))),[{index:'7',label:'↗  Robotics Playground'},{index:'8',label:'↗  Free Lab · experiment freely'},{index:'9',label:'↗  TF & Odometry'}]);assert.equal(await page.locator('#unit-heading').innerText(),'1. ROS 2 environment');
 for(const width of [1440,1920]){await page.setViewportSize({width,height:1000});const box=await page.locator('#workspace').boundingBox(),files=await page.locator('#files').boundingBox();assert(box.width>width*.65,'Unit 1 uses available workspace width');assert(Math.abs(files.x+files.width-((await page.evaluate(()=>document.body.clientWidth))-20))<4,'Unit 1 editor reaches right edge');}
 await page.setViewportSize({width:1440,height:1000});await page.locator('#locale').selectOption('fr');await page.screenshot({path:'artifacts/screenshots/unit-1-french.png',fullPage:true});await page.locator('#locale').selectOption('en');
 const body=await page.locator('body').innerText();assert(!/Diepenbeek|UHasselt|KU Leuven|student/.test(body),JSON.stringify(body.match(/.{0,70}(?:Diepenbeek|UHasselt|KU Leuven|student).{0,70}/g)));
 await page.locator('.xterm-helper-textarea').focus();await page.keyboard.insertText('mkdir -p ~/ros2_ws/src');await page.keyboard.press('Enter');await page.waitForTimeout(100);await page.keyboard.insertText('echo "portable workspace" > ~/ros2_ws/src/notes.txt');await page.keyboard.press('Enter');await page.waitForTimeout(300);await page.locator('#save-session').click();await page.waitForFunction(()=>document.querySelector('#session-state').textContent==='Progress saved in this browser');
 for(const locale of ['nl','fr','es','de','pt','it','en']){await page.locator('#locale').selectOption(locale);await page.locator('#nav button').nth(6).click();assert((await page.locator('#unit').innerText()).length>80);}
 await page.screenshot({path:'artifacts/screenshots/actions-unit.png',fullPage:true});await page.locator('#save-session').click();await page.waitForTimeout(500);await page.reload();await page.locator('.xterm').waitFor();assert.equal(await page.locator('#unit-heading').innerText(),'7. Actions');await page.locator('.xterm-helper-textarea').focus();await page.keyboard.insertText('cat ~/ros2_ws/src/notes.txt');await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('.terminal-transcript pre').textContent.includes('portable workspace'));
 await page.locator('#exercise-nav button[data-index="7"]').click();await page.locator('#playground-start').click();await page.waitForTimeout(600);await page.locator('#playground-stop').click();await page.locator('#nav button').first().click();
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;assert(await download.path());
 await page.setViewportSize({width:390,height:844});assert(await page.locator('#export').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'artifacts/screenshots/mobile-workspace.png',fullPage:true});
 await page.goto(site);for(const locale of ['en','nl','fr','es','de','pt','it']){await page.locator('#locale').selectOption(locale);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),locale+' mobile overflow');}
 await page.locator('#theme').selectOption('light');await page.screenshot({path:'artifacts/screenshots/mobile-landing-light.png',fullPage:true});
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(site);assert.equal(await reduced.locator('.brand img').evaluate(el=>getComputedStyle(el).animationName),'none');await reduced.close();
 // The third module opens its isolated workspace; returning to Basics resumes
 // the saved course instead of the last-active TF module.
 await page.locator('#locale').selectOption('en');await page.locator('#theme').selectOption('dark');
 assert.equal(await page.locator('.start-unit').count(),3);
 await page.locator('.start-unit').nth(1).click();await page.locator('.xterm').waitFor();
 const savedCourseHeading=await page.locator('#unit-heading').innerText();
 await page.locator('#save-session').click();await page.waitForTimeout(600);await page.goto(site);
 await page.locator('.start-unit').nth(2).click();await page.locator('.xterm').waitFor();
 assert.equal(await page.locator('#unit-heading').innerText(),'TF & Odometry');
 assert.equal(await page.locator('.playground-exercises button').count(),5);
 assert(!(await page.locator('#file-tree').innerText()).includes('notes.txt'));
 await page.locator('.xterm-helper-textarea').first().focus();await page.keyboard.insertText('echo "TF workspace preserved" > ~/tf-marker.txt');await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('#file-tree').textContent.includes('tf-marker.txt'));
 await page.locator('[data-exercise="odometry"]').click();await page.locator('#save-session').click();await page.waitForTimeout(600);
 await page.goto(site);await page.locator('.start-unit').nth(1).click();await page.locator('.xterm').waitFor();
 assert.equal(await page.locator('#unit-heading').innerText(),savedCourseHeading);
 assert((await page.locator('#file-tree').innerText()).includes('notes.txt'));assert(!(await page.locator('#file-tree').innerText()).includes('tf-marker.txt'));
 await page.locator('#save-session').click();await page.waitForTimeout(600);
 await page.goto(site);await page.locator('.start-unit').nth(2).click();await page.locator('.xterm').waitFor();
 assert.equal(await page.locator('#unit-heading').innerText(),'TF & Odometry');
 assert((await page.locator('#file-tree').innerText()).includes('tf-marker.txt'));
 assert.equal(await page.locator('[data-exercise="odometry"]').getAttribute('aria-current'),'step');
 assert.deepEqual(errors,[]);console.log('PASS product: three modules, isolated TF/Basics entry and saved files, seven languages, autosave/reload, export, mobile and reduced motion');
}finally{await browser.close();}
