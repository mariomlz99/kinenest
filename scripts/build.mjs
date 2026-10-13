import {publishBuild} from './publish-build.mjs';
import {cp,mkdir,readFile,writeFile,rm,readdir,stat,mkdtemp} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const hash=createHash('sha256');
async function digest(dir){for(const item of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const name=dir+'/'+item.name;hash.update(name);if(item.isDirectory())await digest(name);else hash.update(await readFile(name));}}
for(const dir of ['src','public'])await digest(dir);
for(const file of ['index.html','basics.html','linux.html','licences.html'])hash.update(await readFile(file));
const assetVersion=hash.digest('hex').slice(0,12),prefix='assets/'+assetVersion+'/';
const output=await mkdtemp('dist.staging-');await mkdir(output+'/'+prefix,{recursive:true});
for(const name of ['src','public'])await cp(name,output+'/'+prefix+name,{recursive:true});
for(const name of ['index.html','basics.html','linux.html','licences.html']){const html=await readFile(name,'utf8');await writeFile(output+'/'+name,html.replaceAll('./src/','./'+prefix+'src/').replaceAll('./public/','./'+prefix+'public/'));}
await cp('legacy-assets',output+'/assets',{recursive:true});
// Public legal/social image URLs stay stable; executable assets are versioned.
await cp('public',output+'/public',{recursive:true});
await mkdir(output+'/docs',{recursive:true});for(const name of ['SUPPORTED.md','ARCHITECTURE.md','INTERFACES.md'])await cp('docs/'+name,output+'/docs/'+name);
await mkdir(output+'/docs/tf',{recursive:true});await cp('docs/tf/runtime.md',output+'/docs/tf/runtime.md');
for(const name of ['LICENSE','NOTICE','_redirects'])await cp(name,output+'/'+name);
await writeFile(output+'/.nojekyll','');
const commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),dirty=!!execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim();
await writeFile(output+'/build-info.json',JSON.stringify({commit,builtAt:new Date().toISOString(),project:'KineNest',assetVersion,dirty},null,2)+'\n');
console.log('KineNest built · '+assetVersion+' · '+commit);

async function checkAssets(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isDirectory())await checkAssets(file);else if((await stat(file)).size>25*1024*1024)throw Error('Asset exceeds Cloudflare 25 MiB limit: '+file);}}
await checkAssets(output);
await publishBuild(output);
