export function courseMode(module,search=''){
 const linux=module==='linux',tf=!linux&&new URLSearchParams(search).get('unit')==='tf';
 return {linux,tf,name:linux?'LINUX & TERMINAL':tf?'TF & Odometry':'ROS 2 BASICS',database:linux?'kinenest-linux-session':'kinenest-basics-session'};
}
const mode=courseMode(typeof document==='undefined'?undefined:document.body?.dataset.module,typeof location==='undefined'?'':location.search);
export const LINUX_MODE=mode.linux,TF_MODE=mode.tf,MODULE_NAME=mode.name,SESSION_DATABASE=mode.database;
export function moduleAllowsUnit(index,{linux=LINUX_MODE,tf=TF_MODE}={}){
 return Number.isInteger(index)&&index>=0&&(tf?index===9:index<=(linux?6:8));
}
