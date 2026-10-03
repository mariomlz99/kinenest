export function newEvidence(){return {callbacks:0,dimensions:false,converted:false,stats:false,detectionCases:new Set(),positionCases:new Set(),client:false,request:false,response:false,reset:false,codePublications:0,centeredFrames:0,reports:0,detectionCounts:new Map(),positionCounts:new Map()};}
export function evaluateReport(e, report, truth, caseId) {
  e.reports++;
  if(!caseId?.startsWith('test-'))return;
  const correct=typeof report.visible==='boolean'&&report.visible===truth.visible;
  e.detectionCounts.set(caseId,correct?(e.detectionCounts.get(caseId)??0)+1:0);
  if(e.detectionCounts.get(caseId)>=3)e.detectionCases.add(caseId);else e.detectionCases.delete(caseId);
  const located=correct&&(!truth.visible||(Number.isFinite(report.cx)&&Math.abs(report.cx-truth.cx)<=8));
  e.positionCounts.set(caseId,located?(e.positionCounts.get(caseId)??0)+1:0);
  if(e.positionCounts.get(caseId)>=3)e.positionCases.add(caseId);else e.positionCases.delete(caseId);
}
export function sessionChecks(runtime,lesson) {
  const e=runtime.evidence;
  const values={camera_subscriber:[runtime.topics.get('/camera/image_raw')?.subscribers.size>0&&e.callbacks>=3,'Camera callback received at least 3 images'],dimensions:[e.dimensions,'Image width and height accessed'],image_array:[e.converted,'Image pixels accessed for processing'],image_stats:[e.stats,'Correct shape and channel means reported'],detection:[e.detectionCases.size>=4,'Detection correct in all 4 varied scenes'],position:[e.positionCases.size>=4,'Centroid correct in all 4 varied scenes'],service:[e.client&&e.request&&e.response&&e.reset,'Client created → request → response → robot reset'],control:[e.codePublications>=3,'Code published control commands'],centered:[e.centeredFrames>=8,'Target centered and robot stopped for 8 camera frames']};
  return lesson.checks.map(({type})=>{if(!values[type])throw new Error('Unknown Session 3 check: '+type);return {passed:!!values[type][0],label:values[type][1]};});
}
