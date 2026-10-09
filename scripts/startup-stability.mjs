import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const site=process.env.SITE_URL||'http://127.0.0.1:8024/';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
try{for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(theme=>{localStorage.setItem('kinenest.theme',theme);window.framesSeen=[];function sample(){const logo=document.querySelector('.brand img');if(logo&&document.body){const rect=logo.getBoundingClientRect();window.framesSeen.push({bg:getComputedStyle(document.documentElement).backgroundColor,width:rect.width,height:rect.height,transform:getComputedStyle(logo).transform,top:rect.top,scroll:scrollY});}if(window.framesSeen.length<1200)requestAnimationFrame(sample);}requestAnimationFrame(sample);},theme);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.route('**/src/app.js',async route=>{await new Promise(r=>setTimeout(r,700));await route.continue();});
 for(const path of ['', 'linux.html?start=1','basics.html?start=1']){
  await page.goto(site+path);if(path)await page.locator('.xterm').waitFor();else await page.locator('#locale:not([disabled])').waitFor();
  for(let reload=0;reload<2;reload++){
   if(reload){await page.reload();if(path)await page.locator('.xterm').waitFor();else await page.locator('#locale:not([disabled])').waitFor();}
   await page.waitForTimeout(100);const frames=await page.evaluate(()=>window.framesSeen);assert(frames.length>0);
   const background=theme==='light'?'rgb(245, 247, 244)':'rgb(16, 25, 31)';
   for(const frame of frames){assert.equal(frame.bg,background,theme+' '+path+' background flash');assert.equal(frame.width,38,'logo width changed');assert.equal(frame.height,38,'logo height changed');assert.equal(frame.transform,'none');assert.equal(frame.scroll,0,'startup moved viewport');}
   assert.equal(new Set(frames.map(f=>f.top)).size,1,'header shifted');assert(!await page.locator('html').evaluate(el=>el.classList.contains('workspace-loading')));
  }
  if(path){for(const i of [1,2,0]){await page.locator('#nav button').nth(i).click();assert.equal(await page.evaluate(()=>scrollY),0);}await page.locator('#restore-layout').click();}
 }
 assert.deepEqual(errors,[]);await context.close();console.log('PASS '+theme+': cold load and refresh, steady background, fixed logo/header, no viewport jump, lesson navigation and layout restore.');
}
const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await mobile.newPage();await page.goto(site+'linux.html?start=1');await page.locator('.xterm').waitFor();assert(await page.locator('#theme').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16));assert(await page.locator('.xterm-helper-textarea').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16));assert(await page.evaluate(()=>visualViewport.scale===1&&document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'/tmp/kinenest-stable-mobile.png',fullPage:true});await mobile.close();console.log('PASS mobile input sizes, viewport scale and no horizontal overflow.');
}finally{await browser.close();}
