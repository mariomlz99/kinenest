import http from 'node:http';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const browser=process.argv[2]||'chrome';const production=process.argv.includes('--built');
let hold,child,timeout,finished=false;
const profile=await mkdtemp(browser==='firefox'?path.join(root,'../ros2learn-firefox-'):path.join(tmpdir(),'ros2learn-browser-'));
async function finish(text){if(finished)return;finished=true;clearTimeout(timeout);console.log(text);if(hold){hold.writeHead(204);hold.end();}child?.kill();server.close();await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});process.exitCode=text.startsWith('PASS')?0:1;}
const server=http.createServer(async(req,res)=>{
 if(req.url==='/progress'){let body='';for await(const part of req)body+=part;console.log(body);res.end('ok');return;}
 if(req.url==='/hold'){hold=res;return;}
 if(req.url?.includes('.html'))console.log('Loaded '+req.url);
 if(req.url==='/done'){let body='';for await(const part of req)body+=part;res.end('ok');await finish(body);return;}
 try{let relative=decodeURIComponent(req.url.split('?')[0]).replace(/^\/ros2learn\//,'');if(!relative||relative.endsWith('/'))relative+='index.html';let file=path.resolve(root,production&&!relative.startsWith('tests/')?'dist/'+relative:relative);if(!file.startsWith(root))throw new Error('Invalid path');if(file.endsWith(path.sep))file+='index.html';const data=await readFile(file);if(suite==='lesson-loading'&&relative.startsWith('public/lessons/'))await new Promise(resolve=>setTimeout(resolve,350));res.setHeader('Content-Type',({'.svg':'image/svg+xml','.png':'image/png','.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.py':'text/plain','.json':'application/json','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const suite=process.argv.find(a=>a.startsWith('--suite='))?.slice(8)||'session3';
if(!/^[a-z0-9-]+$/.test(suite))throw Error('Invalid suite');
const url='http://127.0.0.1:'+server.address().port+'/ros2learn/tests/'+suite+'.html';
const args=browser==='firefox'?['--headless','--no-remote','--profile',profile,url]:['--headless','--disable-gpu','--user-data-dir='+profile,'--remote-debugging-port=0',url];
console.log('Testing '+browser+' at '+url);
child=spawn(browser==='firefox'?(process.env.FIREFOX_BIN||'firefox'):'google-chrome',args,{stdio:['ignore','ignore','pipe']});
let errors='';child.stderr.on('data',data=>{errors=(errors+data).slice(-2000);});
child.on('error',error=>finish('FAIL: '+error.message));child.on('exit',()=>{if(!finished)finish('FAIL: Browser exited before test result. '+errors);});
timeout=setTimeout(()=>finish('FAIL: Browser test exceeded 420 seconds. '+errors),420000);
