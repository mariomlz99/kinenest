// Maintainer-only native validation fixtures from the same browser templates.
import {mkdir,writeFile} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {WorkspaceModel,ROOT} from '../src/bridge/workspace.js';
import {exportPackageZip} from '../src/bridge/export.js';
const prefix=process.argv[2]??'/tmp/kinenest-native-';
for(const [language,type] of [['python','ament_python'],['cpp','ament_cmake']]){
  const workspace=new WorkspaceModel();workspace.createPackage('my_robot_pkg',type);
  const launch=ROOT+'/src/my_robot_pkg/launch/system_launch.py';workspace.write(launch,workspace.read(launch).replace('other_chatter','bridge_chatter'));
  const dest=prefix+language+'/src/my_robot_pkg';
  for(const [relative,content] of Object.entries(workspace.filesUnder(ROOT+'/src/my_robot_pkg'))){const path=join(dest,relative);await mkdir(dirname(path),{recursive:true});await writeFile(path,content);}
  const zip=prefix+language+'-export.zip';
  await writeFile(zip,new Uint8Array(await exportPackageZip(workspace,'my_robot_pkg').arrayBuffer()));
  console.log(dest+' · '+zip);
}
