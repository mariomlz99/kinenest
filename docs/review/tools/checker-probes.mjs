import {launch,wait} from '../../../scripts/browser-driver.mjs';import {serveDirectory} from '../../../scripts/static-server.mjs';import {readFile,writeFile} from 'node:fs/promises';const browser=process.argv[2]??'chrome',root=new URL('../../../',import.meta.url),s=await serveDirectory(new URL('dist/',root).pathname),b=await launch(browser,{profileRoot:new URL('../',root).pathname});async function until(e,seconds=60){for(let i=0;i<seconds*10;i++){if(await b.evaluate(e))return;await wait(100);}throw Error('Timeout '+e);}const configured=`import rclpy
from rclpy.node import Node
from std_msgs.msg import String
rclpy.init()
n=Node('student_controller')
n.declare_parameter('speed',0.2)
p=n.create_publisher(String,'/review_noise',10)
def tick():
    speed=n.get_parameter('speed').value
    p.publish(String(data=str(speed)))
n.create_timer(0.1,tick)
rclpy.spin(n)`;const custom=`import rclpy
from rclpy.node import Node
from ros2learn_interfaces.msg import TargetInfo
rclpy.init()
n=Node('student_controller')
p=n.create_publisher(TargetInfo,'/review_wrong_target_topic',10)
def tick():
    m=TargetInfo()
    m.visible=True
    m.position='CENTER'
    m.confidence=0.9
    p.publish(m)
n.create_timer(0.1,tick)
rclpy.spin(n)`;const early=(await readFile(new URL('tests/python/course/session-02-04-avoidance.py',root),'utf8')).replace('front < 1.1','front < 1.8');const blind=(await readFile(new URL('tests/python/course/session-06-03-beacon.py',root),'utf8')).replace('from sensor_msgs.msg import Image, LaserScan','from sensor_msgs.msg import Image\nfrom nav_msgs.msg import Odometry').replace('front = min(msg.ranges[55:66])','front = 4.5 - msg.pose.pose.position.x').replace("node.create_subscription(LaserScan, '/scan', scan, 10)","node.create_subscription(Odometry, '/odom', scan, 10)");const results=[];try{for(const [id,code,delay]of [['session-04-01-configure',configured,1500],['session-04-03-custom',custom,1500],['session-02-04-avoidance',early,14000],['session-06-03-beacon',blind,12000]]){await b.navigate(s.url+'session-'+id.split('-')[1]+'.html');await until('document.body.dataset.lessonState==="ready"');await b.evaluate('document.getElementById("lesson-select").value='+JSON.stringify(id)+';document.getElementById("lesson-select").dispatchEvent(new Event("change"));true');await until('document.body.dataset.lessonId==='+JSON.stringify(id)+'&&document.body.dataset.lessonState==="ready"');await b.evaluate('document.getElementById("python-code").value='+JSON.stringify(code)+';document.getElementById("run-python").click();true');await until('document.getElementById("python-state").textContent.includes("callbacks ready")');await wait(delay);await b.evaluate('document.getElementById("check").click();true');await wait(200);results.push({id,status:await b.evaluate('document.getElementById("status").textContent'),output:await b.evaluate('document.getElementById("python-output").textContent'),graph:await b.evaluate('document.getElementById("graph").textContent')});}console.log(JSON.stringify({browser,results},null,2));if(process.argv.includes('--expect-hardened'))for(const result of results){const expected=result.id==='session-02-04-avoidance';if(result.status.startsWith('Exercise complete')!==expected)throw Error('Unexpected checker result '+result.id);}}finally{await b.close();s.close();}