// A bounded project tree, never a browser imitation of a Linux filesystem.
export const ROOT='/home/learner/ros2_ws';
export const SUPPORTED_DEPENDENCIES=new Set(['rclpy','rclcpp','std_msgs','geometry_msgs','sensor_msgs','nav_msgs','std_srvs','tf2_ros','tf2_msgs','ros2launch']);
const PACKAGE=/^[a-z][a-z0-9_]*$/;

export function normalizePath(path,cwd=ROOT){
  if(typeof path!=='string'||!path||path.includes('\0'))throw Error('Enter a workspace path.');
  if(path==='~'||path==='~/ros2_ws')path=ROOT;
  else if(path.startsWith('~/ros2_ws/'))path=ROOT+path.slice('~/ros2_ws'.length);
  else if(path.startsWith('~/'))throw Error('This learning workspace is limited to ~/ros2_ws.');
  const parts=(path.startsWith('/')?path:cwd+'/'+path).split('/');
  const out=[];
  for(const part of parts){if(!part||part==='.')continue;if(part==='..')out.pop();else out.push(part);}
  const result='/'+out.join('/');
  if(result!==ROOT&&!result.startsWith(ROOT+'/'))throw Error('This learning workspace is limited to ~/ros2_ws.');
  return result;
}

function xmlNode(source){
  const root={name:'',children:[],text:''},stack=[root];let pos=0;
  for(const match of source.matchAll(/<\/?[A-Za-z_][^>]*>|<\?[^>]*\?>|<!--[^]*?-->/g)){
    stack.at(-1).text+=source.slice(pos,match.index);pos=match.index+match[0].length;
    const tag=match[0];if(tag.startsWith('<?')||tag.startsWith('<!--'))continue;
    if(tag.startsWith('</')){const name=tag.slice(2,-1).trim();if(stack.length===1||stack.at(-1).name!==name)throw Error('package.xml has mismatched XML tags.');stack.pop();continue;}
    const name=tag.slice(1).match(/^[A-Za-z_][\w:-]*/)?.[0];if(!name)throw Error('Invalid package.xml tag.');
    const node={name,attrs:Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1],m[2]])),children:[],text:''};
    stack.at(-1).children.push(node);if(!tag.endsWith('/>'))stack.push(node);
  }
  stack.at(-1).text+=source.slice(pos);if(stack.length!==1||root.children.length!==1||root.children[0].name!=='package')throw Error('package.xml must contain one <package> root.');
  return root.children[0];
}
export function parsePackageXml(source){
  const root=xmlNode(source),one=name=>{const nodes=root.children.filter(n=>n.name===name);if(nodes.length!==1||!nodes[0].text.trim())throw Error('package.xml needs one <'+name+'>.');return nodes[0].text.trim();};
  const name=one('name');if(!PACKAGE.test(name))throw Error('Package names use lowercase letters, digits and underscores, starting with a letter.');
  const version=one('version'),description=one('description'),license=one('license'),maintainer=one('maintainer');
  if(!/^\d+\.\d+\.\d+$/.test(version))throw Error('package.xml version should be MAJOR.MINOR.PATCH.');
  const deps=new Set(root.children.filter(n=>['depend','exec_depend','build_depend','buildtool_depend'].includes(n.name)).map(n=>n.text.trim()));
  const exportNode=root.children.find(n=>n.name==='export');
  const buildType=exportNode?.children.find(n=>n.name==='build_type')?.text.trim();
  if(!['ament_python','ament_cmake'].includes(buildType))throw Error('package.xml needs a supported <export><build_type>.');
  if(!deps.has(buildType))throw Error('package.xml needs <buildtool_depend>'+buildType+'</buildtool_depend>.');
  for(const dep of deps)if(!SUPPORTED_DEPENDENCIES.has(dep)&&dep!==buildType)throw Error('Unsupported lesson dependency: '+dep);
  return {name,version,description,license,maintainer,maintainerEmail:root.children.find(n=>n.name==='maintainer')?.attrs.email??'',dependencies:deps,buildType};
}

