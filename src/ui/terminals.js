import { BridgeTerminal } from '../bridge/terminal.js';
import { WorkspaceModel } from '../bridge/workspace.js';
import { BuildSystemAdapter } from '../bridge/build.js';
import { ProcessManager } from '../bridge/processes.js';

export function createTerminals(runtime, onCommand) {
  const container=document.getElementById('terminals');
  const add=document.getElementById('add-terminal');
  const terminals=new Map(),workspace=new WorkspaceModel(),builder=new BuildSystemAdapter(workspace),processes=new ProcessManager(runtime,workspace,{onChange:()=>{for(const {session} of terminals.values())session.onState();},onOutput:(process,line)=>terminals.get(process.terminal)?.write('['+process.name+'/'+process.executable+'] '+line)});let nextId=0;
  const welcome='Shared ROS graph and ~/ros2_ws workspace · independent terminal\nTry ros2 topic list, ls, or help for supported commands.';

  function create(focus=true) {
    const id=++nextId, first=id===1;
    const panel=document.createElement('section');panel.className='panel terminal';panel.dataset.terminal=String(id);
    const headingId='terminal-title-'+id, inputId=first?'command':'command-'+id;
    panel.setAttribute('aria-labelledby',headingId);
    panel.innerHTML='<div class="panel-head"><h3 id="'+headingId+'">Terminal '+id+'</h3><span class="terminal-cwd">~/ros2_ws</span><span class="session-state" role="status">Ready</span><button type="button" class="stop-echo" disabled>Stop command</button><button type="button" class="close-terminal" aria-label="Close terminal '+id+'">Close</button></div><pre tabindex="0" role="log" aria-live="off" aria-label="Terminal '+id+' output"></pre><form><label for="'+inputId+'">$ <span class="sr-only">Command in terminal '+id+'</span></label><input id="'+inputId+'" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" placeholder="ros2 topic list"><button type="submit">Execute</button></form><p class="terminal-tip">Enter to execute · ↑ / ↓ history · Ctrl+C to stop</p>';
    const output=panel.querySelector('pre'),form=panel.querySelector('form'),input=panel.querySelector('input');
    const submit=form.querySelector('button'),stop=panel.querySelector('.stop-echo'),close=panel.querySelector('.close-terminal');
    if(first){output.id='output';form.id='terminal-form';submit.id='execute';}
    const write=text=>{
      if(text==='\f'){output.textContent='';return;}
      const follow=output.scrollHeight-output.scrollTop-output.clientHeight<35;
      output.textContent=(output.textContent+'\n'+text+'\n').slice(-24000);
      if(follow)output.scrollTop=output.scrollHeight;
    };
    const session=new BridgeTerminal(id,runtime,workspace,builder,processes,write,()=>{
      const foreground=session.busy||session.graph.running;
      input.readOnly=foreground;submit.disabled=foreground;stop.disabled=!session.running;
      panel.querySelector('.session-state').textContent=session.running?'Command running':'Ready';
      panel.querySelector('.terminal-cwd').textContent=session.cwd.replace('/home/learner','~');
      input.placeholder=foreground?'Command active: Ctrl+C to stop':'ros2 topic list';
    });
    form.addEventListener('submit',async event=>{
      event.preventDefault();const text=input.value.trim();if(!text||session.busy||session.graph.running)return;
      input.value='';try{await session.run(text);onCommand(false);}catch(error){write('Error: '+error.message);onCommand(true);}finally{panel.querySelector('.terminal-cwd').textContent=session.cwd.replace('/home/learner','~');input.focus();}
    });
    panel.addEventListener('keydown',event=>{
      if(event.ctrlKey&&event.key.toLowerCase()==='c'&&session.running){event.preventDefault();session.stop();input.focus();}
    });
    input.addEventListener('keydown',event=>{
      if(session.busy||session.graph.running||!['ArrowUp','ArrowDown'].includes(event.key))return;
      event.preventDefault();input.value=session.recall(event.key==='ArrowUp'?-1:1);
    });
    stop.addEventListener('click',()=>{session.stop();input.focus();});
    close.addEventListener('click',()=>{
      if(terminals.size===1)return;
      session.stop(false);terminals.delete(id);panel.remove();updateClose();
      terminals.values().next().value.input.focus();
    });
    output.textContent=welcome;
    terminals.set(id,{session,panel,input,output,write});container.append(panel);updateClose();
    if(focus)input.focus();
  }
  function updateClose(){for(const {panel} of terminals.values())panel.querySelector('.close-terminal').disabled=terminals.size===1;}
  add.addEventListener('click',()=>create());add.disabled=false;
  create(false);create(false);
  window.addEventListener('pagehide',()=>{builder.cancel();for(const {session} of terminals.values())session.stop(false);processes.stopAll();},{once:true});
  return {
    reset(){builder.cancel();processes.reset();workspace.reset();for(const {session,panel,input,output} of terminals.values()){session.reset();input.value='';output.textContent=welcome;panel.querySelector('.terminal-cwd').textContent='~/ros2_ws';}},
    focus(){terminals.values().next().value.input.focus();}
  };
}
