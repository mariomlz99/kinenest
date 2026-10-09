import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {linuxUnit} from '../src/linux-course.js';
const site=process.env.SITE_URL||'http://127.0.0.1:8024/';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
try{const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>requests.push(r.url()));
 await page.goto(site);assert.equal(await page.locator('.start-unit').count(),2);assert.equal(await page.locator('.module-grid small').filter({hasText:'🔒'}).count(),3);assert.equal(await page.locator('a[href="https://docs.ros.org/en/jazzy/Tutorials.html"]').count(),1);assert.equal(await page.locator('img[src$="linux-penguin.svg"]').count(),1);
 const command=async line=>{await page.locator('.xterm-helper-textarea').first().focus();await page.waitForTimeout(50);await page.keyboard.type(line,{delay:1});await page.keyboard.press('Enter');await page.waitForTimeout(250);};
 const save=async()=>{await page.locator('#save-session').click();await page.waitForFunction(()=>document.querySelector('#session-state').textContent==='Progress saved in this browser');await page.waitForTimeout(250);};
 await page.goto(site+'basics.html?start=1');await page.locator('.xterm').waitFor();await command('echo "ROS work preserved" > ~/ros-marker.txt');await save();
 await page.goto(site+'linux.html?start=1');await page.locator('.xterm').waitFor();assert(await page.locator('#exercise-nav button').isDisabled());assert(await page.locator('#language').isHidden());assert(!(await page.locator('#file-tree').innerText()).includes('ros-marker.txt'));
 for(let i=0;i<7;i++){await page.locator('#nav button').nth(i).click();
  for(const line of linuxUnit(i).filter(s=>s.kind==='commands').flatMap(s=>s.commands)){
   await command(line);
   if(line.startsWith('nano ')){await page.locator('.nano-text').fill('Edited with nano.\nA second line.\n');await page.keyboard.press('Control+o');await page.keyboard.press('Enter');await page.keyboard.press('Control+x');}
   if(line.startsWith('gedit ')){await page.locator('.cm-content').click();await page.keyboard.press('Control+a');await page.keyboard.insertText('Edited with gedit.\nA second line.\n');await page.locator('#save').click();await page.waitForTimeout(300);}
  }
 }
 await writeFile('/tmp/kinenest-linux-transcript.txt',await page.locator('.terminal-transcript pre').first().textContent());assert((await page.locator('.terminal-transcript pre').first().textContent()).includes('No such file'));assert((await page.locator('.terminal-transcript pre').first().textContent()).includes('Edited with gedit.'));
 await command('echo "Linux work preserved" > ~/linux-marker.txt');await save();await page.reload();await page.locator('.xterm').waitFor();assert.equal(await page.locator('#unit-heading').innerText(),'7. Put it together');assert(await page.locator('#exercise-nav button').isDisabled());await command('cat ~/linux-marker.txt');assert((await page.locator('.terminal-transcript pre').first().textContent()).includes('Linux work preserved'));
 const dl=page.waitForEvent('download');await page.locator('#export').click();assert.equal((await dl).suggestedFilename(),'linux-workspace.tar');
 assert(!requests.some(u=>/pyodide.*\.(wasm|zip)|wasm-clang.*\.wasm/.test(u)));
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'artifacts/screenshots/linux-mobile.png',fullPage:true});
 await page.goto(site+'basics.html?start=1');await page.locator('.xterm').waitFor();assert(await page.locator('#exercise-nav button').isEnabled());await command('cat ~/ros-marker.txt');assert((await page.locator('.terminal-transcript pre').first().textContent()).includes('ROS work preserved'));assert(!(await page.locator('#file-tree').innerText()).includes('linux-marker.txt'));
 assert.deepEqual(errors,[]);console.log('PASS both modules: all Linux exercises/editors, official docs, vector penguin, locks, isolated saved workspaces, Linux export, mobile and no runtime downloads.');
}finally{await browser.close();}
