import { execute } from './cli.js';

export function fieldValue(message, path) {
  let value=message;
  for(const key of path.split('.')) {
    if(!value || typeof value!=='object' || !Object.hasOwn(value,key)) throw new Error('Unknown message field: '+path);
    value=value[key];
  }
  return value;
}

export function formatMessage(value, indent=0) {
  if(Array.isArray(value)) return '['+value.map(v=>formatMessage(v)).join(', ')+']';
  if(value!==null && typeof value==='object') return Object.entries(value).map(([key,child])=>{
    const nested=child!==null && typeof child==='object' && !Array.isArray(child);
    return ' '.repeat(indent)+key+':'+(nested?'\n'+formatMessage(child,indent+2):' '+formatMessage(child));
  }).join('\n');
  return typeof value==='number'?String(Number(value.toFixed(6))):JSON.stringify(value);
}

// A terminal owns its foreground echo process; every session shares one Runtime.
export class TerminalSession {
  constructor(runtime,id,write,onState=()=>{}) {
    this.runtime=runtime;this.id=id;this.write=write;this.onState=onState;
    this.unsubscribe=null;this.history=[];this.cursor=0;
  }
  get running(){return this.unsubscribe!==null;}
  run(input) {
    if(this.running) throw new Error('Stop echo with Ctrl+C before entering another command.');
    const command=input.trim();if(!command)return;
    this.history.push(command);if(this.history.length>100)this.history.shift();this.cursor=this.history.length;
    this.write('$ '+command);
    const parts=command.split(/\s+/);
    if(parts.slice(0,3).join(' ')!=='ros2 topic echo') {this.write(execute(this.runtime,command));return;}
    const topicName=parts[3];let field=null,once=false;
    for(let i=4;i<parts.length;i++) {
      if(parts[i]==='--once'&&!once)once=true;
      else if(parts[i]==='--field'&&field===null&&parts[i+1])field=parts[++i];
      else throw new Error('Usage: ros2 topic echo TOPIC [--field FIELD] [--once]');
    }
    if(!topicName)throw new Error('Usage: ros2 topic echo TOPIC [--field FIELD] [--once]');
    const topic=this.runtime.topic(topicName);
    if(topic.placeholder)throw new Error(topicName+' has no simulated sensor samples yet. Try /odom or /cmd_vel.');
    const sample=topicName==='/odom'?this.runtime.odometry():{linear:{x:0,y:0,z:0},angular:{x:0,y:0,z:0}};
    if(field!==null)fieldValue(sample,field);
    this.unsubscribe=this.runtime.subscribe(topicName,'/ros2cli_echo_'+this.id,message=>{
      this.write(formatMessage(field===null?message:fieldValue(message,field))+'\n---');
      if(once)this.stop(false);
    });
    this.write('Listening on '+topicName+' — waiting for new messages. Ctrl+C or Stop echo to return to the prompt.');
    this.onState(true);
  }
  recall(direction){this.cursor=Math.max(0,Math.min(this.history.length,this.cursor+direction));return this.history[this.cursor]??'';}
  stop(announce=true){if(!this.running)return;this.unsubscribe();this.unsubscribe=null;if(announce)this.write('^C');this.onState(false);}
  reset(){this.stop(false);this.history=[];this.cursor=0;}
}
