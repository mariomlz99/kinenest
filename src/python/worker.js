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
    await pyodide.loadPackage('numpy');
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
  }else if(data.kind==='service_response'){
    pyodide.globals.set('response_key',data.id);pyodide.globals.set('response_json',JSON.stringify(data.response));
    pyodide.runPython('_service_response(response_key, response_json)');
  }
}
onmessage=event=>{chain=chain.then(()=>handle(event.data)).catch(error=>postMessage({kind:'error',text:String(error)}));};
