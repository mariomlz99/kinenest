export function validateLesson(lesson) {
  if(!lesson || typeof lesson.id!=='string' || typeof lesson.title!=='string' || typeof lesson.description!=='string' || !Array.isArray(lesson.steps) || !lesson.steps.every(s=>typeof s==='string') || !Array.isArray(lesson.hints) || !lesson.hints.every(s=>typeof s==='string') || !Array.isArray(lesson.checks) || !lesson.checks.length) throw new Error('Invalid lesson data.');
  for(const check of lesson.checks) {
    if(!['topic_discovered','twist_published','robot_moved'].includes(check.type)) throw new Error('Unknown lesson check: '+check.type);
    if(check.type==='robot_moved' && (!Number.isFinite(check.distance) || check.distance<=0)) throw new Error('Invalid distance threshold.');
  }
  return lesson;
}
export async function loadLesson(url, fetcher=fetch) { const response=await fetcher(url); if(!response.ok) throw new Error('Lesson could not load (HTTP '+response.status+').'); return validateLesson(await response.json()); }
export function checkSolution(runtime,lesson) {
  return lesson.checks.map(check=> {
    switch(check.type) {
      case 'topic_discovered': return {passed:runtime.discovered,label:'/cmd_vel discovered'};
      case 'twist_published': return {passed:runtime.publications>0,label:'Valid Twist published'};
      case 'robot_moved': return {passed:runtime.robot.distance+1e-9>=check.distance,label:'Distance travelled: '+runtime.robot.distance.toFixed(2)+' / '+check.distance.toFixed(2)+' m'};
      default: throw new Error('Unknown check: '+check.type);
    }
  });
}
