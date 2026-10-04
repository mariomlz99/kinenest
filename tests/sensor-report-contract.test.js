import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/runtime/graph.js';
import {RuntimeAdapter} from '../src/runtime/adapter.js';

test('scan reports need ranges access in their own processed sample, in either language',()=>{
 for(const language of ['Python','C++'])for(const [report,values,counter]of [['range',[1],'range'],['sectors',[2,1,3],'sectors']]){
  const runtime=new Runtime();runtime.enableSession3();const adapter=new RuntimeAdapter(runtime,{language});
  const message={ranges:[3,2,1],angle_min:-Math.PI/2,angle_increment:Math.PI/2};
  for(const [id,access]of [[1,[]],[2,['ranges']]]){
   runtime.samples.set(id,{topic:'/scan',message});
   adapter.handle({kind:'course_report',sample:id,report,values});
   adapter.handle({kind:'message_processed',sample:id,access});
   assert.equal(runtime.course[counter]??0,id===1?0:1);
  }
  // Numerically correct values from an older, unread sample cannot borrow the
  // later callback's access evidence.
  adapter.handle({kind:'course_report',sample:1,report,values});
  assert.equal(runtime.course[counter],1);
  adapter.stop();
 }
});
