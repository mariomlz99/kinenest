const out=document.getElementById('result');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let runtime,bridge,python,timer,running=false,output='',state='';
const observations=[];
const expectFixed=new URLSearchParams(location.search).get('expect')==='fixed';
const assert=(condition,message)=>{if(!condition)throw Error(message);};
async function checked(url){const r=await fetch(url);if(!r.ok)throw Error(url+': '+r.status);return r;}
async function poll(fn,seconds=120){const end=performance.now()+seconds*1000;while(performance.now()<end){if(fn())return;if(!(python??bridge).worker)throw Error(output);await wait(25);}throw Error('Timeout '+state+' '+output);}
try{
 const build=await(await checked('../build-info.json')).json();
 await fetch('/progress',{method:'POST',body:'BUFFER_PROBE_BUILD '+JSON.stringify({commit:build.commit,assetVersion:build.assetVersion,builtAt:build.builtAt,dirty:build.dirty,expectFixed})});
 const html=await(await checked('../session-02.html')).text();
 const path=new DOMParser().parseFromString(html,'text/html').querySelector('script[src$="session3-boot.js"]').getAttribute('src').replace('ui/session3-boot.js','');
 const {Runtime}=await import('../'+path+'runtime/graph.js');
 const {CppBridge}=await import('../'+path+'cpp/bridge.js');
 const {PythonBridge}=await import('../'+path+'python/bridge.js');
 const {TRAINING_WORLD}=await import('../'+path+'simulator/lidar.js');
 const publicPath=path.replace(/src\/$/,'public/');
 runtime=new Runtime();runtime.enableSession3();
 bridge=new CppBridge(runtime,{output:value=>{output+=(value+'\n');},status:value=>{state=value;}});
 timer=setInterval(()=>{if(running)runtime.step(1/60);},1000/60);
 async function setup(id){running=false;bridge.stop();python?.stop();python=null;runtime.reset();output='';state='';const lesson=await(await checked('../'+publicPath+'lessons/'+id+'.json')).json();runtime.world=lesson.world??(id.startsWith('session-02')?structuredClone(TRAINING_WORLD):null);runtime.targets=lesson.targets;runtime.robot.x=lesson.startX??0;runtime.robot.y=lesson.startY??0;runtime.robot.yaw=lesson.startYaw??0;}
 async function probe(name,code,language='cpp',image=false){
  if(language==='python'){python=new PythonBridge(runtime,{output:value=>{output+=value+'\n';},status:value=>{state=value;}});python.run(code);}else bridge.run(code);
  await poll(()=>state.includes('callbacks ready'));running=true;
  await poll(()=>image?runtime.evidence.callbacks>=5:runtime.course.scan>=5,15);running=false;
  const observation={name,language,compiled:language==='cpp',scanCallbacks:runtime.course.scan,rangeAccess:runtime.course.scanAccess??0,rangeReports:runtime.course.range,sectors:runtime.course.sectors??0,imageCallbacks:runtime.evidence.callbacks,imageDataCredited:runtime.evidence.converted,output:output.slice(-600)};
  observations.push(observation);await fetch('/progress',{method:'POST',body:'BUFFER_PROBE '+JSON.stringify(observation)});
 }
 for(const copy of [false,true]){
  await setup('session-02-03-sectors');
  await probe(copy?'scan-owned-vector-copy':'scan-direct-control','#include <rclcpp/rclcpp.hpp>\n#include <sensor_msgs/msg/laser_scan.hpp>\n#include <kinenest/reports.hpp>\n#include <algorithm>\n#include <vector>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("scan_probe");auto s=n->create_subscription<sensor_msgs::msg::LaserScan>("/scan",10,[](sensor_msgs::msg::LaserScan::SharedPtr m){'+(copy?'std::vector<float> values=m->ranges;':'const auto& values=m->ranges;')+'kinenest::report_range(*std::min_element(values.begin(),values.end()));});rclcpp::spin(n);}');
 }
 for(const copy of [false,true]){
  await setup('session-03-03-color-detection');
  await probe(copy?'image-owned-vector-copy':'image-direct-control','#include <rclcpp/rclcpp.hpp>\n#include <sensor_msgs/msg/image.hpp>\n#include <kinenest/reports.hpp>\n#include <vector>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("image_probe");auto s=n->create_subscription<sensor_msgs::msg::Image>("/camera/image_raw",10,[](sensor_msgs::msg::Image::SharedPtr m){unsigned w=m->width,h=m->height;'+(copy?'std::vector<std::uint8_t> values=m->data;':'const auto& values=m->data;')+'int count=0;double sum=0;for(unsigned y=0;y<h;y++)for(unsigned x=0;x<w;x++){unsigned i=y*m->step+3*x;if(values[i]>180&&values[i+1]<100&&values[i+2]<100){count++;sum+=x;}}if(count)kinenest::report_detection(true,sum/count);else kinenest::report_detection(false);});rclcpp::spin(n);}', 'cpp', true);
 }
 await setup('session-02-03-sectors');
 await probe('retained-scan-ranges','#include <rclcpp/rclcpp.hpp>\n#include <sensor_msgs/msg/laser_scan.hpp>\n#include <kinenest/reports.hpp>\n#include <algorithm>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("retained_scan");auto old=std::make_shared<sensor_msgs::msg::LaserScan::SharedPtr>();auto s=n->create_subscription<sensor_msgs::msg::LaserScan>("/scan",10,[old](sensor_msgs::msg::LaserScan::SharedPtr m){if(!*old){*old=m;return;}const auto& values=(*old)->ranges;kinenest::report_range(*std::min_element(values.begin(),values.end()));});rclcpp::spin(n);}');

 await setup('session-02-03-sectors');
 await probe('retained-scan-ranges', 'import rclpy\nfrom rclpy.node import Node\nfrom sensor_msgs.msg import LaserScan\nfrom ros2learn import report_range\nrclpy.init()\nnode=Node("retained_scan")\nold=None\ndef receive(message):\n    global old\n    if old is None:\n        old=message\n        return\n    report_range(min(old.ranges))\nsub=node.create_subscription(LaserScan,"/scan",receive,10)\nrclpy.spin(node)', 'python');
 await setup('session-02-03-sectors');
 await probe('scan-const-reverse-iterators','#include <rclcpp/rclcpp.hpp>\n#include <sensor_msgs/msg/laser_scan.hpp>\n#include <kinenest/reports.hpp>\n#include <algorithm>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("reverse_scan");auto s=n->create_subscription<sensor_msgs::msg::LaserScan>("/scan",10,[](sensor_msgs::msg::LaserScan::SharedPtr m){const auto& values=m->ranges;kinenest::report_range(*std::min_element(values.rbegin(),values.rend()));});rclcpp::spin(n);}');
 for(const language of ['cpp','python']){
  await setup('session-02-03-sectors');
  const scan=runtime.scan();const sector=center=>Math.min(...scan.ranges.filter((v,i)=>Number.isFinite(v)&&Math.abs(Math.atan2(Math.sin(scan.angle_min+i*scan.angle_increment-center),Math.cos(scan.angle_min+i*scan.angle_increment-center)))<=Math.PI/12+1e-9));
  const values=[sector(0),sector(Math.PI/2),sector(-Math.PI/2)];if(!values.every(Number.isFinite))throw Error('Probe scene requires finite sectors');
  const code=language==='cpp'?'#include <rclcpp/rclcpp.hpp>\n#include <sensor_msgs/msg/laser_scan.hpp>\n#include <kinenest/reports.hpp>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("constant_scan");auto s=n->create_subscription<sensor_msgs::msg::LaserScan>("/scan",10,[](sensor_msgs::msg::LaserScan::SharedPtr){kinenest::report_sectors('+values.join(',')+');});rclcpp::spin(n);}':'import rclpy\nfrom rclpy.node import Node\nfrom sensor_msgs.msg import LaserScan\nfrom ros2learn import report_sectors\nrclpy.init()\nnode=Node("constant_scan")\ndef receive(message):\n    report_sectors('+values.join(',')+')\nsub=node.create_subscription(LaserScan,"/scan",receive,10)\nrclpy.spin(node)';
  await probe('constant-sector-without-reading',code,language);
 }

 await setup('session-02-03-sectors');
 bridge.run('#include <rclcpp/rclcpp.hpp>\n#include <sensor_msgs/msg/laser_scan.hpp>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("const_scan");auto s=n->create_subscription<sensor_msgs::msg::LaserScan>("/scan",10,[](sensor_msgs::msg::LaserScan::SharedPtr m){const auto& values=m->ranges;std::printf("ENDS %g %g\\n",values.front(),values.back());});rclcpp::spin(n);}');
 const deadline=performance.now()+120000;while(bridge.worker&&!state.includes('callbacks ready')&&performance.now()<deadline)await wait(25);
 if(performance.now()>=deadline)throw Error('Const accessor compile timeout');
 if(state.includes('callbacks ready')){running=true;await poll(()=>runtime.course.scan>=5,15);running=false;}
 const constantObservation={name:'scan-const-front-back',language:'cpp',compiled:state.includes('callbacks ready'),rangeAccess:runtime.course.scanAccess??0,scanCallbacks:runtime.course.scan,diagnostic:output.slice(-5000)};
 observations.push(constantObservation);await fetch('/progress',{method:'POST',body:'BUFFER_PROBE '+JSON.stringify(constantObservation)});

 if(expectFixed){
  for(const observation of observations){
   const {name,language}=observation;
   if(['scan-direct-control','scan-owned-vector-copy','scan-const-reverse-iterators'].includes(name))
    assert(observation.compiled&&observation.rangeAccess===observation.scanCallbacks&&observation.rangeReports===observation.scanCallbacks,name+' did not credit legitimate current sensor data');
   if(['image-direct-control','image-owned-vector-copy'].includes(name))
    assert(observation.compiled&&observation.imageDataCredited,name+' did not credit real pixels');
   if(name==='retained-scan-ranges')
    assert(observation.rangeAccess===0&&observation.rangeReports===0,language+' retained scan was credited to the current callback');
   if(name==='constant-sector-without-reading')
    assert(observation.rangeAccess===0&&observation.sectors===0,language+' constant sector report bypassed range access');
   if(name==='scan-const-front-back')
    assert(observation.compiled&&observation.rangeAccess===observation.scanCallbacks&&observation.scanCallbacks>=5,'Const front/back access is not natural usable C++');
  }
 }
 out.textContent=expectFixed?'PASS: copied-buffer compatibility and current-sample evidence regression':'PASS: completed investigative buffer probes; observations are not acceptance claims';
 await fetch('/progress',{method:'POST',body:'BUFFER_PROBE_SUMMARY '+JSON.stringify(observations)});
}catch(error){out.textContent='FAIL: '+error.message;}finally{running=false;bridge?.stop();python?.stop();clearInterval(timer);}
await fetch('/done',{method:'POST',body:out.textContent});
