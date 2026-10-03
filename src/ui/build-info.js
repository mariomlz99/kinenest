const output=document.getElementById('build-info');
try{
 const response=await fetch(new URL('./build-info.json',location.href),{cache:'no-store',signal:AbortSignal.timeout(5000)});
 if(!response.ok)throw Error('HTTP '+response.status);
 const info=await response.json();
 if(info.project!=='KineNest'||!Number.isFinite(Date.parse(info.builtAt)))throw Error('Invalid build information');
 const loaded=import.meta.url.match(/\/assets\/([a-f0-9]{12})\//)?.[1]??'development';
 output.textContent='Project: '+info.project+'\nCommit: '+(info.commit??'unavailable')+'\nBuilt: '+info.builtAt+'\nDeployed assets: '+info.assetVersion+'\nPage assets: '+loaded+'\nUncommitted changes: '+(info.dirty===null?'unknown':String(info.dirty));
}catch{output.textContent='Build information unavailable. Local source previews do not contain build-info.json.';}
