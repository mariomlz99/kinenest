const frame=document.querySelector('iframe'),result=document.getElementById('result'),sessions=document.body.dataset.sessions.split(',');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,seconds=30){for(let i=0;i<seconds*10;i++){if(fn())return;await wait(100);}throw Error('Timeout: '+frame.contentDocument?.getElementById('python-state')?.textContent+' / '+frame.contentDocument?.getElementById('python-output')?.textContent);}
async function checkedFetch(url,options={}){try{const response=await fetch(url,{...options,signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('HTTP '+response.status);return response;}catch(error){throw Error('Request '+url+': '+error.message);}}
async function progress(text){result.textContent+='\n'+text;await checkedFetch('/progress',{method:'POST',body:text});}
try{for(const session of sessions){
 frame.src='../session-0'+session+'.html';await until(()=>frame.contentDocument?.getElementById('session-tag')?.textContent==='SESSION 0'+session&&frame.contentDocument?.body.dataset.lessonState==='ready');
 const d=frame.contentDocument,$=id=>d.getElementById(id),ids=[...$('lesson-select').options].map(o=>o.value);
 if(ids.length<3)throw Error('Missing lesson catalog: '+session);
 for(const [index,id]of ids.entries()){
  if(document.body.dataset.filter&&!id.includes(document.body.dataset.filter))continue;
  $('lesson-select').value=id;$('lesson-select').dispatchEvent(new Event('change'));await until(()=>d.body.dataset.lessonState==='ready'&&d.body.dataset.lessonId===id&&!$('run-python').disabled);
  $('check').click();if($('status').textContent.startsWith('Exercise complete'))throw Error('Empty exercise passed '+id);
  $('python-code').value=await(await checkedFetch('./python/course/'+id+'.py')).text();$('run-python').click();await until(()=>$('python-state').textContent.includes('callbacks ready'),90);
  if(id.includes('parameter')||id.includes('tuning')){await wait(1000);$('command').value='ros2 param set /student_controller speed 0.6';$('terminal-form').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));}
  await until(()=>{$('check').click();return $('status').textContent.startsWith('Exercise complete');},35);
  await progress('PASS '+id);$('stop-python').click();
 }
 if(session==='2'){
  $('lesson-select').selectedIndex=2;$('lesson-select').dispatchEvent(new Event('change'));await until(()=>d.body.dataset.lessonState==='ready'&&$('lesson-number').textContent==='EXERCISE 2.3');
  $('python-code').value=await(await checkedFetch('./python/course/alternative-sectors.py')).text();$('run-python').click();await until(()=>$('python-state').textContent.includes('callbacks ready'),90);await until(()=>{$('check').click();return $('status').textContent.startsWith('Exercise complete');});$('stop-python').click();await progress('PASS alternate NumPy sector implementation');
 }
 // Layout and theme controls must be usable without losing the selected program.
 const code=$('python-code').value,english=$('mission-title').textContent;
 for(const lang of ['nl','fr']){$('language').value=lang;$('language').dispatchEvent(new Event('change'));await wait(50);if(d.documentElement.lang!==lang||$('mission-title').textContent===english||$('python-code').value!==code)throw Error('Language switch failed or modified Python');}
 $('language').value='en';$('language').dispatchEvent(new Event('change'));await wait(50);if($('mission-title').textContent!==english)throw Error('English restore failed');$('theme').click();if(d.documentElement.dataset.theme!=='light')throw Error('Light theme failed');$('theme').click();
 $('layout').value='stack';$('layout').dispatchEvent(new Event('change'));if(d.body.dataset.layout!=='stack'||$('python-code').value!==code)throw Error('Layout lost code');$('layout').value='split';$('layout').dispatchEvent(new Event('change'));
}
result.textContent='PASS: course solutions, empty-program negative checks, theme and layout';
}catch(error){result.textContent='FAIL: '+error.message+' / '+frame.contentDocument?.getElementById('feedback')?.textContent+' / '+frame.contentDocument?.getElementById('pose')?.textContent;}
await fetch('/done',{method:'POST',body:result.textContent});
