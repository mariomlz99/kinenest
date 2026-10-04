import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {launch,wait} from './browser-driver.mjs';
const browser=process.argv[2]??'chrome';
const arg=name=>process.argv.find(a=>a.startsWith('--'+name+'='))?.slice(name.length+3);
const base=arg('url'),commit=arg('commit'),language=arg('language')??'python';
assert.ok(['python','cpp'].includes(language),'Choose --language=python or cpp');
assert.ok(base&&/^[a-f0-9]{40}$/.test(commit??''),'Pass --url and --commit');
const info=await(await fetch(new URL('build-info.json',base),{cache:'no-store'})).json();
assert.equal(info.commit,commit);assert.equal(info.dirty,false);
const b=await launch(browser,{profileRoot:fileURLToPath(new URL('../../',import.meta.url))});
async function until(expression,seconds=90){
 for(let i=0;i<seconds*10;i++){if(await b.evaluate(expression))return;await wait(100);}
 throw Error('Timeout '+expression+' '+await b.evaluate('document.getElementById("feedback")?.textContent+" / "+document.getElementById("python-output")?.textContent'));
}
const command=text=>b.evaluate('document.getElementById("command").value='+JSON.stringify(text)+';document.getElementById("terminal-form").requestSubmit();true');
try{
 await b.navigate(new URL('session-01.html',base).href);await until('document.documentElement.dataset.kinenestBoot==="ready"');
 for(const text of ['ros2 node list','ros2 topic list','ros2 topic type /cmd_vel','ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.6}}"'])await command(text);
 await wait(3000);await b.evaluate('document.getElementById("check").click();true');
 assert.ok(await b.evaluate('document.getElementById("status").textContent.startsWith("Exercise complete")'),'Session 1 CLI failed');
 await b.evaluate('document.getElementById("reset").click();document.getElementById("check").click();true');
 assert.ok(!await b.evaluate('document.getElementById("status").textContent.startsWith("Exercise complete")'),'Session 1 stale completion');
 console.log('PASS live Session 1 CLI and Reset');
 let count=0;
 for(const session of [2,3,4,5,6]){
  await b.navigate(new URL('session-0'+session+'.html',base).href);await until('document.documentElement.dataset.kinenestBoot==="ready"');
  const ids=await b.evaluate('[...document.getElementById("lesson-select").options].map(o=>o.value)');
  for(const [index,id] of ids.entries()){
   await b.evaluate('document.getElementById("lesson-select").value='+JSON.stringify(id)+';document.getElementById("lesson-select").dispatchEvent(new Event("change"));true');
   await until('document.body.dataset.lessonId==='+JSON.stringify(id)+'&&document.body.dataset.lessonState==="ready"&&!document.getElementById("run-python").disabled');
   await b.evaluate('document.getElementById("check").click();true');
   assert.ok(!await b.evaluate('document.getElementById("status").textContent.startsWith("Exercise complete")'),'Empty passed '+id);
   const file=language==='cpp'?'cpp/course/'+id+'.cpp':'python/'+(session===3?'solution-'+(index+1)+'.py':'course/'+id+'.py');
   const code=await readFile(new URL('../tests/'+file,import.meta.url),'utf8');
   await b.evaluate('document.querySelector('+JSON.stringify('[data-code-language="'+language+'"]')+').click();document.getElementById("'+language+'-code").value='+JSON.stringify(code)+';document.getElementById("run-python").click();true');
   await until('document.getElementById("python-state").textContent.includes("callbacks ready")',120);
   if(id.includes('parameter')||id.includes('tuning')){await wait(1000);await command('ros2 param set /student_controller speed 0.6');}
   await until('(()=>{const done=()=>document.getElementById("status").textContent.startsWith("Exercise complete");if(done())return true;const c=document.getElementById("check");if(!c.disabled)c.click();return done()})()',90);
   await b.evaluate('document.getElementById("stop-python").click();true');
   await until('document.getElementById("python-state").textContent.includes("stopped")');
   await b.evaluate('document.getElementById("reset").click();true');
   await until('document.body.dataset.lessonState==="ready"&&!document.getElementById("check").disabled');
   await b.evaluate('document.getElementById("check").click();true');
   assert.ok(!await b.evaluate('document.getElementById("status").textContent.startsWith("Exercise complete")'),'Reset retained completion '+id);
   console.log('PASS live',language,id,'reference, empty, Stop/Reset');count++;
  }
 }
 assert.equal(count,25);console.log('PASS live full course:',browser,commit,'Session 1 CLI + 25 '+language+' exercises');
}finally{await b.close();}
