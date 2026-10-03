import {transforms,lookup} from '../runtime/course.js';
export function frameSnapshot(runtime){
 const edges=transforms(runtime).transforms,ids=[...new Set(edges.flatMap(e=>[e.header.frame_id,e.child_frame_id]))];
 return {edges,frames:ids.map(id=>({id,...lookup(runtime,'world',id)}))};
}
export function relativeValues(runtime,target,source){const pose=lookup(runtime,target,source);return {...pose,distance:Math.hypot(pose.x,pose.y),bearing:Math.atan2(pose.y,pose.x)};}
export function defaultFrames(number){return number==='5.3'?['base_link','laser_link']:['world','base_link','target'];}
export function treeLayout(edges){
 const children=new Map(),parents=new Map();for(const e of edges){const p=e.header.frame_id,c=e.child_frame_id;parents.set(c,p);if(!children.has(p))children.set(p,[]);children.get(p).push(c);}
 const roots=[...children.keys()].filter(id=>!parents.has(id)),nodes=[];let leaf=0;
 function visit(id,depth){const descendants=(children.get(id)??[]).map(child=>visit(child,depth+1));const x=descendants.length?descendants.reduce((a,n)=>a+n.x,0)/descendants.length:leaf++;
  const node={id,parent:parents.get(id)??null,x,depth};nodes.push(node);return node;}
 for(const root of roots)visit(root,0);return nodes;
}
