import { renderCamera, inspectPixels, CAMERA_PERIOD } from '../simulator/camera.js';
import { newEvidence } from '../exercises/perception.js';
import { Robot } from '../simulator/robot.js';
export const TWIST='geometry_msgs/msg/Twist';
export class Runtime {
  constructor() { this.robot=new Robot(); this.reset(); }
  reset() {
    this.robot.reset(); this.discovered=false; this.publications=0;
    this.jobs=new Set();this.listeners=new Map(); this.time=0; this.odomElapsed=0;
    this.nodes=new Set(['/simulator']);
    this.services=new Map();this.evidence=newEvidence();this.cameraElapsed=0;this.frameId=0;this.frames=new Map();this.camera=null;this.targets=undefined;this.testCase=null;
    this.topics=new Map([
      ['/cmd_vel',{type:TWIST,publishers:new Set(),subscribers:new Set(['/simulator'])}],
      ['/odom',{type:'nav_msgs/msg/Odometry',publishers:new Set(['/simulator']),subscribers:new Set()}],
      ['/scan',{type:'sensor_msgs/msg/LaserScan',publishers:new Set(['/simulator']),subscribers:new Set()}]
    ]);
    if(this.session3Enabled)this.enableSession3();
  }
  every(period,callback){if(!Number.isFinite(period)||period<.05||period>60)throw new Error('Lab publication rate must be between 1/60 and 20 Hz.');const job={period,remaining:period,callback};this.jobs.add(job);return ()=>this.jobs.delete(job);}
  stamp(){const nanos=Math.round(this.time*1e9);return {sec:Math.floor(nanos/1e9),nanosec:nanos%1e9};}
  scan(){
    const ranges=[];const targets=this.session3Enabled?(this.targets??[{x:5,y:0},{x:6,y:-2}]):[];
    for(let i=0;i<36;i++){
      const angle=this.robot.yaw-Math.PI+i*Math.PI/18;let distance=Infinity;
      for(const target of targets){const dx=target.x-this.robot.x,dy=target.y-this.robot.y,along=dx*Math.cos(angle)+dy*Math.sin(angle),cross=-dx*Math.sin(angle)+dy*Math.cos(angle);if(along>0&&Math.abs(cross)<.5){const hit=along-Math.sqrt(.25-cross*cross);if(hit>=.1&&hit<=10)distance=Math.min(distance,hit);}}
      ranges.push(distance);
    }
    return {header:{stamp:this.stamp(),frame_id:'laser'},angle_min:-Math.PI,angle_max:Math.PI-Math.PI/18,angle_increment:Math.PI/18,time_increment:0,scan_time:.2,range_min:.1,range_max:10,ranges,intensities:[]};
  }
  ensureTopic(name,type){if(!/^\/[A-Za-z_][A-Za-z_0-9/]*$/.test(name))throw new Error('Use an absolute topic name such as /chatter');const existing=this.topics.get(name);if(existing&&existing.type!==type)throw new Error('Topic type mismatch: '+existing.type);if(!existing)this.topics.set(name,{type,publishers:new Set(),subscribers:new Set(),dynamic:true});return this.topic(name);}
  removeEmptyTopics(){for(const [name,t] of this.topics)if(t.dynamic&&!t.publishers.size&&!t.subscribers.size)this.topics.delete(name);}
  enableSession3() {
    this.session3Enabled=true;
    this.topics.set('/camera/image_raw',{type:'sensor_msgs/msg/Image',publishers:new Set(['/simulator']),subscribers:new Set()});
    this.nodes.add('/reset_server');
    this.services.set('/reset_robot',{type:'std_srvs/srv/Trigger',node:'/reset_server',clients:new Set(),handler:()=>{this.robot.reset();return {success:true,message:'Robot reset'};}});
  }
  service(name){const service=this.services.get(name);if(!service)throw new Error('Unknown service: '+name);return service;}
  callService(name,type,request={}) {
    const service=this.service(name);if(type!==service.type)throw new Error('Expected '+service.type);
    if(!request||typeof request!=='object'||Array.isArray(request)||Object.keys(request).length)throw new Error('Trigger request must be empty.');
    return service.handler(request);
  }
  cameraFrame() {
    const image=renderCamera(this.robot,this.targets);image.header={stamp:this.stamp(),frame_id:'camera_link'};
    this.camera=image;const id=++this.frameId,truth=inspectPixels(image);
    this.frames.set(id,{truth,caseId:this.testCase??'practice'});if(this.frames.size>32)this.frames.delete(this.frames.keys().next().value);
    if(truth.visible&&Math.abs(truth.cx-160)<12&&Math.abs(this.robot.angular)<0.02&&Math.abs(this.robot.linear)<0.02)this.evidence.centeredFrames++;else this.evidence.centeredFrames=0;
    this.emit('/camera/image_raw',{...image,_frameId:id});
  }
  topic(name) { const topic=this.topics.get(name); if(!topic) throw new Error('Unknown topic: '+name); return topic; }
  subscribe(topicName, nodeName, callback, {existingNode=false,id=nodeName}={}) {
    const topic=this.topic(topicName);
    if(this.nodes.has(nodeName)&&!existingNode) throw new Error('Subscriber node already exists: '+nodeName);
    const listeners=this.listeners, nodes=this.nodes;
    const entries=listeners.get(topicName)??new Map();
    listeners.set(topicName,entries); entries.set(id,callback);
    nodes.add(nodeName); topic.subscribers.add(nodeName);
    return ()=>{entries.delete(id);topic.subscribers.delete(nodeName);if(!existingNode)nodes.delete(nodeName);this.removeEmptyTopics();};
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
      const slice=Math.min(remaining,0.2-this.odomElapsed,this.session3Enabled?CAMERA_PERIOD-this.cameraElapsed:Infinity,...[...this.jobs].map(job=>job.remaining));
      this.robot.step(slice);this.time+=slice;this.odomElapsed+=slice;this.cameraElapsed+=this.session3Enabled?slice:0;remaining-=slice;
      if(this.session3Enabled&&this.cameraElapsed>=CAMERA_PERIOD-1e-12){this.cameraElapsed=0;this.cameraFrame();}
      if(this.odomElapsed>=0.2-1e-12){this.odomElapsed=0;this.emit('/odom',this.odometry());this.emit('/scan',this.scan());}
      for(const job of [...this.jobs]){job.remaining-=slice;if(job.remaining<1e-12){job.remaining=job.period;job.callback();}}
    }
  }
  publish(topic,type,msg) {
    if(type==='std_msgs/msg/String'){if(!msg||typeof msg.data!=='string'||Object.keys(msg).some(k=>k!=='data'))throw new Error('String requires {data: "text"}');this.ensureTopic(topic,type);this.emit(topic,{data:msg.data});return;}
    if(type!==TWIST)throw new Error('Publishing supports geometry_msgs/msg/Twist and std_msgs/msg/String.');
    const existing=this.topics.get(topic);if(existing&&existing.type!==type)throw new Error('Expected '+existing.type);
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
    this.ensureTopic(topic,type);
    if(topic==='/cmd_vel'){this.discovered=true;this.publications++;this.robot.command(linear,angular);}
    this.emit(topic,{linear:{x:linear,y:0,z:0},angular:{x:0,y:0,z:angular}});
  }
}
