import {brandPage, pageSession} from '../src/ui/product.js';
import {rm,mkdir,cp,readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url),dest=new URL('dist/',root);
const hash=createHash('sha256');
async function digest(url){for(const item of (await readdir(url,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const child=new URL(item.name+(item.isDirectory()?'/':''),url);hash.update(item.name);if(item.isDirectory())await digest(child);else hash.update(await readFile(child));}}
for(const directory of ['src/','public/'])await digest(new URL(directory,root));
const version=hash.digest('hex').slice(0,12),assetPath='assets/'+version+'/';
await rm(dest,{recursive:true,force:true});await mkdir(new URL(assetPath,dest),{recursive:true});
// An explicit allowlist: no tests, reference solutions, docs, Git metadata or tooling.
for(const name of ['src','public'])await cp(new URL(name,root),new URL(assetPath+name,dest),{recursive:true});
for(const file of ['LICENSE','NOTICE','_redirects'])await cp(new URL(file,root),new URL(file,dest));
for(const page of ['index.html','session-01.html','session-02.html','session-03.html','session-04.html','session-05.html','session-06.html','real-ros.html','about.html','licences.html']){const html=await readFile(new URL(page,root),'utf8');await writeFile(new URL(page,dest),brandPage(html,pageSession(page),{assetPath,page}).replaceAll('./src/','./'+assetPath+'src/').replaceAll('./public/','./'+assetPath+'public/'));}
let commit=null,dirty=null;
try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:fileURLToPath(root),encoding:'utf8'}).trim();dirty=!!execFileSync('git',['status','--porcelain'],{cwd:fileURLToPath(root),encoding:'utf8'}).trim();}catch{}
if(commit&&!/^[a-f0-9]{40}$/.test(commit))throw Error('Invalid build commit');
await writeFile(new URL('build-info.json',dest),JSON.stringify({commit,builtAt:new Date().toISOString(),project:'KineNest',assetVersion:version,dirty},null,2)+'\n');
console.log('Static site ready in dist/ · asset version '+version+' · commit '+(commit??'unavailable'));
