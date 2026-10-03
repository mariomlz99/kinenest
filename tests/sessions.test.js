import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime,TWIST} from '../src/runtime/graph.js';
import {TerminalSession,fieldValue} from '../src/terminal/session.js';
const pub='ros2 topic pub --once /cmd_vel '+TWIST+' "{linear: {x: 0.6}}"';
function session(runtime,id){const output=[];const terminal=new TerminalSession(runtime,id,text=>output.push(text));return {terminal,output};}

test('two echo subscribers receive new Twist only, with separate histories',()=>{
 const r=new Runtime(),a=session(r,1),b=session(r,2),c=session(r,3);
 c.terminal.run(pub);a.terminal.run('ros2 topic echo /cmd_vel');b.terminal.run('ros2 topic echo /cmd_vel --field linear.x');
 assert.equal(a.output.length,2);assert.equal(r.topic('/cmd_vel').subscribers.size,3);
 c.terminal.run(pub);assert.match(a.output.at(-1),/x: 0.6/);assert.equal(b.output.at(-1),'0.6\n---');
 assert.deepEqual(a.terminal.history,['ros2 topic echo /cmd_vel']);assert.equal(c.terminal.history.length,2);
 assert.throws(()=>a.terminal.run('ros2 topic list'),/Ctrl\+C/);
 a.terminal.stop();const count=a.output.length;c.terminal.run(pub);assert.equal(a.output.length,count);assert.equal(r.topic('/cmd_vel').subscribers.size,2);
 assert.ok(!r.nodes.has('/ros2cli_echo_1'));assert.ok(r.nodes.has('/ros2cli_echo_2'));
});
test('odometry streams at 5 Hz with pose, timestamp, quaternion and velocity',()=>{
 const r=new Runtime(),messages=[];r.subscribe('/odom','/observer',m=>messages.push(m));
 r.publish('/cmd_vel',TWIST,{linear:{x:1},angular:{z:1}});r.step(1);
 assert.equal(messages.length,5);assert.ok(Math.abs(messages.at(-1).pose.pose.position.x-Math.sin(1))<1e-9);
 assert.ok(Math.abs(messages.at(-1).pose.pose.orientation.z-Math.sin(.5))<1e-9);
 assert.equal(messages.at(-1).header.stamp.sec,1);assert.equal(messages.at(-1).twist.twist.linear.x,1);
 assert.equal(messages.at(-1).pose.covariance.length,36);
 r.step(1.2);assert.equal(messages.length,11);assert.equal(messages.at(-1).twist.twist.linear.x,0);
 const x=messages.at(-1).pose.pose.position.x;r.step(.2);assert.equal(messages.at(-1).pose.pose.position.x,x);
});
test('echo once cleans up; invalid topic/field/flags never create subscriptions',()=>{
 const r=new Runtime(),a=session(r,1);a.terminal.run('ros2 topic echo /odom --once --field pose.pose.position');
 r.step(.2);assert.equal(a.terminal.running,false);assert.equal(r.topic('/odom').subscribers.size,0);assert.match(a.output.at(-1),/x: 0/);
 for(const command of ['ros2 topic echo /missing','ros2 topic echo /odom --field bogus','ros2 topic echo /odom --field','ros2 topic echo /odom --rate 3'])assert.throws(()=>a.terminal.run(command));
 assert.equal(r.nodes.size,1);assert.throws(()=>fieldValue({},'__proto__'));
});
test('reset and close remove subscriptions; stale cleanup cannot remove new nodes',()=>{
 const r=new Runtime(),a=session(r,1),b=session(r,2);a.terminal.run('ros2 topic echo /odom');b.terminal.run('ros2 topic echo /cmd_vel');
 a.terminal.reset();b.terminal.reset();r.reset();const count=a.output.length;r.step(1);assert.equal(a.output.length,count);assert.equal(a.terminal.history.length,0);assert.equal(r.time,1);assert.equal(r.nodes.size,1);
 a.terminal.run('ros2 topic echo /odom');r.step(.2);assert.ok(a.output.length>count);
 const oldUnsubscribe=r.subscribe('/odom','/old',()=>{});r.reset();r.subscribe('/odom','/old',()=>{});oldUnsubscribe();assert.ok(r.nodes.has('/old'));
});
