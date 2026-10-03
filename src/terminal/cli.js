import { setParameter } from '../runtime/course.js';
import { interfaceType, INTERFACES } from '../runtime/interfaces.js';
export function parseMessage(text) {
  let value=text.trim();
  if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))value=value.slice(1,-1);
  value=value.replace(/([{,]\s*)([A-Za-z_][A-Za-z_0-9]*)(\s*:)/g,'$1"$2"$3');
  try{return JSON.parse(value);}catch{throw new Error('Use JSON or a simple flow mapping, e.g. "{linear: {x: 0.6}}".');}
}
export function tokens(text){
  const result=[];let token='',quote=null,depth=0,escape=false;
  for(const char of text){
    if(escape){token+=char;escape=false;continue;}
    if(char==='\\'&&quote){token+=char;escape=true;continue;}
    if(quote){token+=char;if(char===quote)quote=null;continue;}
    if(char==='"'||char==="'"){quote=char;token+=char;continue;}
    if(char==='{'||char==='[')depth++;if(char==='}'||char===']')depth--;
    if(/\s/.test(char)&&depth===0){if(token){result.push(token);token='';}}else token+=char;
  }
  if(quote||depth!==0)throw new Error('Unclosed quote or message mapping');if(token)result.push(token);return result;
}
export function parsePublication(input){
  const args=tokens(input.trim().replace(/^ros2\s+topic\s+pub\s+/,''));let once=false,rate=1;const positional=[];
  for(let i=0;i<args.length;i++){
    if(args[i]==='--once')once=true;
    else if(['-r','--rate'].includes(args[i])){rate=Number(args[++i]);if(!Number.isFinite(rate)||rate<1/60||rate>20)throw new Error('Lab rate must be between 1/60 and 20 Hz.');}
    else if(args[i].startsWith('-'))throw new Error('Supported publication flags: --once, -r / --rate HZ');
    else positional.push(args[i]);
  }
  if(positional.length<2||positional.length>3)throw new Error('Usage: ros2 topic pub [--once | --rate HZ] TOPIC TYPE [MESSAGE]');
  return {topic:positional[0],type:positional[1],message:parseMessage(positional[2]??'{}'),once,rate};
}
const HELP='ROS learning CLI (shared by all labs)\nros2 node list | info NODE\nros2 topic list [-t] | type TOPIC | info TOPIC [-v] | find TYPE\nros2 topic echo TOPIC [--field PATH] [--once]\nros2 topic hz TOPIC | bw TOPIC | delay TOPIC\nros2 topic pub [--once | -r HZ] TOPIC TYPE MESSAGE\nros2 interface list | packages | package PACKAGE | show TYPE | proto TYPE\nros2 service list [-t] | type SERVICE | info SERVICE | find TYPE | call SERVICE TYPE [REQUEST]\nros2 param list [NODE] | get NODE NAME | set NODE NAME VALUE\nros2 action list [-t] | info ACTION | send_goal ACTION TYPE GOAL [--feedback]\nCtrl+C stops streaming commands. This is not a Linux shell. Only implemented message types and flags are supported.';
export function execute(runtime,input){
  const command=input.trim().replace(/\s+/g,' '),parts=command.split(' ');
  if(command==='help'||command==='ros2'||parts.includes('--help')||parts.includes('-h'))return HELP;
  const args=tokens(input.trim());
  if(args[1]==='param'){
    const [,,verb,node,name,...rest]=args;
    if(verb==='list'&&args.length<=4){if(node&&!runtime.nodes.has(node))throw Error('Unknown node');return [...runtime.parameters].filter(([n])=>!node||n===node).map(([n,p])=>n+':\n'+[...p.keys()].map(k=>'  '+k).join('\n')).join('\n')||'(no declared parameters)';}
    if(verb==='get'&&args.length===5){const p=runtime.parameters.get(node);if(!p?.has(name))throw Error('Parameter not declared');return JSON.stringify(p.get(name));}
    if(verb==='set'&&args.length===6){let value;try{value=JSON.parse(rest[0]);}catch{value=rest[0];}setParameter(runtime,node,name,value);return 'Set '+name+' = '+JSON.stringify(value);}
    throw Error('Usage: ros2 param list [NODE] | get NODE NAME | set NODE NAME VALUE');
  }
  if(args[1]==='action'){
    if(args[2]==='list'&&(args.length===3||args.length===4&&['-t','--show-types'].includes(args[3])))return [...runtime.actions].map(([n,a])=>n+(args[3]?' ['+a.type+']':'')).join('\n');
    if(args[2]==='type'&&args.length===4){const a=runtime.actions.get(args[3]);if(!a)throw Error('Unknown action');return a.type;}
    if(args[2]==='info'&&args.length===4){const a=runtime.actions.get(args[3]);if(!a)throw Error('Unknown action');return 'Action: '+args[3]+'\nType: '+a.type+'\nServer: '+a.node+'\nClients: '+[...a.clients].join(', ');}
  }
  if(command==='ros2 node list')return [...runtime.nodes].sort().join('\n');
  if(parts.slice(0,3).join(' ')==='ros2 node info'&&parts.length===4){
    const name=parts[3];if(!runtime.nodes.has(name))throw new Error('Unknown node: '+name);
    const topics=kind=>[...runtime.topics].filter(([,t])=>t[kind].has(name)).map(([n,t])=>'  '+n+': '+t.type).join('\n')||'  (none)';
    const services=[...runtime.services].filter(([,s])=>s.node===name).map(([n,s])=>'  '+n+': '+s.type).join('\n')||'  (none)';
    const clients=[...runtime.services].filter(([,s])=>s.clients.has(name)).map(([n,s])=>'  '+n+': '+s.type).join('\n')||'  (none)';
    return name+'\nSubscribers:\n'+topics('subscribers')+'\nPublishers:\n'+topics('publishers')+'\nService Servers:\n'+services+'\nService Clients:\n'+clients;
  }
  const list=command.match(/^ros2 (topic|service) list(?: (-t|--show-types))?$/);
  if(list){if(list[1]==='topic')runtime.discovered=true;return [...(list[1]==='topic'?runtime.topics:runtime.services)].map(([name,t])=>name+(list[2]?' ['+t.type+']':'')).join('\n');}
  const find=command.match(/^ros2 (topic|service) find (\S+)$/);
  if(find)return [...(find[1]==='topic'?runtime.topics:runtime.services)].filter(([,t])=>t.type===find[2]).map(([name])=>name).join('\n');
  const inspect=command.match(/^ros2 topic (type|info) (\/\S+)(?: (-v|--verbose))?$/);
  if(inspect){const topic=runtime.topic(inspect[2]);if(inspect[2]==='/cmd_vel')runtime.discovered=true;if(inspect[1]==='type')return topic.type;let output='Type: '+topic.type+'\nPublisher count: '+topic.publishers.size+'\nSubscription count: '+topic.subscribers.size;if(inspect[3])output+='\nPublisher nodes: '+([...topic.publishers].join(', ')||'(none)')+'\nSubscriber nodes: '+([...topic.subscribers].join(', ')||'(none)')+'\nEducational graph: DDS endpoint IDs and QoS negotiation are not simulated.';return output;}
  const serviceInfo=command.match(/^ros2 service (type|info) (\/\S+)$/);
  if(serviceInfo){const s=runtime.service(serviceInfo[2]);return serviceInfo[1]==='type'?s.type:'Type: '+s.type+'\nServer: '+s.node+'\nClient count: '+s.clients.size;}
  const serviceCall=command.match(/^ros2 service call (\/\S+) (\S+)(?: (.+))?$/);
  if(serviceCall){const response=runtime.callService(serviceCall[1],serviceCall[2],serviceCall[3]?parseMessage(serviceCall[3]):{});return 'success: '+response.success+'\nmessage: '+JSON.stringify(response.message);}
  if(command==='ros2 interface list')return Object.keys(INTERFACES).join('\n');
  if(command==='ros2 interface packages')return [...new Set(Object.keys(INTERFACES).map(name=>name.split('/')[0]))].join('\n');
  const pkg=command.match(/^ros2 interface package (\S+)$/);if(pkg)return Object.keys(INTERFACES).filter(name=>name.startsWith(pkg[1]+'/')).join('\n');
  const iface=command.match(/^ros2 interface (show|proto) (\S+)$/);if(iface){const type=interfaceType(iface[2]);return iface[1]==='show'?type.definition:JSON.stringify(type.prototype,null,2);}
  if(/^ros2 topic pub /.test(command)){const pub=parsePublication(input);if(!pub.once)throw new Error('Run repeated publication in a terminal; use --once for one-shot execution.');runtime.publish(pub.topic,pub.type,pub.message);runtime.removeEmptyTopics();return 'Published one message on '+pub.topic+(pub.topic==='/cmd_vel'?'. Controller holds velocity for 2 seconds, then stops.':'.');}
  throw new Error('Unsupported command or flags. Type help for the supported ROS basics.');
}
