import {SENSORS} from '../simulator/sensors.js';
// Course-only extensions. All clocks and motion use the shared simulator.
export const DRIVE='ros2learn_interfaces/action/DriveDistance';
export function resetCourse(r){
  r.parameters=new Map();r.parameterListeners=new Set();r.actions=new Map();r.goals=new Map();r.goalCounter=0;
  r.course={timers:0,messages:0,scan:0,range:0,odom:0,pose:0,tf:0,transform:0,paramReads:0,paramChanges:0,paramValues:new Set(),feedback:0,results:0,cancelled:0,actionAccepted:0,stopped:0,waypoints:0};
  r.samples=new Map();r.sampleCounter=0;
}
export function enableCourse(r){
  r.topics.set('/tf',{type:'tf2_msgs/msg/TFMessage',publishers:new Set(['/simulator']),subscribers:new Set()});
  r.nodes.add('/drive_distance_server');r.topic('/cmd_vel').publishers.add('/drive_distance_server');r.parameters.set('/drive_distance_server',new Map([['speed',0.5]]));
  r.actions.set('/drive_distance',{type:DRIVE,node:'/drive_distance_server',clients:new Set()});
}
export function transforms(r){
  const transform=(parent,child,x,y,yaw)=>({header:{stamp:r.stamp(),frame_id:parent},child_frame_id:child,transform:{translation:{x,y,z:0},rotation:{x:0,y:0,z:Math.sin(yaw/2),w:Math.cos(yaw/2)}}});
  return {transforms:[transform('world','odom',0,0,0),transform('odom','base_link',r.robot.x,r.robot.y,r.robot.yaw),...Object.values(SENSORS).map(m=>transform('base_link',m.frame,m.x,m.y,m.yaw)),transform('world','target',...(r.targetFrame??[5,0]),0)]};
}
// Compose the same published edges used by Python's Buffer and the TF views.
export function lookup(r,target,source){
  const edges=new Map(),known=new Set();
  const add=(from,to,x,y,yaw)=>{if(!edges.has(from))edges.set(from,[]);edges.get(from).push({to,x,y,yaw});};
  for(const edge of transforms(r).transforms){
    const parent=edge.header.frame_id,child=edge.child_frame_id,p=edge.transform.translation,q=edge.transform.rotation,a=2*Math.atan2(q.z,q.w);
    known.add(parent);known.add(child);add(child,parent,p.x,p.y,a);
    add(parent,child,-Math.cos(a)*p.x-Math.sin(a)*p.y,Math.sin(a)*p.x-Math.cos(a)*p.y,-a);
  }
  if(!known.has(target)||!known.has(source))throw Error('Known frames: '+[...known].join(', '));
  const queue=[{to:source,x:0,y:0,yaw:0}],seen=new Set();
  while(queue.length){const current=queue.shift();if(current.to===target)return {x:current.x,y:current.y,yaw:current.yaw};
    if(seen.has(current.to))continue;seen.add(current.to);
    for(const edge of edges.get(current.to)??[])if(!seen.has(edge.to))queue.push({to:edge.to,x:edge.x+Math.cos(edge.yaw)*current.x-Math.sin(edge.yaw)*current.y,y:edge.y+Math.sin(edge.yaw)*current.x+Math.cos(edge.yaw)*current.y,yaw:edge.yaw+current.yaw});
  }
  throw Error('Frames are disconnected');
}
export function declareParameter(r,node,name,value){
  if(!r.nodes.has(node))throw Error('Unknown node: '+node);
  if(!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)||!['number','boolean','string'].includes(typeof value)||typeof value==='number'&&!Number.isFinite(value))throw Error('Use a named scalar parameter');
  const params=r.parameters.get(node)??new Map();if(params.has(name))throw Error('Parameter already declared');params.set(name,value);r.parameters.set(node,params);
}
export function setParameter(r,node,name,value){
  const params=r.parameters.get(node);if(!params?.has(name))throw Error('Parameter not declared: '+name);
  if(typeof value!==typeof params.get(name)||typeof value==='number'&&!Number.isFinite(value))throw Error('Parameter type mismatch');
  params.set(name,value);r.course.paramChanges++;for(const listener of r.parameterListeners)listener(node,name,value);return value;
}
export function startGoal(r,node,goal,notify=()=>{}){
  if(!r.actions.has('/drive_distance'))throw Error('Action server unavailable');
  if(!goal||typeof goal!=='object'||Object.keys(goal).some(k=>k!=='distance'))throw Error('DriveDistance goal contains only distance');
  const {distance}=goal,speed=r.parameters.get('/drive_distance_server')?.get('speed')??.5;
  if(typeof distance!=='number'||!Number.isFinite(distance)||distance<=0||distance>3||typeof speed!=='number'||!Number.isFinite(speed)||speed<=0||speed>1)throw Error('Goal requires 0 < distance ≤ 3 m and 0 < speed ≤ 1 m/s');
  if([...r.goals.values()].some(g=>g.status===2))throw Error('Drive server is busy; cancel or finish its current goal');
  const id=String(++r.goalCounter),g={id,node,distance,speed,start:r.robot.distance,status:2,notify};r.goals.set(id,g);r.course.actionAccepted++;
  let elapsed=0;
  g.collisions=r.collisions;g.dispose=r.every(.1,()=>{elapsed+=.1;if(r.collisions>g.collisions){finishGoal(r,g,6);return;}const travelled=r.robot.distance-g.start;if(travelled>=distance-.015){finishGoal(r,g,4);return;}r.publish('/cmd_vel','geometry_msgs/msg/Twist',{linear:{x:Math.min(speed,(distance-travelled)/.1)}});if(elapsed>=.2-1e-9){elapsed=0;notify('feedback',{distance_travelled:travelled});}});
  return id;
}
function finishGoal(r,g,status){g.dispose();g.status=status;r.publish('/cmd_vel','geometry_msgs/msg/Twist',{});g.result={status,result:{final_distance:r.robot.distance-g.start,success:status===4}};g.notify('result',g.result);}
export function cancelGoal(r,id){const g=r.goals.get(id);if(!g||g.status!==2)return false;finishGoal(r,g,5);return true;}