export function cmakeCalls(source){
  const calls=[];let i=0;
  while(i<source.length){
    if(/\s/.test(source[i])){i++;continue;}
    if(source[i]==='#'){while(i<source.length&&source[i]!=='\n')i++;continue;}
    const match=/^[A-Za-z_][A-Za-z_0-9]*/.exec(source.slice(i));if(!match)throw Error('Unsupported CMake syntax near '+source.slice(i,i+20));
    const name=match[0].toLowerCase();i+=match[0].length;while(/\s/.test(source[i]))i++;
    if(source[i++]!=='(')throw Error('Expected ( after '+name);let depth=1,start=i,quote=false;
    while(i<source.length&&depth){const c=source[i++];if(c==='"')quote=!quote;else if(!quote&&c==='(')depth++;else if(!quote&&c===')')depth--;}
    if(depth)throw Error('Unclosed CMake '+name+' declaration.');
    calls.push({name,args:source.slice(start,i-1).trim().split(/\s+/).filter(Boolean)});
  }
  return calls;
}
export function parseCmake(source,packageName){
  const calls=cmakeCalls(source),allowed=new Set(['cmake_minimum_required','project','find_package','add_executable','ament_target_dependencies','install','ament_package']);
  for(const c of calls)if(!allowed.has(c.name))throw Error('CMake '+c.name+' is outside the supported lesson subset.');
  if(!calls.some(c=>c.name==='cmake_minimum_required'))throw Error('CMakeLists.txt needs cmake_minimum_required.');
  if(!calls.some(c=>c.name==='project'&&c.args[0]===packageName))throw Error('CMake project must match package.xml name.');
  const found=new Set(calls.filter(c=>c.name==='find_package'&&c.args.includes('REQUIRED')).map(c=>c.args[0]));
  if(!found.has('ament_cmake'))throw Error('CMakeLists.txt needs find_package(ament_cmake REQUIRED).');
  if(!calls.some(c=>c.name==='ament_package'))throw Error('CMakeLists.txt needs ament_package().');
  const targets=new Map();for(const c of calls.filter(c=>c.name==='add_executable'))targets.set(c.args[0],c.args.slice(1));
  const installed=new Set();let launchInstalled=false;for(const c of calls.filter(c=>c.name==='install')){
    if(c.args[0]==='DIRECTORY'&&c.args[1]==='launch'&&c.args[2]==='DESTINATION'&&c.args[3]===`share/\${PROJECT_NAME}`){launchInstalled=true;continue;}
    if(c.args[0]!=='TARGETS'||!c.args.includes('DESTINATION')||c.args.slice(c.args.indexOf('DESTINATION')+1).join(' ')!==`lib/\${PROJECT_NAME}`)throw Error('Supported install form: install(TARGETS name DESTINATION lib/${PROJECT_NAME}).');
    for(const name of c.args.slice(1,c.args.indexOf('DESTINATION')))installed.add(name);
  }
  const dependencies=new Map();for(const c of calls.filter(c=>c.name==='ament_target_dependencies'))dependencies.set(c.args[0],new Set(c.args.slice(1)));
  return {found,targets,installed,dependencies,launchInstalled};
}

