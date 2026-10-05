import { interfaceType } from '../runtime/interfaces.js';
import { startGoal, cancelGoal, DRIVE } from '../runtime/course.js';
import { execute, parsePublication, parseMessage, tokens } from './cli.js';
import {transforms} from '../runtime/course.js';

export function fieldValue(message, path) {
  let value=message;
  for(const key of path.split('.')) {
    if(!value || typeof value!=='object' || !Object.hasOwn(value,key)) throw new Error('Unknown message field: '+path);
    value=value[key];
  }
  return value;
}

export function formatMessage(value, indent=0) {
  if(ArrayBuffer.isView(value))return '<'+value.byteLength+' bytes>';

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
    if(this.running) throw new Error('Stop the running command with Ctrl+C before entering another command.');
    const command=input.trim();if(!command)return;
    this.history.push(command);if(this.history.length>100)this.history.shift();this.cursor=this.history.length;
    this.write('$ '+command);
    const parts=command.split(/\s+/);
    if(parts.slice(0,3).join(' ')==='ros2 action send_goal'){
      const args=tokens(command),feedback=args.at(-1)==='--feedback';if(feedback)args.pop();
      if(args.length!==6||args[3]!=='/drive_distance'||args[4]!==DRIVE)throw Error('Usage: ros2 action send_goal /drive_distance ros2learn_interfaces/action/DriveDistance "{distance: 1}" [--feedback]');
      const node='/ros2cli_action_'+this.id;
      const id=startGoal(this.runtime,node,parseMessage(args[5]),(event,payload)=>{if(event==='feedback'&&feedback)this.write('Feedback: '+formatMessage(payload));if(event==='result'){this.write('Result: '+formatMessage(payload));this.stop(false);}});
      this.runtime.nodes.add(node);this.runtime.actions.get('/drive_distance').clients.add(node);
      this.unsubscribe=()=>{this.runtime.actions.get('/drive_distance')?.clients.delete(node);this.runtime.nodes.delete(node);cancelGoal(this.runtime,id);};this.write('Goal accepted. Ctrl+C cancels this teaching action.');this.onState(true);return;
    }
    if(parts.slice(0,3).join(' ')==='ros2 topic pub'){
      const pub=parsePublication(command);if(pub.once){this.write(execute(this.runtime,command));return;}
      const node='/ros2cli_pub_'+this.id;
      try{this.runtime.publish(pub.topic,pub.type,pub.message);}catch(error){this.runtime.removeEmptyTopics();throw error;}
      const topic=this.runtime.topic(pub.topic);topic.publishers.add(node);this.runtime.nodes.add(node);
      let count=1;
      const cancel=this.runtime.every(1/pub.rate,()=>{this.runtime.publish(pub.topic,pub.type,pub.message);this.write('publishing #'+(++count)+' on '+pub.topic);});
      this.unsubscribe=()=>{cancel();topic.publishers.delete(node);this.runtime.nodes.delete(node);this.runtime.removeEmptyTopics();};
      this.write('publishing #1 on '+pub.topic+' at '+pub.rate+' Hz. Ctrl+C to stop.');this.onState(true);return;
    }
    if(['hz','bw','delay'].includes(parts[2])&&parts.slice(0,2).join(' ')==='ros2 topic'){
      if(parts.length!==4)throw new Error('Usage: ros2 topic '+parts[2]+' TOPIC');
      const topic=parts[3],mode=parts[2];this.runtime.topic(topic);let first=null,count=0,bytes=0,totalDelay=0;
      this.unsubscribe=this.runtime.subscribe(topic,'/ros2cli_'+mode+'_'+this.id,message=>{
        if(first===null){first=this.runtime.time;return;}
        count++;bytes+=message.data?.byteLength??new TextEncoder().encode(JSON.stringify(message)).length;
        if(mode==='delay'){
          if(!message.header?.stamp){this.write('This message has no header timestamp; delay is undefined.');this.stop(false);return;}
          totalDelay+=this.runtime.time-message.header.stamp.sec-message.header.stamp.nanosec/1e9;
        }
        if(count%8===0){const elapsed=this.runtime.time-first;this.write(mode==='hz'?'average rate: '+(count/elapsed).toFixed(2)+' Hz (simulation time)':mode==='bw'?(bytes/elapsed/1024).toFixed(2)+' KiB/s (estimated message payload; not DDS wire bandwidth)':'average delay: '+(totalDelay/count).toFixed(6)+' s (simulation time)');}
      });
      this.write('Measuring '+topic+'; Ctrl+C to stop.');this.onState(true);return;
    }
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
    const sample=topicName==='/camera/image_raw'?(this.runtime.camera??interfaceType(topic.type).prototype):topicName==='/odom'?this.runtime.odometry():topicName==='/scan'?this.runtime.scan():topicName==='/tf'?transforms(this.runtime):interfaceType(topic.type).prototype;
    if(field!==null)fieldValue(sample,field);
    this.unsubscribe=this.runtime.subscribe(topicName,'/ros2cli_echo_'+this.id,message=>{
      const {_frameId,...display}=message;this.write(formatMessage(field===null?display:fieldValue(message,field))+'\n---');
      if(once)this.stop(false);
    });
    this.write('Listening on '+topicName+' — waiting for new messages. Ctrl+C or Stop echo to return to the prompt.');
    this.onState(true);
  }
  recall(direction){this.cursor=Math.max(0,Math.min(this.history.length,this.cursor+direction));return this.history[this.cursor]??'';}
  stop(announce=true){if(!this.running)return;const dispose=this.unsubscribe;this.unsubscribe=null;dispose();if(announce)this.write('^C');this.onState(false);}
  reset(){this.stop(false);this.history=[];this.cursor=0;}
}
