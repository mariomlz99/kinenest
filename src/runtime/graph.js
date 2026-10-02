import { Robot } from '../simulator/robot.js';
export const TWIST='geometry_msgs/msg/Twist';
export class Runtime {
  constructor() { this.robot=new Robot(); this.reset(); }
  reset() {
    this.robot.reset(); this.discovered=false; this.publications=0;
    this.nodes=new Set(['/simulator']);
    this.topics=new Map([
      ['/cmd_vel',{type:TWIST,publishers:new Set(),subscribers:new Set(['/simulator'])}],
      ['/odom',{type:'nav_msgs/msg/Odometry',publishers:new Set(['/simulator']),subscribers:new Set(),placeholder:true}],
      ['/scan',{type:'sensor_msgs/msg/LaserScan',publishers:new Set(['/simulator']),subscribers:new Set(),placeholder:true}]
    ]);
  }
  topic(name) { const topic=this.topics.get(name); if(!topic) throw new Error('Unknown topic: '+name); return topic; }
  publish(topic,type,msg) {
    if(topic!=='/cmd_vel') throw new Error('Lab 01 only accepts publication on /cmd_vel.');
    if(type!==this.topic(topic).type) throw new Error('Expected '+TWIST);
    if (!msg || typeof msg!=='object' || Array.isArray(msg)) throw new Error('Twist must be a mapping.');
    for(const [field,vector] of Object.entries(msg)) {
      if(!['linear','angular'].includes(field) || !vector || typeof vector!=='object' || Array.isArray(vector)) throw new Error('Expected linear/angular vector mappings.');
      for(const [axis,value] of Object.entries(vector)) {
        if(!['x','y','z'].includes(axis) || typeof value!=='number' || !Number.isFinite(value)) throw new Error('Vector components must be finite numbers.');
        if(value!==0 && !((field==='linear' && axis==='x') || (field==='angular' && axis==='z'))) throw new Error('This 2D lab supports only linear.x and angular.z; leave other components zero.');
      }
    }
    const linear=msg.linear?.x??0, angular=msg.angular?.z??0;
    if(Math.abs(linear)>2 || Math.abs(angular)>3) throw new Error('Lab limits: |linear.x| ≤ 2 m/s, |angular.z| ≤ 3 rad/s.');
    this.discovered=true; this.publications++; this.robot.command(linear,angular);
  }
}
