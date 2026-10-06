import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {serveDirectory} from './static-server.mjs';
import {launch,wait} from './browser-driver.mjs';

const output=process.argv[2]??'/tmp/kinenest-core-bridge-screenshots';
await mkdir(output,{recursive:true});
const directory=fileURLToPath(new URL('../dist/',import.meta.url));
const server=await serveDirectory(directory),browser=await launch('chrome');
async function ready(){for(let i=0;i<200;i++){if(await browser.evaluate('document.documentElement.dataset.kinenestReady==="true"'))return;await wait(100);}throw Error('Bridge did not become ready.');}
async function screenshot(name){const data=await browser.screenshot();await writeFile(output+'/'+name,Buffer.from(data,'base64'));console.log(output+'/'+name);}
try{
  await browser.command('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
  for(const type of ['ament_python','ament_cmake']){
    await browser.navigate(server.url+'bridge.html');await ready();
    await browser.evaluate(`(async()=>{
      const type=${JSON.stringify(type)},doc=document;
      const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
      async function command(number,text,expected){const panel=doc.querySelectorAll('.bridge-terminal')[number-1],input=panel.querySelector('input'),output=panel.querySelector('pre'),before=output.textContent.length;input.value=text;panel.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));for(let i=0;i<600;i++){if(output.textContent.slice(before).includes(expected))return;await wait(250);}throw Error('Command timed out: '+text+' '+output.textContent.slice(-1000));}
      await command(1,'cd src','~/ros2_ws/src');
      await command(1,'ros2 pkg create --build-type '+type+' --license Apache-2.0 my_robot_pkg','Created my_robot_pkg');
      await command(1,'cd ..','~/ros2_ws');
      await command(1,'colcon build','Summary: 1 package(s) built');
      for(let n=1;n<=3;n++)await command(n,'source install/local_setup.bash','Workspace packages are discoverable');
      const file=[...doc.querySelectorAll('#bridge-tree button')].find(el=>el.title.endsWith('/system.launch.py'));file.click();const editor=doc.getElementById('bridge-code');editor.value=editor.value.replace('other_chatter','bridge_chatter');doc.getElementById('bridge-save').click();
      await command(1,'colcon build','Summary: 1 package(s) built');
      await command(1,'ros2 launch my_robot_pkg system.launch.py','Started 2 processes');
      for(let i=0;i<120;i++){if(/Delivered student messages: ([1-9][0-9]*)/.test(doc.getElementById('bridge-graph').textContent))return 'ready';await wait(250);}throw Error('No launched message');
    })()`);
    if(type==='ament_python'){
      await browser.evaluate('window.scrollTo(0,0)');await wait(300);await screenshot('bridge-python-workspace.png');
    }
    await browser.evaluate('document.querySelector(".bridge-terminals").scrollIntoView({block:"start"})');await wait(300);
    await screenshot(type==='ament_python'?'bridge-python-launch.png':'bridge-cpp-launch.png');
    await browser.evaluate('document.getElementById("bridge-reset").click()');
  }
  await browser.command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
  await browser.navigate(server.url+'bridge.html');await ready();
  await browser.evaluate('document.getElementById("language").value="it";document.getElementById("language").dispatchEvent(new Event("change"));window.scrollTo(0,0)');await wait(300);
  await screenshot('bridge-it-mobile.png');
}finally{await browser.close();server.close();}
