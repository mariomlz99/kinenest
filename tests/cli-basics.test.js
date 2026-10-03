import test from 'node:test';
import assert from 'node:assert/strict';
import {Runtime,TWIST} from '../src/runtime/graph.js';
import {execute,parsePublication} from '../src/terminal/cli.js';
import {TerminalSession} from '../src/terminal/session.js';

test('core discovery commands reflect the live graph',()=>{
 const r=new Runtime();assert.match(execute(r,'ros2 topic list -t'),/cmd_vel \[geometry_msgs\/msg\/Twist\]/);
 assert.equal(execute(r,'ros2 topic find '+TWIST),'/cmd_vel');assert.match(execute(r,'ros2 node info /simulator'),/Subscribers:[\s\S]*cmd_vel/);
 assert.match(execute(r,'ros2 topic info /cmd_vel --verbose'),/Subscriber nodes: \/simulator/);
 for(const type of ['sensor_msgs/msg/Image','sensor_msgs/msg/LaserScan','nav_msgs/msg/Odometry','std_srvs/srv/Trigger','std_msgs/msg/String'])assert.ok(execute(r,'ros2 interface show '+type));
 assert.match(execute(r,'ros2 interface packages'),/sensor_msgs/);assert.match(execute(r,'ros2 interface package geometry_msgs'),/Twist/);
 assert.deepEqual(JSON.parse(execute(r,'ros2 interface proto std_msgs/msg/String')),{data:''});
 assert.match(execute(r,'ros2 topic --help'),/topic hz/);assert.throws(()=>execute(r,'ros2 node info /absent'));
 r.enableSession3();assert.equal(execute(r,'ros2 service find std_srvs/srv/Trigger'),'/reset_robot');assert.match(execute(r,'ros2 service info /reset_robot'),/Server: \/reset_server/);
});
test('continuous publisher uses runtime clock and survives multiple terminal observers',()=>{
 const r=new Runtime(),pub=new TerminalSession(r,1,()=>{}),messages=[];
 pub.run('ros2 topic pub /cmd_vel '+TWIST+' "{linear: {x: 0.5}}" --rate 4');
 const echo=new TerminalSession(r,2,text=>messages.push(text));echo.run('ros2 topic echo /cmd_vel');
 assert.ok(r.nodes.has('/ros2cli_pub_1'));assert.equal(r.topic('/cmd_vel').publishers.size,1);
 r.step(1);assert.equal(messages.filter(text=>text.endsWith('---')).length,4);assert.equal(r.publications,5);
 pub.stop();assert.equal(r.jobs.size,0);assert.equal(r.topic('/cmd_vel').publishers.size,0);const count=r.publications;r.step(2);assert.equal(r.publications,count);echo.stop();
});
test('String topics can be created, observed and removed without moving robot',()=>{
 const r=new Runtime(),output=[],pub=new TerminalSession(r,1,()=>{}),echo=new TerminalSession(r,2,text=>output.push(text));
 pub.run('ros2 topic pub -r 2 /chatter std_msgs/msg/String '+JSON.stringify({data:'hello   world'}));
 echo.run('ros2 topic echo /chatter --field data --once');r.step(.5);assert.equal(output.at(-1),'"hello   world"\n---');assert.equal(r.robot.distance,0);
 pub.stop();assert.equal(r.topics.has('/chatter'),false);
 assert.equal(parsePublication('ros2 topic pub --once /cmd_vel '+TWIST+' "{linear: {x: 1}}"').once,true);
 assert.throws(()=>parsePublication('ros2 topic pub -r 0 /cmd_vel '+TWIST+' {}'));
});
test('scan is live and topic metrics stop cleanly',()=>{
 const r=new Runtime(),values=[],scan=new TerminalSession(r,1,text=>values.push(text));scan.run('ros2 topic echo /scan --once');r.step(.2);assert.match(values.at(-1),/range_max: 10/);assert.equal(r.scan().ranges.length,36);
 for(const mode of ['hz','bw','delay']){const out=[],session=new TerminalSession(r,2,text=>out.push(text));session.run('ros2 topic '+mode+' /odom');r.step(2);assert.ok(out.length>2);assert.ok(!out.at(-1).includes('NaN'));session.stop();}
 assert.equal(r.topic('/odom').subscribers.size,0);
});
