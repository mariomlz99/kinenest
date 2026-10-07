import test from 'node:test';import assert from 'node:assert/strict';
import {Lab} from '../src/lab.js';import {prepareUnit} from '../src/units/prepare.js';import {captureSession,restoreSession} from '../src/session.js';import {rosCompletions} from '../src/completion.js';
for(const language of ['python','cpp'])test(`independent ${language} units preserve source and restore installed completion data`,async()=>{
 const lab=new Lab(),terminal=lab.terminal();lab.builder.compile=async()=>({imports:[],module:new Uint8Array([0,97,115,109])});
 await prepareUnit(lab,5,language);
 const pkg=language==='python'?'py_pubsub':'cpp_pubsub';assert(lab.workspace.current(pkg));assert(lab.workspace.current('tutorial_interfaces'));
 assert.deepEqual(rosCompletions(lab,terminal,`ros2 run ${pkg} ta`),['talker']);assert.deepEqual(rosCompletions(lab,terminal,`ros2 launch ${pkg} `),['system.launch.py']);
 const other=lab.terminal();assert.deepEqual(rosCompletions(lab,other,'ros2 run '+pkg.slice(0,3)),[],'Unsourced terminals do not see workspace packages');
 const path=lab.workspace.sourcePath(pkg)+(language==='python'?'/'+pkg+'/talker.py':'/src/publisher_member_function.cpp');const edited=lab.fs.read(path)+'\n';lab.fs.write(path,edited);await prepareUnit(lab,5,language);assert.equal(lab.fs.read(path),edited,'Preparation preserves learner edits');
 const saved=structuredClone(captureSession(lab,{unitIndex:5})),restored=new Lab();const shells=restoreSession(restored,saved);const t=restored.terminal();Object.assign(t,shells[0]);
 assert(restored.workspace.current(pkg));assert.deepEqual(rosCompletions(restored,t,`ros2 run ${pkg} ta`),['talker']);assert.equal(restored.processes.active().length,0);
 lab.reset();restored.reset();
});

test('legacy session migration retains files and maps progress without completing Actions',async()=>{
 const {migrateSession}=await import('../src/session.js');
 const bytes=new Uint8Array([1,2]);
 const saved={version:1,ui:{lessonIndex:5,progress:[0,1,5],guidePositions:[['0:python',2],['5:python',3]]},workspace:{files:new Map([['/home/student/notes.txt','my notes']]),bytes},terminals:[{cwd:'/home/student/ros2_ws',overlays:new Set(['/home/student/ros2_ws'])}]};
 const result=migrateSession(saved);
 assert.equal(result.version,2);assert.equal(result.ui.unitIndex,5);assert.deepEqual(result.ui.progress,[0,1]);assert.deepEqual(result.ui.guidePositions,[['0:python',2]]);
 assert.equal(result.workspace.files.get('/home/learner/notes.txt'),'my notes');assert.equal(result.terminals[0].cwd,'/home/learner/ros2_ws');assert(result.terminals[0].overlays.has('/home/learner/ros2_ws'));assert.deepEqual(result.workspace.bytes,bytes);assert.equal(saved.version,1);
});
