import {spawn} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
export const wait=ms=>new Promise(r=>setTimeout(r,ms));
export async function launch(browser,{profileRoot=tmpdir()}={}){
 const profile=await mkdtemp(path.join(profileRoot,'kn-browser-'));let stderr='',socket,child;
 const pending=new Map();let next=0,context;
 const command=(method,params={})=>new Promise((resolve,reject)=>{const id=++next;const timer=setTimeout(()=>{pending.delete(id);reject(Error('Protocol timeout: '+method));},120000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));});
 const close=async()=>{for(const job of pending.values()){clearTimeout(job.timer);job.reject(Error('Browser closed'));}pending.clear();socket?.close();child?.kill();await wait(350);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});};
 try{
  child=spawn(browser==='firefox'?(process.env.FIREFOX_BIN||'firefox'):'google-chrome',browser==='firefox'?['--headless','--no-remote','--profile',profile,'--remote-debugging-port=0','about:blank']:['--headless','--disable-gpu','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});
  child.stderr.on('data',d=>stderr=(stderr+d).slice(-10000));child.on('error',e=>stderr+=e.message);
  let url;
  for(let i=0;i<200;i++){
   if(browser==='firefox'){const match=stderr.match(/WebDriver BiDi listening on (ws:\/\/[^\s]+)/);if(match){url=match[1].replace(/\/$/,'')+'/session';break;}}
   else{try{const port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();url=tabs.find(t=>t.type==='page').webSocketDebuggerUrl;break;}catch{}}
   await wait(100);
  }
  if(!url)throw Error('No browser protocol endpoint: '+stderr);
  socket=new WebSocket(url);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=()=>reject(Error('Cannot connect '+url+' '+stderr));});
  socket.onmessage=event=>{const m=JSON.parse(event.data),job=pending.get(m.id);if(!job)return;pending.delete(m.id);clearTimeout(job.timer);m.error?job.reject(Error(typeof m.error==='string'?m.error+': '+m.message:m.error.message)):job.resolve(m.result);};
  if(browser==='firefox'){await command('session.new',{capabilities:{alwaysMatch:{acceptInsecureCerts:false}}});const tree=await command('browsingContext.getTree',{});context=tree.contexts[0].context;}
  else await command('Page.enable');
  return {command,close,
   async navigate(url){if(browser==='firefox')return command('browsingContext.navigate',{context,url,wait:'complete'});await command('Page.navigate',{url});for(let i=0;i<300;i++){try{if(await this.evaluate('location.href==='+JSON.stringify(url)+'&&document.readyState==="complete"'))return;}catch{}await wait(100);}throw Error('Navigation timeout '+url);},
   async evaluate(expression){const e='(async()=>JSON.stringify(await (0,eval)('+JSON.stringify(expression)+')))()';const r=browser==='firefox'?await command('script.evaluate',{expression:e,target:{context},awaitPromise:true,resultOwnership:'none'}):await command('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});if(r.type==='exception'||r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));const value=r.result?.value;return value===undefined?undefined:JSON.parse(value);},
   async screenshot(){return browser==='firefox'?(await command('browsingContext.captureScreenshot',{context})).data:(await command('Page.captureScreenshot',{format:'png'})).data;}
  };
 }catch(error){await close();throw error;}
}
