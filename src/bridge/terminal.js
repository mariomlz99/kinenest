import {ROOT,normalizePath} from './workspace.js';
import {TerminalSession} from '../terminal/session.js';
import {execute,tokens} from '../terminal/cli.js';

const HELP='KineNest ROS workspace commands: pwd, cd, ls, tree, mkdir, cat, ros2 pkg create --build-type TYPE --license Apache-2.0 NAME, colcon build, source install/local_setup.bash, ros2 run PACKAGE EXECUTABLE, ros2 launch PACKAGE FILE, ros2 node list, ros2 topic list, ros2 topic echo TOPIC. Ctrl+C stops this terminal’s processes. This is a bounded educational terminal, not Bash or native ROS 2.';
export class BridgeTerminal {
  constructor(id,runtime,workspace,builder,processes,write=()=>{},onState=()=>{}){
    this.id=id;this.runtime=runtime;this.workspace=workspace;this.builder=builder;this.processes=processes;this.write=write;this.onState=onState;
    this.cwd=ROOT;this.sourced=false;this.busy=false;this.graph=new TerminalSession(runtime,id,write,onState);
  }
  get running(){return this.busy||this.graph.running||this.processes.active().some(p=>p.terminal===this.id);}
  path(text){return normalizePath(text,this.cwd);}
  listing(path){return this.workspace.list(path).map(e=>e.name+(e.kind==='dir'?'/':'')).join('  ')||'(empty)';}
  tree(path,depth=0){const lines=[];for(const item of this.workspace.list(path)){lines.push('  '.repeat(depth)+item.name+(item.kind==='dir'?'/':''));if(item.kind==='dir'&&depth<4)lines.push(this.tree(this.path(path+'/'+item.name),depth+1));}return lines.filter(Boolean).join('\n');}
  async run(input){
    if(this.busy||this.graph.running)throw Error('Stop the active command before entering another.');
    const command=input.trim();if(!command)return;
    this.write('$ '+command);
    if(/[|;&<>`]/.test(command)||/\$[({A-Za-z_]/.test(command)||/[?*]/.test(command)||/^(sudo|apt|bash|sh|python3?|g\+\+|clang)\b/.test(command))throw Error('This terminal supports only the listed learning commands. Pipes, redirection, scripts, expansion, wildcards and arbitrary binaries are unavailable.');
    if(command==='help'){this.write(HELP);return;}
    const args=tokens(command);
    if(args[0]==='pwd'&&args.length===1){this.write(this.cwd.replace('/home/learner','~'));return;}
    if(args[0]==='cd'&&args.length===2){const path=this.path(args[1]);if(this.workspace.entry(path).kind!=='dir')throw Error('Not a directory: '+args[1]);this.cwd=path;this.write(this.cwd.replace('/home/learner','~'));return;}
    if(args[0]==='ls'&&args.length<=2){this.write(this.listing(this.path(args[1]??'.')));return;}
    if(args[0]==='tree'&&args.length<=2){this.write(this.tree(this.path(args[1]??'.')));return;}
    if(args[0]==='mkdir'&&args.length===2){this.workspace.mkdir(this.path(args[1]));this.write('Created '+args[1]);return;}
    if(args[0]==='cat'&&args.length===2){this.write(this.workspace.read(this.path(args[1])));return;}
    if(args[0]==='ros2'&&args[1]==='pkg'&&args[2]==='create'){
      if(this.cwd!==ROOT+'/src')throw Error('Create packages inside ~/ros2_ws/src.');
      const typeAt=args.indexOf('--build-type'),licenseAt=args.indexOf('--license'),name=args.at(-1);
      if(typeAt<0||licenseAt<0||!['ament_python','ament_cmake'].includes(args[typeAt+1])||args[licenseAt+1]!=='Apache-2.0'||args.length!==8)throw Error('Usage: ros2 pkg create --build-type ament_python|ament_cmake --license Apache-2.0 NAME');
      this.workspace.createPackage(name,args[typeAt+1]);this.write('Created '+name+' with '+args[typeAt+1]+' package files.');return;
    }
    if(command==='colcon build'){
      if(this.cwd!==ROOT)throw Error('Run colcon build from ~/ros2_ws.');
      this.busy=true;this.onState(true);try{const records=await this.builder.build(line=>this.write(line));this.write('Summary: '+records.length+' package(s) built in KineNest.');}finally{this.busy=false;this.onState(false);}return;
    }
    if(args[0]==='source'&&args.length===2){const path=this.path(args[1]);if(path!==ROOT+'/install/local_setup.bash'&&path!==ROOT+'/install/setup.bash')throw Error('Supported workspace source: source install/local_setup.bash');if(!this.workspace.exists(path)||!this.workspace.installed.size)throw Error('No installed workspace setup yet. Run colcon build first.');this.sourced=true;this.write('Workspace packages are discoverable in this terminal.');return;}
    if(args[0]==='ros2'&&args[1]==='pkg'&&args[2]==='list'&&args.length===3){this.write(this.sourced?[...this.workspace.installed.keys()].join('\n'):'(source the workspace to discover learner packages)');return;}
    if(args[0]==='ros2'&&args[1]==='pkg'&&args[2]==='executables'&&args.length===4){if(!this.sourced)throw Error('Source the workspace in this terminal first.');this.write([...this.workspace.installedPackage(args[3]).executables.keys()].map(x=>args[3]+' '+x).join('\n'));return;}
    if(args[0]==='ros2'&&args[1]==='run'&&args.length===4){if(!this.sourced)throw Error('Package not found in this terminal. Run source install/local_setup.bash.');const p=await this.processes.run(args[2],args[3],{terminal:this.id});this.write('Started '+args[2]+'/'+args[3]+' as process '+p.id+'.');this.onState(true);return;}
    if(args[0]==='ros2'&&args[1]==='launch'&&args.length===4){if(!this.sourced)throw Error('Package not found in this terminal. Run source install/local_setup.bash.');const launch=await this.processes.launch(args[2],args[3],{terminal:this.id});this.write('Started '+launch.processes.length+' processes in '+launch.group+'.');this.onState(true);return;}
    if(command.startsWith('ros2 topic echo ')){this.graph.run(command);return;}
    if(['ros2 node list','ros2 topic list'].includes(command)||command.startsWith('ros2 node info ')||command.startsWith('ros2 topic info ')){this.write(execute(this.runtime,command));return;}
    throw Error('Unsupported command. Type help for the bounded workspace command list.');
  }
  stop(){if(this.busy)this.builder.cancel();this.graph.stop(false);this.processes.stopTerminal(this.id);this.onState(false);this.write('^C');}
  reset(){this.stop();this.cwd=ROOT;this.sourced=false;}
}
