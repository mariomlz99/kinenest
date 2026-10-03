let pyodide, chain=Promise.resolve();
const INDEX='https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
let outputCount=0, outputTime=0;
self.emit_json=text=>postMessage(JSON.parse(text));
function output(text){const now=Date.now();if(now-outputTime>1000){outputTime=now;outputCount=0;}if(outputCount++<40)postMessage({kind:'stdout',text:String(text).slice(0,4000)});}
async function handle(data){
  if(data.kind==='start'){
    postMessage({kind:'loading'});
    importScripts(INDEX+'pyodide.js');
    pyodide=await loadPyodide({indexURL:INDEX,stdout:output,stderr:output});
    for(let attempt=0;attempt<3;attempt++){
      try{await pyodide.loadPackage('numpy');pyodide.runPython('import numpy');break;}
      catch(error){if(attempt===2)throw new Error('NumPy download failed. Check the connection and press Run again. '+error);await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));}
    }
    const response=await fetch(new URL('./compat.py',self.location.href));
    if(!response.ok)throw new Error('Python teaching API could not load');
    await pyodide.runPythonAsync(await response.text());
    pyodide.globals.set('student_source',data.code);
    postMessage({kind:'executing'});
    pyodide.runPython('_run_student(student_source)');
    postMessage({kind:'ready'});
  }else if(data.kind==='image'){
    pyodide.globals.set('image_key',data.subscription);
    pyodide.globals.set('image_meta',JSON.stringify(data.meta));
    pyodide.globals.set('image_bytes',data.bytes);
    pyodide.globals.set('image_frame',data.frame);
    try{pyodide.runPython('_dispatch_image(image_key, image_meta, image_bytes, image_frame)');}
    finally{pyodide.globals.delete('image_bytes');postMessage({kind:'frame_done',subscription:data.subscription});}
  }else if(data.kind==='message'||data.kind==='timer'){
    pyodide.globals.set('event_key',data.subscription??data.id);
    pyodide.globals.set('event_payload',JSON.stringify(data.message,(_,v)=>v===Infinity?'Infinity':v));
    pyodide.globals.set('event_sample',data.sample??0);
    try{pyodide.runPython(data.kind==='timer'?'_dispatch_timer(event_key)':'_dispatch_message(event_key, event_payload, event_sample)');}
    finally{postMessage({kind:'frame_done',subscription:data.subscription??('timer-'+data.id)});}
  }else if(data.kind==='parameter_update'){
    pyodide.globals.set('param_payload',JSON.stringify(data));
    pyodide.runPython('p = json.loads(param_payload); _nodes[p["node"]]._parameters[p["name"]] = p["value"]');
  }else if(data.kind==='action_event'){
    pyodide.globals.set('action_key',data.id);pyodide.globals.set('action_event',data.event);pyodide.globals.set('action_payload',JSON.stringify(data.payload));
    pyodide.runPython('_action_event(action_key, action_event, action_payload)');
  }else if(data.kind==='service_response'){

    pyodide.globals.set('response_key',data.id);pyodide.globals.set('response_json',JSON.stringify(data.response));
    pyodide.runPython('_service_response(response_key, response_json)');
  }
}
onmessage=event=>{chain=chain.then(()=>handle(event.data)).catch(error=>postMessage({kind:'error',text:String(error)}));};
