import { TWIST } from '../runtime/graph.js';
export function parseMessage(text) {
  let value=text.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value=value.slice(1,-1);
  // Deliberately small flow-mapping subset: JSON or unquoted ROS field names.
  value=value.replace(/([{,]\s*)([A-Za-z_][A-Za-z_0-9]*)(\s*:)/g,'$1"$2"$3');
  try { return JSON.parse(value); } catch { throw new Error('Use a flow mapping, e.g. "{linear: {x: 0.6}, angular: {z: 0.0}}".'); }
}
export function execute(runtime, input) {
  const command=input.trim().replace(/\s+/g,' ');
  if(command==='help') return 'Commands: ros2 topic echo TOPIC [--field FIELD] [--once]; ros2 node list; ros2 topic list; ros2 topic type TOPIC; ros2 topic info TOPIC; ros2 interface show geometry_msgs/msg/Twist; ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.6}}". Lab 01 supports single publications only. This is not a Linux shell.';
  if(command==='ros2 node list') return [...runtime.nodes].join('\n');
  if(command==='ros2 topic list') { runtime.discovered=true; return [...runtime.topics.keys()].join('\n'); }
  const inspect=command.match(/^ros2 topic (type|info) (\/\S+)$/);
  if(inspect) {
    const topic=runtime.topic(inspect[2]); if(inspect[2]==='/cmd_vel') runtime.discovered=true;
    return inspect[1]==='type'?topic.type:'Type: '+topic.type+'\nPublisher count: '+topic.publishers.size+'\nSubscription count: '+topic.subscribers.size+(topic.placeholder?'\nReserved sensor endpoint; no sensor samples in Lab 01.':'');
  }
  if(command==='ros2 interface show '+TWIST) return 'Vector3 linear\n  float64 x\n  float64 y\n  float64 z\nVector3 angular\n  float64 x\n  float64 y\n  float64 z\n\nLinear velocity: m/s. Angular velocity: rad/s. This lab applies linear.x and angular.z.';
  const pub=command.match(/^ros2 topic pub --once (\/\S+) (\S+) (.+)$/);
  if(pub) {runtime.publish(pub[1],pub[2],parseMessage(pub[3])); return 'Published one Twist on /cmd_vel. The simulated controller holds it for 2 seconds, then stops.';}
  if(command.startsWith('ros2 topic pub')) throw new Error('Use ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.6}}". Repeated publishing and other flags are not supported in Lab 01.');
  throw new Error('Unsupported command. Type help for the Lab 01 command list.');
}
