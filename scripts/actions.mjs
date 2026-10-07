import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true});
let page;try {
 page=await browser.newPage();page.on('console',msg=>{console.log(msg.text());});page.on('pageerror',e=>console.error(e));
 await page.goto(process.env.LAB_URL||'http://127.0.0.1:8022/basics.html');
 await page.evaluate(async()=>{
  const appURL=document.querySelector('script[src*="/app.js"]').src;const {Lab}=await import(new URL('./lab.js',appURL));const {actionFiles}=await import(new URL('./action-examples.js',appURL));
  window.actionLab=new Lab();window.actionOutput=[];const lab=window.actionLab;lab.onOutput=(id,s)=>{window.actionOutput.push(s);console.log(s);};
  const t=lab.terminal();await t.execute('mkdir -p ~/ros2_ws/src');await t.execute('cd ~/ros2_ws/src');
  for(const language of ['python','cpp']){const py=language==='python',pkg=py?'py_actions':'cpp_actions';await t.execute(`ros2 pkg create --build-type ${py?'ament_python':'ament_cmake'} ${pkg} --dependencies ${py?'rclpy':'rclcpp rclcpp_action'} action_tutorials_interfaces`);for(const [path,source]of Object.entries(actionFiles(language))){const full='/home/learner/ros2_ws/src/'+pkg+'/'+path;lab.fs.mkdir(full.slice(0,full.lastIndexOf('/')),true);lab.fs.write(full,source);}await lab.builder.build([pkg],line=>console.log(line));}
 });
 console.log('PASS Python and C++ Actions build');
 for(const server of ['py_actions','cpp_actions']){
  await page.evaluate(async pkg=>{window.actionOutput=[];await actionLab.processes.run(pkg,'server');},server);
  await page.waitForFunction(()=>actionLab.runtime.actions.servers.has('/fibonacci'),null,{timeout:120000});
  for(const client of ['py_actions','cpp_actions'])for(const executable of ['client','cancel_client']){
   await page.evaluate(async({client,executable})=>{window.actionOutput=[];await actionLab.processes.run(client,executable);},{client,executable});
   const status=executable==='client'?4:5;
   await page.waitForFunction(status=>actionOutput.some(s=>s.includes('Result status: '+status)),status,{timeout:120000});
   assert(await page.evaluate(()=>actionOutput.some(s=>s.includes('Feedback:'))));
   await page.waitForFunction(()=>!actionLab.runtime.nodes.has('/fibonacci_client'));
   assert.equal(await page.evaluate(()=>actionLab.runtime.actions.goals.size),0);
   console.log(`PASS ${server} → ${client}/${executable}: feedback and status ${status}`);
  }
  await page.evaluate(async()=>{const t=actionLab.terminal();window.actionOutput=[];t.output=s=>actionOutput.push(s);await t.execute("ros2 action send_goal /fibonacci action_tutorials_interfaces/action/Fibonacci '{order: -1}'");});
  await page.waitForFunction(()=>actionOutput.some(s=>s.includes('Goal rejected')));
  await page.evaluate(()=>actionLab.processes.stopAll());
  assert.equal(await page.evaluate(()=>actionLab.runtime.actions.servers.size),0);
  assert.equal(await page.evaluate(()=>actionLab.runtime.actions.goals.size),0);
  console.log(`PASS ${server}: rejection and cleanup`);
 }
 console.log('PASS Actions cross-language lifecycle');
}catch(error){console.error(await page?.evaluate(()=>({output:window.actionOutput,goals:[...actionLab.runtime.actions.goals.values()].map(g=>({id:g.id,status:g.status})),events:actionLab.runtime.actions.events,processes:actionLab.processes.active().map(p=>({name:p.name,executable:p.executable,output:p.output}))})));throw error;}finally{await browser.close();}
