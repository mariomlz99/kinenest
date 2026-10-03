export function observeCourse(r,lesson){
  const c=r.course,p=r.robot;const front=r.scan().ranges[60];
  if(p.distance>.3&&Math.abs(p.linear)<.02&&Math.abs(p.angular)<.03&&front>.55&&front<1.1)c.stopped++;else c.stopped=0;
  if(front<1.4&&Math.abs(p.angular)>.2)c.reacted=true;
  const points=lesson.waypoints??[];if(c.waypoints<points.length&&Math.hypot(p.x-points[c.waypoints][0],p.y-points[c.waypoints][1])<.12)c.waypoints++;
  if(lesson.goal&&Math.hypot(p.x-lesson.goal[0],p.y-lesson.goal[1])<.12&&Math.abs(p.linear)<.02&&Math.abs(p.angular)<.03)c.goalFrames=(c.goalFrames??0)+1;else c.goalFrames=0;
}
export function courseChecks(r,lesson){
  const c=r.course,e=r.evidence;
  const values={
    subscriber:[c.scan>=3&&c.scanAccess>=3,'Scan subscriber accessed range data in three callbacks'],
    sectors:[c.sectors>=3,'Front, left and right sectors computed from actual scan angles'],
    avoidance:[c.scanAccess>=3&&c.commandPublications>=3&&c.reacted&&r.robot.distance>2&&r.time>8&&r.collisions===0,'Reacted to obstacle, travelled over 2 m and avoided collisions'],
    timer:[c.timers>=5&&e.pythonPublications>=5,'Timer fired and Python published at least 5 commands'],
    chatter:[c.messages>=3,'Python subscriber received 3 String messages'],
    scan:[c.scan>=3&&c.range>=3,'Scan callback reported three correct finite distances'],
    safe_stop:[c.stopped>=30&&c.scan>=3&&e.pythonPublications>=3,'Moved, then stopped 0.55–1.10 m before the obstacle'],
    custom:[c.customPython>=3,'Published three valid TargetInfo messages through the graph'],
    configured:[c.paramReads>=3&&e.pythonPublications>=3,'Declared and used parameters while publishing motion'],
    parameter:[c.paramChanges>=1&&c.paramValues.size>=2&&c.commandSpeeds?.size>=2&&c.paramReads>=3&&c.timers>=3,'Live parameter changed and Python read both values'],
    action_result:[c.actionAccepted>=1&&c.results>=1,'Action completed and final result received'],
    action:[c.actionAccepted>=1&&c.feedback>=2&&c.results>=1,'Goal accepted, feedback processed and success result received'],
    cancel:[c.feedback>=1&&c.cancelled>=1&&Math.abs(r.robot.linear)<.02,'Active goal cancelled and cancellation result received'],
    relative:[c.tf>=3&&c.relative>=3,'Computed target coordinates in base_link from TF'],
    integrated:[c.scanAccess>=3&&r.collisions===0&&c.goalFrames>=30&&c.tf>=3,'Reached the goal with scan safety and no collisions'],
    pose:[c.odom>=3&&c.pose>=3,'Odometry callback reported correct x, y and yaw'],
    transform:[c.tf>=3&&c.transform>=3,'TF lookup reported the laser origin in odom three times'],
    goal:[(c.odom>=3||c.tf>=3)&&e.pythonPublications>=3&&c.goalFrames>=30,'Used odometry and stopped at the goal for 0.5 seconds'],
    dock:[c.stopped>=30&&e.converted&&e.callbacks>=3&&e.centeredFrames>=8,'Processed images and scan, centered target and stopped at safe range'],
    route:[c.waypoints===(lesson.waypoints?.length??99)&&c.goalFrames>=30&&c.odom>=3,'Visited the waypoints in order and stopped at the final goal']
  };
  return lesson.checks.map(({type})=>{if(!values[type])throw Error('Unknown course check: '+type);return {passed:!!values[type][0],label:values[type][1]};});
}
