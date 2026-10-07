import {setupPreferences,language} from './preferences.js';
import {pageReady,pageFailed} from './page-ready.js';
import {BRIDGE_TEXT} from './bridge-locales.js';
import {BRIDGE_STATUS} from './bridge-status.js';
import {Runtime} from '../runtime/graph.js';
import {WorkspaceModel,ROOT} from '../bridge/workspace.js';
import {BuildSystemAdapter} from '../bridge/build.js';
import {ProcessManager} from '../bridge/processes.js';
import {BridgeTerminal} from '../bridge/terminal.js';
import {exportPackageZip} from '../bridge/export.js';

const $=id=>document.getElementById(id),runtime=new Runtime(),workspace=new WorkspaceModel(),builder=new BuildSystemAdapter(workspace);
const terminals=new Map(),edited=new Set(),observed=new Set();let selected=null,nextTerminal=0,manualSeen=false,faultSeen=false,launchGroup=null,launchBaseline=0,last=0,accumulator=0,lastGraph=0;
const processes=new ProcessManager(runtime,workspace,{onChange:renderGraph,onOutput:(process,line)=>terminals.get(process.terminal)?.write('['+process.name+'/'+process.executable+'] '+line)});

const status=()=>BRIDGE_STATUS[language()]??BRIDGE_STATUS.en;
function localize(){const rows=BRIDGE_TEXT[language()]??BRIDGE_TEXT.en;for(const node of document.querySelectorAll('[data-bridge]'))node.textContent=rows[node.dataset.bridge]??BRIDGE_TEXT.en[node.dataset.bridge];for(const {panel,terminal} of terminals.values()){panel.querySelector('.session-state').textContent=terminal.running?status().active:status().ready;panel.querySelector('.bridge-cwd').textContent=terminal.cwd.replace('/home/learner','~');panel.querySelector('.bridge-stop').textContent=status().stop;panel.querySelector('.bridge-close').setAttribute('aria-label',status().close+' '+terminal.id);panel.querySelector('pre').setAttribute('aria-label','Terminal '+terminal.id+' '+status().output);panel.querySelector('form button').textContent=status().execute;panel.querySelector('.terminal-tip').textContent=status().tip;}if(!selected)$('bridge-path').textContent=status().selected;$('bridge-file-explainer').textContent=rows[filePurpose(selected)]??BRIDGE_TEXT.en[filePurpose(selected)];if($('bridge-results').children.length)check();renderCheckpoints(evaluateChecks());}
window.addEventListener('languagechange',localize);localize();
function relative(path){return path.replace('/home/learner/','~/');}
function renderFiles(){
  if(selected&&!workspace.exists(selected)){selected=null;$('bridge-code').value='';$('bridge-code').disabled=true;$('bridge-save').disabled=true;$('bridge-path').textContent=status().selected;$('bridge-file-explainer').textContent=(BRIDGE_TEXT[language()]??BRIDGE_TEXT.en).filePurposeDefault;$('bridge-save-state').textContent='';}
  $('bridge-language').disabled=workspace.packages().length>0;
  const tree=$('bridge-tree');tree.replaceChildren();
  function descend(path,level=0){
    for(const item of workspace.list(path).sort((a,b)=>(a.kind===b.kind?0:a.kind==='dir'?-1:1)||a.name.localeCompare(b.name))){
      const full=path+'/'+item.name,li=document.createElement('li');li.style.paddingLeft=level*12+'px';
      if(item.kind==='dir'){li.className='folder';li.textContent='▸ '+item.name+'/';tree.append(li);if(level<4)descend(full,level+1);}
      else{const button=document.createElement('button');button.type='button';button.textContent=item.name;button.title=relative(full);button.setAttribute('aria-current',String(full===selected));button.onclick=()=>selectFile(full);li.append(button);tree.append(li);}
    }
  }
  descend(ROOT);
}
function renderCreateCommand(){$('bridge-create-command').textContent='ros2 pkg create --build-type '+$('bridge-language').value+' --license Apache-2.0 my_robot_pkg';}
$('bridge-language').addEventListener('change',renderCreateCommand);renderCreateCommand();
function filePurpose(path){if(!path)return 'filePurposeDefault';if(path.endsWith('/package.xml'))return 'filePurposeManifest';if(path.endsWith('/setup.py'))return 'filePurposeSetup';if(path.endsWith('/setup.cfg'))return 'filePurposeSetupCfg';if(path.endsWith('/CMakeLists.txt'))return 'filePurposeCmake';if(path.endsWith('launch.py'))return 'filePurposeLaunch';if(/\/(publisher|subscriber)\.(py|cpp)$/.test(path))return 'filePurposeNode';return 'filePurposeOther';}
function selectFile(path){if(workspace.entry(path).kind!=='file')return;selected=path;$('bridge-path').textContent=relative(path);$('bridge-file-explainer').textContent=(BRIDGE_TEXT[language()]??BRIDGE_TEXT.en)[filePurpose(path)];$('bridge-code').value=workspace.read(path);$('bridge-code').disabled=false;$('bridge-save').disabled=false;$('bridge-save-state').textContent='';renderFiles();}
$('bridge-save').onclick=()=>{if(!selected)return;const content=$('bridge-code').value;if(content!==workspace.read(selected)){workspace.write(selected,content);edited.add(selected);$('bridge-save-state').textContent=status().saved;}else $('bridge-save-state').textContent=status().unchanged;renderFiles();renderGraph();};
$('bridge-export').onclick=()=>{const name=workspace.packages()[0];if(!name){$('bridge-save-state').textContent=status().create;return;}const url=URL.createObjectURL(exportPackageZip(workspace,name)),link=document.createElement('a');link.href=url;link.download=name+'.zip';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('bridge-save-state').textContent=name+'.zip · '+status().exported;};

