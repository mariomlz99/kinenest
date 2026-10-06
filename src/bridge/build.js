import {ROOT,parsePackageXml,parseCmake,parsePythonSetup} from './workspace.js';

const ROS_DEPENDENCIES=new Set(['rclpy','rclcpp','std_msgs','geometry_msgs','sensor_msgs','nav_msgs','std_srvs','tf2_ros','tf2_msgs']);
function need(workspace,path){try{return workspace.read(path);}catch{throw Error('Missing required file: '+path.replace(ROOT+'/',''));}}
function checkDependency(manifest,name){if(!manifest.dependencies.has(name))throw Error(name+' is used by this package but is not declared in package.xml.');}
function checkSetupCfg(source,name){
  const sections=new Map();let current=null;
  for(const line of source.split(/\r?\n/)){
    const text=line.trim();if(!text||text.startsWith('#'))continue;
    if(text.startsWith('[')&&text.endsWith(']')){current=text.slice(1,-1);sections.set(current,new Map());continue;}
    const at=text.indexOf('=');if(at<0||!current)throw Error('Unsupported setup.cfg line: '+text);
    sections.get(current).set(text.slice(0,at).trim(),text.slice(at+1).trim());
  }
  if(sections.get('develop')?.get('script_dir')!==`$base/lib/${name}`||sections.get('install')?.get('install_scripts')!==`$base/lib/${name}`)throw Error('setup.cfg must place console scripts in $base/lib/'+name+' for ros2 run.');
}

export function inspectPackage(workspace,name){
  const base=ROOT+'/src/'+name,manifest=parsePackageXml(need(workspace,base+'/package.xml'));
  if(manifest.name!==name)throw Error('package.xml name must match its package directory: '+name+'.');
  const files=workspace.filesUnder(base),launch=Object.keys(files).filter(path=>path.startsWith('launch/')&&path.endsWith('launch.py'));
  if(!launch.length)throw Error('Add a Python launch file ending in launch.py.');
  checkDependency(manifest,'ros2launch');
  if(manifest.buildType==='ament_python'){
    checkDependency(manifest,'rclpy');need(workspace,base+'/resource/'+name);need(workspace,base+'/'+name+'/__init__.py');
    checkSetupCfg(need(workspace,base+'/setup.cfg'),name);
    const scripts=parsePythonSetup(need(workspace,base+'/setup.py'),name);
    for(const file of launch)if(!scripts.launchFiles.has(file))throw Error('Launch file '+file+' is not installed by setup.py.');
    for(const file of scripts.launchFiles)if(!Object.hasOwn(files,file))throw Error('setup.py refers to missing launch file '+file+'.');
    for(const [executable,spec] of scripts){
      const path=spec.module.replaceAll('.','/')+'.py';if(!Object.hasOwn(files,path))throw Error('Entry point '+executable+' refers to missing '+path+'.');
    }
    return {name,type:'python',manifest,files,executables:scripts,launch};
  }
  checkDependency(manifest,'rclcpp');const cmake=parseCmake(need(workspace,base+'/CMakeLists.txt'),name);
  for(const dep of cmake.found)if(dep!=='ament_cmake'){if(!ROS_DEPENDENCIES.has(dep))throw Error('Unsupported CMake dependency: '+dep);checkDependency(manifest,dep);}
  const executables=new Map();
  for(const [target,sources] of cmake.targets){
    if(!sources.length)throw Error('Target '+target+' has no source.');
    if(sources.length!==1)throw Error('The lesson supports one source file per C++ target.');
    const source=sources[0];if(!Object.hasOwn(files,source))throw Error('Target '+target+' refers to missing '+source+'.');
    if(!cmake.installed.has(target))throw Error('Executable '+target+' is not installed by CMakeLists.txt.');
    const deps=cmake.dependencies.get(target);if(!deps?.has('rclcpp'))throw Error('Target '+target+' needs ament_target_dependencies('+target+' rclcpp ...).');
    for(const dep of deps)if(!cmake.found.has(dep))throw Error('Target '+target+' uses '+dep+' without find_package('+dep+' REQUIRED).');
    executables.set(target,{source,code:files[source]});
  }
  if(!executables.size)throw Error('CMakeLists.txt has no executable targets.');
  for(const target of cmake.installed)if(!cmake.targets.has(target))throw Error('Installed target '+target+' is not defined.');
  if(!cmake.launchInstalled)throw Error('CMakeLists.txt must install(DIRECTORY launch DESTINATION share/${PROJECT_NAME}).');
  return {name,type:'cpp',manifest,files,executables,launch};
}

