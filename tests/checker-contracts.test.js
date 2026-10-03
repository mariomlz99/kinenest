import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/runtime/graph.js';
import {RuntimeAdapter} from '../src/runtime/adapter.js';
import {courseChecks} from '../src/exercises/course.js';
const passes=(r,type)=>courseChecks(r,{checks:[{type}]})[0].passed;
const setup=()=>{const r=new Runtime();r.enableSession3();return [r,new RuntimeAdapter(r)];};
test('parameter exercise requires motion publications, not unrelated text',()=>{
 const [r,a]=setup();
 for(let i=0;i<3;i++){a.handle({kind:'parameter_read',value:.2});a.handle({kind:'publish',topic:'/noise',type:'std_msgs/msg/String',message:{data:'moving'}});}
 assert.equal(passes(r,'configured'),false);
 for(let i=0;i<3;i++)a.handle({kind:'publish',topic:'/cmd_vel',type:'geometry_msgs/msg/Twist',message:{linear:{x:.2}}});
 assert.equal(passes(r,'configured'),true);
});
test('custom interface exercise counts the requested endpoint only',()=>{
 const [r,a]=setup(),message={visible:true,position:'CENTER',confidence:.9};
 for(let i=0;i<3;i++)a.handle({kind:'publish',topic:'/wrong_target',type:'ros2learn_interfaces/msg/TargetInfo',message});
 assert.equal(passes(r,'custom'),false);
 for(let i=0;i<3;i++)a.handle({kind:'publish',topic:'/target_info',type:'ros2learn_interfaces/msg/TargetInfo',message});
 assert.equal(passes(r,'custom'),true);
});
test('beacon completion requires student scan access as well as physical and image evidence',()=>{
 const [r]=setup();Object.assign(r.evidence,{converted:true,callbacks:10,centeredFrames:10});Object.assign(r.course,{stopped:30,commandPublications:10});
 assert.equal(passes(r,'dock'),false);
 r.course.scanAccess=3;assert.equal(passes(r,'dock'),true);
 r.collisions=1;assert.equal(passes(r,'dock'),false);
 r.collisions=0;r.course.commandPublications=0;assert.equal(passes(r,'dock'),false);
 r.course.commandPublications=10;r.course.stopped=0;assert.equal(passes(r,'dock'),false);
 r.reset();assert.equal(passes(r,'dock'),false);
});
