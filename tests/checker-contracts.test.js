import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/runtime/graph.js';
import {RuntimeAdapter} from '../src/runtime/adapter.js';
import {courseChecks} from '../src/exercises/course.js';
const passes=(r,type)=>courseChecks(r,{checks:[{type}]})[0].passed;
const setup=()=>{const r=new Runtime();r.enableSession3();return [r,new RuntimeAdapter(r)];};
test('first parameter exercise requires declaration on the controller and motion',()=>{
 const [r,a]=setup();
 for(let i=0;i<3;i++){a.handle({kind:'parameter_read',value:.2});a.handle({kind:'publish',topic:'/noise',type:'std_msgs/msg/String',message:{data:'moving'}});}
 assert.equal(passes(r,'configured'),false);
 for(let i=0;i<3;i++)a.handle({kind:'publish',topic:'/cmd_vel',type:'geometry_msgs/msg/Twist',message:{linear:{x:.2}}});
 assert.equal(passes(r,'configured'),false);
 a.handle({kind:'node',node:'/student_controller'});a.handle({kind:'parameter_declare',node:'/student_controller',name:'speed',value:.2});
 assert.equal(passes(r,'configured'),false);r.step(.2);
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

test('raw position evidence cannot satisfy the separate yaw exercise',()=>{
 const [r,a]=setup();r.robot.x=1.2;r.robot.y=-.4;r.robot.yaw=.7;
 const report=(kind,values,processed=true)=>a.assessCourse({topic:'/odom',message:r.odometry(),processed,report:{report:kind,values}});
 r.course.odom=3;
 report('position',[1.2,-.4],false);report('position',[0,0]);report('position',[NaN,-.4]);
 assert.equal(passes(r,'position'),false);
 for(let i=0;i<3;i++)report('position',[1.2,-.4]);
 assert.equal(passes(r,'position'),true);assert.equal(passes(r,'pose'),false);
 for(let i=0;i<3;i++)report('pose',[1.2,-.4,0]);
 assert.equal(passes(r,'pose'),false);
 for(let i=0;i<3;i++)report('pose',[1.2,-.4,.7]);
 assert.equal(passes(r,'pose'),true);
});

test('callback lesson counts typed chatter publications, not self-subscriptions or unrelated output',()=>{
 const [r,a]=setup();r.course.timers=3;
 for(let i=0;i<3;i++)a.handle({kind:'publish',topic:'/elsewhere',type:'std_msgs/msg/String',message:{data:'hello'}});
 assert.equal(passes(r,'chatter_published'),false);
 for(let i=0;i<3;i++)a.handle({kind:'publish',topic:'/chatter',type:'std_msgs/msg/String',message:{data:'hello'}});
 assert.equal(passes(r,'chatter_published'),true);
 r.reset();assert.equal(passes(r,'chatter_published'),false);
});

test('parameter declaration plus zero commands cannot claim motion, even after external movement',()=>{
 const [r,a]=setup();
 a.handle({kind:'node',node:'/student_controller'});
 a.handle({kind:'parameter_declare',node:'/student_controller',name:'speed',value:.2});
 for(let i=0;i<3;i++)a.handle({kind:'publish',topic:'/cmd_vel',type:'geometry_msgs/msg/Twist',message:{linear:{x:0},angular:{z:0}}});
 r.step(.2);assert.equal(passes(r,'configured'),false);
 r.robot.command(.2,0);r.step(.2);assert.equal(passes(r,'configured'),false);
 for(let i=0;i<3;i++)a.handle({kind:'publish',topic:'/cmd_vel',type:'geometry_msgs/msg/Twist',message:{linear:{x:.2},angular:{z:0}}});
 r.step(.2);assert.equal(passes(r,'configured'),true);
});
