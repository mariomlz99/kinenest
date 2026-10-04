import {loadToolchain} from './toolchain.js';
import {numberField,stringField,associateReport} from './protocol.js';
let app,tool,rangeAccess=false,chain=Promise.resolve(),stdout='',outputCount=0,outputSince=0;
let currentPayload=null,currentSample=null,currentFrame=null,failed=false;
const subscriptions=new Map(),decoder=new TextDecoder(),encoder=new TextEncoder();
const SPIN={kind:'spin'};
function textAt(ptr,length){return decoder.decode(new Uint8Array(app.exports.memory.buffer,ptr,length));}
function output(text){stdout+=String(text).replace(/\x1b\[[0-9;]*m/g,'');while(stdout.includes('\n')||stdout.length>4000){const end=stdout.includes('\n')?stdout.indexOf('\n'):4000,line=stdout.slice(0,Math.min(end,4000));stdout=stdout.slice(end+1);const now=performance.now();if(now-outputSince>1000){outputSince=now;outputCount=0;}if(outputCount++<40)postMessage({kind:'stdout',text:line});}}
function flush(){if(stdout)output('\n');}
function emit(ptr,length){
 const data=JSON.parse(textAt(ptr,length));
 if(data.kind==='subscribe')subscriptions.set(data.id,{type:data.type,node:data.node});
 if(data.kind==='unsubscribe')subscriptions.delete(data.id);
 if(data.kind==='destroy')for(const [id,sub]of subscriptions)if(sub.node===data.node)subscriptions.delete(id);
 postMessage(['course_report','detection','image_stats'].includes(data.kind)?associateReport(data,{sample:currentSample,frame:currentFrame}):data);
}
async function handle(data){
 if(failed)return;
 if(data.kind==='start'){
  tool=await loadToolchain({output,stage:text=>postMessage({kind:'stage',text})});
  const response=await fetch(new URL('./compat.hpp',import.meta.url),{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('C++ compatibility header: HTTP '+response.status);const header=await response.text();
  const headers={'/include/kinenest.hpp':header};
  for(const path of ['rclcpp/rclcpp.hpp','geometry_msgs/msg/twist.hpp','sensor_msgs/msg/laser_scan.hpp','std_msgs/msg/string.hpp','kinenest/reports.hpp'])headers['/include/'+path]='#include <kinenest.hpp>';
  const module=await tool.compile(data.code,headers);
  const imports={kinenest:{
   emit,spin:()=>{throw SPIN;},range_access:()=>{rangeAccess=true;},
   fail:(ptr,length)=>{throw Error(textAt(ptr,length));},
   field_number:(ptr,length)=>numberField(currentPayload,textAt(ptr,length)),
   field_string_size:(ptr,length)=>encoder.encode(stringField(currentPayload,textAt(ptr,length))).length,
   field_string_copy:(ptr,length,dest,capacity)=>{const bytes=encoder.encode(stringField(currentPayload,textAt(ptr,length)));if(bytes.length>capacity)throw Error('C++ string buffer is too small');new Uint8Array(app.exports.memory.buffer,dest,bytes.length).set(bytes);return bytes.length;}
  }};
  app=await tool.instantiate(module,imports);postMessage({kind:'executing'});
  try{app.exports._start();}catch(error){if(error!==SPIN&&error.code!==0)throw error;}
  flush();postMessage({kind:'metrics',metrics:tool.metrics});postMessage({kind:'ready'});
 }else if(data.kind==='message'){
  if(!subscriptions.has(data.subscription)){postMessage({kind:'frame_done',subscription:data.subscription});return;}
  currentPayload=data.message;currentSample=data.sample;rangeAccess=false;let ptr;
  try{
   if(subscriptions.get(data.subscription).type==='sensor_msgs/msg/LaserScan'){
    const m=data.message,bytes=new Float32Array(m.ranges);ptr=app.exports.kn_alloc(bytes.byteLength);
    if(!ptr&&bytes.byteLength)throw Error('C++ sensor buffer allocation failed');
    new Float32Array(app.exports.memory.buffer,ptr,bytes.length).set(bytes);
    app.exports.kn_receive_scan(data.subscription,ptr,bytes.length,m.angle_min,m.angle_max,m.angle_increment,m.range_min,m.range_max,m.header.stamp.sec,m.header.stamp.nanosec,m.scan_time);
   }else app.exports.kn_receive_message(data.subscription);
   postMessage({kind:'message_processed',sample:data.sample,access:rangeAccess?['ranges']:[]});flush();
  }finally{if(ptr!==undefined)app.exports.kn_free(ptr);currentPayload=null;currentSample=null;postMessage({kind:'frame_done',subscription:data.subscription});}
 }else if(data.kind==='timer'){
  try{app.exports.kn_tick(data.id);postMessage({kind:'timer_processed'});flush();}finally{postMessage({kind:'frame_done',subscription:'timer-'+data.id});}
 }
}
onmessage=event=>{chain=chain.then(()=>handle(event.data)).catch(error=>{failed=true;flush();postMessage({kind:'error',text:'C++: '+(error.message??String(error))});});};
