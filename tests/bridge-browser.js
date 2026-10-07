const target=new URLSearchParams(location.search).get('language')==='cpp'?'cpp':'python';
const frame=document.getElementById('app');
const timings={};const openedAt=performance.now();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(predicate,label,ms=120000){const end=Date.now()+ms;while(Date.now()<end){if(predicate())return;await sleep(250);}throw Error('Timed out: '+label+'\n'+frame.contentDocument?.getElementById('bridge-terminal-grid')?.textContent?.slice(-2000));}
async function report(message){await fetch('/progress',{method:'POST',body:target+': '+message});}
async function command(number,text,expect){const panel=frame.contentDocument.querySelectorAll('.bridge-terminal')[number-1],input=panel.querySelector('input'),before=panel.querySelector('pre').textContent.length;input.value=text;panel.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));if(expect)await until(()=>panel.querySelector('pre').textContent.slice(before).includes(expect),text,150000);}
function edit(file,change){const doc=frame.contentDocument,button=[...doc.querySelectorAll('#bridge-tree button')].find(el=>el.title.endsWith('/'+file));if(!button)throw Error('Missing editor file '+file);button.click();const textarea=doc.getElementById('bridge-code');textarea.value=change(textarea.value);doc.getElementById('bridge-save').click();}
function graph(){return frame.contentDocument.getElementById('bridge-graph').textContent;}
function delivered(){return Number(/Delivered student messages: (\d+)/.exec(graph())?.[1]??0);}
try{
  await new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject;});
  await until(()=>frame.contentDocument.documentElement.dataset.kinenestReady==='true','bridge ready',20000);
  timings.workspaceReadyMs=Math.round(performance.now()-openedAt);
  if(frame.contentDocument.querySelector('.bridge-cwd')?.textContent!=='~/ros2_ws')throw Error('Terminal did not show its initial workspace directory');
  if(!frame.contentDocument.querySelector('.bridge-command-guide')?.textContent.includes('cd src'))throw Error('Command explanations are missing');
  if([...frame.contentDocument.querySelectorAll('.bridge-checkpoints progress')].length!==3||[...frame.contentDocument.querySelectorAll('.bridge-checkpoints progress')].some(p=>p.value!==0))throw Error('Checkpoints must begin empty');
  await report('opened');
  await command(1,'cd src','~/ros2_ws/src');
  await command(1,'ros2 pkg create --build-type '+(target==='cpp'?'ament_cmake':'ament_python')+' --license Apache-2.0 my_robot_pkg','Created my_robot_pkg');
  [...frame.contentDocument.querySelectorAll('#bridge-tree button')].find(button=>button.title.endsWith('/package.xml')).click();
  if(!frame.contentDocument.getElementById('bridge-file-explainer')?.textContent.includes('dependencies'))throw Error('Editor file explanation is missing');
  edit(target==='cpp'?'publisher.cpp':'publisher.py',source=>source+'\n// learner edit\n'.replace('// learner edit',target==='cpp'?'// learner edit':'# learner edit'));
  await command(1,'cd ..');
  if(target==='cpp'){
    const panel=frame.contentDocument.querySelectorAll('.bridge-terminal')[0],input=panel.querySelector('input');
    input.value='colcon build';panel.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));frame.contentDocument.getElementById('bridge-stop-all').click();
    await until(()=>panel.querySelector('pre').textContent.includes('Build cancelled.'),'C++ compile cancellation',10000);
    if([...frame.contentDocument.querySelectorAll('#bridge-tree button')].some(el=>el.title.includes('/install/my_robot_pkg/lib/')))throw Error('Cancelled C++ build left installed executable');
  }
  let started=performance.now();await command(1,'colcon build','Summary: 1 package(s) built');timings.firstBuildMs=Math.round(performance.now()-started);
  if(target==='python'&&frame.contentWindow.performance.getEntriesByType('resource').some(entry=>entry.name.includes('wasm-clang')||entry.name.includes('/src/cpp/')))throw Error('Python-only workspace fetched C++ compiler assets');
  await report('build complete');
  const sourceFile=target==='cpp'?'publisher.cpp':'publisher.py',badLine='\nthis is invalid source\n';
  edit(sourceFile,source=>source+badLine);
  await command(1,'colcon build','Failed <<< my_robot_pkg');
  edit(sourceFile,source=>source.replace(badLine,''));
  started=performance.now();await command(1,'colcon build','Summary: 1 package(s) built');timings.recoveryBuildMs=Math.round(performance.now()-started);
  for(let n=1;n<=3;n++)await command(n,'source ~/ros2_ws/install/local_setup.bash','Workspace packages are discoverable');
  started=performance.now();await command(1,'ros2 run my_robot_pkg publisher','Started my_robot_pkg/publisher');timings.firstRunMs=Math.round(performance.now()-started);
  await command(2,'ros2 run my_robot_pkg subscriber','Started my_robot_pkg/subscriber');
  await until(()=>graph().includes('/talker')&&graph().includes('/listener')&&delivered()>0,'manual two-node message',120000);
  await command(3,'ros2 node list');await command(3,'ros2 topic list');await command(3,'ros2 topic echo /chatter');
  await until(()=>frame.contentDocument.querySelectorAll('.bridge-terminal')[2].querySelector('pre').textContent.includes('hello'),'topic echo',30000);
  const panels=frame.contentDocument.querySelectorAll('.bridge-terminal');
  panels[0].querySelector('.bridge-stop').click();await until(()=>!graph().includes('/talker')&&graph().includes('/listener'),'stop one manual process',10000);
  started=performance.now();panels[1].querySelector('.bridge-stop').click();await until(()=>!graph().includes('/listener'),'stop second manual process',10000);timings.stopMs=Math.round(performance.now()-started);
  const manualBaseline=delivered();await command(1,'ros2 run my_robot_pkg publisher','Started my_robot_pkg/publisher');await command(2,'ros2 run my_robot_pkg subscriber','Started my_robot_pkg/subscriber');await until(()=>delivered()>manualBaseline,'manual rerun',30000);frame.contentDocument.getElementById('bridge-stop-all').click();
  await until(()=>!graph().includes('/ros2cli_')&&!graph().includes('/talker')&&!graph().includes('/listener'),'Stop All removes package and echo endpoints',10000);
  await command(3,'ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.2}}"');
  await command(2,'ros2 topic echo /cmd_vel');
  await until(()=>graph().includes('/ros2cli_pub_')&&graph().includes('/ros2cli_echo_'),'CLI processes active',10000);
  frame.contentDocument.getElementById('bridge-stop-all').click();
  await sleep(1200);
  if(graph().includes('/ros2cli_')||[...frame.contentDocument.querySelectorAll('.bridge-stop')].some(button=>!button.disabled))throw Error('Stop All retained an active CLI process');
  await report('manual run/stop complete');
  await command(1,'ros2 launch my_robot_pkg system_launch.py','Started 2 processes');
  await until(()=>graph().includes('/other_chatter')&&graph().includes('/bridge_chatter'),'faulty remap',120000);
  frame.contentDocument.getElementById('bridge-stop-all').click();
  const resolvedTopic=target==='cpp'?'/other_chatter':'/bridge_chatter';
  edit('system_launch.py',source=>target==='cpp'?source.replace("('chatter', 'bridge_chatter')","('chatter', 'other_chatter')"):source.replace('other_chatter','bridge_chatter'));
  await command(1,'colcon build','Summary: 1 package(s) built');
  const beforeMessages=delivered();started=performance.now();await command(1,'ros2 launch my_robot_pkg system_launch.py','Started 2 processes');
  await until(()=>graph().includes(resolvedTopic)&&delivered()>beforeMessages,'fixed launch message',120000);
  timings.launchToMessageMs=Math.round(performance.now()-started);
  frame.contentDocument.getElementById('bridge-check').click();
  const failures=[...frame.contentDocument.querySelectorAll('#bridge-results .fail')].map(el=>el.textContent);
  if(failures.length)throw Error('Checks failed: '+failures.join('; '));
  if([...frame.contentDocument.querySelectorAll('.bridge-checkpoints progress')].some(p=>p.value!==3))throw Error('Completed system did not complete all checkpoints');
  frame.contentDocument.getElementById('bridge-stop-all').click();await until(()=>!graph().includes('/talker'),'launch stop',10000);
  await command(1,'ros2 launch my_robot_pkg system_launch.py','Started 2 processes');await until(()=>graph().includes('/listener'),'launch rerun',10000);
  frame.contentDocument.querySelector('.bridge-terminal .bridge-close').click();await until(()=>!graph().includes('/talker')&&!graph().includes('/listener'),'closing launch terminal',10000);
  await command(1,'ros2 launch my_robot_pkg system_launch.py','Started 2 processes');await until(()=>graph().includes('/listener'),'launch after terminal close',10000);
  frame.contentWindow.dispatchEvent(new Event('pagehide'));await until(()=>!graph().includes('/talker')&&!graph().includes('/listener')&&!graph().includes('/chatter'),'navigation cleanup',10000);
  await command(1,'ros2 launch my_robot_pkg system_launch.py','Started 2 processes');await until(()=>graph().includes('/listener'),'launch after navigation cleanup',10000);
  started=performance.now();frame.contentDocument.getElementById('bridge-reset').click();
  await until(()=>!graph().includes('/talker')&&!graph().includes('/listener')&&frame.contentDocument.querySelectorAll('#bridge-tree button').length===0,'reset cleanup',10000);
  if([...frame.contentDocument.querySelectorAll('.bridge-checkpoints progress')].some(p=>p.value!==0))throw Error('Reset retained checkpoint evidence');
  timings.resetMs=Math.round(performance.now()-started);
  await report('timings '+JSON.stringify(timings));
  await fetch('/done',{method:'POST',body:'PASS bridge '+target+' create/build/source/manual/echo/fault/relaunch/reset'});
}catch(error){await fetch('/done',{method:'POST',body:'FAIL bridge '+target+': '+(error.stack??error)});}
