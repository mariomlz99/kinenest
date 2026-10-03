import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/runtime/graph.js';
import {lookup} from '../src/runtime/course.js';
import {SENSORS,sensorPose,ROBOT_RADIUS} from '../src/simulator/sensors.js';
import {laserScan} from '../src/simulator/lidar.js';
import {renderCamera,inspectPixels} from '../src/simulator/camera.js';
import {LatestMailbox} from '../src/runtime/mailbox.js';
import {PythonBridge} from '../src/python/bridge.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,a+' != '+b);
test('sensor origins are distinct and match TF after translation and rotation',()=>{
 const r=new Runtime();r.enableSession3();Object.assign(r.robot,{x:1,y:2,yaw:Math.PI/2});
 for(const name of ['lidar','camera']){const p=sensorPose(r.robot,name),t=lookup(r,'world',SENSORS[name].frame);near(p.x,t.x);near(p.y,t.y);near(p.yaw,t.yaw);}
 near(lookup(r,'laser_link','camera_link').x,-.1);assert.ok(SENSORS.camera.x<ROBOT_RADIUS);
 const scan=laserScan(r.robot,{obstacles:[{x:0,y:4,w:3,h:1}]},{sec:1,nanosec:0});near(scan.ranges[60],1.8);
 const image=renderCamera({x:0,y:0,yaw:0},[{x:5,y:1,color:[235,45,45]}]);assert.ok(Math.abs(inspectPixels(image).cx-(160-160/4.9))<1);
});
test('camera and scan stamps match capture pose and a same-stamp TF sample',()=>{
 const r=new Runtime();r.enableSession3();let tf;const seen=[];r.subscribe('/tf','/tf_test',m=>tf=m);
 for(const [topic,name]of [['/camera/image_raw','camera'],['/scan','lidar']])r.subscribe(topic,'/'+name,m=>{assert.deepEqual(tf.transforms[1].header.stamp,m.header.stamp);near(tf.transforms[1].transform.translation.x,r.robot.x);near(tf.transforms[1].transform.translation.y,r.robot.y);assert.equal(m.header.frame_id,SENSORS[name].frame);seen.push(name);});
 r.robot.command(.5,.6);r.step(1);assert.equal(seen.filter(n=>n==='camera').length,8);assert.equal(seen.filter(n=>n==='lidar').length,5);
 for(const name of ['camera','lidar']){const sample=r.sensorSamples[name],p=sensorPose(sample.basePose,name);near(p.x,sample.pose.x);near(p.y,sample.pose.y);}
 r.reset();assert.deepEqual(r.sensorSamples,{});assert.equal(r.latestScan,null);assert.equal(r.camera,null);
});
test('slow callbacks keep only the newest waiting sample and Reset discards it',()=>{
 const box=new LatestMailbox(),seen=[];for(let i=0;i<100;i++)box.offer('camera',()=>seen.push(i));assert.deepEqual(seen,[0]);assert.equal(box.latest.size,1);box.done('camera');assert.deepEqual(seen,[0,99]);box.done('camera');assert.equal(box.inFlight.size,0);
 box.offer('scan',()=>seen.push(100));box.offer('scan',()=>seen.push(101));box.clear();box.done('scan');assert.deepEqual(seen,[0,99,100]);
});
test('Python transport sends the latest captured scan after acknowledgement and cleans up',()=>{
 const r=new Runtime();r.enableSession3();const sent=[],bridge=new PythonBridge(r);bridge.worker={postMessage:m=>sent.push(m),terminate(){}};
 bridge.handle({kind:'node',node:'/reader'});bridge.handle({kind:'subscribe',id:'scan',node:'/reader',topic:'/scan',type:'sensor_msgs/msg/LaserScan'});
 r.step(.8);assert.equal(sent.length,1);assert.equal(bridge.mailbox.latest.size,1);bridge.handle({kind:'frame_done',subscription:'scan'});assert.equal(sent.length,2);assert.deepEqual(sent[1].message.header.stamp,{sec:0,nanosec:800000000});
 r.step(.2);bridge.stop();assert.equal(bridge.mailbox.latest.size,0);r.reset();r.step(.2);assert.equal(sent.length,2);assert.ok(!r.nodes.has('/reader'));
});
