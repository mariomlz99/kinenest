import {launch,wait} from '../../scripts/browser-driver.mjs';import {serveDirectory} from '../../scripts/static-server.mjs';import {fileURLToPath} from 'node:url';import {mkdir,writeFile,readFile} from 'node:fs/promises';
const browser=process.argv[2]??'chrome',root=new URL('../../',import.meta.url),server=await serveDirectory(fileURLToPath(root)),b=await launch(browser,{profileRoot:fileURLToPath(new URL('../',root))});
try{
 await b.navigate(server.url+'experiments/rmw-wasm/index.html');await wait(12000);const result=await b.evaluate('window.probe');await b.evaluate('window.stopProbe();true');const count=(await b.evaluate('window.probe.events.length'));await wait(500);result.stopClean=await b.evaluate('window.probe.events.length')===count;
 result.browser=browser;result.recordedAt=new Date().toISOString();result.artifacts=JSON.parse(await readFile(new URL('assets.json',import.meta.url),'utf8'));
 result.pubsub=result.events.some(e=>e.node==='listener'&&e.command==='console'&&/I heard/.test(e.message));result.service=result.events.some(e=>e.node==='client'&&e.command==='console'&&/Sum: 13/.test(e.message));
 await mkdir(new URL('results/',import.meta.url),{recursive:true});await writeFile(new URL('results/'+browser+'.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));if(!result.pubsub||!result.service||result.errors.length||!result.stopClean)process.exitCode=1;
}finally{await b.close();server.close();}
