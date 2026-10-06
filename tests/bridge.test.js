import test from 'node:test';
import assert from 'node:assert/strict';
import {WorkspaceModel,ROOT,normalizePath,parseCmake,parsePackageXml} from '../src/bridge/workspace.js';
import {BuildSystemAdapter,inspectPackage} from '../src/bridge/build.js';
import {parseLaunch} from '../src/bridge/launch.js';
import {ProcessManager} from '../src/bridge/processes.js';
import {BridgeTerminal} from '../src/bridge/terminal.js';
import {exportPackageZip} from '../src/bridge/export.js';
import {Runtime} from '../src/runtime/graph.js';
import {RuntimeAdapter} from '../src/runtime/adapter.js';

test('workspace paths stay bounded and edits invalidate only their package',async()=>{
  const w=new WorkspaceModel();assert.equal(normalizePath('./src'),ROOT+'/src');assert.throws(()=>normalizePath('../src'),/limited/);assert.throws(()=>normalizePath('/tmp'),/limited/);
  w.createPackage('alpha','ament_python');w.createPackage('beta','ament_cmake');
  const build=new BuildSystemAdapter(w,async task=>({kind:'build_ok',imports:task.type==='python'?['rclpy','std_msgs']:[]}));
  await build.build();assert.equal(w.installed.size,2);
  assert(w.exists(ROOT+'/install/local_setup.bash'));
  assert(w.exists(ROOT+'/install/alpha/lib/alpha/publisher'));
  assert(w.exists(ROOT+'/install/beta/lib/beta/publisher'));
  w.write(ROOT+'/src/alpha/alpha/publisher.py',w.read(ROOT+'/src/alpha/alpha/publisher.py')+'\n# edited');
  assert.throws(()=>w.installedPackage('alpha'),/no current installed/);assert.equal(w.installedPackage('beta').name,'beta');
  assert(!w.exists(ROOT+'/install/alpha/lib/alpha/publisher'));
  assert(w.exists(ROOT+'/install/beta/lib/beta/publisher'));
  await build.build();assert.equal(w.installed.size,2);
});

test('package metadata, entry points and CMake declarations cause useful build failures',async()=>{
  const w=new WorkspaceModel();w.createPackage('robot','ament_python');
  const base=ROOT+'/src/robot';
  let xml=w.read(base+'/package.xml');w.write(base+'/package.xml',xml.replace('<depend>std_msgs</depend>',''));
  await assert.rejects(new BuildSystemAdapter(w,async()=>({imports:['std_msgs']})).build(),/std_msgs.*not declared/);
  w.write(base+'/package.xml',xml);let setup=w.read(base+'/setup.py');w.write(base+'/setup.py',setup.replace('robot.publisher:main','robot.missing:main'));
  assert.throws(()=>inspectPackage(w,'robot'),/missing robot\/missing.py/);
  w.reset();w.createPackage('robot','ament_cmake');let cmake=w.read(base+'/CMakeLists.txt');w.write(base+'/CMakeLists.txt',cmake.replace('install(TARGETS publisher subscriber','install(TARGETS publisher'));
  assert.throws(()=>inspectPackage(w,'robot'),/subscriber is not installed/);
  assert.equal(parsePackageXml(xml).buildType,'ament_python');assert.equal(parseCmake(cmake,'robot').targets.size,2);
});

test('build failures cannot leave a stale executable discoverable',async()=>{
  const w=new WorkspaceModel();w.createPackage('robot','ament_cmake');
  const compile=async({code})=>{if(code.includes('BROKEN'))throw Error('compiler diagnostic');return {kind:'build_ok'};};
  const build=new BuildSystemAdapter(w,compile);await build.build();
  const path=ROOT+'/src/robot/src/publisher.cpp';w.write(path,w.read(path)+'\nBROKEN');
  await assert.rejects(build.build(),/compiler diagnostic/);assert.throws(()=>w.installedPackage('robot'),/no current installed/);
});

test('launch parser applies literal node configuration and rejects arbitrary Python',()=>{
  const w=new WorkspaceModel();w.createPackage('robot','ament_python');
  const launch=w.read(ROOT+'/src/robot/launch/system.launch.py'),actions=parseLaunch(launch);
  assert.equal(actions.length,2);assert.equal(actions[1].parameters.prefix,'received');assert.deepEqual(actions[1].remappings,[['chatter','other_chatter']]);
  assert.throws(()=>parseLaunch(launch+'\nimport os'),/Unsupported statements/);
  assert.throws(()=>parseLaunch(launch.replace("'received'",'__import__("x")')),/literal/);
});

test('two process adapters share runtime and stop/reset remove owned graph state',async()=>{
  const w=new WorkspaceModel(),r=new Runtime();w.createPackage('robot','ament_python');await new BuildSystemAdapter(w,async()=>({imports:['rclpy','std_msgs']})).build();
  class Adapter{constructor(runtime,{ros,onStop}){this.runtime=runtime;this.ros=ros;this.onStop=onStop;this.node=null;}run(program){this.node='/'+(this.ros.name??program.entry.module.split('.').at(-1));this.runtime.nodes.add(this.node);}stop(){this.runtime.nodes.delete(this.node);this.onStop();}}
  const manager=new ProcessManager(r,w,{factories:new Map([['python',async()=>Adapter]])});
  const a=await manager.run('robot','publisher'),b=await manager.run('robot','subscriber');assert.equal(manager.active().length,2);assert(r.nodes.has('/publisher')&&r.nodes.has('/subscriber'));
  manager.stop(a.id);assert(!r.nodes.has('/publisher'));assert(r.nodes.has('/subscriber'));
  manager.reset();assert.deepEqual([...r.nodes],['/simulator']);assert.equal(manager.active().length,0);
});

