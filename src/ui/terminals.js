import { TerminalSession } from '../terminal/session.js';

export function createTerminals(runtime, onCommand) {
  const container=document.getElementById('terminals');
  const add=document.getElementById('add-terminal');
  const terminals=new Map();let nextId=0;
  const welcome='Shared ROS graph · independent terminal\nTry ros2 topic list, or ros2 topic echo /odom --field pose.pose.\nType help for supported commands.';

  function create(focus=true) {
    const id=++nextId, first=id===1;
    const panel=document.createElement('section');panel.className='panel terminal';panel.dataset.terminal=String(id);
    const headingId='terminal-title-'+id, inputId=first?'command':'command-'+id;
    panel.setAttribute('aria-labelledby',headingId);
    panel.innerHTML='<div class="panel-head"><h3 id="'+headingId+'">Terminal '+id+'</h3><span class="session-state" role="status">Ready</span><button type="button" class="stop-echo" disabled>Stop command</button><button type="button" class="close-terminal" aria-label="Close terminal '+id+'">Close</button></div><pre tabindex="0" role="log" aria-live="off" aria-label="Terminal '+id+' output"></pre><form><label for="'+inputId+'">$ <span class="sr-only">ROS command in terminal '+id+'</span></label><input id="'+inputId+'" spellcheck="false" autocomplete="off" placeholder="ros2 topic list"><button type="submit">Execute</button></form><p class="terminal-tip">Enter to execute · ↑ / ↓ history · Ctrl+C to stop</p>';
    const output=panel.querySelector('pre'),form=panel.querySelector('form'),input=panel.querySelector('input');
    const submit=form.querySelector('button'),stop=panel.querySelector('.stop-echo'),close=panel.querySelector('.close-terminal');
    if(first){output.id='output';form.id='terminal-form';submit.id='execute';}
    const write=text=>{
      const follow=output.scrollHeight-output.scrollTop-output.clientHeight<35;
      output.textContent=(output.textContent+'\n'+text+'\n').slice(-24000);
      if(follow)output.scrollTop=output.scrollHeight;
    };
    const session=new TerminalSession(runtime,id,write,running=>{
      input.readOnly=running;submit.disabled=running;stop.disabled=!running;
      panel.querySelector('.session-state').textContent=running?'Command running':'Ready';
      input.placeholder=running?'Command active — Ctrl+C to stop':'ros2 topic list';
    });
    form.addEventListener('submit',event=>{
      event.preventDefault();const text=input.value.trim();if(!text||session.running)return;
      try{session.run(text);onCommand(false);}catch(error){write('Error: '+error.message);onCommand(true);}
      input.value='';input.focus();
    });
    panel.addEventListener('keydown',event=>{
      if(event.ctrlKey&&event.key.toLowerCase()==='c'&&session.running){event.preventDefault();session.stop();input.focus();}
    });
    input.addEventListener('keydown',event=>{
      if(session.running||!['ArrowUp','ArrowDown'].includes(event.key))return;
      event.preventDefault();input.value=session.recall(event.key==='ArrowUp'?-1:1);
    });
    stop.addEventListener('click',()=>{session.stop();input.focus();});
    close.addEventListener('click',()=>{
      if(terminals.size===1)return;
      session.stop(false);terminals.delete(id);panel.remove();updateClose();
      terminals.values().next().value.input.focus();
    });
    output.textContent=welcome;
    terminals.set(id,{session,panel,input,output});container.append(panel);updateClose();
    if(focus)input.focus();
  }
  function updateClose(){for(const {panel} of terminals.values())panel.querySelector('.close-terminal').disabled=terminals.size===1;}
  add.addEventListener('click',()=>create());add.disabled=false;
  create(false);create(false);
  return {
    reset(){for(const {session,input,output} of terminals.values()){session.reset();input.value='';output.textContent=welcome;}},
    focus(){terminals.values().next().value.input.focus();}
  };
}