function createTerminal(){
  const id=++nextTerminal,panel=document.createElement('section');panel.className='panel terminal bridge-terminal';panel.innerHTML='<div class="panel-head"><h3>Terminal '+id+'</h3><span class="bridge-cwd">~/ros2_ws</span><span class="session-state" role="status">'+status().ready+'</span><button type="button" class="bridge-stop">'+status().stop+'</button><button type="button" class="bridge-close" aria-label="'+status().close+' '+id+'">×</button></div><pre role="log" tabindex="0" aria-label="Terminal '+id+' '+status().output+'"></pre><form><label for="bridge-command-'+id+'">$</label><input id="bridge-command-'+id+'" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" placeholder="help"><button type="submit">'+status().execute+'</button></form><p class="terminal-tip">'+status().tip+'</p>';
  const output=panel.querySelector('pre'),input=panel.querySelector('input'),stop=panel.querySelector('.bridge-stop');
  const write=line=>{if(line==='\f'){output.textContent='';return;}const follow=output.scrollHeight-output.scrollTop-output.clientHeight<35;output.textContent=(output.textContent+'\n'+line+'\n').slice(-30000);if(follow)output.scrollTop=output.scrollHeight;};
  const terminal=new BridgeTerminal(id,runtime,workspace,builder,processes,write,()=>{panel.querySelector('.session-state').textContent=terminal.running?status().active:status().ready;panel.querySelector('.bridge-cwd').textContent=terminal.cwd.replace('/home/learner','~');stop.disabled=!terminal.running;renderGraph();});
  let history=[],cursor=0;
  panel.querySelector('form').onsubmit=async event=>{event.preventDefault();const command=input.value.trim();if(!command)return;input.value='';history.push(command);cursor=history.length;
    try{await terminal.run(command);if(command.startsWith('ros2 node list'))observed.add('nodes');if(command.startsWith('ros2 topic list'))observed.add('topics');if(command.startsWith('ros2 topic echo'))observed.add('echo');}
    catch(error){write('Error: '+error.message);}finally{panel.querySelector('.bridge-cwd').textContent=terminal.cwd.replace('/home/learner','~');renderFiles();renderGraph();input.focus();}
  };
  panel.onkeydown=event=>{if(event.ctrlKey&&event.key.toLowerCase()==='c'){event.preventDefault();terminal.stop();input.focus();}if(event.target===input&&['ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();cursor=Math.max(0,Math.min(history.length,cursor+(event.key==='ArrowUp'?-1:1)));input.value=history[cursor]??'';}};
  stop.onclick=()=>terminal.stop();panel.querySelector('.bridge-close').onclick=()=>{if(terminals.size<2)return;terminal.stop();terminals.delete(id);panel.remove();renderGraph();};
  write(status().welcome);terminals.set(id,{terminal,panel,input,write,output});$('bridge-terminal-grid').append(panel);stop.disabled=true;return terminal;
}
$('bridge-add-terminal').onclick=()=>createTerminal();
function renderGraph(){
  const active=processes.active(),groups=[...processes.groups].filter(([,ids])=>ids.size>0);
  const currentGroup=groups.at(-1)?.[0];if(currentGroup&&currentGroup!==launchGroup){launchGroup=currentGroup;launchBaseline=runtime.course.messages;}
  const manual=active.filter(p=>!p.group),manualNames=new Set(manual.map(p=>p.executable));
  if(manualNames.has('publisher')&&manualNames.has('subscriber')&&processes.communicated(manual))manualSeen=true;
  const connected=runtime.topics.get('/bridge_chatter');
  if(currentGroup&&connected?.publishers.size&&runtime.topics.get('/other_chatter')?.subscribers.size)faultSeen=true;
  const lines=['Processes: '+(active.length||'none'),...active.map(p=>'  #'+p.id+' '+p.name+'/'+p.executable+' · '+p.state+(p.group?' · '+p.group:'')), 'Nodes: '+[...runtime.nodes].sort().join(', '), 'Topics:', ...[...runtime.topics].sort(([a],[b])=>a.localeCompare(b)).map(([name,t])=>'  '+name+' ['+t.type+']  pub: '+([...t.publishers].join(', ')||'—')+'  sub: '+([...t.subscribers].join(', ')||'—')), 'Delivered student messages: '+runtime.course.messages];
  $('bridge-graph').textContent=lines.join('\n');
  renderCheckpoints(evaluateChecks());
}
function evaluateChecks(){
  const records=[...workspace.installed.values()],names=workspace.packages(),active=processes.active();
  const group=active.find(p=>p.group)?.group,launched=active.filter(p=>p.group===group),owned=new Set(launched.flatMap(p=>[...(p.adapter?.nodes??[])]));
  const linked=[...runtime.topics].filter(([,topic])=>[...topic.publishers].some(node=>owned.has(node))&&[...topic.subscribers].some(node=>owned.has(node)));
  const remapTargets=new Set(launched.flatMap(p=>(p.ros?.remappings??[]).map(([,to])=>to.startsWith('/')?to:'/'+[(p.ros?.namespace??'').replace(/^\/+|\/+$/g,''),to].filter(Boolean).join('/'))));
  const launchPass=!!group&&processes.communicated(launched,{topics:new Set(linked.map(([name])=>name).filter(name=>remapTargets.has(name)))});
  const parameter=[...owned].some(node=>runtime.parameters.get(node)?.get('prefix')==='received');
  const checks=[
    ['A supported package exists in ros2_ws/src',names.length>0],
    ['Node source was edited and saved', [...edited].some(path=>/\/(publisher|subscriber)\.(py|cpp)$/.test(path))],
    ['A current package build is installed',records.length>0&&records.length===names.length],
    ['A terminal sourced the install space',[...terminals.values()].some(t=>t.terminal.sourced)],
    ['Two manual executables exchanged messages',manualSeen],
    ['The graph was inspected with node, topic and echo commands',['nodes','topics','echo'].every(x=>observed.has(x))],
    ['The launch configuration fault was observed',faultSeen],
    ['One launch starts both nodes and remaps a communicating topic',launchPass],
    ['The launch parameter reaches a running node',parameter&&launchPass]
  ];
  return checks;
}
function renderCheckpoints(checks){
  for(let group=0;group<3;group++){
    const items=checks.slice(group*3,group*3+3),list=$('bridge-checkpoint-'+group);
    const signature=language()+items.map(([,passed])=>Number(passed)).join('');
    if(list.dataset.state===signature)continue;
    list.dataset.state=signature;list.replaceChildren();
    $('bridge-progress-'+group).value=items.filter(([,passed])=>passed).length;
    items.forEach(([,passed],offset)=>{const item=document.createElement('li');item.className=passed?'pass':'pending';item.textContent=(passed?'✓ ':'○ ')+status().checks[group*3+offset];list.append(item);});
  }
}
function check(){
  const checks=evaluateChecks();renderCheckpoints(checks);
  const list=$('bridge-results');list.replaceChildren();checks.forEach(([,passed],index)=>{const item=document.createElement('li');item.className=passed?'pass':'fail';item.textContent=(passed?'✓ ':'○ ')+status().checks[index];list.append(item);});
  return checks.every(([,passed])=>passed);
}
$('bridge-check').onclick=check;
$('bridge-stop-all').onclick=()=>{builder.cancel();for(const {terminal} of terminals.values())terminal.stop(false);processes.stopAll();renderGraph();};
$('bridge-reset').onclick=()=>{processes.reset();runtime.reset();workspace.reset();edited.clear();observed.clear();manualSeen=false;faultSeen=false;launchGroup=null;launchBaseline=0;for(const {terminal,panel,output} of terminals.values()){terminal.reset();panel.querySelector('.bridge-cwd').textContent=terminal.cwd.replace('/home/learner','~');output.textContent=status().welcome;}selected=null;$('bridge-code').value='';$('bridge-code').disabled=true;$('bridge-save').disabled=true;$('bridge-path').textContent=status().selected;$('bridge-file-explainer').textContent=(BRIDGE_TEXT[language()]??BRIDGE_TEXT.en).filePurposeDefault;$('bridge-save-state').textContent='';$('bridge-results').replaceChildren();renderFiles();renderGraph();};
window.addEventListener('pagehide',()=>{builder.cancel();for(const {terminal} of terminals.values())terminal.stop();processes.stopAll();});
function frame(now){if(last)accumulator+=Math.min((now-last)/1000,.1);last=now;while(accumulator>=1/60){runtime.step(1/60);accumulator-=1/60;}if(now-lastGraph>=200){renderGraph();lastGraph=now;}requestAnimationFrame(frame);}
document.addEventListener('visibilitychange',()=>{last=0;accumulator=0;});
try{setupPreferences();for(let i=0;i<3;i++)createTerminal();renderFiles();renderGraph();requestAnimationFrame(frame);await pageReady();}catch(error){pageFailed(error);}
