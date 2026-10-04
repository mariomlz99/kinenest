import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/runtime/graph.js';
import {RuntimeAdapter} from '../src/runtime/adapter.js';
import {startGoal,cancelGoal} from '../src/runtime/course.js';
const worker=()=>({messages:[],terminated:false,postMessage(message){this.messages.push(structuredClone(message));this.onMessage?.(message);},terminate(){this.terminated=true;}});
function setup(){const runtime=new Runtime();runtime.enableSession3();const output=[];const adapter=new RuntimeAdapter(runtime,{output:text=>output.push(text)});adapter.worker=worker();adapter.handle({kind:'node',node:'/student'});return{runtime,adapter,output};}
function register(adapter,name='/drive_distance',node='/student'){adapter.handle({kind:'action_client',node,name});}
function send(adapter,id=1,extra={}){adapter.handle({kind:'action_goal',node:'/student',id,goal:{distance:.5},...extra});}

test('registered Python client may omit action name; acceptance precedes feedback and result',()=>{
 const {runtime,adapter}=setup();register(adapter);const w=adapter.worker;
 w.onMessage=m=>{if(m.event==='result')assert.equal(adapter.actionIds.has(m.id),false,'terminal map removed before result delivery');};
 send(adapter);assert.deepEqual(w.messages.map(m=>m.event),['accepted']);assert.equal(w.messages[0].payload.accepted,true);
 runtime.step(.4);assert.ok(w.messages.some(m=>m.event==='feedback'));runtime.step(2);
 const events=w.messages.map(m=>m.event);assert.equal(events[0],'accepted');assert.equal(events.at(-1),'result');assert.equal(w.messages.at(-1).payload.status,4);assert.equal(adapter.actionIds.size,0);adapter.stop();
});

test('cancel delivers terminal result before acknowledgement and clears only its goal mapping',()=>{
 const {runtime,adapter}=setup();register(adapter);send(adapter,7,{name:'/drive_distance',goal:{distance:2}});const w=adapter.worker;runtime.step(.4);
 adapter.handle({kind:'action_cancel',id:7,request:8});
 assert.deepEqual(w.messages.slice(-2).map(m=>[m.id,m.event]),[[7,'result'],[8,'cancel']]);
 assert.equal(w.messages.at(-2).payload.status,5);assert.deepEqual(w.messages.at(-1).payload.goals_canceling,[7]);assert.equal(adapter.actionIds.has(7),false);
 assert.equal(runtime.robot.linear,0);adapter.stop();
});

test('old-run notifier cannot contact replacement worker or remove its reused request id',()=>{
 const {runtime,adapter}=setup();register(adapter);send(adapter,1,{goal:{distance:2}});
 const oldWorker=adapter.worker,oldGoal=runtime.goals.get(adapter.actionIds.get(1)),oldNotify=oldGoal.notify;
 adapter.stop();assert.equal(oldWorker.terminated,true);
 adapter.worker=worker();adapter.handle({kind:'node',node:'/student'});register(adapter);send(adapter,1,{goal:{distance:2}});
 const currentWorker=adapter.worker,currentGoal=adapter.actionIds.get(1),before=currentWorker.messages.length;
 oldNotify('feedback',{distance_travelled:99});oldNotify('result',{status:4,result:{success:true,final_distance:99}});
 assert.equal(currentWorker.messages.length,before);assert.equal(adapter.actionIds.get(1),currentGoal);adapter.stop();
});

test('unknown action client has a factual diagnostic, without accidental registration',()=>{
 const {runtime,adapter}=setup();assert.throws(()=>register(adapter,'/missing_action'),error=>!(error instanceof TypeError)&&/action/i.test(error.message)&&/missing_action/.test(error.message));
 assert.equal(runtime.actions.get('/drive_distance').clients.size,0);adapter.stop();
});

test('goal requires the named registered client; default remains available only to registered Python clients',()=>{
 for(const mode of ['unregistered','wrong-name','wrong-node']){
  const {runtime,adapter,output}=setup();if(mode!=='unregistered')register(adapter);
  const extra=mode==='wrong-name'?{name:'/missing_action'}:mode==='wrong-node'?{node:'/other'}:{};send(adapter,1,extra);
  assert.equal(runtime.goals.size,0,mode+' created a goal');assert.equal(adapter.actionIds.size,0);
  assert.equal(adapter.worker.messages.at(-1)?.event,'accepted');assert.equal(adapter.worker.messages.at(-1)?.payload.accepted,false);
  assert.ok(output.some(text=>/reject|action|client/i.test(text)),mode+' lacks diagnostic');adapter.stop();
 }
});

test('completed goal history is bounded at 100 while a new active goal remains available',()=>{
 const runtime=new Runtime();runtime.enableSession3();let delivered=0;let firstId,lastId;
 for(let i=0;i<105;i++){
  const notify=()=>{delivered++;};const id=startGoal(runtime,'/client',{distance:1},notify);firstId??=id;lastId=id;
  const originalDispose=runtime.goals.get(id).dispose;
  assert.equal(cancelGoal(runtime,id),true);const goal=runtime.goals.get(id);assert.ok(goal);assert.equal(goal.status,5);
  assert.notEqual(goal.dispose,originalDispose,'terminal record retains scheduler closure and original notifier');
  assert.notEqual(goal.notify,notify,'terminal record retains notification closure');const count=delivered;goal.notify?.('result',goal.result);assert.equal(delivered,count,'terminal notifier still delivers');
 }
 assert.equal(delivered,105);assert.equal(runtime.goals.has(firstId),false);assert.equal(runtime.goals.has(lastId),true);
 assert.equal([...runtime.goals.values()].filter(g=>g.status!==2).length,100);
 const active=startGoal(runtime,'/client',{distance:2});assert.equal(runtime.goals.get(active).status,2);assert.equal(runtime.goals.size,101);
 runtime.step(.4);assert.ok(runtime.robot.x>0);assert.equal(runtime.goals.get(active).status,2);cancelGoal(runtime,active);
 assert.equal(runtime.goals.size,100);assert.equal(runtime.robot.linear,0);
});

test('terminal cleanup survives a failing notification consumer',()=>{
 const runtime=new Runtime();runtime.enableSession3();const notify=()=>{throw Error('consumer failure');};
 const id=startGoal(runtime,'/client',{distance:1},notify);const goal=runtime.goals.get(id),originalDispose=goal.dispose;
 assert.throws(()=>cancelGoal(runtime,id),/consumer failure/);assert.equal(goal.status,5);assert.notEqual(goal.notify,notify);assert.notEqual(goal.dispose,originalDispose);
 assert.equal(runtime.robot.linear,0);assert.equal(runtime.jobs.size,0);
});
