import test from 'node:test';
import assert from 'node:assert/strict';
import {courseMode,moduleAllowsUnit} from '../src/course-mode.js';

test('TF is an explicit third module using its existing Basics session database',()=>{
 const basics=courseMode(undefined,'?start=1'),tf=courseMode(undefined,'?start=1&unit=tf'),linux=courseMode('linux','?start=1&unit=tf');
 assert.deepEqual([basics.linux,basics.tf,basics.name],[false,false,'ROS 2 BASICS']);
 assert.deepEqual([tf.linux,tf.tf,tf.name],[false,true,'TF & Odometry']);
 assert.deepEqual([linux.linux,linux.tf,linux.name],[true,false,'LINUX & TERMINAL']);
 assert.equal(basics.database,tf.database);assert.notEqual(linux.database,tf.database);
 for(const [mode,allowed]of [[basics,[0,1,2,3,4,5,6,7,8]],[tf,[9]],[linux,[0,1,2,3,4,5,6]]]){
  assert.deepEqual(Array.from({length:11},(_,i)=>i-1).filter(index=>moduleAllowsUnit(index,mode)),allowed);
  assert(!moduleAllowsUnit(2.5,mode));assert(!moduleAllowsUnit('9',mode));
 }
});