// Read literal setup declarations as tokens. Node modules are subsequently
// compiled and imported by CPython; no source-text grader is involved.
export function parsePythonSetup(source,packageName){
  const tokens=[];let i=0;
  while(i<source.length){const c=source[i];if(/\s/.test(c)){i++;continue;}if(c==='#'){while(i<source.length&&source[i]!=='\n')i++;continue;}
    if(c==='"'||c==="'"){const quote=c;let value='',closed=false;i++;while(i<source.length){const next=source[i++];if(next===quote){closed=true;break;}if(next==='\\'){value+=source[i++]??'';}else value+=next;}if(!closed)throw Error('Unclosed setup.py string.');tokens.push({kind:'string',value});continue;}
    if(/[A-Za-z_]/.test(c)){let value='';while(i<source.length&&/[A-Za-z_0-9]/.test(source[i]))value+=source[i++];tokens.push({kind:'name',value});continue;}
    tokens.push({kind:'symbol',value:c});i++;
  }
  const values=tokens.map(token=>token.value),at=values.indexOf('entry_points');
  if(at<0||values[at+1]!=='='||values[at+2]!=='{')throw Error('setup.py needs a literal entry_points map.');
  const key=values.indexOf('console_scripts',at+3);
  if(key<0||tokens[key].kind!=='string'||values[key+1]!==':'||values[key+2]!=='[')throw Error('setup.py needs a literal console_scripts list.');
  const scripts=new Map();let cursor=key+3;
  while(values[cursor]!==']'){
    const token=tokens[cursor++];if(!token||token.kind!=='string')throw Error('Only literal console_scripts entries are supported.');
    const equal=token.value.indexOf('='),colon=token.value.lastIndexOf(':'),executable=token.value.slice(0,equal).trim(),module=token.value.slice(equal+1,colon).trim(),func=token.value.slice(colon+1).trim();
    if(equal<1||colon<=equal+1||!PACKAGE.test(executable)||!module.startsWith(packageName+'.')||!module.split('.').every(part=>PACKAGE.test(part))||!PACKAGE.test(func))throw Error('Console script must name a module inside '+packageName+'.');
    if(scripts.has(executable))throw Error('Duplicate console script: '+executable);
    scripts.set(executable,{module,function:func});
    if(values[cursor]===',')cursor++;else if(values[cursor]!==']')throw Error('Expected comma in console_scripts list.');
  }
  if(!scripts.size)throw Error('setup.py has no console scripts.');
  const launchAt=tokens.findIndex((token,index)=>token.kind==='string'&&token.value==='/launch'&&values[index-1]==='+'&&values[index-2]==='package_name'&&values[index-3]==='+'&&tokens[index-4]?.kind==='string'&&tokens[index-4].value==='share/');
  if(launchAt<0||values[launchAt+1]!==','||values[launchAt+2]!=='[')throw Error('setup.py must install a literal launch file list in this lesson.');
  scripts.launchFiles=new Set();let fileAt=launchAt+3;
  while(values[fileAt]!==']'){
    const token=tokens[fileAt++];if(!token||token.kind!=='string'||!token.value.startsWith('launch/')||!token.value.endsWith('launch.py'))throw Error('setup.py launch installation needs literal launch/*.py filenames.');
    scripts.launchFiles.add(token.value);
    if(values[fileAt]===',')fileAt++;else if(values[fileAt]!==']')throw Error('Expected comma in setup.py launch file list.');
  }
  if(!scripts.launchFiles.size)throw Error('setup.py must install at least one launch file.');
  return scripts;
}

function packageXml(name,type){return `<?xml version="1.0"?>\n<package format="3">\n  <name>${name}</name>\n  <version>0.0.0</version>\n  <description>Two-node KineNest learning system</description>\n  <maintainer email="learner@example.com">Learner</maintainer>\n  <license>Apache-2.0</license>\n  <buildtool_depend>${type}</buildtool_depend>\n  <depend>${type==='ament_python'?'rclpy':'rclcpp'}</depend>\n  <depend>std_msgs</depend>\n  <exec_depend>ros2launch</exec_depend>\n  <export><build_type>${type}</build_type></export>\n</package>\n`;}
const pythonPublisher=`import rclpy\nfrom rclpy.node import Node\nfrom std_msgs.msg import String\n\nclass Talker(Node):\n    def __init__(self):\n        super().__init__('talker')\n        self.publisher = self.create_publisher(String, 'chatter', 10)\n        self.count = 0\n        self.timer = self.create_timer(1.0, self.tick)\n\n    def tick(self):\n        message = String()\n        message.data = f'hello {self.count}'\n        self.publisher.publish(message)\n        self.get_logger().info(message.data)\n        self.count += 1\n\ndef main():\n    rclpy.init()\n    node = Talker()\n    try:\n        rclpy.spin(node)\n    except KeyboardInterrupt:\n        pass\n    if rclpy.ok():\n        node.destroy_node()\n        rclpy.shutdown()\n`;
const pythonSubscriber=`import rclpy\nfrom rclpy.node import Node\nfrom std_msgs.msg import String\n\nclass Listener(Node):\n    def __init__(self):\n        super().__init__('listener')\n        self.declare_parameter('prefix', 'heard')\n        self.subscription = self.create_subscription(String, 'chatter', self.receive, 10)\n\n    def receive(self, message):\n        self.get_logger().info(f"{self.get_parameter('prefix').value}: {message.data}")\n\ndef main():\n    rclpy.init()\n    node = Listener()\n    try:\n        rclpy.spin(node)\n    except KeyboardInterrupt:\n        pass\n    if rclpy.ok():\n        node.destroy_node()\n        rclpy.shutdown()\n`;
const cppPublisher=`#include <rclcpp/rclcpp.hpp>\n#include <std_msgs/msg/string.hpp>\n#include <chrono>\n#include <memory>\nusing namespace std::chrono_literals;\nclass Talker : public rclcpp::Node {\npublic:\n  Talker() : Node("talker") {\n    publisher_ = create_publisher<std_msgs::msg::String>("chatter", 10);\n    timer_ = create_wall_timer(1s, [this]() {\n      std_msgs::msg::String message;\n      message.data = "hello " + std::to_string(count_++);\n      publisher_->publish(message);\n    });\n  }\nprivate:\n  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;\n  rclcpp::TimerBase::SharedPtr timer_;\n  int count_ = 0;\n};\nint main(int argc, char ** argv) {\n  rclcpp::init(argc, argv);\n  rclcpp::spin(std::make_shared<Talker>());\n  rclcpp::shutdown();\n  return 0;\n}\n`;
const cppSubscriber=`#include <rclcpp/rclcpp.hpp>\n#include <std_msgs/msg/string.hpp>\n#include <memory>\nclass Listener : public rclcpp::Node {\npublic:\n  Listener() : Node("listener") {\n    declare_parameter<std::string>("prefix", "heard");\n    subscription_ = create_subscription<std_msgs::msg::String>("chatter", 10, [this](std_msgs::msg::String::SharedPtr message) {\n      RCLCPP_INFO(get_logger(), "%s: %s", get_parameter("prefix").as_string().c_str(), message->data.c_str());\n    });\n  }\nprivate:\n  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr subscription_;\n};\nint main(int argc, char ** argv) {\n  rclcpp::init(argc, argv);\n  rclcpp::spin(std::make_shared<Listener>());\n  rclcpp::shutdown();\n  return 0;\n}\n`;

