// Protocol-compatible host routing; payloads and callbacks run in upstream Wasm.
const state=window.probe={started:performance.now(),nodes:{},events:[],errors:[],messages:[],delivered:0},workers=new Map(),topics=new Map(),seen=new Map();
function record(node,data){if(data.command!=='retrieve'&&data.command!=='probe-memory'){state.events.push({node,ms:performance.now()-state.started,...data});if(state.events.length>120)state.events.shift();}document.getElementById('output').textContent=JSON.stringify(state,null,2);}
for(const node of ['listener','talker','server','client']){
 const worker=new Worker('./worker.js?node='+node);workers.set(node,worker);state.nodes[node]={};
 worker.onerror=e=>{state.errors.push(node+': '+e.message);};
 worker.onmessage=({data})=>{
  if(data.command==='probe-ready')state.nodes[node].readyMs=performance.now()-state.started;
  if(data.bytes)state.nodes[node].linearMemoryBytes=Math.max(state.nodes[node].linearMemoryBytes??0,data.bytes);
  if(data.command==='probe-error')state.errors.push(node+': '+data.message);
  if(data.command==='publish'){const previous=topics.get(data.topic);topics.set(data.topic,{message:data.message,sequence:(previous?.sequence??0)+1});state.messages.push({node,topic:data.topic,message:data.message});if(state.messages.length>30)state.messages.shift();}
  if(data.command==='retrieve'){
   const sample=topics.get(data.topic),key=node+':'+data.topic;
   if(sample&&(seen.get(key)??0)<sample.sequence){seen.set(key,sample.sequence);worker.postMessage({topic:data.topic,message:sample.message});state.delivered++;}
  }
  record(node,data);
 };
}
window.stopProbe=()=>{for(const worker of workers.values())worker.terminate();state.stopped=true;};
window.addEventListener('pagehide',window.stopProbe);
