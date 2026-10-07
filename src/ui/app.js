import {pageReady,pageFailed} from './page-ready.js';
import { setupPreferences, language, translate } from './preferences.js';
setupPreferences();
import { Runtime } from '../runtime/graph.js';
import { createTerminals } from './terminals.js';
import { loadLesson,checkSolution } from '../exercises/lesson.js';
const $=id=>document.getElementById(id), runtime=new Runtime({lidar:false});
let lesson, terminals, hints=0, trail=[], last=0, accumulator=0;
function localLesson(){return {...lesson,...lesson.translations?.[language()]};}
function renderLesson(){if(!lesson)return;let path=$('lesson-path');if(!path){path=document.createElement('aside');path.id='lesson-path';path.className='lesson-path';$('description').after(path);}path.replaceChildren();const label=document.createElement('strong');label.textContent=translate('Core exercise');const next=document.createElement('a');next.href='./session-02.html?lesson=session-02-01-subscriber';next.textContent=translate('Next Core exercise');path.append(label,document.createElement('br'),next);const text=localLesson();$('hint').disabled=hints>=text.hints.length;$('mission-title').textContent=text.title;$('description').textContent=text.description;$('steps').replaceChildren();for(const step of text.steps){const li=document.createElement('li');li.textContent=step;$('steps').append(li);}$('hints').replaceChildren();for(const hint of text.hints.slice(0,hints)){const p=document.createElement('p');p.textContent=hint;$('hints').append(p);}}
window.addEventListener('languagechange',renderLesson);
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
$('hint').addEventListener('click',()=>{if(hints>=localLesson().hints.length)return;const p=document.createElement('p');p.textContent=localLesson().hints[hints++];$('hints').append(p);$('hint').textContent=hints===localLesson().hints.length?'All hints revealed':'Reveal next hint ('+hints+'/'+localLesson().hints.length+')';$('hint').disabled=hints===localLesson().hints.length;});
$('check').addEventListener('click',()=>{const results=checkSolution(runtime,lesson);$('feedback').replaceChildren();for(const result of results){const p=document.createElement('p');p.className=result.passed?'pass':'fail';p.textContent=(result.passed?'✓ ':'○ ')+result.label;$('feedback').append(p);}const complete=results.every(r=>r.passed);$('status').textContent=complete?'Exercise complete.':'Not complete yet. Travel at least 1 m.';$('feedback').hidden=false;});
$('reset').addEventListener('click',()=>{terminals.reset();runtime.reset();hints=0;trail=[];accumulator=0;last=0;$('hints').replaceChildren();$('hint').textContent='Reveal next hint';$('hint').disabled=false;$('feedback').hidden=true;$('status').textContent='Reset complete.';render();terminals.focus();});
try{lesson=await loadLesson(new URL('../../public/lessons/topics-01.json',import.meta.url));renderLesson();terminals=createTerminals(runtime,error=>{$('status').textContent=error?'Review the terminal error and try again.':'Terminals share one graph. Observe messages and robot motion.';$('feedback').hidden=true;});for(const id of ['hint','reset','check'])$(id).disabled=false;$('status').textContent='Ready. Discover the graph in the terminal.';render();requestAnimationFrame(frame);await pageReady();}catch(error){$('mission-title').textContent='Unable to open Session 1';$('description').textContent=error.message+' Reload the page to retry.';$('status').textContent='Lesson loading failed.';pageFailed(error);}
