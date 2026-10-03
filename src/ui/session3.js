import { Runtime } from '../runtime/graph.js';
import { PythonBridge } from '../python/bridge.js';
import { createTerminals } from './terminals.js';
import { sessionChecks } from '../exercises/perception.js';
import { inspectPixels } from '../simulator/camera.js';

const $=id=>document.getElementById(id),runtime=new Runtime();runtime.enableSession3();
let lesson,hints=0,epoch=0,testing=false,last=0,accumulator=0,lastFrame=-1,lastDetection=null;
const drafts=new Map();
const output=text=>{const pre=$('python-output');pre.textContent=(pre.textContent+text+'\n').slice(-24000);pre.scrollTop=pre.scrollHeight;};
const python=new PythonBridge(runtime,{output,status:text=>{$('python-state').textContent=text;$('stop-python').disabled=!python.worker;},detection:value=>{lastDetection=value;$('detection').textContent=value.visible?'Student detection: visible'+(value.cx===null?'':' · centroid x = '+value.cx.toFixed(1)):'Student detection: no red target';}});
const terminals=createTerminals(runtime,error=>{if(error)$('status').textContent='Review the terminal error.';});
async function json(name){const response=await fetch(new URL('../../public/lessons/'+name,import.meta.url),{signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Lesson HTTP '+response.status);return response.json();}
function reset(){
  epoch++;testing=false;python.stop();terminals.reset();runtime.reset();runtime.robot.x=lesson.startX;runtime.robot.yaw=lesson.startYaw;
  hints=0;lastDetection=null;lastFrame=-1;last=0;accumulator=0;$('hints').replaceChildren();$('hint').textContent='Reveal next hint';$('hint').disabled=false;$('feedback').hidden=true;$('check').disabled=false;$('python-output').textContent='';$('detection').textContent='No student detection reported';$('status').textContent='Ready. Complete the TODOs and Run Python.';runtime.cameraFrame();
}
async function selectLesson(id){
  if(lesson)drafts.set(lesson.id,$('python-code').value);
  python.stop();const next=await json(id+'.json');lesson=next;reset();
  $('lesson-number').textContent='EXERCISE '+lesson.number;$('mission-title').textContent=lesson.title;$('description').textContent=lesson.description;
  $('steps').replaceChildren();for(const step of lesson.steps){const li=document.createElement('li');li.textContent=step;$('steps').append(li);}
  $('python-code').value=drafts.get(id)??lesson.starterCode;
  for(const id of ['run-python','restore-code','reset','check','hint'])$(id).disabled=false;
}
function showResults(){const results=sessionChecks(runtime,lesson);$('feedback').replaceChildren();for(const result of results){const p=document.createElement('p');p.className=result.passed?'pass':'fail';p.textContent=(result.passed?'✓ ':'○ ')+result.label;$('feedback').append(p);}$('feedback').hidden=false;$('status').textContent=results.every(r=>r.passed)?'Exercise complete. Your code passed the behavioural checks.':'Not complete yet. Review the checks, output and hints.';}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function testScenes(){
  if(!python.worker){$('status').textContent='Run your Python detector before checking.';return;}
  testing=true;$('check').disabled=true;const token=++epoch;
  const e=runtime.evidence;e.detectionCases.clear();e.positionCases.clear();e.detectionCounts.clear();e.positionCounts.clear();
  // Random positions and order prevent constant answers from passing. Ground truth stays on the JS side.
  const cases=[{y:2+Math.random(),color:[235,45,45]},{y:(Math.random()-.5)*.5,color:[220,35,50]},{y:-2-Math.random(),color:[240,65,40]},{y:0,color:[40,85,230]}].sort(()=>Math.random()-.5);
  for(let i=0;i<cases.length;i++){
    if(epoch!==token)return;
    runtime.robot.reset();runtime.testCase='test-'+i;runtime.targets=[{x:5,...cases[i]},{x:6,y:-2,color:[30,160,65]}];
    $('status').textContent='Testing rendered scene '+(i+1)+' / 4…';
    await wait(1500);
  }
  if(epoch!==token)return;
  runtime.testCase=null;runtime.targets=undefined;testing=false;$('check').disabled=false;showResults();
}
$('lesson-select').addEventListener('change',()=>selectLesson($('lesson-select').value).catch(error=>{$('status').textContent=error.message;}));
$('run-python').addEventListener('click',()=>{const code=$('python-code').value;reset();python.run(code);});
$('stop-python').addEventListener('click',()=>{epoch++;testing=false;runtime.testCase=null;runtime.targets=undefined;$('check').disabled=false;python.stop();});
$('restore-code').addEventListener('click',()=>{$('python-code').value=lesson.starterCode;});
$('reset').addEventListener('click',reset);
$('check').addEventListener('click',()=>{if(lesson.testScenes)testScenes();else showResults();});
$('hint').addEventListener('click',()=>{const p=document.createElement('p');p.textContent=lesson.hints[hints++];$('hints').append(p);$('hint').disabled=hints===lesson.hints.length;});
let leaveEditor=false;$('python-code').addEventListener('keydown',event=>{if(event.key==='Escape'){leaveEditor=true;return;}if(event.key==='Tab'&&!event.shiftKey&&!leaveEditor){event.preventDefault();const el=event.target;el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');}leaveEditor=false;});
function draw(){
  const image=runtime.camera;
  if(image&&lastFrame!==runtime.frameId){
    lastFrame=runtime.frameId;const context=$('camera').getContext('2d'),rgba=new Uint8ClampedArray(320*240*4);
    for(let i=0,j=0;i<image.data.length;i+=3,j+=4){rgba[j]=image.data[i];rgba[j+1]=image.data[i+1];rgba[j+2]=image.data[i+2];rgba[j+3]=255;}
    context.putImageData(new ImageData(rgba,320,240),0,0);
    if($('overlay').checked&&lastDetection?.visible&&Number.isFinite(lastDetection.cx)&&runtime.frameId-lastDetection.frame<4){context.strokeStyle='#ffffff';context.beginPath();context.moveTo(lastDetection.cx-8,120);context.lineTo(lastDetection.cx+8,120);context.moveTo(lastDetection.cx,112);context.lineTo(lastDetection.cx,128);context.stroke();}
    $('camera-stats').textContent='RGB channel means: '+inspectPixels(image).means.map((v,i)=>'RGB'[i]+': '+v.toFixed(1)).join(' · ');
    const r=runtime.robot,ctx=$('map').getContext('2d');ctx.fillStyle='#0b1b25';ctx.fillRect(0,0,480,200);
    for(const t of runtime.targets??[{x:5,y:0,color:[235,45,45]},{x:6,y:-2,color:[40,85,230]}]){ctx.fillStyle='rgb('+t.color.join(',')+')';ctx.fillRect(100+t.x*45-8,100-t.y*30-8,16,16);}
    ctx.save();ctx.translate(100+r.x*45,100-r.y*30);ctx.rotate(-r.yaw);ctx.fillStyle='#57ddbc';ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(-10,-9);ctx.lineTo(-10,9);ctx.closePath();ctx.fill();ctx.restore();
    $('pose').textContent='x '+r.x.toFixed(2)+' m · y '+r.y.toFixed(2)+' m · yaw '+r.yaw.toFixed(2)+' rad';
    $('graph').textContent=[...runtime.topics].filter(([,t])=>!t.placeholder).map(([name,t])=>[...t.publishers].join(', ')+' → '+name+' → '+([...t.subscribers].join(', ')||'(no subscribers)')).join('\n')+'\n\n'+[...runtime.services].map(([name,s])=>([...s.clients].join(', ')||'(no client)')+' ⇄ '+name+' ⇄ '+s.node).join('\n');
  }
}
function frame(now){if(last)accumulator+=Math.min((now-last)/1000,.1);last=now;while(accumulator>=1/60){if(testing)runtime.robot.command(0,0);runtime.step(1/60);accumulator-=1/60;}draw();requestAnimationFrame(frame);}
document.addEventListener('visibilitychange',()=>{last=0;accumulator=0;});
const catalog=await json('session-03.json');for(const entry of catalog){const option=document.createElement('option');option.value=entry.id;option.textContent=entry.number+' — '+entry.title;$('lesson-select').append(option);}
$('lesson-select').disabled=false;await selectLesson(catalog[0].id);requestAnimationFrame(frame);
