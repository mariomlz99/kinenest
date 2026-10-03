// Instrumentation only; the pinned upstream worker and Wasm remain unchanged.
const name=new URL(location.href).searchParams.get('node');
if(!['talker','listener','server','client'].includes(name))throw Error('Invalid probe');
var Module={
 locateFile:file=>new URL('./vendor/'+file,location.href).href,
 onRuntimeInitialized(){postMessage({command:'probe-ready',bytes:Module.HEAPU8?.buffer.byteLength??null});},
 onAbort:reason=>postMessage({command:'probe-error',message:String(reason)})
};
importScripts('./vendor/'+name+'.js');
setInterval(()=>postMessage({command:'probe-memory',bytes:Module.HEAPU8?.buffer.byteLength??null}),1000);
