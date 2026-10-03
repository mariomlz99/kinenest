import test from 'node:test';
import assert from 'node:assert/strict';
import {codeVariants,cppVisible,DraftStore} from '../src/exercises/programming.js';
import {RuntimeAdapter} from '../src/runtime/adapter.js';
import {PythonBridge} from '../src/python/bridge.js';
import {Runtime} from '../src/runtime/graph.js';
import {courseChecks} from '../src/exercises/course.js';
const lesson={id:'one',programming:{python:{supported:true,starterCode:'# TODO'},cpp:{supported:true,experimental:true,starterCode:'// TODO'}}};
test('code drafts are independent by exercise and language; unsupported mode retains its draft',()=>{
 const store=new DraftStore();store.set('one','python','my Python');store.set('one','cpp','my C++');assert.equal(store.get(lesson,'python'),'my Python');assert.equal(store.get(lesson,'cpp'),'my C++');assert.equal(store.get({...lesson,id:'two'},'cpp'),'// TODO');assert.equal(store.restore(lesson,'python'),'# TODO');assert.equal(store.get(lesson,'cpp'),'my C++');assert.equal(cppVisible(lesson),false);assert.equal(cppVisible(lesson,true),true);assert.equal(cppVisible({programming:{python:{supported:true}}},true),false);assert.equal(codeVariants({starterCode:'legacy'}).python.starterCode,'legacy');
});
test('both execution languages use the same endpoint ownership, publication and checker evidence',()=>{
 for(const language of ['Python','C++']){const r=new Runtime();r.enableSession3();const bridge=language==='Python'?new PythonBridge(r):new RuntimeAdapter(r,{language});bridge.handle({kind:'node',node:'/controller'});bridge.handle({kind:'publisher',node:'/controller',topic:'/cmd_vel',type:'geometry_msgs/msg/Twist'});for(let i=0;i<5;i++){bridge.handle({kind:'timer_processed'});bridge.handle({kind:'publish',node:'/controller',topic:'/cmd_vel',message:{linear:{x:.5}}});}r.step(.5);assert.ok(r.robot.x>0);assert.ok(courseChecks(r,{checks:[{type:'timer'}]})[0].passed);bridge.stop();assert.ok(!r.nodes.has('/controller'));assert.ok(!r.topic('/cmd_vel').publishers.has('/controller'));}
});
