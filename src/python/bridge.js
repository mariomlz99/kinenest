import { TWIST } from '../runtime/graph.js';
import { evaluateReport } from '../exercises/perception.js';

export class PythonBridge {
  constructor(runtime,{output=()=>{},status=()=>{},detection=()=>{}}={}){
    this.runtime=runtime;this.output=output;this.status=status;this.detection=detection;
    this.worker=null;this.nodes=new Set();this.subscriptions=new Map();this.pending=new Set();this.processed=new Map();this.reports=new Map();this.timer=null;
  }
  run(code){
    this.stop();this.processed.clear();this.reports.clear();
    const worker=new Worker(new URL('./worker.js',import.meta.url));this.worker=worker;
    worker.onmessage=event=>{if(this.worker!==worker)return;try{this.handle(event.data);}catch(error){this.output('Error: '+error.message);this.stop();}};
    worker.onerror=event=>{if(this.worker!==worker)return;this.output('Python worker error: '+event.message);this.stop();};
    this.status('Loading real Python and NumPy… first load requires internet.');
    this.watchdog(120000,'Python download timed out. Check your connection and try Run again.');
    worker.postMessage({kind:'start',code});
  }
  watchdog(ms,message){clearTimeout(this.timer);this.timer=setTimeout(()=>{this.output(message);this.stop();},ms);}
  cleanupNode(node){
    for(const [id,sub]of this.subscriptions)if(sub.node===node){sub.dispose();this.subscriptions.delete(id);this.pending.delete(id);}
    for(const topic of this.runtime.topics.values()){topic.publishers.delete(node);topic.subscribers.delete(node);}
    for(const service of this.runtime.services.values())service.clients.delete(node);
    this.runtime.nodes.delete(node);this.nodes.delete(node);
  }
  stop(){
    clearTimeout(this.timer);this.worker?.terminate();this.worker=null;
    for(const node of [...this.nodes])this.cleanupNode(node);
    this.pending.clear();this.runtime.robot.command(0,0);this.status('Python stopped');
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
      case 'publisher':r.topic(data.topic).publishers.add(data.node);break;
      case 'publish':r.publish(data.topic,TWIST,data.message);e.pythonPublications++;break;
      case 'client':r.service(data.name).clients.add(data.node);e.client=true;break;
      case 'service_call':{
        e.request=true;let response;
        try{response=r.callService(data.name,'std_srvs/srv/Trigger');e.reset=response.success;}catch(error){response={error:error.message};}
        this.worker.postMessage({kind:'service_response',id:data.id,response});break;
      }
      case 'response_received':e.response=!!data.success;break;
      case 'subscribe':{
        const dispose=r.subscribe(data.topic,data.node,image=>{
          if(!this.worker||this.pending.has(data.id))return;
          this.pending.add(data.id);
          const {data:bytes,_frameId:frame,...meta}=image;
          this.worker.postMessage({kind:'image',subscription:data.id,frame,meta,bytes},[bytes.buffer]);
          if(this.pending.size===1)this.watchdog(5000,'Image callback took too long; stopped.');
        },{existingNode:true,id:'python-'+data.id});
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
