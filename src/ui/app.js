import { Runtime } from '../runtime/graph.js';
import { createTerminals } from './terminals.js';
import { loadLesson,checkSolution } from '../exercises/lesson.js';
const $=id=>document.getElementById(id), runtime=new Runtime();
let lesson, terminals, hints=0, trail=[], last=0, accumulator=0;
function render() {
  const r=runtime.robot, x=320+r.x*40, y=180-r.y*40;
  $('robot').setAttribute('transform','translate('+x+' '+y+') rotate('+(-r.yaw*180/Math.PI)+')');
  // Follow the robot when it leaves the central viewport.
  const dx=x<160?160-x:x>480?480-x:0, dy=y<90?90-y:y>270?270-y:0;
  $('scene').setAttribute('transform','translate('+dx+' '+dy+')');
  if(r.remaining>0 && (!trail.length || Math.hypot(x-trail.at(-1)[0],y-trail.at(-1)[1])>1)) { trail.push([x,y]); if(trail.length>1500) trail.shift(); }
  $('trail').setAttribute('d',trail.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' '));
  for(const key of ['x','y','distance']) $(key).textContent=r[key].toFixed(2)+' m';
  $('yaw').textContent=r.yaw.toFixed(2)+' rad'; $('motion-state').textContent=r.remaining>0?'Command active':'Ready';
}
function frame(now) {if(last) accumulator+=Math.min((now-last)/1000,.1);last=now;while(accumulator>=1/60){runtime.step(1/60);accumulator-=1/60;}render();requestAnimationFrame(frame);}
document.addEventListener('visibilitychange',()=>{last=0;accumulator=0;});
$('hint').addEventListener('click',()=>{if(hints>=lesson.hints.length)return;const p=document.createElement('p');p.textContent=lesson.hints[hints++];$('hints').append(p);$('hint').textContent=hints===lesson.hints.length?'All hints revealed':'Reveal next hint ('+hints+'/'+lesson.hints.length+')';$('hint').disabled=hints===lesson.hints.length;});
$('check').addEventListener('click',()=>{const results=checkSolution(runtime,lesson);$('feedback').replaceChildren();for(const result of results){const p=document.createElement('p');p.className=result.passed?'pass':'fail';p.textContent=(result.passed?'✓ ':'○ ')+result.label;$('feedback').append(p);}const complete=results.every(r=>r.passed);$('status').textContent=complete?'Lab complete. You sent a message to a robot subscriber.':'Keep experimenting. Travel at least 1 m; you can use the hints.';$('feedback').hidden=false;});
$('reset').addEventListener('click',()=>{terminals.reset();runtime.reset();hints=0;trail=[];accumulator=0;last=0;$('hints').replaceChildren();$('hint').textContent='Reveal next hint';$('hint').disabled=false;$('feedback').hidden=true;$('status').textContent='Lab reset. Ready for a fresh experiment.';render();terminals.focus();});
try{lesson=await loadLesson(new URL('../../public/lessons/topics-01.json',import.meta.url));$('mission-title').textContent=lesson.title;$('description').textContent=lesson.description;for(const step of lesson.steps){const li=document.createElement('li');li.textContent=step;$('steps').append(li);}terminals=createTerminals(runtime,error=>{$('status').textContent=error?'Review the terminal error and try again.':'Terminals share one graph. Observe messages and robot motion.';$('feedback').hidden=true;});for(const id of ['hint','reset','check'])$(id).disabled=false;$('status').textContent='Ready when you are. No installation required.';requestAnimationFrame(frame);}catch(error){$('mission-title').textContent='Unable to open Lab 01';$('description').textContent=error.message+' Reload the page to retry.';$('status').textContent='Lesson loading failed.';}
