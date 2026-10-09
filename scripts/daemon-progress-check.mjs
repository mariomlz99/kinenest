import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
try{for(const [url,kine] of [[process.env.KINE_URL||'http://127.0.0.1:8024/',true],[process.env.LAB_URL||'http://127.0.0.1:8017/ros2-basics-lab/',false]]){
 const context=await browser.newContext(),page=await context.newPage();
 await page.goto(kine?url+'basics.html?start=1':url);if(!kine)await page.getByRole('button',{name:'Start lesson',exact:true}).click();await page.locator('.xterm').waitFor();
 const command=async line=>{await page.locator('.xterm-helper-textarea').first().focus();await page.keyboard.insertText(line);await page.keyboard.press('Enter');await page.waitForTimeout(200);};
 for(const line of ['pwd','echo $ROS_DISTRO','ros2 node list','ros2 daemon stop','ros2 daemon status','ros2 node list --all --no-daemon','ros2 daemon status','ros2 node list --a','ros2 daemon status'])await command(line);
 const transcript=await page.locator('.terminal-transcript pre').first().textContent();assert(transcript.includes('The daemon is not running'));assert.match(transcript,/_ros2cli_daemon_0_[a-f0-9]{32}/);
 await page.locator('#guide-mode').click();await page.locator('.complete').click();await page.locator('#nav .completion-mark').waitFor();
 const mark=page.locator('#nav .completion-mark').first();assert.equal(await mark.textContent(),'✓');const box=await mark.boundingBox(),button=await page.locator('#nav button').first().boundingBox();assert(box.x>button.x+button.width/2);
 await page.waitForTimeout(1800);await page.reload();if(!kine)await page.getByRole('button',{name:'Start lesson',exact:true}).click();await page.locator('#nav .completion-mark').waitFor();
 assert.equal(await page.locator('#nav .completion-mark').count(),1);
 if(kine){await page.evaluate(()=>localStorage.removeItem('kinenest.progress.ros'));await page.goto(url);await page.waitForFunction(()=>document.querySelector('[data-module-progress=ros]').textContent==='1 / 7 completed');}
 await context.close();console.log('PASS daemon behavior and persisted right-side completion mark: '+url);
}}finally{await browser.close();}
