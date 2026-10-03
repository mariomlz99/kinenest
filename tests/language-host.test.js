import test from 'node:test';import assert from 'node:assert/strict';import {ExecutionHost} from '../src/runtime/languages.js';
test('execution host loads only the selected adapter, preserves shared runtime and cancels stale loads',async()=>{
 const runtime={},loaded=[],runs=[];let finish;
 const adapter=id=>class{constructor(r){assert.equal(r,runtime);}run(code){this.worker={};runs.push([id,code]);}stop(){this.worker=null;}};
 const host=new ExecutionHost(runtime,{},new Map([['python',async()=>{loaded.push('python');return adapter('python');}],['cpp',()=>{loaded.push('cpp');return new Promise(r=>finish=r);}],['third',async()=>adapter('third')]]));
 await host.run('python','first');assert.deepEqual(loaded,['python']);assert.ok(host.active);
 const pending=host.run('cpp','stale');assert.equal(host.peek('python').worker,null);host.stop();finish(adapter('cpp'));assert.equal(await pending,false);assert.equal(host.peek('cpp'),undefined);assert.equal(host.active,false);
 await host.run('third','generic');assert.deepEqual(runs,[['python','first'],['third','generic']]);host.reset();assert.equal(host.active,false);host.dispose();assert.equal(host.instances.size,0);await assert.rejects(host.run('missing',''),/Unsupported code language/);
});
