import { Robot } from '../simulator/robot.js';
export const TWIST='geometry_msgs/msg/Twist';
export class Runtime {
  constructor() { this.robot=new Robot(); this.reset(); }
  reset() {
    this.robot.reset(); this.discovered=false; this.publications=0;
    this.listeners=new Map(); this.time=0; this.odomElapsed=0;
    this.nodes=new Set(['/simulator']);
    this.topics=new Map([
      ['/cmd_vel',{type:TWIST,publishers:new Set(),subscribers:new Set(['/simulator'])}],
      ['/odom',{type:'nav_msgs/msg/Odometry',publishers:new Set(['/simulator']),subscribers:new Set()}],
      ['/scan',{type:'sensor_msgs/msg/LaserScan',publishers:new Set(['/simulator']),subscribers:new Set(),placeholder:true}]
    ]);
  }
  topic(name) { const topic=this.topics.get(name); if(!topic) throw new Error('Unknown topic: '+name); return topic; }
  subscribe(topicName, nodeName, callback) {
    const topic=this.topic(topicName);
    if(this.nodes.has(nodeName)) throw new Error('Subscriber node already exists: '+nodeName);
    const listeners=this.listeners, nodes=this.nodes;
    const entries=listeners.get(topicName)??new Map();
    listeners.set(topicName,entries); entries.set(nodeName,callback);
    nodes.add(nodeName); topic.subscribers.add(nodeName);
    return ()=>{entries.delete(nodeName);topic.subscribers.delete(nodeName);nodes.delete(nodeName);};
  }
  emit(topic, message) {
    for(const callback of [...(this.listeners.get(topic)?.values()??[])]) callback(structuredClone(message));
  }
  odometry() {
    const r=this.robot, nanos=Math.round(this.time*1e9);
    return {
      header:{stamp:{sec:Math.floor(nanos/1e9),nanosec:nanos%1e9},frame_id:'odom'},
      child_frame_id:'base_link',
      pose:{pose:{position:{x:r.x,y:r.y,z:0},orientation:{x:0,y:0,z:Math.sin(r.yaw/2),w:Math.cos(r.yaw/2)}},covariance:Array(36).fill(0)},
      twist:{twist:{linear:{x:r.linear,y:0,z:0},angular:{x:0,y:0,z:r.angular}},covariance:Array(36).fill(0)}
    };
  }
  step(dt) {
    if(!Number.isFinite(dt)||dt<0) throw new Error('Invalid timestep');
    // Integrate to each 5 Hz odometry boundary, independent of caller step size.
    let remaining=dt;
    while(remaining>1e-12) {
      const slice=Math.min(remaining,0.2-this.odomElapsed);
      this.robot.step(slice);this.time+=slice;this.odomElapsed+=slice;remaining-=slice;
      if(this.odomElapsed>=0.2-1e-12){this.odomElapsed=0;this.emit('/odom',this.odometry());}
    }
  }
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
    this.emit(topic,{linear:{x:linear,y:0,z:0},angular:{x:0,y:0,z:angular}});
  }
}
