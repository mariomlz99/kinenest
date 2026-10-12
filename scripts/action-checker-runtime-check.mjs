// Run bad and repaired action servers in actual Python/C++ workers.
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
try{
 const page=await browser.newPage();await page.goto(process.env.LAB_URL||'http://127.0.0.1:8034/basics.html');
 await page.exposeFunction('actionProgress',s=>console.log(s));
 for(const language of ['python','cpp']){
  const result=await page.evaluate(async language=>{
   const base=document.querySelector('script[type=module]').src,{Lab}=await import(new URL('lab.js',base)),{actionFiles}=await import(new URL('action-examples.js',base)),{unitChecks}=await import(new URL('units/checks.js',base));
   const lab=new Lab(),t=lab.terminal(),inspect=lab.terminal(),log=[],cases=[],py=language==='python',pkg=py?'py_actions':'cpp_actions',root='/home/learner/ros2_ws/src/'+pkg+'/',serverFile=py?pkg+'/server.py':'src/server.cpp',files=actionFiles(language);
   lab.onOutput=(id,s)=>log.push(s);t.output=s=>log.push(s);inspect.output=s=>log.push(s);
   const sleep=ms=>new Promise(r=>setTimeout(r,ms)),checks=()=>unitChecks(lab,6).map(c=>c.passed);
   const until=async(fn,label)=>{for(let i=0;i<1800;i++){if(fn())return;await sleep(50);}throw Error(label+' '+log.slice(-12).join('\n'));};
   const record=async(label,passed)=>{if(!passed)throw Error(label+' '+JSON.stringify(checks())+' '+log.slice(-12).join('\n'));cases.push(label);await window.actionProgress(language+': '+label);};
   const compile=async()=>{await t.execute('cd ~/ros2_ws');await t.execute('colcon build --packages-select '+pkg);if(!lab.workspace.current(pkg))throw Error('Build failed '+log.slice(-12).join('\n'));};
   const start=async()=>{await lab.processes.run(pkg,'server');await until(()=>lab.runtime.actions.servers.has('/fibonacci'),'server startup');};
   const client=async(executable,status)=>{log.length=0;await lab.processes.run(pkg,executable);await until(()=>log.some(s=>s.includes('Result status: '+status)),'client result');await until(()=>!lab.runtime.nodes.has('/fibonacci_client'),'client cleanup');};
   const reject=async()=>{log.length=0;await inspect.execute("ros2 action send_goal /fibonacci action_tutorials_interfaces/action/Fibonacci '{order: -1}'");await until(()=>log.some(s=>s.includes('Goal rejected')),'rejection');};
   try{
    await t.execute('mkdir -p ~/ros2_ws/src');await t.execute('cd ~/ros2_ws/src');await t.execute(`ros2 pkg create ${pkg} --build-type ${py?'ament_python':'ament_cmake'} --dependencies ${py?'rclpy':'rclcpp rclcpp_action'} action_tutorials_interfaces`);
    for(const [path,source]of Object.entries(files)){lab.fs.mkdir((root+path).slice(0,(root+path).lastIndexOf('/')),true);lab.fs.write(root+path,source);}
    const bad=files[serverFile].replace(py?'sequence.append(sequence[-1] + sequence[-2])':'sequence_.push_back(sequence_[sequence_.size()-1] + sequence_[sequence_.size()-2]);',py?'sequence.append(99)':'sequence_.push_back(99);');
    if(bad===files[serverFile])throw Error('Bad-server fixture did not modify the source');
    lab.fs.write(root+serverFile,bad);await compile();await start();await client('client',4);await client('cancel_client',5);await reject();
    await record('Wrong Fibonacci output is rejected despite successful statuses',checks().join(',')==='false,false,true,true');lab.processes.stopAll();
    lab.fs.write(root+serverFile,files[serverFile]);await compile();await start();await record('Repaired server cannot reuse previous-run evidence',checks().every(v=>!v));
    await inspect.execute("ros2 action send_goal /fibonacci action_tutorials_interfaces/action/Fibonacci '{order: 8}' --feedback");await until(()=>lab.runtime.actions.goals.size===0,'CLI goal result');
    await record('Valid CLI result cannot replace the program client',checks()[0]&&!checks()[1]);
    await client('client',4);await client('cancel_client',5);await reject();await record('Repaired real server and clients pass all checks',checks().every(Boolean));
    lab.processes.stopAll();await record('Visible final server Stop preserves earned completion',checks().every(Boolean));
    await start();await record('Rerun must earn fresh feedback, result, cancellation and rejection',checks().every(v=>!v));
    lab.reset();await record('Reset removes action evidence and endpoints',checks().every(v=>!v)&&lab.runtime.actions.events.length===0&&lab.runtime.actions.servers.size===0&&lab.runtime.actions.goals.size===0);
    return {language,passed:true,cases};
   }finally{lab.reset();}
  },language);
  assert(result.passed);await mkdir('artifacts/audit',{recursive:true});await writeFile('artifacts/audit/action-checker-'+language+'.json',JSON.stringify(result,null,2));
 }
}finally{await browser.close();}