test('a launch group releases crashed processes and graph endpoints',async()=>{
  const w=new WorkspaceModel(),r=new Runtime();w.createPackage('robot','ament_python');await new BuildSystemAdapter(w,async()=>({imports:['rclpy','std_msgs']})).build();
  const instances=[];
  class Adapter{constructor(runtime,{onStop}){this.runtime=runtime;this.onStop=onStop;instances.push(this);}run(){this.runtime.nodes.add('/student');}stop(){this.runtime.nodes.delete('/student');this.onStop();}crash(){this.stop();}}
  const manager=new ProcessManager(r,w,{factories:new Map([['python',async()=>Adapter]])});
  manager.groups.set('launch-1',new Set());
  const process=await manager.run('robot','publisher',{group:'launch-1'});
  assert.equal(manager.groups.get('launch-1')?.has(process.id),true);
  instances[0].crash();
  assert.equal(manager.active().length,0);assert.equal(manager.groups.has('launch-1'),false);assert(!r.nodes.has('/student'));
});

test('launch names, namespaces, remapping and scalar parameters affect the shared graph',()=>{
  const runtime=new Runtime(),adapter=new RuntimeAdapter(runtime,{ros:{name:'renamed',namespace:'team',remappings:[['chatter','/shared']],parameters:{prefix:'received'}}});
  adapter.handle({kind:'node',node:'listener'});
  adapter.handle({kind:'publisher',node:'listener',topic:'chatter',type:'std_msgs/msg/String'});
  adapter.handle({kind:'parameter_declare',node:'listener',name:'prefix',value:'heard'});
  assert(runtime.nodes.has('/team/renamed'));
  assert(runtime.topics.get('/shared').publishers.has('/team/renamed'));
  assert.equal(runtime.parameters.get('/team/renamed').get('prefix'),'received');
  adapter.stop();assert(!runtime.nodes.has('/team/renamed'));assert(!runtime.topics.has('/shared'));
});

test('terminal requires build and source before run and rejects shell syntax',async()=>{
  const w=new WorkspaceModel(),r=new Runtime(),lines=[];const build=new BuildSystemAdapter(w,async()=>({imports:['rclpy','std_msgs']}));
  const manager=new ProcessManager(r,w,{factories:new Map([['python',async()=>class{constructor(){}run(){}stop(){}}]])});
  const terminal=new BridgeTerminal(1,r,w,build,manager,line=>lines.push(line));
  await assert.rejects(terminal.run('ros2 run robot publisher'),/source/);
  await assert.rejects(terminal.run('ls | cat'),/Pipes/);
  await terminal.run('cd src');await terminal.run('ros2 pkg create --build-type ament_python --license Apache-2.0 robot');await terminal.run('cd ..');await terminal.run('colcon build');
  await terminal.run('source install/local_setup.bash');assert.equal(terminal.sourced,true);assert(lines.some(x=>x.includes('Finished <<< robot')));
});

test('stopping a build cannot install a late compiler result',async()=>{
  const w=new WorkspaceModel();w.createPackage('robot','ament_cmake');
  let finish;const compile=()=>new Promise(resolve=>{finish=resolve;});
  const builder=new BuildSystemAdapter(w,compile),pending=builder.build();
  await Promise.resolve();builder.cancel();finish({kind:'build_ok'});
  await assert.rejects(pending,/cancelled/);
  assert.throws(()=>w.installedPackage('robot'),/no current installed/);
});

test('editing source while compilation runs leaves no falsely current build',async()=>{
  const w=new WorkspaceModel();w.createPackage('robot','ament_cmake');
  let finish;const builder=new BuildSystemAdapter(w,()=>new Promise(resolve=>{finish=resolve;}));
  const pending=builder.build();await Promise.resolve();
  const path=ROOT+'/src/robot/src/publisher.cpp';w.write(path,w.read(path)+'\n// changed');
  finish({kind:'build_ok'});
  await assert.rejects(pending,/changed during build/);
  assert.throws(()=>w.installedPackage('robot'),/no current installed/);
});

test('package export contains the editable source and package metadata',async()=>{
  const w=new WorkspaceModel();w.createPackage('robot','ament_python');
  const blob=exportPackageZip(w,'robot'),data=new Uint8Array(await blob.arrayBuffer());
  const decoder=new TextDecoder(),text=decoder.decode(data);
  assert.equal(blob.type,'application/zip');
  assert(text.includes('robot/package.xml'));
  assert(text.includes('robot/robot/publisher.py'));
  assert(text.includes('robot/launch/system.launch.py'));
  assert.equal(new DataView(data.buffer).getUint32(data.length-22,true),0x06054b50);
});
