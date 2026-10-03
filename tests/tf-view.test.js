import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/runtime/graph.js';
import {transforms,lookup} from '../src/runtime/course.js';
import {frameSnapshot,relativeValues,defaultFrames,treeLayout} from '../src/ui/tf-model.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,a+' != '+b);
test('spatial frames follow published transforms, including child rotation and fixed target',()=>{
 const r=new Runtime();r.enableSession3();r.targetFrame=[5,3];
 for(const [x,y,yaw]of [[0,0,0],[1,-2,.7],[-.3,2,-1.3],[2,1,Math.PI]]){
  Object.assign(r.robot,{x,y,yaw});const snapshot=frameSnapshot(r),get=id=>snapshot.frames.find(f=>f.id===id);
  close(get('base_link').x,x);close(get('base_link').y,y);close(get('base_link').yaw,yaw);
  close(get('laser_link').x,x+.2*Math.cos(yaw));close(get('laser_link').y,y+.2*Math.sin(yaw));close(get('camera_link').x,x+.1*Math.cos(yaw));close(get('camera_link').y,y+.1*Math.sin(yaw));
  close(get('target').x,5);close(get('target').y,3);close(get('target').yaw,0);
  const relative=relativeValues(r,'base_link','target');close(relative.x,Math.cos(yaw)*(5-x)+Math.sin(yaw)*(3-y));close(relative.y,-Math.sin(yaw)*(5-x)+Math.cos(yaw)*(3-y));close(relative.distance,Math.hypot(5-x,3-y));
  assert.deepEqual({x:relative.x,y:relative.y,yaw:relative.yaw},lookup(r,'base_link','target'));
 }
});
test('TF hierarchy and lesson defaults reflect actual runtime edges',()=>{
 const r=new Runtime();r.enableSession3();const edges=transforms(r).transforms,nodes=treeLayout(edges);
 assert.equal(nodes.length,6);assert.equal(nodes.find(n=>n.id==='world').parent,null);
 for(const edge of edges)assert.equal(nodes.find(n=>n.id===edge.child_frame_id).parent,edge.header.frame_id);
 assert.deepEqual(defaultFrames('5.3'),['base_link','laser_link']);assert.deepEqual(defaultFrames('5.4'),['world','base_link','target']);assert.throws(()=>lookup(r,'missing','target'));
});
