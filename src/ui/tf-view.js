import {frameSnapshot,relativeValues,defaultFrames,treeLayout} from './tf-model.js';
const NS='http://www.w3.org/2000/svg';
function svg(tag,attributes={},text){const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attributes))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el;}
function value(el,n,unit='m'){el.dataset.value=String(n);const text=n.toFixed(3)+' '+unit;if(el.textContent!==text)el.textContent=text;}
export function createTFView(runtime,session){
 if(![5,6].includes(session))return null;
 const world=document.querySelector('.world-panel'),map=document.getElementById('map');map.width=720;map.height=300;
 const stage=document.createElement('div');stage.className='tf-stage';map.before(stage);stage.append(map);
 const spatial=svg('svg',{id:'tf-spatial',viewBox:'0 0 720 300',role:'img','aria-label':'Coordinate frames in the robot world','data-i18n-label':'Coordinate frames in the robot world'});stage.append(spatial);
 const defs=svg('defs'),marker=svg('marker',{id:'relative-arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:6,markerHeight:6,orient:'auto-start-reverse'});marker.append(svg('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:'currentColor'}));defs.append(marker);spatial.append(defs);
 const vector=svg('line',{id:'tf-vector','marker-end':'url(#relative-arrow)'});spatial.append(vector);
 const controls=document.createElement('fieldset');controls.className='frame-controls';controls.innerHTML='<legend>Frames</legend>';stage.after(controls);
 const ids=frameSnapshot(runtime).frames.map(f=>f.id),axes=new Map(),checks=new Map();
 for(const [index,id]of ids.entries()){
  const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.value=id;check.dataset.frame=id;label.append(check,document.createTextNode(id));controls.append(label);checks.set(id,check);
  const group=svg('g',{'data-frame':id,class:'frame-origin'}),rotated=svg('g',{class:'frame-axes'});
  rotated.append(svg('path',{d:'M 0 0 L 32 0 M 27 -3 L 32 0 L 27 3',class:'axis-x'}),svg('path',{d:'M 0 0 L 0 -32 M -3 -27 L 0 -32 L 3 -27',class:'axis-y'}),svg('text',{x:38,y:4,class:'axis-label'},'x'),svg('text',{x:-3,y:-38,class:'axis-label'},'y'));
  // Label leaders distinguish coincident world/odom and base_link/camera_link origins.
  const offset={world:40,odom:60,base_link:18,laser_link:40,camera_link:62,target:18}[id]??18;
  group.append(rotated,svg('circle',{r:3,class:'frame-dot'}),svg('line',{x1:0,y1:3,x2:5,y2:offset-3,class:'frame-leader'}),svg('text',{x:8,y:offset,class:'frame-label'},id));spatial.append(group);axes.set(id,{group,rotated});
 }
 const panel=document.createElement('section');panel.className='panel tf-panel';panel.innerHTML='<h2>Transform inspector</h2><div class="tf-selectors"><label>Target frame <select id="tf-target"></select></label><label>Source frame <select id="tf-source"></select></label></div><p class="tf-help">Express the source frame in the target frame: lookup_transform(target_frame, source_frame, ...).</p><dl class="tf-values"><div><dt>translation.x</dt><dd id="tf-x"></dd></div><div><dt>translation.y</dt><dd id="tf-y"></dd></div><div><dt>yaw</dt><dd id="tf-yaw"></dd></div><div><dt>distance</dt><dd id="tf-distance"></dd></div><div><dt>bearing</dt><dd id="tf-bearing"></dd></div></dl><label><input type="checkbox" id="tf-show-vector" checked> Relative target vector</label><details><summary>TF hierarchy</summary><svg id="tf-hierarchy" viewBox="0 0 640 260" aria-label="TF hierarchy" data-i18n-label="TF hierarchy"></svg></details><details><summary>Selected frame</summary><label>Frame <select id="tf-selected"></select></label><dl class="tf-values"><div><dt>Parent</dt><dd id="tf-parent"></dd></div><div><dt>translation.x</dt><dd id="tf-local-x"></dd></div><div><dt>translation.y</dt><dd id="tf-local-y"></dd></div><div><dt>yaw</dt><dd id="tf-local-yaw"></dd></div></dl></details><p class="tf-help">Latest 2D transforms only. Real tf2 also supports 3D transforms and time history.</p>';
 world.after(panel);const $=id=>panel.querySelector('#'+id);
 for(const selector of ['tf-target','tf-source','tf-selected'])for(const id of ids){const option=document.createElement('option');option.value=id;option.textContent=id;$(selector).append(option);}
 $('tf-target').value='base_link';$('tf-source').value='target';$('tf-selected').value='base_link';
 const tree=$('tf-hierarchy'),positions=treeLayout(frameSnapshot(runtime).edges),cols=Math.max(...positions.map(n=>n.x))+1;
 const point=node=>({x:70+node.x*(500/Math.max(1,cols-1)),y:28+node.depth*65});
 for(const node of positions){if(!node.parent)continue;const a=point(positions.find(p=>p.id===node.parent)),b=point(node);tree.append(svg('path',{d:'M '+a.x+' '+a.y+' V '+(b.y-30)+' H '+b.x+' V '+b.y,class:'tree-edge'}));}
 for(const node of positions){const p=point(node),button=svg('g',{transform:'translate('+p.x+' '+p.y+')',role:'button',tabindex:0,'aria-label':node.id,'data-tree-frame':node.id,class:'tree-node'});button.append(svg('rect',{x:-62,y:-17,width:124,height:34,rx:5}),svg('text',{'text-anchor':'middle',y:4},node.id));const select=()=>{$('tf-selected').value=node.id;$('tf-source').value=node.id;update();};button.addEventListener('click',select);button.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});tree.append(button);}
 let projection;
 function update(){
  const snapshot=frameSnapshot(runtime);
  for(const frame of snapshot.frames){const {group,rotated}=axes.get(frame.id);group.style.display=checks.get(frame.id).checked?'':'none';group.dataset.x=frame.x;group.dataset.y=frame.y;group.dataset.yaw=frame.yaw;if(projection)group.setAttribute('transform','translate('+projection.sx(frame.x)+' '+projection.sy(frame.y)+')');rotated.setAttribute('transform','rotate('+(-frame.yaw*180/Math.PI)+')');}
  const relative=relativeValues(runtime,$('tf-target').value,$('tf-source').value);value($('tf-x'),relative.x);value($('tf-y'),relative.y);value($('tf-distance'),relative.distance);value($('tf-yaw'),relative.yaw,'rad / '+(relative.yaw*180/Math.PI).toFixed(1)+'°');value($('tf-bearing'),relative.bearing,'rad / '+(relative.bearing*180/Math.PI).toFixed(1)+'°');
  const selected=$('tf-selected').value,edge=snapshot.edges.find(e=>e.child_frame_id===selected);$('tf-parent').textContent=edge?.header.frame_id??'—';value($('tf-local-x'),edge?.transform.translation.x??0);value($('tf-local-y'),edge?.transform.translation.y??0);value($('tf-local-yaw'),edge?2*Math.atan2(edge.transform.rotation.z,edge.transform.rotation.w):0,'rad');
  for(const button of tree.querySelectorAll('[data-tree-frame]'))button.setAttribute('aria-pressed',String(button.dataset.treeFrame===selected));
  vector.style.display=$('tf-show-vector').checked?'':'none';if(projection){const base=snapshot.frames.find(f=>f.id==='base_link'),target=snapshot.frames.find(f=>f.id==='target');for(const [key,n]of Object.entries({x1:projection.sx(base.x),y1:projection.sy(base.y),x2:projection.sx(target.x),y2:projection.sy(target.y)}))vector.setAttribute(key,n);}
 }
 controls.addEventListener('change',update);panel.addEventListener('change',update);
 return {draw(p){projection=p;update();},setLesson(lesson){for(const [id,check]of checks)check.checked=(lesson.frames??defaultFrames(lesson.number)).includes(id);$('tf-target').value=lesson.number==='5.3'?'odom':'base_link';$('tf-source').value=lesson.number==='5.3'?'laser_link':'target';$('tf-selected').value=lesson.number==='5.3'?'laser_link':'base_link';$('tf-show-vector').checked=lesson.number!=='5.3';panel.querySelector('details').open=lesson.number==='5.3';update();}};
}
