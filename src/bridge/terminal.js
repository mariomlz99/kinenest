import {ROOT,normalizePath} from './workspace.js';
import {TerminalSession} from '../terminal/session.js';
import {tokens,normalizeCommand} from '../terminal/cli.js';

const HELP='Workspace commands: pwd, cd, ls [-a] [-l] [PATH], tree [PATH], mkdir [-p] PATH, touch PATH, cat PATH, cp [-r] SOURCE DEST, mv SOURCE DEST, rm [-r] [-f] PATH, clear. ROS commands: ros2 pkg create --build-type TYPE --license Apache-2.0 NAME, colcon build, source ~/ros2_ws/install/local_setup.bash, ros2 run PACKAGE EXECUTABLE, ros2 launch PACKAGE FILE, ros2 node list, ros2 topic list, ros2 topic echo TOPIC. Ctrl+C stops this terminal’s processes. This is a bounded educational terminal, not Bash or native ROS 2.';
function flags(args,allowed){const found=new Set(),paths=[];let positional=false;for(const arg of args){if(arg==='--'&&!positional){positional=true;continue;}if(!positional&&arg.startsWith('-')&&arg!=='-'){const names=arg.startsWith('--')?[arg.slice(2)]:[...arg.slice(1)];for(const name of names){const key=allowed[name];if(!key)throw Error('Unsupported option: '+arg);found.add(key);}}else paths.push(arg);}return {found,paths};}
function shellWords(input){const words=[];let word='',quote=null,started=false,escape=false;for(const char of input){if(escape){word+=char;started=true;escape=false;continue;}if(char==='\\'&&quote!=="'"){escape=true;continue;}if(char==='"'||char==="'"){if(quote===char){quote=null;continue;}if(!quote){quote=char;started=true;continue;}}if(!quote&&/\s/.test(char)){if(started){words.push(word);word='';started=false;}continue;}word+=char;started=true;}if(quote||escape)throw Error('Unclosed quote or escape.');if(started)words.push(word);return words;}
export class BridgeTerminal {
  constructor(id,runtime,workspace,builder,processes,write=()=>{},onState=()=>{}){
    this.id=id;this.runtime=runtime;this.workspace=workspace;this.builder=builder;this.processes=processes;this.write=write;this.onState=onState;
    this.cwd=ROOT;this.sourced=false;this.busy=false;this.history=[];this.cursor=0;this.graph=new TerminalSession(runtime,id,write,onState);
  }
  get running(){return this.busy||this.graph.running||this.processes.active().some(p=>p.terminal===this.id);}
  path(text){return normalizePath(text,this.cwd);}
  listing(path,{all=false,long=false}={}){const entry=this.workspace.entry(path),items=entry.kind==='dir'?this.workspace.list(path):[{name:path.split('/').at(-1),...entry}];if(all&&entry.kind==='dir')items.unshift({name:'.',kind:'dir'},{name:'..',kind:'dir'});return items.filter(e=>all||!e.name.startsWith('.')).map(e=>long?(e.kind==='dir'?'drwxr-xr-x':'-rw-r--r--')+'  '+(e.kind==='file'?new TextEncoder().encode(e.content).length:0).toString().padStart(6)+'  '+e.name+(e.kind==='dir'?'/':''):e.name+(e.kind==='dir'?'/':'')).join(long?'\n':'  ')||(long?'':'(empty)');}
  tree(path,depth=0){const lines=[];for(const item of this.workspace.list(path)){lines.push('  '.repeat(depth)+item.name+(item.kind==='dir'?'/':''));if(item.kind==='dir'&&depth<4)lines.push(this.tree(this.path(path+'/'+item.name),depth+1));}return lines.filter(Boolean).join('\n');}
  async run(input){
    if(this.busy||this.graph.running)throw Error('Stop the active command before entering another.');
    const command=normalizeCommand(input).trim();if(!command)return;
    this.history.push(command);if(this.history.length>100)this.history.shift();this.cursor=this.history.length;
    this.write('$ '+command);
    if(/[|;&<>`]/.test(command)||/\$[({A-Za-z_]/.test(command)||/[?*]/.test(command)||/^(sudo|apt|bash|sh|python3?|g\+\+|clang)\b/.test(command))throw Error('This terminal supports only the listed learning commands. Pipes, redirection, scripts, expansion, wildcards and arbitrary binaries are unavailable.');
    if(command==='help'){this.write(HELP);return;}
    const args=command.startsWith('ros2 topic echo ')?tokens(command):shellWords(command);
    if(args[0]==='pwd'&&args.length===1){this.write(this.cwd);return;}
    if(args[0]==='cd'&&args.length<=2){const target=args[1]??'~',path=this.path(target);if(this.workspace.entry(path).kind!=='dir')throw Error('Not a directory: '+target);this.cwd=path;this.write(this.cwd.replace('/home/learner','~'));return;}
    if(args[0]==='ls'){const {found,paths}=flags(args.slice(1),{a:'all',l:'long',all:'all'});if(paths.length>1)throw Error('Usage: ls [-a] [-l] [PATH]');this.write(this.listing(this.path(paths[0]??'.'),{all:found.has('all'),long:found.has('long')}));return;}
    if(args[0]==='tree'&&args.length<=2){this.write(this.tree(this.path(args[1]??'.')));return;}
    if(args[0]==='mkdir'){const {found,paths}=flags(args.slice(1),{p:'parents',parents:'parents'});if(!paths.length)throw Error('Usage: mkdir [-p] PATH...');for(const path of paths)this.workspace.mkdir(this.path(path),{parents:found.has('parents')});return;}
    if(args[0]==='touch'){if(args.length<2)throw Error('Usage: touch PATH...');for(const path of args.slice(1))this.workspace.touch(this.path(path));return;}
    if(args[0]==='cat'&&args.length>=2){for(const path of args.slice(1))this.write(this.workspace.read(this.path(path)));return;}
    if(args[0]==='rm'){const {found,paths}=flags(args.slice(1),{r:'recursive',R:'recursive',recursive:'recursive',f:'force',force:'force'});if(!paths.length&&!found.has('force'))throw Error('Usage: rm [-r] [-f] PATH...');for(const path of paths)this.workspace.remove(this.path(path),{recursive:found.has('recursive'),force:found.has('force')});return;}
    if(args[0]==='cp'){const {found,paths}=flags(args.slice(1),{r:'recursive',R:'recursive',recursive:'recursive'});if(paths.length!==2)throw Error('Usage: cp [-r] SOURCE DEST');const source=this.path(paths[0]),requested=this.path(paths[1]),dest=this.workspace.exists(requested)&&this.workspace.entry(requested).kind==='dir'?requested+'/'+source.split('/').at(-1):requested;this.workspace.copy(source,dest,{recursive:found.has('recursive')});return;}
    if(args[0]==='mv'){if(args.length!==3)throw Error('Usage: mv SOURCE DEST');const source=this.path(args[1]),requested=this.path(args[2]),dest=this.workspace.exists(requested)&&this.workspace.entry(requested).kind==='dir'?requested+'/'+source.split('/').at(-1):requested;this.workspace.move(source,dest);return;}
    if(command==='clear'){this.write('\f');return;}
    if(args[0]==='ros2'&&args[1]==='pkg'&&args[2]==='create'){
      if(this.cwd!==ROOT+'/src')throw Error('Current directory: '+this.cwd.replace('/home/learner','~')+'. Run cd ~/ros2_ws/src before creating a package.');
      const typeAt=args.indexOf('--build-type'),licenseAt=args.indexOf('--license'),name=args.at(-1);
      if(typeAt<0||licenseAt<0||!['ament_python','ament_cmake'].includes(args[typeAt+1])||args[licenseAt+1]!=='Apache-2.0'||args.length!==8)throw Error('Usage: ros2 pkg create --build-type ament_python|ament_cmake --license Apache-2.0 NAME');
      this.workspace.createPackage(name,args[typeAt+1]);this.write('Created '+name+' with '+args[typeAt+1]+' package files.');return;
    }
    if(command==='colcon build'){
      if(this.cwd!==ROOT)throw Error('Run colcon build from ~/ros2_ws.');
      this.busy=true;this.onState(true);try{const records=await this.builder.build(line=>this.write(line));this.write('Summary: '+records.length+' package(s) built in KineNest.');}finally{this.busy=false;this.onState(false);}return;
    }
    if(args[0]==='source'&&args.length===2){const path=this.path(args[1]);if(path!==ROOT+'/install/local_setup.bash'&&path!==ROOT+'/install/setup.bash')throw Error('Supported workspace source: source ~/ros2_ws/install/local_setup.bash');if(!this.workspace.exists(path)||!this.workspace.installed.size)throw Error('No installed workspace setup yet. Run colcon build first.');this.sourced=true;this.write('Workspace packages are discoverable in this terminal.');return;}
    if(args[0]==='ros2'&&args[1]==='pkg'&&args[2]==='list'&&args.length===3){this.write(this.sourced?[...this.workspace.installed.keys()].join('\n'):'(source the workspace to discover learner packages)');return;}
    if(args[0]==='ros2'&&args[1]==='pkg'&&args[2]==='executables'&&args.length===4){if(!this.sourced)throw Error('Source the workspace in this terminal first.');this.write([...this.workspace.installedPackage(args[3]).executables.keys()].map(x=>args[3]+' '+x).join('\n'));return;}
    if(args[0]==='ros2'&&args[1]==='run'&&args.length===4){if(!this.sourced)throw Error('Package not found in this terminal. Run source ~/ros2_ws/install/local_setup.bash.');const p=await this.processes.run(args[2],args[3],{terminal:this.id});this.write('Started '+args[2]+'/'+args[3]+' as process '+p.id+'.');this.onState(true);return;}
    if(args[0]==='ros2'&&args[1]==='launch'&&args.length===4){if(!this.sourced)throw Error('Package not found in this terminal. Run source ~/ros2_ws/install/local_setup.bash.');const launch=await this.processes.launch(args[2],args[3],{terminal:this.id});this.write('Started '+launch.processes.length+' processes in '+launch.group+'.');this.onState(true);return;}
    if(args[0]==='ros2'){this.graph.run(command,{echo:false});return;}
    throw Error('Unsupported command. Type help for the bounded workspace command list.');
  }
  recall(direction){this.cursor=Math.max(0,Math.min(this.history.length,this.cursor+direction));return this.history[this.cursor]??'';}
  stop(announce=true){if(this.busy)this.builder.cancel();this.graph.stop(false);this.processes.stopTerminal(this.id);this.onState(false);if(announce)this.write('^C');}
  reset(){this.stop(false);this.cwd=ROOT;this.sourced=false;this.history=[];this.cursor=0;}
}
