import test from 'node:test';
import assert from 'node:assert/strict';
import {sessionScope,savedSlots,selectModuleSession} from '../src/session-scopes.js';
import {Lab} from '../src/lab.js';
import {HOME} from '../src/fs.js';
import {captureSession,restoreSession} from '../src/session.js';
import {migrateCurriculum} from '../src/curriculum-session.js';
test('course, playground and Free Lab retain independent snapshots through reload and reset',()=>{
 const labs=[new Lab(),new Lab(),new Lab()],indices=[0,7,8];
 try{
  const records=labs.map((lab,i)=>{lab.terminal();lab.fs.write(HOME+'/marker',String(i));return captureSession(lab,{lessonIndex:indices[i],unitIndex:indices[i],progress:[0,1],guidePositions:[['7:cpp',9]]});});
  records[2].slots={course:records[0],playground:records[1]};
  const restored=structuredClone(records[2]),slots=savedSlots(restored);assert.deepEqual([...slots.keys()],['course','playground']);
  for(const [i,record]of [slots.get('course'),slots.get('playground'),restored].entries()){
   const lab=new Lab();restoreSession(lab,record);assert.equal(lab.fs.read(HOME+'/marker'),String(i));lab.fs.write(HOME+'/marker','changed');assert.equal(record.workspace.entries.get(HOME+'/marker').content,String(i));lab.reset();
  }
  assert.deepEqual(records[0].ui.progress,[0,1]);assert.equal(sessionScope(6),'course');assert.equal(sessionScope(7),'playground');assert.equal(sessionScope(8),'free');
 }finally{for(const lab of labs)lab.reset();}
});
test('older two-workspace saves migrate without dropping the inactive workspace',()=>{
 const other={curriculumVersion:3,ui:{lessonIndex:7,guidePositions:[['7:cpp',22]]}};
 const record={curriculumVersion:4,ui:{lessonIndex:0},other};assert.equal(savedSlots(record).get('playground'),other);
 const free={curriculumVersion:4,ui:{lessonIndex:8},slots:{course:record,playground:other}};migrateCurriculum(free);
 assert.deepEqual(other.ui.guidePositions,[['7:cpp',0]]);assert.equal(savedSlots(free).size,2);
});

test('TF module links preserve every workspace, draft and guide while Basics restores its course',()=>{
 const indices=[3,7,8,9],labs=indices.map(()=>new Lab());
 try{
  const records=labs.map((lab,i)=>{lab.terminal();lab.fs.write(HOME+'/marker',String(indices[i]));return captureSession(lab,{unitIndex:indices[i],language:i===3?'cpp':'python',progress:[0,1],guidePositions:[[indices[i]+':python',i+2]],activeFile:HOME+'/marker',draft:'unsaved '+indices[i]});});
  let current={...records[0],slots:{playground:records[1],free:records[2],tf:records[3]}};
  for(let visit=0;visit<3;visit++)for(const tf of [true,false]){
   const selected=selectModuleSession(current,{tf});assert.equal(selected.unitIndex,tf?9:3);
   assert.equal(selected.record.ui.draft,tf?'unsaved 9':'unsaved 3');assert.deepEqual(selected.record.ui.guidePositions,[[tf?'9:python':'3:python',tf?5:2]]);
   assert.deepEqual([...selected.slots.keys()].sort(),tf?['course','free','playground']:['free','playground','tf']);
   for(const record of [selected.record,...selected.slots.values()]){assert(!record.slots);assert(!record.other);assert.equal(record.workspace.entries.get(HOME+'/marker').content,String(record.ui.unitIndex));}
   const restored=new Lab();try{restoreSession(restored,selected.record);assert.equal(restored.fs.read(HOME+'/marker'),String(selected.unitIndex));}finally{restored.reset();}
   current={...selected.record,slots:Object.fromEntries(selected.slots)};
  }
  // Explicit Basics entry resumes course even when its optional Free Lab was active.
  const free={...records[2],slots:{course:records[0],tf:records[3]}};
  assert.equal(selectModuleSession(free).unitIndex,8);assert.equal(selectModuleSession(free,{course:true}).unitIndex,3);
  assert.equal(records[0].ui.unitIndex,3);assert.equal(records[3].ui.draft,'unsaved 9');
 }finally{for(const lab of labs)lab.reset();}
});
test('a missing module slot starts fresh and retains the previous module snapshot',()=>{
 const tf={version:2,curriculumVersion:5,ui:{unitIndex:9,draft:'keep TF'}};
 const basics=selectModuleSession(tf);assert.equal(basics.record,undefined);assert.equal(basics.unitIndex,0);assert.equal(basics.slots.get('tf').ui.draft,'keep TF');
 const course={version:2,curriculumVersion:5,ui:{unitIndex:4,draft:'keep Basics'}};
 const fresh=selectModuleSession(course,{tf:true});assert.equal(fresh.record,undefined);assert.equal(fresh.unitIndex,9);assert.equal(fresh.slots.get('course').ui.draft,'keep Basics');
 assert.deepEqual(selectModuleSession(undefined,{tf:true}),{record:undefined,slots:new Map(),unitIndex:9});
});
