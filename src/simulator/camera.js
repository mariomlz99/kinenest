import {SENSORS,sensorPose} from './sensors.js';
export const CAMERA_WIDTH=SENSORS.camera.width, CAMERA_HEIGHT=SENSORS.camera.height, CAMERA_PERIOD=SENSORS.camera.period;

// A tiny pinhole camera: +yaw turns left, so a target to the left has a smaller image x.
export function renderCamera(robot, targets=[{x:5,y:0,color:[235,45,45]},{x:6,y:-2,color:[40,85,230]}]) {
  robot=sensorPose(robot,'camera');
  const width=CAMERA_WIDTH,height=CAMERA_HEIGHT,data=new Uint8Array(width*height*3);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const i=(y*width+x)*3;data[i]=y<120?75:65;data[i+1]=y<120?104:73;data[i+2]=y<120?127:66;
  }
  const projected=targets.map(target=>{
    const dx=target.x-robot.x,dy=target.y-robot.y;
    const depth=dx*Math.cos(robot.yaw)+dy*Math.sin(robot.yaw);
    const lateral=-dx*Math.sin(robot.yaw)+dy*Math.cos(robot.yaw);
    return {...target,depth,cx:160-160*lateral/depth,size:Math.min(200,200/depth)};
  }).filter(t=>t.depth>0.3).sort((a,b)=>b.depth-a.depth);
  for(const target of projected) {
    const left=Math.max(0,Math.floor(target.cx-target.size/2)),right=Math.min(width,Math.ceil(target.cx+target.size/2));
    const top=Math.max(0,Math.floor(120-target.size/2)),bottom=Math.min(height,Math.ceil(120+target.size/2));
    for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)data.set(target.color,(y*width+x)*3);
  }
  return {height,width,encoding:'rgb8',is_bigendian:0,step:width*3,data};
}

// Kept in the simulator/checker, never attached to the student Image message.
export function inspectPixels(image) {
  let count=0,sumX=0;const sums=[0,0,0];
  for(let i=0;i<image.data.length;i+=3){const r=image.data[i],g=image.data[i+1],b=image.data[i+2];sums[0]+=r;sums[1]+=g;sums[2]+=b;if(r>180&&g<100&&b<100){count++;sumX+=(i/3)%image.width;}}
  return {visible:count>500,cx:count?sumX/count:null,count,means:sums.map(s=>s/(image.width*image.height))};
}
