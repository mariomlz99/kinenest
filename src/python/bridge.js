import { declareParameter, setParameter, startGoal, cancelGoal, lookup } from '../runtime/course.js';
import { TWIST } from '../runtime/graph.js';
import { evaluateReport } from '../exercises/perception.js';

export class PythonBridge {
  constructor(runtime,{output=()=>{},status=()=>{},detection=()=>{}}={}){
    this.runtime=runtime;this.output=output;this.status=status;this.detection=detection;
    this.jobs=new Map();this.actionIds=new Map();this.worker=null;this.nodes=new Set();this.subscriptions=new Map();this.pending=new Set();this.processed=new Map();this.reports=new Map();this.timer=null;
  }
  run(code){
    this.stop();this.processed.clear();this.reports.clear();
    const worker=new Worker(new URL('./worker.js',import.meta.url));this.worker=worker;
    worker.onmessage=event=>{if(this.worker!==worker)return;try{this.handle(event.data);}catch(error){this.output('Error: '+error.message);this.stop();}};
    worker.onerror=event=>{if(this.worker!==worker)return;this.output('Python worker error: '+event.message);this.stop();};
    this.status('Loading real Python and NumPy… first load requires internet.');
    this.watchdog(120000,'Python download timed out. Check your connection and try Run again.');
    this.parameterListener=(node,name,value)=>{if(this.nodes.has(node))worker.postMessage({kind:'parameter_update',node,name,value});};this.runtime.parameterListeners.add(this.parameterListener);
    worker.postMessage({kind:'start',code});
  }
  watchdog(ms,message){clearTimeout(this.timer);this.timer=setTimeout(()=>{this.output(message);this.stop();},ms);}
  cleanupNode(node){
    for(const [id,sub]of this.subscriptions)if(sub.node===node){sub.dispose();this.subscriptions.delete(id);this.pending.delete(id);}
    for(const topic of this.runtime.topics.values()){topic.publishers.delete(node);topic.subscribers.delete(node);}
    for(const service of this.runtime.services.values())service.clients.delete(node);
    for(const [id,job]of this.jobs)if(job.node===node){job.dispose();this.jobs.delete(id);this.pending.delete('timer-'+id);}
    for(const action of this.runtime.actions.values())action.clients.delete(node);
    for(const [id,g]of this.runtime.goals)if(g.node===node)cancelGoal(this.runtime,id);
    this.runtime.parameters.delete(node);this.runtime.nodes.delete(node);this.nodes.delete(node);this.runtime.removeEmptyTopics();
  }
  stop(){
    clearTimeout(this.timer);this.worker?.terminate();this.worker=null;
    for(const node of [...this.nodes])this.cleanupNode(node);
    this.runtime.parameterListeners.delete(this.parameterListener);this.actionIds.clear();this.pending.clear();this.runtime.robot.command(0,0);this.status('Python stopped');
  }
  handle(data){
    const r=this.runtime,e=r.evidence;
    switch(data.kind){
      case 'loading':break;
      case 'executing':this.status('Python executing…');this.watchdog(10000,'Python took too long; stopped. Check for an infinite loop.');break;
      case 'ready':clearTimeout(this.timer);this.status('Python running · callbacks ready');break;
      case 'stdout':this.output(data.text);break;
      case 'error':this.output(data.text);this.stop();break;
      case 'node':
        if(r.nodes.has(data.node))throw new Error('Node already exists: '+data.node);
        r.nodes.add(data.node);this.nodes.add(data.node);break;
      case 'destroy':this.cleanupNode(data.node);break;
      case 'publisher':r.ensureTopic(data.topic,data.type??TWIST).publishers.add(data.node);break;
      case 'publish':r.publish(data.topic,data.type??TWIST,data.message);e.pythonPublications++;break;
      case 'timer':{
        const dispose=r.every(data.period,()=>{const key='timer-'+data.id;if(!this.worker||this.pending.has(key))return;this.pending.add(key);this.worker.postMessage({kind:'timer',id:data.id});if(this.pending.size===1)this.watchdog(5000,'Timer callback took too long; stopped.');});
        this.jobs.set(data.id,{dispose,node:data.node});break;
      }
      case 'timer_cancel':this.jobs.get(data.id)?.dispose();this.jobs.delete(data.id);break;
      case 'timer_processed':r.course.timers++;break;
      case 'parameter_declare':declareParameter(r,data.node,data.name,data.value);break;
      case 'parameter_read':r.course.paramReads++;r.course.paramValues.add(data.value);break;
      case 'action_client':r.actions.get(data.name).clients.add(data.node);break;
      case 'action_goal':{
        try{const id=startGoal(r,data.node,data.goal,(event,payload)=>this.worker?.postMessage({kind:'action_event',id:data.id,event,payload}));this.actionIds.set(data.id,id);this.worker.postMessage({kind:'action_event',id:data.id,event:'accepted',payload:{accepted:true}});}
        catch(error){this.output('Goal rejected: '+error.message);this.worker.postMessage({kind:'action_event',id:data.id,event:'accepted',payload:{accepted:false}});}break;
      }
      case 'action_cancel':{const cancelled=cancelGoal(r,this.actionIds.get(data.id));this.worker.postMessage({kind:'action_event',id:data.request,event:'cancel',payload:{goals_canceling:cancelled?[data.id]:[]}});break;}
      case 'action_observed':if(data.event==='feedback')r.course.feedback++;else if(data.status===4)r.course.results++;else if(data.status===5)r.course.cancelled++;break;
      case 'tf_lookup':r.course.tf++;break;
      case 'message_processed':{const sample=r.samples.get(data.sample);if(sample){sample.processed=true;if(sample.topic==='/scan'){r.course.scan++;if(data.access?.includes('ranges'))r.course.scanAccess=(r.course.scanAccess??0)+1;}else if(sample.topic==='/odom')r.course.odom++;else if(sample.topic==='/chatter')r.course.messages++;this.assessCourse(sample);}break;}
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
          if(!this.worker||this.pending.has(data.id))return;
          this.pending.add(data.id);
          if(data.type&&data.type!=='sensor_msgs/msg/Image'){
            const sample=++r.sampleCounter;r.samples.set(sample,{topic:data.topic,message:image});if(r.samples.size>100)r.samples.delete(r.samples.keys().next().value);
            this.worker.postMessage({kind:'message',subscription:data.id,message:image,sample});
          }else{const {data:bytes,_frameId:frame,...meta}=image;this.worker.postMessage({kind:'image',subscription:data.id,frame,meta,bytes},[bytes.buffer]);}
          if(this.pending.size===1)this.watchdog(5000,'Image callback took too long; stopped.');
        },{existingNode:true,id:data.node+':python-'+data.id});
        this.subscriptions.set(data.id,{dispose,node:data.node});break;
      }
      case 'frame_done':this.pending.delete(data.subscription);if(!this.pending.size)clearTimeout(this.timer);break;
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
    if(report==='range'&&sample.topic==='/scan'){const nearest=Math.min(...m.ranges.filter(Number.isFinite));if(Number.isFinite(nearest)&&Number.isFinite(values[0])&&Math.abs(nearest-values[0])<.05)c.range++;}
    if(report==='sectors'&&sample.topic==='/scan'){const sector=center=>Math.min(...m.ranges.filter((v,i)=>Number.isFinite(v)&&Math.abs(Math.atan2(Math.sin(m.angle_min+i*m.angle_increment-center),Math.cos(m.angle_min+i*m.angle_increment-center)))<=Math.PI/12+1e-9));const truth=[sector(0),sector(Math.PI/2),sector(-Math.PI/2)];if(values.length===3&&values.every((v,i)=>Number.isFinite(v)&&Math.abs(v-truth[i])<.05))c.sectors=(c.sectors??0)+1;}
    if(report==='pose'&&sample.topic==='/odom'){const p=m.pose.pose.position,q=m.pose.pose.orientation,yaw=2*Math.atan2(q.z,q.w);if(values.length===3&&values.every(Number.isFinite)&&Math.hypot(values[0]-p.x,values[1]-p.y)<.03&&Math.abs(Math.atan2(Math.sin(values[2]-yaw),Math.cos(values[2]-yaw)))<.03)c.pose++;}
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
