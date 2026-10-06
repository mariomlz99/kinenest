const frame=document.getElementById('app');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(predicate,label){const end=Date.now()+20000;while(Date.now()<end){if(predicate())return;await sleep(100);}throw Error('Timed out: '+label);}
async function command(index,text,expected,{error=false}={}){
  const panel=frame.contentDocument.querySelectorAll('#terminals .terminal')[index],output=panel.querySelector('pre'),input=panel.querySelector('input'),before=output.textContent.length;
  input.value=text;panel.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await until(()=>output.textContent.slice(before).includes('$ '+text),'command echo '+text);
  await sleep(0);
  if(expected)await until(()=>output.textContent.slice(before).includes(expected),text);
  if(!error&&output.textContent.slice(before).includes('Error:'))throw Error(text+': '+output.textContent.slice(before));
  return output.textContent.slice(before);
}
try{
  for(let number=1;number<=6;number++){
    const page='session-0'+number+'.html';
    frame.src='../'+page;await new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject;});
    await until(()=>frame.contentDocument.documentElement.dataset.kinenestReady==='true',page+' ready');
    await command(0,'pwd','/home/learner/ros2_ws');
    await command(0,'mkdir -p scratch/nested');await command(0,'ls','scratch/');
    await command(0,'touch scratch/nested/note.txt');await command(1,'ls scratch/nested','note.txt');
    await command(1,'cp scratch/nested/note.txt scratch/copy.txt');await command(0,'mv scratch/copy.txt scratch/moved.txt');
    await command(1,'ls scratch','moved.txt');await command(0,'rm -rf scratch');
    const panel=frame.contentDocument.querySelectorAll('#terminals .terminal')[1],before=panel.querySelector('pre').textContent.length;
    await command(1,'ls');if(panel.querySelector('pre').textContent.slice(before).includes('scratch/'))throw Error(page+' removal not shared between terminals');
    await command(0,'cd src','~/ros2_ws/src');if(frame.contentDocument.querySelector('#terminals .terminal-cwd')?.textContent!=='~/ros2_ws/src')throw Error(page+' current directory display did not update');
    await command(0,'ros2 pkg create --build-type ament_cmake --license Apache-2.0 my_robot_pkg','Created my_robot_pkg');
    await command(1,'ros2 topic list','/cmd_vel');
    await fetch('/progress',{method:'POST',body:'PASS '+page+' shared file and ROS commands'});
  }
  // wrong-topic-graph-debugging: a valid disconnected topic must carry messages
  // without driving the simulator. Stop echo before asserting zero subscribers.
  frame.src='../session-01.html';await new Promise(resolve=>frame.onload=resolve);
  await until(()=>frame.contentDocument.documentElement.dataset.kinenestReady==='true','graph debugging page ready');
  const d=frame.contentDocument,assert=(ok,message)=>{if(!ok)throw Error(message);};
  d.getElementById('add-terminal').click();
  const panels=d.querySelectorAll('#terminals .terminal'),pose=d.getElementById('robot').getAttribute('transform');
  await command(0,'ros2 topic pub -r 2 /cmdd_vel geometry_msgs/msg/Twist "{linear: {x: 0.6}}"','publishing #1');
  let info=await command(2,'ros2 topic info /cmdd_vel -v','Subscriber nodes: (none)');
  assert(info.includes('Publisher count: 1')&&info.includes('Subscription count: 0'),'Publisher-only typo topic endpoints incorrect');
  await command(1,'ros2 topic echo /cmdd_vel','x: 0.6');
  info=await command(2,'ros2 topic info /cmdd_vel -v','Subscriber nodes: /ros2cli_echo_2');
  assert(info.includes('Publisher count: 1')&&info.includes('Subscription count: 1'),'Active echo must count as a typo-topic subscriber');
  await until(()=>panels[0].querySelector('pre').textContent.includes('publishing #3'),'repeated typo publications');
  assert(d.getElementById('robot').getAttribute('transform')===pose,'Typo publisher moved robot');
  info=await command(2,'ros2 topic info /cmd_vel -v','Subscriber nodes: /simulator');
  assert(info.includes('Publisher count: 0')&&info.includes('Subscription count: 1'),'Real command topic endpoints changed');
  panels[1].querySelector('.stop-echo').click();
  info=await command(2,'ros2 topic info /cmdd_vel -v','Subscriber nodes: (none)');
  assert(info.includes('Publisher count: 1')&&info.includes('Subscription count: 0')&&info.includes('Publisher nodes: /ros2cli_pub_1'),'Typo graph endpoints incorrect');
  panels[0].querySelector('.stop-echo').click();
  const topics=await command(2,'ros2 topic list','/cmd_vel');
  assert(!topics.split('\n').includes('/cmdd_vel'),'Empty typo topic survived publisher Stop');
  for(const [input,message] of [
    ['ros2 topic pub --once cmdvel geometry_msgs/msg/Twist "{linear: {x: 0.6}}"','Use an absolute topic name'],
    [`ros2 topic pub --once /cmd_vel std_msgs/msg/String '{"data":"oops"}'`,'Topic type mismatch: geometry_msgs/msg/Twist'],
    ['ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {y: 1}}"','This 2D lab supports only linear.x and angular.z'],
    ['ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 3}}"','Lab limits:'],
    [`ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist '{"linear":{"x":1e309}}'`,'Vector components must be finite numbers.'],
    ['ros2 topic echo /does_not_exist','Unknown topic: /does_not_exist']
  ])await command(2,input,'Error: '+message,{error:true});
  await command(0,'ros2 topic pub -r 2 /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.6}}"','publishing #1');
  await until(()=>d.getElementById('robot').getAttribute('transform')!==pose,'Corrected topic moves robot');
  panels[0].querySelector('.stop-echo').click();
  await command(0,'ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0}, angular: {z: 0}}"','Published one message on /cmd_vel');
  await sleep(100);
  const stoppedPose=d.getElementById('robot').getAttribute('transform');
  await sleep(500);
  assert(d.getElementById('robot').getAttribute('transform')===stoppedPose,'Explicit zero Twist did not stop robot');
  await fetch('/progress',{method:'POST',body:'PASS wrong-topic-graph-debugging and terminal errors'});
  await fetch('/done',{method:'POST',body:'PASS terminal commands across all six Foundations pages'});
}catch(error){await fetch('/done',{method:'POST',body:'FAIL terminal browser: '+(error.stack??error)});}
