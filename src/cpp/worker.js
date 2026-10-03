import {loadToolchain} from './toolchain.js';
let app,tool,rangeAccess=false,chain=Promise.resolve(),stdout='',outputCount=0,outputSince=0;
const SPIN={kind:'spin'};
function output(text){stdout+=String(text).replace(/\x1b\[[0-9;]*m/g,'');while(stdout.includes('\n')||stdout.length>4000){const end=stdout.includes('\n')?stdout.indexOf('\n'):4000,line=stdout.slice(0,Math.min(end,4000));stdout=stdout.slice(end+1);const now=performance.now();if(now-outputSince>1000){outputSince=now;outputCount=0;}if(outputCount++<40)postMessage({kind:'stdout',text:line});}}
function flush(){if(stdout)output('\n');}
async function handle(data){
 if(data.kind==='start'){
  tool=await loadToolchain({output,stage:text=>postMessage({kind:'stage',text})});
  const response=await fetch(new URL('./compat.hpp',import.meta.url),{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('C++ compatibility header: HTTP '+response.status);const header=await response.text();
  const module=await tool.compile(data.code,{'/include/kinenest.hpp':header,'/include/rclcpp/rclcpp.hpp':'#include <kinenest.hpp>','/include/geometry_msgs/msg/twist.hpp':'#include <kinenest.hpp>','/include/sensor_msgs/msg/laser_scan.hpp':'#include <kinenest.hpp>'});
  const imports={kinenest:{emit:(ptr,length)=>{app.mem.check();const text=new TextDecoder().decode(new Uint8Array(app.exports.memory.buffer,ptr,length));postMessage(JSON.parse(text));},spin:()=>{throw SPIN;},range_access:()=>{rangeAccess=true;}}};
  app=await tool.instantiate(module,imports);postMessage({kind:'executing'});
  try{app.exports._start();}catch(error){if(error!==SPIN&&error.code!==0)throw error;}
  flush();postMessage({kind:'metrics',metrics:tool.metrics});postMessage({kind:'ready'});
 }else if(data.kind==='message'){
  const m=data.message,bytes=new Float32Array(m.ranges),ptr=app.exports.kn_alloc(bytes.byteLength);rangeAccess=false;
  try{new Float32Array(app.exports.memory.buffer,ptr,bytes.length).set(bytes);app.exports.kn_receive_scan(data.subscription,ptr,bytes.length,m.angle_min,m.angle_max,m.angle_increment,m.range_min,m.range_max,m.header.stamp.sec,m.header.stamp.nanosec,m.scan_time);postMessage({kind:'message_processed',sample:data.sample,access:rangeAccess?['ranges']:[]});flush();}
  finally{app.exports.kn_free(ptr);postMessage({kind:'frame_done',subscription:data.subscription});}
 }else if(data.kind==='timer'){
  try{app.exports.kn_tick(data.id);postMessage({kind:'timer_processed'});flush();}finally{postMessage({kind:'frame_done',subscription:'timer-'+data.id});}
 }
}
onmessage=event=>{chain=chain.then(()=>handle(event.data)).catch(error=>{flush();postMessage({kind:'error',text:'C++: '+(error.message??String(error))});});};
