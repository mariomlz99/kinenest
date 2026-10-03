import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/runtime/graph.js';
import {renderCamera,inspectPixels} from '../src/simulator/camera.js';
import {newEvidence,evaluateReport,sessionChecks} from '../src/exercises/perception.js';
import {execute} from '../src/terminal/cli.js';
import {TerminalSession} from '../src/terminal/session.js';

test('camera outputs RGB bytes; pose changes target centroid and scale',()=>{
 const center=renderCamera({x:0,y:0,yaw:0});assert.equal(center.data.length,230400);assert.equal(center.step,960);
 const truth=inspectPixels(center);assert.ok(truth.visible);assert.ok(Math.abs(truth.cx-160)<2);
 assert.ok(inspectPixels(renderCamera({x:0,y:0,yaw:-.4})).cx<130);
 assert.ok(inspectPixels(renderCamera({x:0,y:0,yaw:.4})).cx>190);
 assert.ok(inspectPixels(renderCamera({x:1,y:0,yaw:0})).count>truth.count);
 assert.equal(inspectPixels(renderCamera({x:0,y:0,yaw:Math.PI})).visible,false);
 assert.equal(inspectPixels(renderCamera({x:0,y:0,yaw:0},[{x:5,y:0,color:[30,80,230]}])).visible,false);
});
test('camera streams at 8 Hz; Python-style existing nodes share the graph',()=>{
 const r=new Runtime();r.enableSession3();r.nodes.add('/reader');let count=0;
 const stop=r.subscribe('/camera/image_raw','/reader',msg=>{count++;assert.equal(msg.width,320);assert.ok(msg.data instanceof Uint8Array);},{existingNode:true,id:'reader-camera'});
 r.step(1);assert.equal(r.camera.header.stamp.sec,1);assert.equal(r.camera.header.stamp.nanosec,0);assert.equal(count,8);assert.ok(r.topic('/camera/image_raw').subscribers.has('/reader'));stop();assert.ok(r.nodes.has('/reader'));r.step(.5);assert.equal(count,8);
});
test('services reset pose but preserve Python graph and session progress',()=>{
 const r=new Runtime();r.enableSession3();r.robot.x=3;r.nodes.add('/client');r.evidence.callbacks=5;
 assert.equal(execute(r,'ros2 service list'),'/reset_robot');assert.equal(execute(r,'ros2 service type /reset_robot'),'std_srvs/srv/Trigger');
 assert.match(execute(r,'ros2 service call /reset_robot std_srvs/srv/Trigger {}'),/success: true/);assert.equal(r.robot.x,0);assert.ok(r.nodes.has('/client'));assert.equal(r.evidence.callbacks,5);
 assert.throws(()=>execute(r,'ros2 service call /reset_robot wrong'));assert.throws(()=>execute(r,'ros2 service call /reset_robot std_srvs/srv/Trigger {bad: 1}'));
});
test('image echo summarizes bytes and hz measures actual publications',()=>{
 const r=new Runtime();r.enableSession3();const output=[];const session=new TerminalSession(r,1,text=>output.push(text));
 session.run('ros2 topic echo /camera/image_raw --once');r.step(.125);assert.match(output.at(-1),/<230400 bytes>/);assert.ok(output.at(-1).length<500);assert.equal(session.running,false);
 session.run('ros2 topic hz /camera/image_raw');r.step(1.2);assert.match(output.at(-1),/8.00 Hz/);session.stop();assert.equal(r.topic('/camera/image_raw').subscribers.size,0);
});
test('detection checks require varied scenes and repeated correct frames',()=>{
 const e=newEvidence();for(let i=0;i<4;i++)for(let j=0;j<3;j++)evaluateReport(e,{visible:true,cx:160},{visible:i!==3,cx:160},'test-'+i);
 assert.equal(e.detectionCases.size,3);assert.equal(sessionChecks({evidence:e,topics:new Map()}, {checks:[{type:'detection'}]})[0].passed,false);
 for(let j=0;j<3;j++)evaluateReport(e,{visible:false,cx:null},{visible:false,cx:null},'test-3');assert.equal(e.detectionCases.size,4);
 evaluateReport(e,{visible:true},{visible:false,cx:null},'test-3');assert.equal(e.detectionCases.size,3);
 const f=newEvidence();for(let j=0;j<10;j++)evaluateReport(f,{visible:true,cx:160},{visible:true,cx:160},'practice');assert.equal(f.detectionCases.size,0);
});

 test('all six lesson definitions load with supported checks and editable starters',async()=>{const {readFile}=await import('node:fs/promises');const catalog=JSON.parse(await readFile(new URL('../public/lessons/session-03.json',import.meta.url)));assert.equal(catalog.length,6);const r=new Runtime();r.enableSession3();for(const item of catalog){const lesson=JSON.parse(await readFile(new URL('../public/lessons/'+item.id+'.json',import.meta.url)));assert.ok(lesson.programming.python.starterCode.includes('TODO'));assert.ok(lesson.hints.length>=3);assert.equal(sessionChecks(r,lesson).length,lesson.checks.length);assert.equal(lesson.solution,undefined);}});
