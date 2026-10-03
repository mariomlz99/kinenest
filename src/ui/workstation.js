// Keep advanced tools available, but let each session lead with its own feedback.
function disclose(panel,label,open=false){
 const details=document.createElement('details');details.className=panel.className+' secondary-panel';details.open=open;
 const summary=document.createElement('summary');summary.textContent=label;details.append(summary);panel.querySelector('h2')?.remove();
 while(panel.firstChild)details.append(panel.firstChild);panel.replaceWith(details);return details;
}
export function arrangeSession(session){
 document.body.dataset.session=String(session);
 const camera=document.querySelector('.camera-panel'),world=document.querySelector('.world-panel'),graph=document.querySelector('.graph-panel');
 if(session!==3&&session!==6)disclose(camera,'Camera');
 if(session===3)disclose(world,'Robot');
 const tf=document.getElementById('tf-tree').closest('details');tf.hidden=true;
 const params=document.getElementById('parameters').closest('details'),actions=document.getElementById('action-progress').closest('details');
 if(session===4){const inspector=document.createElement('section');inspector.className='panel course-inspector';params.open=true;actions.open=true;inspector.append(params,actions);world.before(inspector);}
 else if(session!==6){params.hidden=true;actions.hidden=true;}
 if(session!==6)disclose(graph,'Graph');
 if([2,4,5,6].includes(session)){const sensors=document.querySelector('.workbench-sensors');sensors.prepend(world);if(session===4)sensors.prepend(document.querySelector('.course-inspector'));}
 if(session!==6){const terminal=document.querySelector('.terminal-workspace');disclose(terminal,'Learning terminals');}
}