export function validatePythonImports(imports,manifest,name){
  const packages={rclpy:'rclpy',std_msgs:'std_msgs',geometry_msgs:'geometry_msgs',sensor_msgs:'sensor_msgs',nav_msgs:'nav_msgs',std_srvs:'std_srvs',tf2_ros:'tf2_ros',tf2_msgs:'tf2_msgs'};
  for(const imported of imports){const root=imported.split('.')[0],dep=packages[root];if(dep)checkDependency(manifest,dep);else if(root!==name&&!new Set(['math','time','typing','collections','dataclasses','json','functools','itertools','sys']).has(root))throw Error('Unsupported Python import in this lesson: '+imported);}
}

// A single-use validation worker compiles real learner code; the model only records
// an install after every target succeeds. The worker is terminated on failure.
export function browserCompile({type,code,files,name,entries,signal}){
  return new Promise((resolve,reject)=>{
    if(signal?.aborted){reject(Error('Build cancelled.'));return;}
    const worker=new Worker(new URL(type==='cpp'?'../cpp/worker.js':'../python/worker.js',import.meta.url),type==='cpp'?{type:'module'}:undefined);
    const timer=setTimeout(()=>finish(Error('Build timed out. Check the network and try again.')),150000);
    function cancelled(){finish(Error('Build cancelled.'));}
    function finish(error,result){clearTimeout(timer);signal?.removeEventListener('abort',cancelled);worker.terminate();error?reject(error):resolve(result);}
    signal?.addEventListener('abort',cancelled,{once:true});
    worker.onerror=event=>finish(Error(event.message||'Build worker failed.'));
    worker.onmessage=event=>{const data=event.data;if(data.kind==='build_ok')finish(null,data);else if(data.kind==='error')finish(Error(data.text));};
    worker.postMessage({kind:'build',code,files,name,entries});
  });
}

export class BuildSystemAdapter {
  constructor(workspace,compile=browserCompile){this.workspace=workspace;this.compile=compile;this.controller=null;this.epoch=0;}
  cancel(){this.epoch++;this.controller?.abort();this.controller=null;}
  async build(report=()=>{}){
    if(this.controller)throw Error('A workspace build is already running.');
    const controller=new AbortController(),epoch=++this.epoch;this.controller=controller;
    try{return await this.buildCurrent(report,controller.signal,epoch);}finally{if(this.controller===controller)this.controller=null;}
  }
  async buildCurrent(report,signal,epoch){
    const names=this.workspace.packages();if(!names.length)throw Error('No packages found in ros2_ws/src.');
    const results=[];
    for(const name of names){
      this.workspace.removeInstalled(name);report('Starting >>> '+name);
      try{
        const record=inspectPackage(this.workspace,name);
        const revision=this.workspace.packageRevisions.get(name);
        if(record.type==='python'){
          const checked=await this.compile({type:'python',name,files:record.files,entries:[...record.executables.values()],signal});
          if(signal.aborted||epoch!==this.epoch)throw Error('Build cancelled.');
          if(this.workspace.packageRevisions.get(name)!==revision)throw Error('Package files changed during build. Run colcon build again.');
          validatePythonImports(checked.imports??[],record.manifest,name);
        }else for(const [executable,{code}] of record.executables){
          report('Compiling '+name+'/'+executable+' with browser Clang');
          await this.compile({type:'cpp',code,name,signal});
          if(signal.aborted||epoch!==this.epoch)throw Error('Build cancelled.');
          if(this.workspace.packageRevisions.get(name)!==revision)throw Error('Package files changed during build. Run colcon build again.');
        }
        if(signal.aborted||epoch!==this.epoch)throw Error('Build cancelled.');
        if(this.workspace.packageRevisions.get(name)!==revision)throw Error('Package files changed during build. Run colcon build again.');
        this.workspace.markBuilt(name,record);results.push(record);report('Finished <<< '+name);
      }catch(error){report('Failed <<< '+name+': '+error.message);throw error;}
    }
    this.workspace.buildLog.push({at:Date.now(),packages:results.map(r=>r.name)});
    return results;
  }
}
