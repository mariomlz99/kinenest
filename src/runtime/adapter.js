import {LatestMailbox} from './mailbox.js';
import { declareParameter, setParameter, startGoal, cancelGoal, lookup } from './course.js';
import { TWIST } from './graph.js';
import { evaluateReport } from '../exercises/perception.js';

export class RuntimeAdapter {
  constructor(runtime,{output=()=>{},status=()=>{},detection=()=>{},language="Python",ros=null,onStop=()=>{}}={}){
    this.language=language;this.runtime=runtime;this.output=output;this.status=status;this.detection=detection;
    this.ros=ros;this.onStop=onStop;this.nodeNames=new Map();this.sourceNames=new Map();
    this.jobs=new Map();this.actionIds=new Map();this.worker=null;this.nodes=new Set();this.subscriptions=new Map();this.mailbox=new LatestMailbox();this.pending=this.mailbox.inFlight;this.processed=new Map();this.reports=new Map();this.timer=null;
  }
  mapNode(name){
    if(!this.ros)return name;
    if(this.nodeNames.has(name))return this.nodeNames.get(name);
    const namespace=(this.ros.namespace??'').replace(/^\/+|\/+$/g,'');
    const base=this.ros.name??String(name).split('/').filter(Boolean).at(-1);
    const mapped='/'+[namespace,base].filter(Boolean).join('/');
    this.nodeNames.set(name,mapped);this.sourceNames.set(mapped,name);return mapped;
  }
  mapTopic(name){
    if(!this.ros)return name;
    const namespace=(this.ros.namespace??'').replace(/^\/+|\/+$/g,'');
    const absolute=value=>value.startsWith('/')?value:'/'+[namespace,value].filter(Boolean).join('/');
    const mapped=this.ros.remappings?.find(([from])=>absolute(from)===absolute(name));
    return absolute(mapped?.[1]??name);
  }
  watchdog(ms,message){clearTimeout(this.timer);this.timer=setTimeout(()=>{this.output(message);this.stop();},ms);}
  cleanupNode(node){
    for(const [id,sub]of this.subscriptions)if(sub.node===node){sub.dispose();this.subscriptions.delete(id);this.mailbox.remove(id);}
    for(const topic of this.runtime.topics.values()){topic.publishers.delete(node);topic.subscribers.delete(node);}
    for(const service of this.runtime.services.values())service.clients.delete(node);
    for(const [id,job]of this.jobs)if(job.node===node){job.dispose();this.jobs.delete(id);this.pending.delete('timer-'+id);}
    for(const action of this.runtime.actions.values())action.clients.delete(node);
    for(const [id,g]of this.runtime.goals)if(g.node===node)cancelGoal(this.runtime,id);
    this.runtime.parameters.delete(node);this.runtime.nodes.delete(node);this.nodes.delete(node);this.runtime.removeEmptyTopics();
  }
  stop(){
    const active=!!this.worker||this.nodes.size>0;
    clearTimeout(this.timer);this.worker?.terminate();this.worker=null;
    for(const node of [...this.nodes])this.cleanupNode(node);
    this.runtime.parameterListeners.delete(this.parameterListener);this.actionIds.clear();this.mailbox.clear();this.runtime.robot.command(0,0);this.status(this.language+' stopped');if(active)this.onStop();
  }
  handle(data){
    const r=this.runtime,e=r.evidence;
    if(this.ros){
      if(data.node)data={...data,node:this.mapNode(data.node)};
      if(data.topic)data={...data,topic:this.mapTopic(data.topic)};
      if(data.kind==='parameter_declare'&&Object.hasOwn(this.ros.parameters??{},data.name)){
        const value=this.ros.parameters[data.name];data={...data,value};
        this.worker?.postMessage({kind:'parameter_update',node:this.sourceNames.get(data.node),name:data.name,value});
      }
    }
    switch(data.kind){
      case 'loading':if(data.text)this.status(data.text);break;
      case 'shutdown':this.stop();break;
      case 'unsubscribe':this.subscriptions.get(data.id)?.dispose();this.subscriptions.delete(data.id);this.mailbox.remove(data.id);break;
      case 'executing':this.status(this.language+' executing…');this.watchdog(10000,this.language+' took too long; stopped. Check for an infinite loop.');break;
      case 'ready':clearTimeout(this.timer);this.status(this.language+' running · callbacks ready');break;
      case 'stdout':this.output(data.text);break;
      case 'error':this.output(data.text);this.stop();break;
      case 'node':
        if(r.nodes.has(data.node))throw new Error('Node already exists: '+data.node);
        r.nodes.add(data.node);this.nodes.add(data.node);break;
      case 'destroy':this.cleanupNode(data.node);break;
      case 'publisher':r.ensureTopic(data.topic,data.type??TWIST).publishers.add(data.node);break;
      case 'publish':r.publish(data.topic,data.type??TWIST,data.message);e.codePublications++;if(data.topic==='/chatter'&&data.type==='std_msgs/msg/String')r.course.chatterPublished++;if(data.topic==='/cmd_vel'){r.course.commandPublications=(r.course.commandPublications??0)+1;(r.course.commandSpeeds??=new Set()).add(data.message.linear?.x??0);}if(data.type==='ros2learn_interfaces/msg/TargetInfo'&&data.topic==='/target_info')r.course.customCode=(r.course.customCode??0)+1;break;
      case 'timer':{
        const dispose=r.every(data.period,()=>{const key='timer-'+data.id;if(!this.worker||this.pending.has(key))return;this.pending.add(key);this.worker.postMessage({kind:'timer',id:data.id});if(this.pending.size===1)this.watchdog(5000,'Timer callback took too long; stopped.');});
        this.jobs.set(data.id,{dispose,node:data.node});break;
      }
      case 'timer_cancel':this.jobs.get(data.id)?.dispose();this.jobs.delete(data.id);this.mailbox.remove('timer-'+data.id);break;
      case 'timer_processed':r.course.timers++;break;
      case 'parameter_declare':declareParameter(r,data.node,data.name,data.value);break;
      case 'parameter_read':r.course.paramReads++;r.course.paramValues.add(data.value);break;
      case 'action_client':{const action=r.actions.get(data.name);if(!action)throw new Error('Unknown action server: '+data.name);action.clients.add(data.node);break;}
      case 'action_goal':{
        const worker=this.worker;if(!worker)break;
        try{const name=data.name??'/drive_distance',action=r.actions.get(name);if(!action?.clients.has(data.node))throw new Error('Register an action client for '+name+' on '+data.node+' before sending a goal');
          const id=startGoal(r,data.node,data.goal,(event,payload)=>{if(this.worker!==worker)return;if(event==='result')this.actionIds.delete(data.id);worker.postMessage({kind:'action_event',id:data.id,event,payload});});
          this.actionIds.set(data.id,id);worker.postMessage({kind:'action_event',id:data.id,event:'accepted',payload:{accepted:true}});
        }catch(error){this.output('Goal rejected: '+error.message);if(this.worker===worker)worker.postMessage({kind:'action_event',id:data.id,event:'accepted',payload:{accepted:false}});}break;
      }
      case 'action_cancel':{const worker=this.worker;if(!worker)break;const cancelled=cancelGoal(r,this.actionIds.get(data.id));if(this.worker===worker)worker.postMessage({kind:'action_event',id:data.request,event:'cancel',payload:{goals_canceling:cancelled?[data.id]:[]}});break;}
      case 'action_observed':if(data.event==='feedback')r.course.feedback++;else if(data.status===4)r.course.results++;else if(data.status===5)r.course.cancelled++;break;
      case 'tf_lookup':r.course.tf++;break;
      case 'message_processed':{const sample=r.samples.get(data.sample);if(sample){sample.processed=true;sample.access=new Set(data.access??[]);if(sample.topic==='/scan'){r.course.scan++;if(data.access?.includes('ranges'))r.course.scanAccess=(r.course.scanAccess??0)+1;}else if(sample.topic==='/odom')r.course.odom++;else if(sample.type==='std_msgs/msg/String'||sample.topic==='/chatter')r.course.messages++;this.assessCourse(sample);}break;}
      case 'course_report':{const sample=r.samples.get(data.sample);if(sample){sample.report=data;this.assessCourse(sample);}else if(data.report==='relative'){const t=lookup(r,'base_link','target');if(data.values.length===2&&data.values.every(Number.isFinite)&&Math.hypot(data.values[0]-t.x,data.values[1]-t.y)<.05)r.course.relative=(r.course.relative??0)+1;}else if(data.report==='transform'){const t=lookup(r,'odom','laser_link');if(data.values.every(Number.isFinite)&&Math.hypot(data.values[0]-t.x,data.values[1]-t.y)<.05)r.course.transform++;}break;}
      case 'client':r.service(data.name).clients.add(data.node);e.client=true;break;
      case 'service_call':{
        e.request=true;let response;
        try{response=r.callService(data.name,'std_srvs/srv/Trigger');e.reset=response.success;}catch(error){response={error:error.message};}
        this.worker.postMessage({kind:'service_response',id:data.id,response});break;
      }
      case 'response_received':e.response=!!data.success;break;
      case 'subscribe':{
        r.ensureTopic(data.topic,data.type??'sensor_msgs/msg/Image');
        const dispose=r.subscribe(data.topic,data.node,image=>{
          if(!this.worker)return;
          this.mailbox.offer(data.id,()=>{
          if(data.type&&data.type!=='sensor_msgs/msg/Image'){
            const sample=++r.sampleCounter;r.samples.set(sample,{topic:data.topic,type:data.type,message:image});if(r.samples.size>100)r.samples.delete(r.samples.keys().next().value);
            this.worker.postMessage({kind:'message',subscription:data.id,message:image,sample});
          }else{const {data:bytes,_frameId:frame,...meta}=image;this.worker.postMessage({kind:'image',subscription:data.id,frame,meta,bytes},[bytes.buffer]);}
          if(this.pending.size===1)this.watchdog(5000,'Sensor callback took too long; stopped.');
          });
        },{existingNode:true,id:data.node+':code-'+data.id});
        this.subscriptions.set(data.id,{dispose,node:data.node});break;
      }
      case 'frame_done':this.mailbox.done(data.subscription);if(!this.pending.size)clearTimeout(this.timer);break;
      case 'processed':{
        e.callbacks++;const access=new Set(data.access);e.dimensions ||= access.has('width')&&access.has('height');e.converted ||= access.has('converted')||access.has('data');
        this.processed.set(data.frame,access);if(this.processed.size>32)this.processed.delete(this.processed.keys().next().value);
        this.assess(data.frame);break;
      }
      case 'detection':case 'image_stats':{
        const report=this.reports.get(data.frame)??{};report[data.kind]=data;this.reports.set(data.frame,report);
        if(this.reports.size>32)this.reports.delete(this.reports.keys().next().value);this.assess(data.frame);break;
      }
    }
  }
  assessCourse(sample){
    if(!sample.processed||!sample.report)return;
    const {report,values}=sample.report,m=sample.message,c=this.runtime.course;
    if(report==='range'&&sample.topic==='/scan'&&sample.access?.has('ranges')){const nearest=Math.min(...m.ranges.filter(Number.isFinite));if(Number.isFinite(nearest)&&Number.isFinite(values[0])&&Math.abs(nearest-values[0])<.05)c.range++;}
    if(report==='sectors'&&sample.topic==='/scan'&&sample.access?.has('ranges')){const sector=center=>Math.min(...m.ranges.filter((v,i)=>Number.isFinite(v)&&Math.abs(Math.atan2(Math.sin(m.angle_min+i*m.angle_increment-center),Math.cos(m.angle_min+i*m.angle_increment-center)))<=Math.PI/12+1e-9));const truth=[sector(0),sector(Math.PI/2),sector(-Math.PI/2)];if(values.length===3&&values.every((v,i)=>Number.isFinite(v)&&Math.abs(v-truth[i])<.05))c.sectors=(c.sectors??0)+1;}
    if((report==='position'||report==='pose')&&sample.topic==='/odom'){const p=m.pose.pose.position,q=m.pose.pose.orientation,yaw=2*Math.atan2(q.z,q.w);if(values.length>=(report==='pose'?3:2)&&values.every(Number.isFinite)&&Math.hypot(values[0]-p.x,values[1]-p.y)<.03){c.position++;if(report==='pose'&&Math.abs(Math.atan2(Math.sin(values[2]-yaw),Math.cos(values[2]-yaw)))<.03)c.pose++;}}
    delete sample.report;
  }
  assess(frame){
    const access=this.processed.get(frame),report=this.reports.get(frame),sample=this.runtime.frames.get(frame);
    if(!access?.has('data')||!report||!sample)return;
    if(report.detection){
      evaluateReport(this.runtime.evidence,report.detection,sample.truth,sample.caseId);
      this.detection({...report.detection});delete report.detection;
    }
    if(report.image_stats){
      const {shape,means}=report.image_stats;
      if(JSON.stringify(shape)==='[240,320,3]'&&means?.length===3&&means.every((v,i)=>Number.isFinite(v)&&Math.abs(v-sample.truth.means[i])<1))this.runtime.evidence.stats=true;
      delete report.image_stats;
    }
  }
}
