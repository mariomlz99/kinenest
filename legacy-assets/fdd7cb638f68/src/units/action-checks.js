// Check observed messages from the current installed server, independent of source style.
export function actionChecks(runtime,owners){
 const current=new Set([...owners.keys()].map(adapter=>adapter.owner));
 const events=runtime.actions.events.filter(e=>current.has(e.serverOwner)&&e.type==='action_tutorials_interfaces/action/Fibonacci');
 const validOrder=e=>Number.isInteger(e.request?.order)&&e.request.order>=2&&e.request.order<=20;
 const prefix=(sequence,order)=>{
  if(!Array.isArray(sequence)||sequence.length<2||sequence.length>order)return false;
  let a=0,b=1;
  return sequence.every(value=>{const expected=a;[a,b]=[b,a+b];return value===expected;});
 };
 const check=(label,passed)=>({label,passed});
 return [
  check('Receive action feedback',events.some(e=>e.event==='feedback'&&validOrder(e)&&prefix(e.payload?.partial_sequence,e.request.order))),
  check('Complete an action goal',events.some(e=>e.event==='result'&&e.status===4&&current.has(e.clientOwner)&&validOrder(e)&&e.payload?.result?.sequence?.length===e.request.order&&prefix(e.payload.result.sequence,e.request.order))),
  check('Cancel an action goal',events.some(e=>e.event==='result'&&e.status===5&&current.has(e.clientOwner)&&validOrder(e))),
  check('Observe a rejected goal',events.some(e=>e.event==='rejected'&&Number.isInteger(e.request?.order)&&!validOrder(e)))
 ];
}
