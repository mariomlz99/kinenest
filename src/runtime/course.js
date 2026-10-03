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
  return {transforms:[transform('world','odom',0,0,0),transform('odom','base_link',r.robot.x,r.robot.y,r.robot.yaw),transform('base_link','laser_link',.2,0,0),transform('base_link','camera_link',.15,0,0),transform('world','target',...(r.targetFrame??[5,0]),0)]};
}
export function lookup(r,target,source){
  const frames={odom:[0,0,0],base_link:[r.robot.x,r.robot.y,r.robot.yaw],laser_link:[r.robot.x+.2*Math.cos(r.robot.yaw),r.robot.y+.2*Math.sin(r.robot.yaw),r.robot.yaw],camera_link:[r.robot.x+.15*Math.cos(r.robot.yaw),r.robot.y+.15*Math.sin(r.robot.yaw),r.robot.yaw],world:[0,0,0],target:[...(r.targetFrame??[5,0]),0]};
  if(!frames[target]||!frames[source])throw Error('Known frames: world, odom, base_link, laser_link, camera_link, target');
  const [tx,ty,ta]=frames[target],[sx,sy,sa]=frames[source],dx=sx-tx,dy=sy-ty;
  return {x:Math.cos(ta)*dx+Math.sin(ta)*dy,y:-Math.sin(ta)*dx+Math.cos(ta)*dy,yaw:sa-ta};
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