export class WorkspaceModel {
  constructor(){this.entries=new Map([[ROOT,{kind:'dir'}],[ROOT+'/src',{kind:'dir'}]]);this.revision=0;this.installed=new Map();this.buildLog=[];this.packageRevisions=new Map();}
  exists(path){return this.entries.has(normalizePath(path));}
  entry(path){const full=normalizePath(path);const entry=this.entries.get(full);if(!entry)throw Error('No such workspace path: '+path);return entry;}
  mkdir(path){const full=normalizePath(path);if(this.entries.has(full))throw Error('Already exists: '+path);if(this.entry(full.slice(0,full.lastIndexOf('/'))).kind!=='dir')throw Error('Parent is not a directory.');this.entries.set(full,{kind:'dir'});}
  write(path,content){const full=normalizePath(path);if(this.entry(full.slice(0,full.lastIndexOf('/'))).kind!=='dir')throw Error('Parent is not a directory.');this.entries.set(full,{kind:'file',content:String(content)});this.revision++;const name=full.slice((ROOT+'/src/').length).split('/')[0];if(full.startsWith(ROOT+'/src/')&&name){this.packageRevisions.set(name,this.revision);this.removeInstalled(name);}}
  ensureDir(path){const full=normalizePath(path);let current=ROOT;for(const part of full.slice(ROOT.length).split('/').filter(Boolean)){current+='/'+part;if(!this.exists(current))this.mkdir(current);}}
  removeInstalled(name){this.installed.delete(name);const base=ROOT+'/install/'+name;for(const path of [...this.entries.keys()])if(path===base||path.startsWith(base+'/'))this.entries.delete(path);}
  read(path){const entry=this.entry(path);if(entry.kind!=='file')throw Error('Not a file: '+path);return entry.content;}
  list(path){const full=normalizePath(path);if(this.entry(full).kind!=='dir')throw Error('Not a directory: '+path);return [...this.entries].filter(([p])=>p.startsWith(full+'/')&&!p.slice(full.length+1).includes('/')).map(([p,e])=>({name:p.slice(full.length+1),...e})).sort((a,b)=>a.name.localeCompare(b.name));}
  createPackage(name,type){
    if(!PACKAGE.test(name))throw Error('Use a lowercase ROS package name with letters, digits and underscores.');
    if(!['ament_python','ament_cmake'].includes(type))throw Error('Supported build types: ament_python, ament_cmake.');
    const base=ROOT+'/src/'+name;if(this.exists(base))throw Error('Package already exists: '+name);this.mkdir(base);this.write(base+'/package.xml',packageXml(name,type));
    if(type==='ament_python'){
      this.mkdir(base+'/resource');this.write(base+'/resource/'+name,'');this.mkdir(base+'/'+name);this.write(base+'/'+name+'/__init__.py','');this.write(base+'/'+name+'/publisher.py',pythonPublisher);this.write(base+'/'+name+'/subscriber.py',pythonSubscriber);
      this.write(base+'/setup.cfg',`[develop]\nscript_dir=$base/lib/${name}\n[install]\ninstall_scripts=$base/lib/${name}\n`);
      this.write(base+'/setup.py',`from setuptools import find_packages, setup\n\npackage_name = '${name}'\nsetup(\n    name=package_name,\n    version='0.0.0',\n    packages=find_packages(exclude=['test']),\n    data_files=[('share/ament_index/resource_index/packages', ['resource/' + package_name]), ('share/' + package_name, ['package.xml']), ('share/' + package_name + '/launch', ['launch/system_launch.py'])],\n    install_requires=['setuptools'],\n    zip_safe=True,\n    maintainer='Learner',\n    maintainer_email='learner@example.com',\n    description='Two-node learning system',\n    license='Apache-2.0',\n    entry_points={'console_scripts': ['publisher = ${name}.publisher:main', 'subscriber = ${name}.subscriber:main']},\n)\n`);
    }else{
      this.mkdir(base+'/include');this.mkdir(base+'/include/'+name);this.mkdir(base+'/src');this.write(base+'/src/publisher.cpp',cppPublisher);this.write(base+'/src/subscriber.cpp',cppSubscriber);
      this.write(base+'/CMakeLists.txt',`cmake_minimum_required(VERSION 3.8)\nproject(${name})\nfind_package(ament_cmake REQUIRED)\nfind_package(rclcpp REQUIRED)\nfind_package(std_msgs REQUIRED)\nadd_executable(publisher src/publisher.cpp)\nadd_executable(subscriber src/subscriber.cpp)\nament_target_dependencies(publisher rclcpp std_msgs)\nament_target_dependencies(subscriber rclcpp std_msgs)\ninstall(TARGETS publisher subscriber DESTINATION lib/\${PROJECT_NAME})\ninstall(DIRECTORY launch DESTINATION share/\${PROJECT_NAME})\nament_package()\n`);
    }
    this.mkdir(base+'/launch');this.write(base+'/launch/system_launch.py',`from launch import LaunchDescription\nfrom launch_ros.actions import Node\n\ndef generate_launch_description():\n    return LaunchDescription([\n        Node(package='${name}', executable='publisher', name='talker', remappings=[('chatter', 'bridge_chatter')]),\n        Node(package='${name}', executable='subscriber', name='listener', parameters=[{'prefix': 'received'}], remappings=[('chatter', 'other_chatter')]),\n    ])\n`);
    return base;
  }
  packages(){return this.list(ROOT+'/src').filter(e=>e.kind==='dir'&&this.exists(ROOT+'/src/'+e.name+'/package.xml')).map(e=>e.name);}
  markBuilt(name,record){
    try{
      for(const dir of ['build/'+name,'install/'+name,'log','install/'+name+'/lib/'+name,'install/'+name+'/share/'+name+'/launch'])this.ensureDir(ROOT+'/'+dir);
      this.write(ROOT+'/build/'+name+'/status.txt','KineNest educational build: '+record.type+' package validated and compiled.\n');
      this.write(ROOT+'/install/'+name+'/share/'+name+'/package.xml',record.files['package.xml']);
      for(const file of record.launch)this.write(ROOT+'/install/'+name+'/share/'+name+'/'+file,record.files[file]);
      for(const executable of record.executables.keys())this.write(ROOT+'/install/'+name+'/lib/'+name+'/'+executable,'KineNest modeled installed executable: '+name+'/'+executable+'\n');
      for(const file of ['local_setup.bash','setup.bash'])if(!this.exists(ROOT+'/install/'+file))this.write(ROOT+'/install/'+file,'# KineNest educational workspace overlay; not a native shell script.\n');
      this.write(ROOT+'/log/build.txt','KineNest educational build completed for '+[...this.installed.keys(),name].join(', ')+'.\n');
      this.installed.set(name,{...record,revision:this.packageRevisions.get(name)});
    }catch(error){this.removeInstalled(name);throw error;}
  }
  installedPackage(name){const record=this.installed.get(name);if(!record)throw Error('Package '+name+' has no current installed build. Run colcon build.');if(record.revision!==this.packageRevisions.get(name))throw Error('Source changed after build. Run colcon build again.');return record;}
  filesUnder(path){const full=normalizePath(path);return Object.fromEntries([...this.entries].filter(([p,e])=>e.kind==='file'&&p.startsWith(full+'/')).map(([p,e])=>[p.slice(full.length+1),e.content]));}
  reset(){this.entries=new WorkspaceModel().entries;this.installed.clear();this.packageRevisions.clear();this.revision=0;this.buildLog=[];}
}
