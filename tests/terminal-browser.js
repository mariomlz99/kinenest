const frame=document.getElementById('app');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(predicate,label){const end=Date.now()+20000;while(Date.now()<end){if(predicate())return;await sleep(100);}throw Error('Timed out: '+label);}
async function command(index,text,expected){
  const panel=frame.contentDocument.querySelectorAll('#terminals .terminal')[index],output=panel.querySelector('pre'),input=panel.querySelector('input'),before=output.textContent.length;
  input.value=text;panel.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await until(()=>output.textContent.slice(before).includes('$ '+text),'command echo '+text);
  await sleep(0);
  if(expected)await until(()=>output.textContent.slice(before).includes(expected),text);
  if(output.textContent.slice(before).includes('Error:'))throw Error(text+': '+output.textContent.slice(before));
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
  await fetch('/done',{method:'POST',body:'PASS terminal commands across all six Foundations pages'});
}catch(error){await fetch('/done',{method:'POST',body:'FAIL terminal browser: '+(error.stack??error)});}
